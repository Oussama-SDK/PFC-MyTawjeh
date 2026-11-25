const mongoose = require('mongoose');

const resultatExerciceSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 20 },
  reponse: String,
  feedback: String,
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
  exerciceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercice', required: true },
}, { timestamps: true });

// Unique index: one result per student per exercise
resultatExerciceSchema.index({ eleveId: 1, exerciceId: 1 }, { unique: true });
resultatExerciceSchema.index({ eleveId: 1 });
resultatExerciceSchema.index({ exerciceId: 1 });

module.exports = mongoose.model('ResultatExercice', resultatExerciceSchema);
