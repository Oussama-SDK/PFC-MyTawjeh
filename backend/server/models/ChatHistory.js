const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  // Rolling summary of messages older than the sliding window
  summary: { type: String, default: '' },
  // How many messages are already captured in the summary
  summaryUpTo: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
