const mongoose = require('mongoose');

const matchEventSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlayerStats', required: true },
  playerName: { type: String, required: true },
  eventType: { type: String, enum: ['goal', 'assist', 'yellowCard', 'redCard', 'substitution', 'ownGoal'], required: true },
  timestamp: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('MatchEvent', matchEventSchema);
