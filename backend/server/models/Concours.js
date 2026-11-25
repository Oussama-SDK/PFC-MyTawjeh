const mongoose = require('mongoose');

const concoursSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  school: String,
  dateConcours: Date,
  seuil: Number,
  description: String,
  lien: String,
  annales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Annale' }],
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

concoursSchema.index({ nom: 1 });
concoursSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Concours', concoursSchema);
