const Note = require('../models/Note');
const Notification = require('../models/Notification');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const getNotes = async (req, res) => {
  if (req.user.role === 'eleve' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  try {
    const { limit, offset } = req.query;
    const parsedLimit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
    const parsedOffset = parseInt(offset, 10) || 0;
    const notes = await Note.find({ eleveId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip(parsedOffset)
      .lean();
    res.json(notes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const addNote = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let targetEleveId = req.body.eleveId;
    if (role === 'eleve') {
      targetEleveId = userId;
    }
    if (!targetEleveId) {
      return res.status(400).json({ message: 'eleveId requis' });
    }

    const note = await Note.create({
      ...req.body,
      eleveId: targetEleveId,
    });

    const message = parseFloat(note.valeur) < 10
      ? `⚠️ Note faible en ${note.matiere} : ${note.valeur}/20. Pensez à revoir cette matière !`
      : `📊 Nouvelle note en ${note.matiere} : ${note.valeur}/20 (${note.periode})`;

    await Notification.create({
      contenu: message,
      type: 'note',
      eleveId: targetEleveId,
    }).catch(() => {});

    res.status(201).json(note);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note introuvable' });

    // Only admin or the owning eleve can delete
    if (req.user.role === 'eleve' && note.eleveId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note supprimée' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getNotes, addNote, deleteNote };
