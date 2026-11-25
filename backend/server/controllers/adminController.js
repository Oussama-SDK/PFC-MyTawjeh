const Eleve = require('../models/Eleve');
const Professeur = require('../models/Professeur');
const Parent = require('../models/Parent');

const getUsers = async (req, res) => {
  const [eleves, profs, parents] = await Promise.all([
    Eleve.find().select('-motDePasse').lean(),
    Professeur.find().select('-motDePasse').lean(),
    Parent.find().select('-motDePasse').lean(),
  ]);
  res.json({ eleves, profs, parents });
};

const ALLOWED_UPDATE_FIELDS = ['nom', 'email', 'niveau', 'matiere', 'matieres', 'telephone', 'adresse', 'dateNaissance', 'genre', 'photo'];

const deleteUser = async (req, res) => {
  try {
    const { role, id } = req.params;
    const models = { eleve: Eleve, professeur: Professeur, parent: Parent };
    const Model = models[role];
    if (!Model) return res.status(400).json({ message: 'Rôle invalide' });
    await Model.findByIdAndDelete(id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { role, id } = req.params;
    const models = { eleve: Eleve, professeur: Professeur, parent: Parent };
    const Model = models[role];
    if (!Model) return res.status(400).json({ message: 'Rôle invalide' });

    const updates = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (key in req.body) updates[key] = req.body[key];
    }

    const updated = await Model.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .select('-motDePasse')
      .lean();
    if (!updated) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getUserPassword = async (req, res) => {
  try {
    const { role, id } = req.params;
    const models = { eleve: Eleve, professeur: Professeur, parent: Parent };
    const Model = models[role];
    if (!Model) return res.status(400).json({ message: 'Rôle invalide' });
    const user = await Model.findById(id).select('motDePasseClair').lean();
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ motDePasse: user.motDePasseClair || null });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getUsers, deleteUser, updateUser, getUserPassword };
