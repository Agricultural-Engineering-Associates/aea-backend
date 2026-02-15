const supabase = require('../config/db');
const { transformRow } = require('./utils');

const findByEmail = async (email) => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('admins')
    .select('id, email, name, created_at, updated_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const create = async ({ email, passwordHash, name }) => {
  const { data, error } = await supabase
    .from('admins')
    .insert({ email: email.toLowerCase(), password_hash: passwordHash, name })
    .select('id, email, name, created_at, updated_at')
    .single();
  if (error) throw error;
  return transformRow(data);
};

module.exports = { findByEmail, findById, create };
