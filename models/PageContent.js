const supabase = require('../config/db');
const { transformRow } = require('./utils');

const findByPageName = async (pageName) => {
  const { data, error } = await supabase
    .from('page_contents')
    .select('*')
    .eq('page_name', pageName)
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const getAll = async () => {
  const { data, error } = await supabase
    .from('page_contents')
    .select('*')
    .order('page_name');
  if (error) throw error;
  return (data || []).map(transformRow);
};

const create = async ({ pageName, sections }) => {
  const { data, error } = await supabase
    .from('page_contents')
    .insert({ page_name: pageName, sections: sections || [] })
    .select()
    .single();
  if (error) throw error;
  return transformRow(data);
};

const updateSections = async (pageName, sections) => {
  const { data, error } = await supabase
    .from('page_contents')
    .update({ sections })
    .eq('page_name', pageName)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const upsert = async (pageName, sections) => {
  const { data, error } = await supabase
    .from('page_contents')
    .upsert(
      { page_name: pageName, sections: sections || [] },
      { onConflict: 'page_name' }
    )
    .select()
    .single();
  if (error) throw error;
  return transformRow(data);
};

const deleteByPageName = async (pageName) => {
  const { data, error } = await supabase
    .from('page_contents')
    .delete()
    .eq('page_name', pageName)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? transformRow(data) : null;
};

const count = async () => {
  const { count: total, error } = await supabase
    .from('page_contents')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return total;
};

module.exports = { findByPageName, getAll, create, updateSections, upsert, deleteByPageName, count };
