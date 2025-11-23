const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin');
const playerRoutes = require('./routes/players');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const auth = require('./middleware/auth');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.use('/api/admin', adminRoutes);
app.use('/api/players', auth, playerRoutes); // Protect players routes

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
