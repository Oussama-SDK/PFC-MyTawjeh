const Exercice = require('../models/Exercice');
const ResultatExercice = require('../models/ResultatExercice');
const Notification = require('../models/Notification');
const { chatbot, executeWithFallback, getPrimaryProvider, getModelForProvider } = require('../services/aiService');
const OpenAI = require('openai');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const getExercices = async (req, res) => {
  const query = {};
  if (req.query.matiere) query.matiere = req.query.matiere;
  if (req.query.difficulte) query.difficulte = req.query.difficulte;
  if (req.query.niveau) query.niveau = req.query.niveau;

  // Students only see approved exercises; teachers see their own; admins see all
  if (req.user.role === 'eleve') {
    query.isApproved = true;
  } else if (req.user.role === 'professeur') {
    query.professeurId = req.user.id;
  }
  // admin: no filter — sees all

  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;

  const exercices = await Exercice.find(query)
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 })
    .lean();
  
  res.json(exercices);
};

// AI auto-correction — upsert so retries don't inflate count
const submitExercice = async (req, res) => {
  try {
    const { reponse } = req.body;

    // Security: always use the authenticated user's own ID
    const eleveId = req.user.id;

    const exercice = await Exercice.findById(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });

    let score = null;
    let feedback = '';

    if (reponse && exercice.correction) {
      const prompt = `Tu es un tuteur bienveillant qui aide un lycéen marocain à comprendre ses erreurs. NE DONNE PAS la correction directement. Ton rôle est de guider l'élève pour qu'il trouve lui-même.\n\nExercice: ${exercice.contenu}\nCorrection officielle (pour toi seulement, ne la révèle pas): ${exercice.correction}\nRéponse de l'élève: ${reponse}\n\nRéponds UNIQUEMENT avec un JSON valide sans markdown:\n{"score": <0 à 20>, "feedback": "<1) Ce que l'élève a bien fait. 2) Ce qui est incorrect ou manquant, expliqué sans donner la réponse. 3) Une question de guidage pour l'aider à corriger lui-même. Max 5 phrases en français.>"}`;

      try {
        const aiResponse = await chatbot(prompt, '');
        const clean = aiResponse.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        score = Math.min(20, Math.max(0, parseFloat(parsed.score) || 0));
        feedback = parsed.feedback || '';
      } catch {
        score = 0;
        feedback = 'Correction automatique indisponible. Score basé sur la tentative.';
      }
    } else {
      score = parseFloat(req.body.score) || 0;
      feedback = '';
    }

    const resultat = await ResultatExercice.findOneAndUpdate(
      { eleveId, exerciceId: req.params.id },
      { score, reponse: reponse || '', feedback },
      { upsert: true, new: true, runValidators: true }
    );

    const isNew = !resultat || resultat.createdAt === resultat.updatedAt;
    if (isNew || score < 10) {
      await Notification.create({
        contenu: score < 10
          ? `📝 Score de ${score}/20 en ${exercice.matiere}. ${feedback || 'Continuez à pratiquer !'}`
          : `✅ Exercice de ${exercice.matiere} complété : ${score}/20 !`,
        type: score < 10 ? 'revision' : 'info',
        eleveId,
      }).catch(() => {});
    }

    res.status(201).json({ resultat, score, feedback, correction: exercice.correction });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createExercice = async (req, res) => {
  try {
    const isApproved = req.user.role === 'admin';
    const ex = await Exercice.create({ ...req.body, professeurId: req.user.id, isApproved });
    res.status(201).json(ex);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateExercice = async (req, res) => {
  try {
    const exercice = await Exercice.findById(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });

    const isOwner = exercice.professeurId?.toString() === req.user.id?.toString();
    if (req.user.role === 'professeur' && !isOwner)
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres exercices' });

    // Approval goes through PATCH /approve (admin) and the owner never changes on edit
    const { isApproved, professeurId, _id, ...changes } = req.body;
    // A professor's edit goes back to the admin for review, like a new exercise
    if (req.user.role === 'professeur') changes.isApproved = false;
    const updated = await Exercice.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const deleteExercice = async (req, res) => {
  try {
    const exercice = await Exercice.findById(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });

    const isOwner = exercice.professeurId?.toString() === req.user.id?.toString();
    if (req.user.role === 'professeur' && !isOwner)
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres exercices' });

    await Exercice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exercice supprimé' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const approveExercice = async (req, res) => {
  try {
    const exercice = await Exercice.findById(req.params.id);
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });
    
    const updated = await Exercice.findByIdAndUpdate(req.params.id, { isApproved: req.body.approved !== false }, { new: true });
    res.json({ message: req.body.approved !== false ? 'Exercice approuvé' : 'Exercice refusé', exercice: updated });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getPendingExercices = async (req, res) => {
  try {
    const pending = await Exercice.find({ isApproved: false })
      .sort({ createdAt: -1 });
    res.json(pending);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getResultats = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;
  
  const resultats = await ResultatExercice.find({ eleveId: req.params.eleveId })
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 })
    .lean();
  
  res.json(resultats);
};

// POST /exercices/:id/chat — AI tutor chat for a specific exercise
const chatWithExercice = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ message: 'Message requis' });

    const exercice = await Exercice.findById(req.params.id).lean();
    if (!exercice) return res.status(404).json({ message: 'Exercice introuvable' });

    const systemPrompt = `Tu es un tuteur bienveillant qui aide un lycéen marocain à résoudre un exercice.

EXERCICE À RÉSOUDRE :
${exercice.contenu}

RÈGLES ABSOLUES :
- Ne donne JAMAIS la réponse directe ou la correction complète.
- Guide l'élève par des questions socratiques : "Qu'est-ce que tu sais sur... ?", "Quelle formule s'applique ici ?", "Que se passe-t-il si... ?"
- Si l'élève est bloqué, donne un INDICE partiel, pas la solution.
- Si l'élève dit quelque chose de correct, confirme et encourage.
- Si l'élève fait une erreur, explique POURQUOI c'est incorrect sans donner la bonne réponse.
- Réponds en français, de manière concise (max 150 mots).
- Quand l'élève semble avoir compris, encourage-le à soumettre sa réponse finale.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    const primary = getPrimaryProvider();
    const reply = await executeWithFallback(primary.name, async (client, name) => {
      if (name === 'claude') {
        const response = await client.messages.create({
          model: getModelForProvider(name),
          max_tokens: 400,
          system: systemPrompt,
          messages: messages.filter(m => m.role !== 'system'),
        });
        return response.content[0].text;
      }
      const response = await client.chat.completions.create({
        model: getModelForProvider(name),
        messages,
        temperature: 0.7,
        max_tokens: 400,
      });
      return response.choices[0].message.content;
    });

    res.json({ reply });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getExercices, submitExercice, chatWithExercice, createExercice, updateExercice, deleteExercice, approveExercice, getPendingExercices, getResultats };
