#!/usr/bin/env node
// Inserisce il corso di esempio "Posto di blocco e fermo veicolo" in Firestore.
//   FIREBASE_SERVICE_ACCOUNT="$(cat chiave-servizio.json)" node scripts/seed-formazione.mjs
// Scrive solo le raccolte corsi, moduli e domande (sovrascrive i documenti con gli stessi id).
import { firestoreStore } from '../workers/sportello/src/formazione/store.js';
import { validaCorso, validaModulo, validaDomanda } from '../workers/sportello/src/formazione/validazione.js';
import { CORSO, MODULI, DOMANDE } from '../workers/sportello/seed/posto-di-blocco.js';

const store = firestoreStore(process.env);
if (!store) {
  console.error('Imposta FIREBASE_SERVICE_ACCOUNT con il contenuto del JSON del service account.');
  process.exit(1);
}
const c = validaCorso(CORSO, CORSO.id);
if (c.errore) throw new Error(c.errore);
await store.set('corsi', CORSO.id, c.dati);
for (const m of MODULI) {
  const v = validaModulo(m, CORSO.id, m.id);
  if (v.errore) throw new Error(`${m.id}: ${v.errore}`);
  await store.set('moduli', `${CORSO.id}__${m.id}`, v.dati);
}
for (const d of DOMANDE) {
  const v = validaDomanda(d, CORSO.id, d.moduloId, d.id);
  if (v.errore) throw new Error(`${d.id}: ${v.errore}`);
  await store.set('domande', `${CORSO.id}__${d.moduloId}__${d.id}`, v.dati);
}
console.log(`Corso "${CORSO.titolo}": ${MODULI.length} moduli, ${DOMANDE.length} domande.`);
