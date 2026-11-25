const mongoose = require('mongoose');

const profilOnetSchema = new mongoose.Schema({
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', unique: true, required: true },
  testLevel: Number,
  scoresR: { type: Number, default: 0 },
  scoresI: { type: Number, default: 0 },
  scoresA: { type: Number, default: 0 },
  scoresS: { type: Number, default: 0 },
  scoresE: { type: Number, default: 0 },
  scoresC: { type: Number, default: 0 },
  primaryInterest: String,
  secondaryInterest: String,
  tertiaryInterest: String,
  jobZone: Number,
  dreamUni: String,
  dreamJob: String,
  language: { type: String, default: 'fr' },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

profilOnetSchema.index({ eleveId: 1 });

module.exports = mongoose.model('ProfilOnet', profilOnetSchema);