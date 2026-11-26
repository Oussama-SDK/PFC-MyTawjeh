const bcrypt = require('bcryptjs');
const Eleve = require('../models/Eleve');
const Professeur = require('../models/Professeur');
const Parent = require('../models/Parent');

const getUsers = async (req, res) => {
  const [eleves, profs, parents] = await Promise.all([
    Eleve.find().select('-motDePasse -motDePasseClair').lean(),
    Professeur.find().select('-motDePasse -motDePasseClair').lean(),
    Parent.find().select('-motDePasse -motDePasseClair').lean(),
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
      .select('-motDePasse -motDePasseClair')
      .lean();
    if (!updated) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// PUT /admin/users/:role/:id/password — set a new password (stored hashed only).
// Passwords are never readable, so "forgot password" is handled by a reset.
const resetUserPassword = async (req, res) => {
  try {
    const { role, id } = req.params;
    const models = { eleve: Eleve, professeur: Professeur, parent: Parent };
    const Model = models[role];
    if (!Model) return res.status(400).json({ message: 'Rôle invalide' });
    const hash = await bcrypt.hash(req.body.newPassword, 10);
    const user = await Model.findByIdAndUpdate(id, { motDePasse: hash, $unset: { motDePasseClair: 1 } }).select('_id').lean();
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ message: 'Mot de passe réinitialisé' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getUsers, deleteUser, updateUser, resetUserPassword };
