const router = require('express').Router();
const auth = require('../middleware/auth');
const { validateSchema } = require('../middleware/validation');
const schemas = require('../middleware/schemas');
const { requireEleveAccess } = require('../middleware/access');
const { register, login, changePassword, linkStudent, unlinkStudent, getLinkedStudent, saveOnetProfile, getOnetProfile, getOnetProfileByEleveId } = require('../controllers/authController');
const { getNotes, addNote, deleteNote } = require('../controllers/notesController');
const { getExercices, submitExercice, chatWithExercice, createExercice, updateExercice, deleteExercice, approveExercice, getPendingExercices, getResultats } = require('../controllers/exercicesController');
const { getRoadmap, generateRoadmapHandler, recommendCareersHandler, chatbotHandler, getChatHistory, resetChatHistory } = require('../controllers/aiController');
const { getConcours, createConcours, updateConcours, deleteConcours, getAnnales, createAnnale, updateAnnale, deleteAnnale } = require('../controllers/concoursController');
const { getNotifications, getSentNotifications, createNotification, createBulkNotification, markRead, markUnread } = require('../controllers/notificationsController');
const { getElevesFaibles, getProfStats } = require('../controllers/profController');
const { getUsers, deleteUser, updateUser, resetUserPassword } = require('../controllers/adminController');

// Every :id / :eleveId in this API is a MongoDB ObjectId — reject malformed ones up front
const mongoose = require('mongoose');
const requireObjectId = (req, res, next, value) =>
  mongoose.isValidObjectId(value) ? next() : res.status(400).json({ message: 'Identifiant invalide' });
router.param('id', requireObjectId);
router.param('eleveId', requireObjectId);

// Auth — public
router.post('/auth/register', validateSchema(schemas.register), register);
router.post('/auth/login', validateSchema(schemas.login), login);

// Auth — protected
router.post('/auth/change-password', auth(), validateSchema(schemas.changePassword), changePassword);
router.post('/auth/link-student', auth(), linkStudent);
router.delete('/auth/link-student', auth(['parent']), unlinkStudent);
router.get('/auth/linked-student', auth(), getLinkedStudent);
router.post('/onet/save', auth(['eleve']), saveOnetProfile);
router.get('/onet/profile', auth(['eleve']), getOnetProfile);
router.get('/onet/profile/:eleveId', auth(['parent', 'admin']), getOnetProfileByEleveId);

// Notes
router.get('/eleves/:id/notes', auth(), requireEleveAccess('id'), getNotes);
router.post('/notes', auth(['eleve', 'professeur', 'admin']), validateSchema(schemas.note), addNote);
router.delete('/notes/:id', auth(['eleve', 'professeur', 'admin']), deleteNote);

// Exercices
router.get('/exercices', auth(), getExercices);
router.get('/exercices/pending', auth(['admin']), getPendingExercices);
router.post('/exercices', auth(['professeur', 'admin']), createExercice);
router.put('/exercices/:id', auth(['admin', 'professeur']), updateExercice);
router.patch('/exercices/:id/approve', auth(['admin']), approveExercice);
router.delete('/exercices/:id', auth(['admin', 'professeur']), deleteExercice);
router.post('/exercices/:id/submit', auth(['eleve']), submitExercice);
router.post('/exercices/:id/chat', auth(['eleve']), chatWithExercice);
router.get('/exercices/resultats/:eleveId', auth(), requireEleveAccess('eleveId'), getResultats);

// AI
router.get('/roadmap/:eleveId', auth(), requireEleveAccess('eleveId'), getRoadmap);
router.post('/roadmap/generate', auth(['eleve']), generateRoadmapHandler);
router.post('/roadmap/recommendations', auth(['eleve']), recommendCareersHandler);
router.post('/chatbot/message', auth(), chatbotHandler);
router.get('/chatbot/history', auth(), getChatHistory);
router.delete('/chatbot/history', auth(), resetChatHistory);

// Concours & Annales
router.get('/concours', auth(), getConcours);
router.post('/concours', auth(['admin']), createConcours);
router.put('/concours/:id', auth(['admin']), updateConcours);
router.delete('/concours/:id', auth(['admin']), deleteConcours);
router.get('/annales', auth(), getAnnales);
router.post('/annales', auth(['admin']), createAnnale);
router.put('/annales/:id', auth(['admin']), updateAnnale);
router.delete('/annales/:id', auth(['admin']), deleteAnnale);

// Notifications
router.get('/notifications/sent', auth(['admin', 'professeur']), getSentNotifications);
router.get('/notifications/:eleveId', auth(), getNotifications);
router.post('/notifications', auth(['admin', 'professeur']), createNotification);
router.post('/notifications/bulk', auth(['admin']), createBulkNotification);
router.patch('/notifications/:id/read', auth(), markRead);
router.patch('/notifications/:id/unread', auth(), markUnread);

// Prof
router.get('/prof/eleves-faibles', auth(['professeur']), getElevesFaibles);
router.get('/prof/stats', auth(['professeur']), getProfStats);

// Admin
router.get('/admin/users', auth(['admin']), getUsers);
router.put('/admin/users/:role/:id/password', auth(['admin']), validateSchema(schemas.resetPassword), resetUserPassword);
router.put('/admin/users/:role/:id', auth(['admin']), updateUser);
router.delete('/admin/users/:role/:id', auth(['admin']), deleteUser);

// Contact form (public - no auth required)
router.post('/contact', validateSchema(schemas.contact), async (req, res) => {
  const { nom, email, message } = req.body;
  // Log to console (email integration can be added later)
  console.log(`📧 Contact: ${nom} <${email}> — ${message}`);
  res.json({ message: 'Message reçu. Nous vous répondrons dans les 24h.' });
});

module.exports = router;
