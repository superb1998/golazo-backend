const mongoose = require('mongoose');

const playerStatsSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['defender', 'midfielder', 'attacker'], required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gamesPlayed: { type: Number, default: 0 },
  goalsScored: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  performanceScore: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  monthlyPayments: [{ month: String, amount: Number }],
  extraPoints: { type: Number, default: 0 },
  lastPlayedWith: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('PlayerStats', playerStatsSchema);
