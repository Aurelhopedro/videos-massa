// downloads.js — gestor de downloads para arquivos com link direto e permitido.
// Não faz engenharia reversa de streams protegidos nem contorna proteção de sites.

const Downloads = {
  active: new Map(), // id -> { controller }

  async list() {
    const all = await DB.getAll('downloads');
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },

  async start(url, filenameHint) {
    const filename = filenameHint || url.split('/').pop().split('?')[0] || 'arquivo';
    const id = await DB.add('downloads', {
      url, filename, status: 'baixando', receivedBytes: 0, totalBytes: 0, createdAt: Date.now()
    });

    const controller = new AbortController();
    this.active.set(id, { controller });

    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error('Falha ao acessar o arquivo (HTTP ' + res.status + ')');
      const total = Number(res.headers.get('content-length')) || 0;
      const reader = res.body.getReader();
      const chunks = [];
      let received = 0;
      let lastTick = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;

        if (Date.now() - lastTick > 300) {
          lastTick = Date.now();
          await this._updateProgress(id, received, total);
        }
      }
      await this._updateProgress(id, received, total);

      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      await this._setStatus(id, 'concluido');
      showToast(`Download concluído: ${filename}`);
    } catch (err) {
      if (err.name === 'AbortError') {
        await this._setStatus(id, 'cancelado');
      } else {
        await this._setStatus(id, 'erro');
        showToast('Erro no download: ' + err.message);
      }
    } finally {
      this.active.delete(id);
    }
    return id;
  },

  cancel(id) {
    const entry = this.active.get(id);
    if (entry) entry.controller.abort();
  },

  async retry(id) {
    const all = await DB.getAll('downloads');
    const item = all.find(d => d.id === id);
    if (!item) return;
    await DB.delete('downloads', id);
    return this.start(item.url, item.filename);
  },

  async remove(id) {
    this.cancel(id);
    await DB.delete('downloads', id);
  },

  async _updateProgress(id, received, total) {
    const all = await DB.getAll('downloads');
    const item = all.find(d => d.id === id);
    if (!item) return;
    item.receivedBytes = received;
    item.totalBytes = total;
    await DB.put('downloads', item);
  },

  async _setStatus(id, status) {
    const all = await DB.getAll('downloads');
    const item = all.find(d => d.id === id);
    if (!item) return;
    item.status = status;
    await DB.put('downloads', item);
  }
};
