// Stampa l'SQL che inserisce il corso di esempio "Posto di blocco" nel database D1.
// INSERT OR IGNORE: non sovrascrive un corso già presente o modificato dall'area admin.
import { validaCorso, validaModulo, validaDomanda } from '../src/formazione/validazione.js';
import { CORSO, MODULI, DOMANDE } from '../seed/posto-di-blocco.js';

const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
const riga = (col, id, dati) => `INSERT OR IGNORE INTO docs (col, id, data) VALUES (${q(col)}, ${q(id)}, ${q(JSON.stringify(dati))});`;
const ok = (r, etichetta) => { if (r.errore) throw new Error(`${etichetta}: ${r.errore}`); return r.dati; };

const out = [riga('corsi', CORSO.id, ok(validaCorso(CORSO, CORSO.id), 'corso'))];
for (const m of MODULI) out.push(riga('moduli', `${CORSO.id}__${m.id}`, ok(validaModulo(m, CORSO.id, m.id), m.id)));
for (const d of DOMANDE) out.push(riga('domande', `${CORSO.id}__${d.moduloId}__${d.id}`, ok(validaDomanda(d, CORSO.id, d.moduloId, d.id), d.id)));
console.log(out.join('\n'));
