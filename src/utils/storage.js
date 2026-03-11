// src/utils/storage.js
export const setWithExpiry = (key, value, ttlMinutes = 480) => {
  const item = {
    value,
    expiry: Date.now() + ttlMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const item = JSON.parse(raw);
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};
