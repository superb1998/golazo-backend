const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
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

// Player login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: 'player' });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({ success: true, user: { id: user._id, email: user.email, name: user.name, role: user.role }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get player credentials (admin only)
router.get('/reset/:playerId', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const player = await PlayerStats.findOne({ playerId: req.params.playerId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.json({ success: true, data: { email: player.email, password: player.password } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
