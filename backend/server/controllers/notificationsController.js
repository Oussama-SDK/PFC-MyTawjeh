const Notification = require('../models/Notification');
const Eleve      = require('../models/Eleve');
const Professeur = require('../models/Professeur');
const Parent     = require('../models/Parent');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const getNotifications = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;

  const id = req.params.eleveId;
  const notifs = await Notification.find({
    $or: [{ eleveId: id }, { recipientId: id }],
  })
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 })
    .lean();

  res.json(notifs);
};

const getSentNotifications = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
    const notifs = await Notification.find({ admineId: req.user.id, isLog: true })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    res.json(notifs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { recipientType, recipientId, eleveId } = req.body;
    let recipientName = req.body.recipientName;
    if (!recipientName && recipientId) {
      const Model = recipientType === 'eleve' ? Eleve : recipientType === 'professeur' ? Professeur : Parent;
      const u = await Model.findById(recipientId).select('nom').lean();
      if (u) recipientName = u.nom;
    }
    if (!recipientName && eleveId) {
      const u = await Eleve.findById(eleveId).select('nom').lean();
      if (u) recipientName = u.nom;
    }
    const notif = await Notification.create({ ...req.body, admineId: req.user.id, recipientName, isLog: true });
    res.status(201).json(notif);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const createBulkNotification = async (req, res) => {
  try {
    const { contenu, type, targetRole } = req.body;
    const MODELS = { eleve: Eleve, professeur: Professeur, parent: Parent };

    const groups = targetRole === 'all'
      ? [{ model: Eleve, rType: 'eleve' }, { model: Professeur, rType: 'professeur' }, { model: Parent, rType: 'parent' }]
      : [{ model: MODELS[targetRole], rType: targetRole }];

    let totalCount = 0;
    for (const { model, rType } of groups) {
      const users = await model.find({}).select('_id').lean();
      totalCount += users.length;
      await Promise.all(users.map(u =>
        Notification.create({
          contenu, type,
          admineId: req.user.id,
          eleveId: rType === 'eleve' ? u._id : undefined,
          recipientId: u._id,
          recipientType: rType,
          isLog: false,
        })
      ));
    }

    const labelMap = { all: 'Tous les utilisateurs', eleve: 'Tous les élèves', parent: 'Tous les parents', professeur: 'Tous les professeurs' };
    const log = await Notification.create({
      contenu, type,
      admineId: req.user.id,
      recipientType: targetRole === 'all' ? 'all' : targetRole,
      recipientName: labelMap[targetRole] ?? 'Tous',
      recipientCount: totalCount,
      isLog: true,
    });

    res.status(201).json(log);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const markRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { lu: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Notification introuvable' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const markUnread = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { lu: false }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Notification introuvable' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getNotifications, getSentNotifications, createNotification, createBulkNotification, markRead, markUnread };
