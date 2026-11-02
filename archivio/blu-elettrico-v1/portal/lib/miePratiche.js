// Elenco locale (solo su questo dispositivo) dei codici pratica usati dal
// cittadino: serve a mostrare "Le tue pratiche" senza account.
const KEY = 'pds-mie-pratiche';

export function getSaved() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list.filter((p) => p && typeof p.code === 'string') : [];
  } catch (e) {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
    window.dispatchEvent(new Event('pds-pratiche'));
  } catch (e) {
    /* storage non disponibile */
  }
}

export function savePratica(code, tipo) {
  const list = getSaved().filter((p) => p.code !== code);
  list.unshift({ code, tipo: tipo || null, ts: Date.now() });
  write(list);
}

export function removePratica(code) {
  write(getSaved().filter((p) => p.code !== code));
}
