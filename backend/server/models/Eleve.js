const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  motDePasse: { type: String, required: true },
  niveau: { type: String, required: true },
  filiere: String,
  filiere_autre: String,
  ville: String,
  typeFormation: String,
  niveauPostBac: String,
  niveauPostBac_autre: String,
  notes: [{
    matiere: String,
    valeur: Number,
    date: { type: Date, default: Date.now }
  }],
  onetProfile: {
    responses: {},
    careerMatch: String,
    date: Date
  },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  roadmaps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' }],
}, { timestamps: true });

eleveSchema.index({ email: 1 });
eleveSchema.index({ niveau: 1 });

module.exports = mongoose.model('Eleve', eleveSchema);
