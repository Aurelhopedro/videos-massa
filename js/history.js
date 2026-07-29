// history.js

const History = {
  async record(url, title) {
    await DB.add('history', { url, title: title || url, visitedAt: Date.now() });
  },
  async all() {
    const all = await DB.getAll('history');
    return all.sort((a, b) => b.visitedAt - a.visitedAt);
  },
  async search(term) {
    const all = await this.all();
    const t = term.toLowerCase();
    return all.filter(h => (h.title || '').toLowerCase().includes(t) || h.url.toLowerCase().includes(t));
  },
  async clear() {
    await DB.clear('history');
  },
  async remove(id) {
    await DB.delete('history', id);
  }
};
