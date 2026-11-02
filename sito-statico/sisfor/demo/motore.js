// Modalità prova: stessa logica del Worker (copiata qui), ma in memoria nel browser e con un'identità finta.
// Serve solo a provare l'interfaccia: nessun dato reale viene letto o scritto, al ricaricamento si riparte da zero.
import { handleFormazione } from './api.js';
import { validaCorso, validaModulo, validaDomanda } from './validazione.js';
import { CORSO, MODULI, DOMANDE } from './posto-di-blocco.js';

// Come Firestore: un campo `id` dentro al documento ha la precedenza sull'id del documento.
function archivio(seed) {
  const db = new Map();
  for (const [col, docs] of Object.entries(seed)) for (const [id, d] of Object.entries(docs)) db.set(`${col}/${id}`, structuredClone(d));
  return {
    async get(col, id) { const d = db.get(`${col}/${id}`); return d ? { id, ...structuredClone(d) } : null; },
    async set(col, id, data) { db.set(`${col}/${id}`, structuredClone(data)); },
    async delete(col, id) { db.delete(`${col}/${id}`); },
    async list(col, where = {}) {
      const out = [];
      for (const [k, d] of db) if (k.startsWith(`${col}/`) && Object.entries(where).every(([f, v]) => d[f] === v)) out.push({ id: k.slice(col.length + 1), ...structuredClone(d) });
      return out;
    },
  };
}

const ID_PROVA = '111111111111111111';

export function creaMotore(ruolo) {
  const grado = ruolo === 'admin' ? 'Questore' : ruolo === 'istruttore' ? 'Ispettore' : 'Agente';
  const store = archivio({
    'auth-sito': {
      [ID_PROVA]: { nome: 'Mario', cognome: 'Rossi', grado, ruolo },
      '222222222222222222': { nome: 'Luca', cognome: 'Bianchi', grado: 'Agente', ruolo: 'allievo' },
    },
  });
  const pronto = (async () => {
    const c = validaCorso(CORSO, CORSO.id);
    await store.set('corsi', CORSO.id, c.dati);
    for (const m of MODULI) await store.set('moduli', `${CORSO.id}__${m.id}`, validaModulo(m, CORSO.id, m.id).dati);
    for (const d of DOMANDE) await store.set('domande', `${CORSO.id}__${d.moduloId}__${d.id}`, validaDomanda(d, CORSO.id, d.moduloId, d.id).dati);
  })();
  return async function chiama(path, { method = 'GET', body } = {}) {
    await pronto;
    const url = new URL('https://prova.locale/formazione' + path);
    const request = new Request(url, { method, headers: body ? { 'Content-Type': 'application/json', Authorization: 'Bearer prova' } : { Authorization: 'Bearer prova' }, body: body ? JSON.stringify(body) : undefined });
    return handleFormazione(request, {}, { cors: {}, url, verify: async () => ({ sub: 'discord:' + ID_PROVA }), store });
  };
}
