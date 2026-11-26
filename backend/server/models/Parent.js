const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  motDePasse: { type: String, required: true },
  eleveIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }],
}, { timestamps: true });

parentSchema.index({ eleveIds: 1 });

module.exports = mongoose.model('Parent', parentSchema);
