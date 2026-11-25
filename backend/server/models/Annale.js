const mongoose = require('mongoose');

const annaleSchema = new mongoose.Schema({
  annee: Number,
  matiere: String,
  niveau: { type: String, enum: ['1bac', '2bac', 'tronc commun', 'licence', 'master'], default: '2bac' },
  type: { type: String, enum: ['examen national', 'white test', 'examen blanc', 'exercice corrigé'], default: 'examen national' },
  fichier: String,
  lien: String,
  contenu: String,
  correction: String,
  concoursId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concours' },
}, { timestamps: true });

annaleSchema.index({ matiere: 1 });
annaleSchema.index({ niveau: 1 });
annaleSchema.index({ type: 1 });
annaleSchema.index({ concoursId: 1 });

module.exports = mongoose.model('Annale', annaleSchema);
