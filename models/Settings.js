const supabase = require('../config/db');
const { transformRow, toDB } = require('./utils');

const transformSettings = (row) => {
  if (!row) return null;
  const result = transformRow(row);
  result.socialLinks = {
    facebook: result.facebook || '',
    instagram: result.instagram || '',
    twitter: result.twitter || '',
    linkedin: result.linkedin || ''
  };
  delete result.facebook;
  delete result.instagram;
  delete result.twitter;
  delete result.linkedin;
  return result;
};

const get = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? transformSettings(data) : null;
};

const update = async (inputData) => {
  const { socialLinks, ...rest } = inputData;
  const flatData = {};

  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) flatData[key] = value;
  }

  if (socialLinks) {
    if (socialLinks.facebook !== undefined) flatData.facebook = socialLinks.facebook;
    if (socialLinks.instagram !== undefined) flatData.instagram = socialLinks.instagram;
    if (socialLinks.twitter !== undefined) flatData.twitter = socialLinks.twitter;
    if (socialLinks.linkedin !== undefined) flatData.linkedin = socialLinks.linkedin;
  }

  const dbData = toDB(flatData);

  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  let result;

  if (existing) {
    const { data, error } = await supabase
      .from('settings')
      .update(dbData)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from('settings')
      .insert(dbData)
      .select()
      .single();
    if (error) throw error;
    result = data;
  }

  return transformSettings(result);
};

module.exports = { get, update };
