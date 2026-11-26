const Eleve = require('../models/Eleve');
const Note = require('../models/Note');
const Roadmap = require('../models/Roadmap');
const ProfilOnet = require('../models/ProfilOnet');
const ChatHistory = require('../models/ChatHistory');
const { generateRoadmap, chatbot, summarizeMessages } = require('../services/aiService');

// Sliding window config
const WINDOW_SIZE = 10;       // full messages sent to AI
const SUMMARIZE_TRIGGER = 20; // total messages before summarization kicks in
const SUMMARIZE_INTERVAL = 8; // don't re-summarize until 8 new messages accumulate

const getRoadmap = async (req, res) => {
  const roadmap = await Roadmap.findOne({ eleveId: req.params.eleveId })
    .sort({ createdAt: -1 })
    .lean();
  res.json(roadmap);
};

const generateRoadmapHandler = async (req, res) => {
  try {
    // Security: eleve can only generate their own roadmap
    const eleveId = req.user.role === 'eleve' ? req.user.id : req.body.eleveId;
    if (!eleveId) return res.status(400).json({ message: 'eleveId requis' });

    const eleve = await Eleve.findById(eleveId).lean();
    if (!eleve) return res.status(404).json({ message: 'Élève introuvable' });

    const notes = await Note.find({ eleveId: eleve._id }).lean();

    let onetProfil = null;
    try {
      onetProfil = await ProfilOnet.findOne({ eleveId: eleve._id }).lean();
    } catch (_) {}

    // Optional career/domain typed by the student at the top of the Roadmap page
    const metierCible = typeof req.body.metierCible === 'string'
      ? req.body.metierCible.trim().slice(0, 100)
      : '';

    const result = await generateRoadmap(eleve, notes, onetProfil, metierCible);

    const roadmap = await Roadmap.create({
      eleveId: eleve._id,
      matiereCible: result.matieresCles?.join(', '),
      niveau: eleve.niveau,
      parcours: JSON.stringify(result),
    });

    res.json({ roadmap, result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Build student context string (reused by chatbot + history get)
const buildContext = async (userId, role, bodyEleveId) => {
  const eleveId = role === 'eleve' ? userId : bodyEleveId;
  if (!eleveId) return '';
  try {
    const eleve = await Eleve.findById(eleveId).lean();
    if (!eleve) return '';
    const notes = await Note.find({ eleveId }).lean();
    const moyenne = notes.length
      ? (notes.reduce((s, n) => s + parseFloat(n.valeur) * parseFloat(n.coefficient), 0) /
         notes.reduce((s, n) => s + parseFloat(n.coefficient), 0)).toFixed(1)
      : null;
    let ctx = `Étudiant: ${eleve.nom}. Niveau: ${eleve.niveau}. Filière: ${eleve.filiere || 'non définie'}. Ville: ${eleve.ville || 'non précisée'}.${moyenne ? ` Moyenne: ${moyenne}/20.` : ''}`;
    try {
      const onet = await ProfilOnet.findOne({ eleveId }).lean();
      if (onet) {
        ctx += ` RIASEC: ${onet.primaryInterest}/${onet.secondaryInterest}/${onet.tertiaryInterest}.`;
        if (onet.dreamJob) ctx += ` Métier rêvé: ${onet.dreamJob}.`;
        if (onet.dreamUni) ctx += ` Université rêvée: ${onet.dreamUni}.`;
      }
    } catch (_) {}
    const faibles = notes.filter(n => parseFloat(n.valeur) < 10);
    if (faibles.length) ctx += ` Difficultés: ${faibles.map(n => `${n.matiere} (${n.valeur}/20)`).join(', ')}.`;
    return ctx;
  } catch (_) { return ''; }
};

// Fire-and-forget: compress old messages into a rolling summary
const triggerSummarize = async (userId, context, allMessages, currentSummaryUpTo) => {
  try {
    const toSummarize = allMessages.slice(currentSummaryUpTo, allMessages.length - WINDOW_SIZE);
    if (toSummarize.length < 4) return;
    const newSummaryChunk = await summarizeMessages(toSummarize, context);
    const existingDoc = await ChatHistory.findOne({ userId });
    const combined = [existingDoc?.summary, newSummaryChunk].filter(Boolean).join('\n');
    await ChatHistory.findOneAndUpdate(
      { userId },
      { summary: combined, summaryUpTo: allMessages.length - WINDOW_SIZE },
      { upsert: true }
    );
  } catch (err) {
    console.warn('⚠️ Summarization failed (non-blocking):', err.message);
  }
};

const chatbotHandler = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id.toString();

    const context = await buildContext(userId, req.user.role, req.body.eleveId);

    // Load or create history doc
    const histDoc = await ChatHistory.findOne({ userId }) || { messages: [], summary: '', summaryUpTo: 0 };
    const allMessages = histDoc.messages || [];

    // Sliding window: send only the last WINDOW_SIZE messages to the AI
    const recentHistory = allMessages.slice(-WINDOW_SIZE);

    const reply = await chatbot(message, context, recentHistory, histDoc.summary || '');

    // Persist new messages
    const newPair = [
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: reply, timestamp: new Date() },
    ];
    await ChatHistory.findOneAndUpdate(
      { userId },
      { $push: { messages: { $each: newPair } } },
      { upsert: true, new: true }
    );

    // Trigger summarization if needed (non-blocking)
    const totalAfter = allMessages.length + 2;
    const unsummarized = totalAfter - (histDoc.summaryUpTo || 0);
    if (totalAfter > SUMMARIZE_TRIGGER && unsummarized > WINDOW_SIZE + SUMMARIZE_INTERVAL) {
      triggerSummarize(userId, context, [...allMessages, ...newPair], histDoc.summaryUpTo || 0);
    }

    res.json({ reply });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /chatbot/history — load persisted history for the current user
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const histDoc = await ChatHistory.findOne({ userId }).lean();
    res.json({ messages: histDoc?.messages || [] });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// DELETE /chatbot/history — start a new conversation (wipes history + summary)
const resetChatHistory = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    await ChatHistory.findOneAndUpdate(
      { userId },
      { messages: [], summary: '', summaryUpTo: 0 },
      { upsert: true }
    );
    res.json({ message: 'Conversation réinitialisée' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getRoadmap, generateRoadmapHandler, chatbotHandler, getChatHistory, resetChatHistory };
