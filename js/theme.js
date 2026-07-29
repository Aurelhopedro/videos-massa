// theme.js — tema claro/escuro/automático

const Theme = {
  async init() {
    const mode = await DB.getSetting('theme', 'auto');
    this.apply(mode);
  },
  apply(mode) {
    let effective = mode;
    if (mode === 'auto') {
      effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', effective);
  },
  async set(mode) {
    await DB.setSetting('theme', mode);
    this.apply(mode);
  }
};

document.addEventListener('DOMContentLoaded', () => Theme.init());
