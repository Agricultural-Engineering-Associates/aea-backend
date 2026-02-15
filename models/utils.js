const snakeToCamelMap = {
  password_hash: 'passwordHash',
  photo_url: 'photoUrl',
  page_name: 'pageName',
  display_order: 'displayOrder',
  is_active: 'isActive',
  is_read: 'isRead',
  image_url: 'imageUrl',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  business_name: 'businessName'
};

const camelToSnakeMap = {};
for (const [snake, camel] of Object.entries(snakeToCamelMap)) {
  camelToSnakeMap[camel] = snake;
}

const transformRow = (row) => {
  if (!row) return null;
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = snakeToCamelMap[key] || key;
    result[camelKey] = value;
  }
  return result;
};

const toDB = (obj) => {
  if (!obj) return null;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const snakeKey = camelToSnakeMap[key] || key;
    result[snakeKey] = value;
  }
  return result;
};

module.exports = { transformRow, toDB };
