const mongoose = require('mongoose');

const professeurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  motDePasse: { type: String, required: true },
  motDePasseClair: { type: String },
  specialite: String,
  exercices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercice' }],
}, { timestamps: true });

professeurSchema.index({ email: 1 });

module.exports = mongoose.model('Professeur', professeurSchema);
