// tabs.js — sistema de abas, persistido em IndexedDB (store 'tabs')

const Tabs = {
  list: [],
  activeId: null,

  async load() {
    this.list = await DB.getAll('tabs');
    if (this.list.length === 0) {
      const id = await DB.add('tabs', { title: 'Nova aba', url: '', pinned: false, incognito: false, createdAt: Date.now() });
      this.list = await DB.getAll('tabs');
    }
    this.activeId = this.list[this.list.length - 1].id;
  },

  async create(url = '', incognito = false) {
    const id = await DB.add('tabs', { title: 'Nova aba', url, pinned: false, incognito, createdAt: Date.now() });
    this.list = await DB.getAll('tabs');
    this.activeId = id;
    return id;
  },

  async close(id) {
    await DB.delete('tabs', id);
    this.list = await DB.getAll('tabs');
    if (this.list.length === 0) {
      await this.create();
    } else if (this.activeId === id) {
      this.activeId = this.list[this.list.length - 1].id;
    }
  },

  async togglePin(id) {
    const tab = this.list.find(t => t.id === id);
    if (!tab) return;
    tab.pinned = !tab.pinned;
    await DB.put('tabs', tab);
    this.list = await DB.getAll('tabs');
  },

  async updateActive(url, title) {
    const tab = this.list.find(t => t.id === this.activeId);
    if (!tab) return;
    tab.url = url;
    tab.title = title || url;
    await DB.put('tabs', tab);
    this.list = await DB.getAll('tabs');
  },

  getActive() {
    return this.list.find(t => t.id === this.activeId);
  },

  renderStrip(container, onSelect) {
    container.innerHTML = '';
    this.list.forEach(tab => {
      const chip = document.createElement('div');
      chip.className = 'tab-chip' + (tab.id === this.activeId ? ' active' : '');
      chip.innerHTML = `<span>${sanitizeText(tab.title || 'Nova aba')}</span> <button data-id="${tab.id}">✕</button>`;
      chip.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        this.activeId = tab.id;
        onSelect();
      });
      chip.querySelector('button').addEventListener('click', async (e) => {
        e.stopPropagation();
        await this.close(tab.id);
        onSelect();
      });
      container.appendChild(chip);
    });
  }
};
