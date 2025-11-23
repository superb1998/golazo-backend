const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teamA: [{ type: String }],
  teamB: [{ type: String }],
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MatchEvent' }],
  createdAt: { type: Number, default: Date.now },
  date: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
