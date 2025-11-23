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

const auth = require('./middleware/auth');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.use('/api/admin', adminRoutes);
app.use('/api/players', auth, playerRoutes); // Protect players routes

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('MongoDB connected');
  // Create default admins if they don't exist
  const Admin = require('./models/User');
  const bcrypt = require('bcryptjs');
  const saltRounds = 10;

  const defaultAdmins = [
    { email: 'admin@golazo.com', name: 'Admin One', password: 'admin123' },
    { email: 'admin2@golazo.com', name: 'Admin Two', password: 'admin456' },
  ];

  for (const adminData of defaultAdmins) {
    const existingAdmin = await Admin.findOne({ email: adminData.email, role: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
      const newAdmin = new Admin({
        email: adminData.email,
        name: adminData.name,
        role: 'admin',
        password: hashedPassword,
        approved: true,
      });
      await newAdmin.save();
      console.log(`Default admin ${adminData.email} created`);
    }
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
