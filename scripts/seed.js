require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');

const seed = async () => {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || '').toLowerCase();
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('Usage: node scripts/seed.js <email> <password> [name]');
    console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.');
    process.exit(1);
  }

  try {
    const { data: existing } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (existing) {
      const { error } = await supabase
        .from('admins')
        .update({ password_hash: passwordHash, name })
        .eq('id', existing.id);
      if (error) throw error;
      console.log(`Admin updated: ${email} (${name})`);
    } else {
      const { error } = await supabase
        .from('admins')
        .insert({ email, password_hash: passwordHash, name });
      if (error) throw error;
      console.log(`Admin created: ${email} (${name})`);
    }

    console.log('Done.');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
