// utils.js — funções compartilhadas entre páginas

function showToast(msg, duration = 2200) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

function sanitizeText(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const looksLikeUrl = /^https?:\/\//i.test(trimmed) || /^[\w-]+\.[a-z]{2,}(\/.*)?$/i.test(trimmed);
  if (looksLikeUrl) {
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }
  return null;
}

function buildSearchUrl(engine, query) {
  const q = encodeURIComponent(query);
  switch (engine) {
    case 'bing': return `https://www.bing.com/search?q=${q}`;
    case 'duckduckgo': return `https://duckduckgo.com/?q=${q}`;
    case 'google':
    default: return `https://www.google.com/search?q=${q}`;
  }
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString('pt-BR');
}

function faviconLetter(url) {
  try {
    const host = new URL(url).hostname.replace('www.', '');
    return host.charAt(0).toUpperCase();
  } catch { return '?'; }
}
