const mongoose = require('mongoose');

const metierSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  roadmaps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' }],
}, { timestamps: true });

metierSchema.index({ nom: 1 });

module.exports = mongoose.model('Metier', metierSchema);
