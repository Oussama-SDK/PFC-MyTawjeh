const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Eleve = require('../models/Eleve');
const Parent = require('../models/Parent');
const Professeur = require('../models/Professeur');
const Admine = require('../models/Admine');
const ProfilOnet = require('../models/ProfilOnet');

const MODELS = { eleve: Eleve, parent: Parent, professeur: Professeur, admin: Admine };

// ── Register ──────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  const { role, nom, email, motDePasse, niveau, filiere, filiere_autre, ville, typeFormation, niveauPostBac, niveauPostBac_autre, specialite, eleveId } = req.body;
  const Model = MODELS[role];
  if (!Model) return res.status(400).json({ message: 'Rôle invalide' });
  try {
    const hash = await bcrypt.hash(motDePasse, 10);
    const extra = role === 'eleve'      ? { niveau: niveau || 'Non défini', filiere, filiere_autre, ville, typeFormation, niveauPostBac, niveauPostBac_autre }
                : role === 'parent'     ? { eleveIds: [] }
                : role === 'professeur' ? { specialite }
                : {};
    const user = await Model.create({ nom, email, motDePasse: hash, motDePasseClair: motDePasse, ...extra });
    res.status(201).json({ message: 'Compte créé', id: user._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// ── Login — auto role detection ───────────────────────────────────────────────
const login = async (req, res) => {
  const { email, motDePasse } = req.body;
  if (!email || !motDePasse)
    return res.status(400).json({ message: 'Email et mot de passe requis' });

  const searchOrder = [
    { model: Eleve,      role: 'eleve' },
    { model: Parent,     role: 'parent' },
    { model: Professeur, role: 'professeur' },
    { model: Admine,     role: 'admin' },
  ];

  let found = null;
  let foundRole = null;

  for (const { model, role } of searchOrder) {
    try {
      const user = await model.findOne({ email });
      if (user) { found = user; foundRole = role; break; }
    } catch (_) {}
  }

  if (!found) return res.status(404).json({ message: 'Aucun compte trouvé avec cet email' });

  const valid = await bcrypt.compare(motDePasse, found.motDePasse);
  if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

  const token = jwt.sign(
    { id: found._id, role: foundRole, nom: found.nom, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: found._id,
      nom: found.nom,
      email,
      role: foundRole,
      niveau: found.niveau,
      filiere: found.filiere,
      filiere_autre: found.filiere_autre,
      ville: found.ville,
      typeFormation: found.typeFormation,
      niveauPostBac: found.niveauPostBac,
      niveauPostBac_autre: found.niveauPostBac_autre,
      specialite: found.specialite,
      eleveIds: found.eleveIds || [],
    }
  });
};

// ── Change password ───────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: 'currentPassword et newPassword sont requis' });

  if (typeof newPassword !== 'string' || newPassword.length < 6)
    return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });

  const { id, role } = req.user;
  const Model = MODELS[role];
  if (!Model) return res.status(400).json({ message: 'Rôle invalide' });

  try {
    const user = await Model.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const valid = await bcrypt.compare(currentPassword, user.motDePasse);
    if (!valid) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });

    const hash = await bcrypt.hash(newPassword, 10);
    await Model.findByIdAndUpdate(id, { motDePasse: hash, motDePasseClair: newPassword });
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ── Link student to parent ────────────────────────────────────────────────────
const linkStudent = async (req, res) => {
  const { eleveEmail } = req.body;
  const { id, role } = req.user;

  if (role !== 'parent') return res.status(403).json({ message: 'Réservé aux parents' });

  try {
    const eleve = await Eleve.findOne({ email: eleveEmail });
    if (!eleve) return res.status(404).json({ message: 'Aucun étudiant trouvé avec cet email' });

    const parent = await Parent.findById(id);
    const alreadyLinked = parent?.eleveIds?.some(eid => eid.toString() === eleve._id.toString());
    if (alreadyLinked) return res.status(400).json({ message: 'Cet élève est déjà lié à votre compte' });

    const updatedParent = await Parent.findByIdAndUpdate(
      id,
      { $push: { eleveIds: eleve._id } },
      { new: true }
    );
    const allEleves = await Eleve.find({ _id: { $in: updatedParent.eleveIds } })
      .select('-motDePasse').lean();
    res.json({
      message: 'Étudiant lié avec succès',
      eleve: { id: eleve._id, nom: eleve.nom, email: eleve.email, niveau: eleve.niveau, filiere: eleve.filiere },
      eleves: allEleves,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ── Get all linked students for parent ────────────────────────────────────────
const getLinkedStudent = async (req, res) => {
  const { id, role } = req.user;
  if (role !== 'parent') return res.status(403).json({ message: 'Réservé aux parents' });

  try {
    const parent = await Parent.findById(id);
    if (!parent?.eleveIds?.length) return res.json({ eleves: [] });

    const eleves = await Eleve.find({ _id: { $in: parent.eleveIds } }).select('-motDePasse').lean();
    res.json({ eleves, eleve: eleves[0] ?? null });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const unlinkStudent = async (req, res) => {
  const { id, role } = req.user;
  if (role !== 'parent') return res.status(403).json({ message: 'Réservé aux parents' });

  const { eleveId } = req.body;
  if (!eleveId) return res.status(400).json({ message: 'eleveId requis' });

  try {
    const oid = new mongoose.Types.ObjectId(eleveId);
    await Parent.findByIdAndUpdate(id, { $pull: { eleveIds: oid } });
    res.json({ message: 'Élève dissocié avec succès' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ── Save ONET profile ─────────────────────────────────────────────────────────
const saveOnetProfile = async (req, res) => {
  const { id, role } = req.user;
  if (role !== 'eleve') return res.status(403).json({ message: 'Réservé aux étudiants' });

  const { testLevel, scores, primaryInterest, secondaryInterest, tertiaryInterest, jobZone, dreamUni, dreamJob, language } = req.body;

  try {
    const data = {
      testLevel,
      scoresR: scores?.R || 0,
      scoresI: scores?.I || 0,
      scoresA: scores?.A || 0,
      scoresS: scores?.S || 0,
      scoresE: scores?.E || 0,
      scoresC: scores?.C || 0,
      primaryInterest,
      secondaryInterest,
      tertiaryInterest,
      jobZone,
      dreamUni: dreamUni || null,
      dreamJob: dreamJob || null,
      language: language || 'fr',
      completedAt: new Date(),
    };

    const existing = await ProfilOnet.findOne({ eleveId: id });
    if (existing) {
      Object.assign(existing, data);
      await existing.save();
    } else {
      await ProfilOnet.create({ eleveId: id, ...data });
    }

    res.json({ message: 'Profil O*NET sauvegardé avec succès' });
  } catch (e) {
    console.error('[saveOnetProfile error]', e.message, e.code);
    res.status(500).json({ message: e.message });
  }
};

// ── Get ONET profile (own) ────────────────────────────────────────────────────
const getOnetProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const profil = await ProfilOnet.findOne({ eleveId: id });
    res.json({ profil });
  } catch (e) {
    res.json({ profil: null });
  }
};

// ── Get ONET profile by eleveId (parent viewing child's profile) ──────────────
const getOnetProfileByEleveId = async (req, res) => {
  const { role, id: parentId } = req.user;
  const { eleveId } = req.params;
  try {
    if (role === 'parent') {
      const parent = await Parent.findById(parentId).lean();
      const linked = (parent?.eleveIds || []).map(id => id.toString());
      if (!linked.includes(eleveId)) {
        return res.status(403).json({ message: 'Accès refusé — élève non lié' });
      }
    }
    const profil = await ProfilOnet.findOne({ eleveId }).lean();
    res.json({ profil });
  } catch (e) {
    res.json({ profil: null });
  }
};

module.exports = { register, login, changePassword, linkStudent, unlinkStudent, getLinkedStudent, saveOnetProfile, getOnetProfile, getOnetProfileByEleveId };
