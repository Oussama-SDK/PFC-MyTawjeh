const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  contenu: { type: String, required: true },
  type: String,
  lu: { type: Boolean, default: false },
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' },
  admineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admine' },
  recipientType: { type: String, enum: ['eleve', 'parent', 'professeur', 'admin', 'all'], default: 'eleve' },
  recipientId: { type: mongoose.Schema.Types.ObjectId },
  recipientName: { type: String },
  isLog: { type: Boolean, default: false },
  recipientCount: { type: Number },
}, { timestamps: true });

notificationSchema.index({ eleveId: 1 });
notificationSchema.index({ lu: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
