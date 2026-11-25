const mongoose = require('mongoose');

const exerciceSchema = new mongoose.Schema({
  matiere: { type: String, required: true },
  niveau: String,
  difficulte: { type: String, enum: ['facile', 'moyen', 'difficile'], default: 'moyen' },
  contenu: { type: String, required: true },
  correction: String,
  professeurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Professeur' },
  isApproved: { type: Boolean, default: false },
  resultats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ResultatExercice' }],
  stats: {
    totalAttempts: { type: Number, default: 0 },
    averageScore: Number,
    lastModified: Date
  }
}, { timestamps: true });

exerciceSchema.index({ isApproved: 1, createdAt: -1 });
exerciceSchema.index({ professeurId: 1 });
exerciceSchema.index({ matiere: 1 });

module.exports = mongoose.model('Exercice', exerciceSchema);
