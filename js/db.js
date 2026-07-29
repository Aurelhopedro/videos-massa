// db.js — camada única de acesso ao IndexedDB
// Armazena: favoritos, historico, downloads, configuracoes, sessoes (abas)

const DB_NAME = 'videosmassa_browser';
const DB_VERSION = 1;
const STORES = ['favorites', 'history', 'downloads', 'settings', 'tabs'];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach(name => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const DB = {
  async add(store, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).add(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async put(store, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).put(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async delete(store, id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
  async getAll(store) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async clear(store) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
  async getSetting(key, fallback) {
    const all = await this.getAll('settings');
    const found = all.find(s => s.key === key);
    return found ? found.value : fallback;
  },
  async setSetting(key, value) {
    const all = await this.getAll('settings');
    const found = all.find(s => s.key === key);
    if (found) { found.value = value; return this.put('settings', found); }
    return this.add('settings', { key, value });
  }
};
