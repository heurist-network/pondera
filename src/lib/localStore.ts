export const getLocalStore = (key: string) => {
  const localStore = localStorage.getItem(key);
  try {
    if (localStore) return JSON.parse(localStore);
    return null;
  } catch {
    return null;
  }
};
