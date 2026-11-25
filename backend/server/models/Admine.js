const mongoose = require('mongoose');

const admineSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  motDePasse: { type: String, required: true },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
}, { timestamps: true });

admineSchema.index({ email: 1 });

module.exports = mongoose.model('Admine', admineSchema);
