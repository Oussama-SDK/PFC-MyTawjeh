// ─── MongoDB Models Loader ─────────────────────────────────────────────────
// Mongoose handles relationships through refs, so no explicit associations needed
// This file just imports all models to register them with MongoDB

require('./Eleve');
require('./Parent');
require('./Professeur');
require('./Admine');
require('./Note');
require('./Exercice');
require('./ResultatExercice');
require('./Roadmap');
require('./Metier');
require('./Concours');
require('./Annale');
require('./Notification');
require('./ProfilOnet');

module.exports = {
  Eleve: require('mongoose').model('Eleve'),
  Parent: require('mongoose').model('Parent'),
  Professeur: require('mongoose').model('Professeur'),
  Admine: require('mongoose').model('Admine'),
  Note: require('mongoose').model('Note'),
  Exercice: require('mongoose').model('Exercice'),
  ResultatExercice: require('mongoose').model('ResultatExercice'),
  Roadmap: require('mongoose').model('Roadmap'),
  Metier: require('mongoose').model('Metier'),
  Concours: require('mongoose').model('Concours'),
  Annale: require('mongoose').model('Annale'),
  Notification: require('mongoose').model('Notification'),
  ProfilOnet: require('mongoose').model('ProfilOnet'),
};