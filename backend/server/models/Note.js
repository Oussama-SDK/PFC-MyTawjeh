const mongoose = require('mongoose');

// Note: Notes are now embedded in Eleve document, but kept as standalone for migration
const noteSchema = new mongoose.Schema({
  matiere: { type: String, required: true },
  valeur: { type: Number, required: true },
  coefficient: { type: Number, default: 1 },
  periode: String,
  type: String,
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
}, { timestamps: true });

noteSchema.index({ eleveId: 1 });

module.exports = mongoose.model('Note', noteSchema);
