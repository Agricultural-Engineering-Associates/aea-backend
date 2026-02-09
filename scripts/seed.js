require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const seed = async () => {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('Usage: node scripts/seed.js <email> <password> [name]');
    console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`Admin with email "${email}" already exists. Skipping.`);
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ email, passwordHash, name });
    console.log(`Admin created: ${admin.email} (${admin.name})`);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
