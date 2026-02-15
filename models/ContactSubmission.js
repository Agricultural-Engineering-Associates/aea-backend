const supabase = require('../config/db');
const { transformRow, toDB } = require('./utils');

const getAll = async () => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(transformRow);
};

const getById = async (id) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const create = async (submissionData) => {
  const dbData = toDB(submissionData);
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(dbData)
    .select()
    .single();
  if (error) throw error;
  return transformRow(data);
};

const markAsRead = async (id) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const remove = async (id) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const getUnreadCount = async () => {
  const { count, error } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
  if (error) throw error;
  return count;
};

module.exports = { getAll, getById, create, markAsRead, delete: remove, getUnreadCount };
