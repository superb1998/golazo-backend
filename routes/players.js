const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PlayerStats = require('../models/PlayerStats');

const router = express.Router();

// Create player
router.post('/', async (req, res) => {
  const { name, email, role } = req.body;

  try {
    // Hash password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      email,
      name,
      role,
      password: hashedPassword,
      approved: true, // Admin creates approved players
    });
    const savedUser = await user.save();

    // Create PlayerStats
    const playerStats = new PlayerStats({
      playerId: savedUser._id,
      name,
      role,
      email,
      password, // Store plain for email, but will update frontend
      gamesPlayed: 0,
      goalsScored: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      performanceScore: 0,
      totalPoints: 0,
      monthlyPayments: [],
      extraPoints: 0,
      lastPlayedWith: [],
    });
    await playerStats.save();

    res.json({ success: true, data: playerStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get teams (returns player stats)
router.get('/', async (req, res) => {
  const { pageNumber = 1, pageSize = 50 } = req.query;

  try {
    const stats = await PlayerStats.find({})
      .limit(parseInt(pageSize))
      .skip((parseInt(pageNumber) - 1) * parseInt(pageSize));

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
