const Concours = require('../models/Concours');
const Annale = require('../models/Annale');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const getConcours = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;
  
  const concours = await Concours.find({ isPublished: true })
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 })
    .lean();
  
  res.json(concours);
};

const createConcours = async (req, res) => {
  try {
    const c = await Concours.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateConcours = async (req, res) => {
  try {
    const concours = await Concours.findById(req.params.id);
    if (!concours) return res.status(404).json({ message: 'Concours introuvable' });
    
    const updated = await Concours.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const deleteConcours = async (req, res) => {
  try {
    const concours = await Concours.findById(req.params.id);
    if (!concours) return res.status(404).json({ message: 'Concours introuvable' });
    
    await Concours.findByIdAndDelete(req.params.id);
    res.json({ message: 'Concours supprimé avec succès' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const getAnnales = async (req, res) => {
  const query = {};
  if (req.query.matiere) query.matiere = req.query.matiere;
  if (req.query.annee) query.annee = req.query.annee;
  if (req.query.niveau) query.niveau = req.query.niveau;
  if (req.query.type) query.type = req.query.type;

  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;

  const annales = await Annale.find(query)
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 })
    .lean();
  
  res.json(annales);
};

const createAnnale = async (req, res) => {
  try {
    const a = await Annale.create(req.body);
    res.status(201).json(a);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const updateAnnale = async (req, res) => {
  try {
    const annale = await Annale.findById(req.params.id);
    if (!annale) return res.status(404).json({ message: 'Annale introuvable' });
    
    const updated = await Annale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const deleteAnnale = async (req, res) => {
  try {
    const annale = await Annale.findById(req.params.id);
    if (!annale) return res.status(404).json({ message: 'Annale introuvable' });
    
    await Annale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Annale supprimée avec succès' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { getConcours, createConcours, updateConcours, deleteConcours, getAnnales, createAnnale, updateAnnale, deleteAnnale };
