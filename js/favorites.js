// favorites.js

const Favorites = {
  async add(url, title, folder = 'Geral') {
    const all = await DB.getAll('favorites');
    if (all.some(f => f.url === url)) { showToast('Já está nos favoritos'); return; }
    await DB.add('favorites', { url, title: title || url, folder, createdAt: Date.now() });
    showToast('Adicionado aos favoritos');
  },
  async remove(id) {
    await DB.delete('favorites', id);
  },
  async update(id, data) {
    const all = await DB.getAll('favorites');
    const item = all.find(f => f.id === id);
    if (!item) return;
    Object.assign(item, data);
    await DB.put('favorites', item);
  },
  async all() {
    return DB.getAll('favorites');
  },
  async byFolder() {
    const all = await this.all();
    const grouped = {};
    all.forEach(f => {
      const folder = f.folder || 'Geral';
      grouped[folder] = grouped[folder] || [];
      grouped[folder].push(f);
    });
    return grouped;
  },
  async exportJson() {
    const all = await this.all();
    return JSON.stringify(all, null, 2);
  },
  async importJson(jsonText) {
    const items = JSON.parse(jsonText);
    for (const item of items) {
      await DB.add('favorites', { url: item.url, title: item.title, folder: item.folder || 'Importado', createdAt: Date.now() });
    }
  }
};
