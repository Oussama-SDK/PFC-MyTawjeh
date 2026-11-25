const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  matiereCible: String,
  niveau: String,
  parcours: String,
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
  metierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Metier' },
}, { timestamps: true });

roadmapSchema.index({ eleveId: 1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);
