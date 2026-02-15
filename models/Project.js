const supabase = require('../config/db');
const { transformRow, toDB } = require('./utils');

const getAll = async (activeOnly = false) => {
  let query = supabase
    .from('projects')
    .select('*')
    .order('category')
    .order('display_order');
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(transformRow);
};

const getById = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const create = async (projectData) => {
  const dbData = toDB(projectData);
  const { data, error } = await supabase
    .from('projects')
    .insert(dbData)
    .select()
    .single();
  if (error) throw error;
  return transformRow(data);
};

const update = async (id, updateData) => {
  const dbData = toDB(updateData);
  const { data, error } = await supabase
    .from('projects')
    .update(dbData)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const remove = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const count = async () => {
  const { count: total, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return total;
};

module.exports = { getAll, getById, create, update, delete: remove, count };
