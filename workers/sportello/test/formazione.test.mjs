import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { configQuiz, estrai, perIlBrowser, puoTentare, correggi } from '../src/formazione/quiz.js';
import { statoModuli, praticaSbloccata, corsoVisibile } from '../src/formazione/percorso.js';
import { transizione, valuta, scadenzaAbilitazione, praticaAttiva } from '../src/formazione/pratica.js';
import { ruoloDi, puo } from '../src/formazione/ruoli.js';
import { validaCorso, validaModulo, validaDomanda } from '../src/formazione/validazione.js';
import { memoryStore } from '../src/formazione/store.js';
import { handleFormazione } from '../src/formazione/api.js';
import { CORSO, MODULI, DOMANDE } from '../seed/posto-di-blocco.js';

const seq = (vals) => { let i = 0; return () => vals[i++ % vals.length]; };
const MIN = 60000;

// ---------- quiz ----------
const pool = Array.from({ length: 10 }, (_, i) => ({ id: `d${i}`, testo: `Q${i}`, opzioni: [{ id: 'a', testo: 'A' }, { id: 'b', testo: 'B' }], corretta: 'a', spiegazione: `perché ${i}` }));

test('estrazione: n domande diverse dal pool, mai più del pool', () => {
  const e = estrai(pool, 4);
  assert.equal(e.length, 4);
  assert.equal(new Set(e.map((d) => d.id)).size, 4);
  assert.equal(estrai(pool, 50).length, 10);
});

test('estrazione casuale: generatori diversi danno sottoinsiemi diversi', () => {
  const a = estrai(pool, 3, seq([0.1, 0.5, 0.9])).map((d) => d.id).join();
  const b = estrai(pool, 3, seq([0.9, 0.2, 0.4])).map((d) => d.id).join();
  assert.notEqual(a, b);
});

test('verso il browser: nessuna risposta corretta né spiegazione', () => {
  const j = JSON.stringify(pool.map((d) => perIlBrowser(d)));
  assert.ok(!j.includes('corretta'));
  assert.ok(!j.includes('spiegazione'));
  assert.ok(!j.includes('perché'));
});

test('configurazione quiz: valori fuori misura tornano ai predefiniti', () => {
  assert.deepEqual(configQuiz({ quiz: { soglia: 80, domande: 7 } }).soglia, 80);
  assert.equal(configQuiz({ quiz: { soglia: 500 } }).soglia, 70);
  assert.equal(configQuiz({}).maxTentativi, 3);
});

test('correzione: punteggio, soglia ed errori con spiegazione', () => {
  const dom = pool.slice(0, 4);
  const r = correggi(dom, { d0: 'a', d1: 'a', d2: 'b' }, 70);
  assert.equal(r.giuste, 2);
  assert.equal(r.punteggio, 50);
  assert.equal(r.esito, 'non_superato');
  assert.equal(r.errori.length, 2);
  assert.equal(r.errori[0].spiegazione, 'perché 2');
  assert.equal(correggi(dom, { d0: 'a', d1: 'a', d2: 'a', d3: 'a' }, 70).esito, 'superato');
  assert.equal(correggi(dom, {}, 70).punteggio, 0); // nessuna risposta = sbagliato
});

test('tentativi: limite, attesa, ripresa del tentativo aperto, quiz già superato', () => {
  const cfg = { maxTentativi: 2, attesaMinuti: 30 };
  const t0 = 1_000_000;
  assert.equal(puoTentare([], cfg, t0).ok, true);
  const uno = [{ consegnatoIl: t0, esito: 'non_superato' }];
  const att = puoTentare(uno, cfg, t0 + 10 * MIN);
  assert.equal(att.ok, false);
  assert.equal(att.motivo, 'attesa');
  assert.equal(att.riprovaTra, 20 * 60);
  assert.equal(puoTentare(uno, cfg, t0 + 31 * MIN).ok, true);
  const due = [...uno, { consegnatoIl: t0 + 40 * MIN, esito: 'non_superato' }];
  assert.equal(puoTentare(due, cfg, t0 + 999 * MIN).motivo, 'tentativi_esauriti');
  assert.equal(puoTentare([{ consegnatoIl: t0, esito: 'superato' }], cfg, t0 + 999 * MIN).motivo, 'gia_superato');
  const aperto = { id: 'x', scadeIl: t0 + 5 * MIN };
  assert.equal(puoTentare([aperto], cfg, t0).riprendi, aperto);
});

// ---------- percorso e sblocco ----------
const moduli = [{ id: 'm1', ordine: 1, titolo: 'Uno' }, { id: 'm2', ordine: 2, titolo: 'Due' }, { id: 'm3', ordine: 3, titolo: 'Tre' }];

test('sblocco in sequenza: il modulo successivo si apre dopo lettura e quiz del precedente', () => {
  let s = statoModuli(moduli, { moduliLetti: [], quizSuperati: {} });
  assert.deepEqual(s.map((x) => x.stato), ['in_corso', 'bloccato', 'bloccato']);
  assert.equal(s[0].quizSbloccato, false); // serve prima leggere
  s = statoModuli(moduli, { moduliLetti: ['m1'], quizSuperati: {} });
  assert.equal(s[0].quizSbloccato, true);
  assert.equal(s[1].stato, 'bloccato');
  s = statoModuli(moduli, { moduliLetti: ['m1'], quizSuperati: { m1: { punteggio: 80 } } });
  assert.deepEqual(s.map((x) => x.stato), ['completato', 'in_corso', 'bloccato']);
});

test('pratica sbloccata solo con tutti i quiz superati', () => {
  const q = (...ids) => Object.fromEntries(ids.map((i) => [i, { punteggio: 90 }]));
  assert.equal(praticaSbloccata(moduli, { quizSuperati: q('m1', 'm2') }), false);
  assert.equal(praticaSbloccata(moduli, { quizSuperati: q('m1', 'm2', 'm3') }), true);
  assert.equal(praticaSbloccata([], { quizSuperati: {} }), false);
});

test('visibilità del corso: grado minimo, abilitazioni richieste, admin', () => {
  const c = { gradoMinimo: 'Assistente', richiede: ['base'] };
  assert.equal(corsoVisibile(c, 'Agente', ['base'], 'allievo'), false); // grado basso
  assert.equal(corsoVisibile(c, 'Assistente', [], 'allievo'), false); // manca l'abilitazione
  assert.equal(corsoVisibile(c, 'Ispettore', ['base'], 'allievo'), true);
  assert.equal(corsoVisibile(c, 'Agente', [], 'admin'), true);
  assert.equal(corsoVisibile({ gradoMinimo: 'Agente', pubblicato: false }, 'Questore', [], 'allievo'), false);
  assert.equal(corsoVisibile({ gradoMinimo: 'Grado inventato' }, 'Questore', [], 'allievo'), false);
});

// ---------- pratica ----------
test('stati della pratica: transizioni consentite e vietate', () => {
  assert.equal(transizione('richiesta', 'assegna'), 'in_valutazione');
  assert.equal(transizione('programmata', 'assegna'), 'in_valutazione');
  assert.equal(transizione('in_valutazione', 'esito_superata'), 'superata');
  assert.equal(transizione('in_valutazione', 'esito_da_ripetere'), 'da_ripetere');
  assert.equal(transizione('richiesta', 'esito_superata'), null); // nessun esito senza valutazione
  assert.equal(transizione('superata', 'assegna'), null);
  assert.equal(praticaAttiva({ stato: 'da_ripetere' }), false);
  assert.equal(praticaAttiva({ stato: 'programmata' }), true);
});

test('griglia: tutti i criteri devono avere un livello valido', () => {
  const g = [{ id: 'a', titolo: 'A' }, { id: 'b', titolo: 'B' }];
  assert.match(valuta(g, [{ criterioId: 'a', livello: 'corretto' }]).errore, /B/);
  assert.ok(valuta(g, [{ criterioId: 'a', livello: 'inventato' }, { criterioId: 'b', livello: 'corretto' }]).errore);
  const v = valuta(g, [{ criterioId: 'a', livello: 'corretto' }, { criterioId: 'b', livello: 'parziale' }]);
  assert.equal(v.punti, 3);
  assert.equal(v.max, 4);
  assert.equal(v.percentuale, 75);
});

test('scadenza dell’abilitazione', () => {
  const t = Date.UTC(2026, 0, 31);
  assert.equal(scadenzaAbilitazione({ abilitazione: { scadenzaMesi: 0 } }, t), null);
  assert.ok(scadenzaAbilitazione({ abilitazione: { scadenzaMesi: 12 } }, t) > t);
});

// ---------- ruoli ----------
test('ruoli: assente o non valido = allievo; permessi per ruolo', () => {
  assert.equal(ruoloDi({}), 'allievo');
  assert.equal(ruoloDi({ ruolo: 'superuser' }), 'allievo');
  assert.equal(ruoloDi({ ruolo: 'admin' }), 'admin');
  assert.equal(puo('allievo', 'valuta'), false);
  assert.equal(puo('istruttore', 'valuta'), true);
  assert.equal(puo('istruttore', 'amministra'), false);
  assert.equal(puo('admin', 'amministra'), true);
});

// ---------- validazione contenuti ----------
test('il corso di esempio e i suoi contenuti passano la validazione', () => {
  assert.ok(validaCorso(CORSO, CORSO.id).dati);
  for (const m of MODULI) assert.ok(validaModulo(m, CORSO.id, m.id).dati, m.id);
  for (const d of DOMANDE) assert.ok(validaDomanda(d, CORSO.id, d.moduloId, d.id).dati, d.id);
  assert.equal(DOMANDE.length, 15);
  assert.ok(new Set(DOMANDE.map((d) => d.corretta)).size > 1); // la lettera giusta varia
});

test('validazione: grado, risposta corretta, video e immagini', () => {
  assert.ok(validaCorso({ ...CORSO, gradoMinimo: 'Re' }, 'x').errore);
  assert.ok(validaDomanda({ ...DOMANDE[0], corretta: 'z' }, 'c', 'm', 'd').errore);
  assert.ok(validaModulo({ titolo: 'T', ordine: 1, blocchi: [{ tipo: 'video', url: 'https://evil.example/x' }] }, 'c', 'm').errore);
  assert.ok(validaModulo({ titolo: 'T', ordine: 1, blocchi: [{ tipo: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }] }, 'c', 'm').dati);
  assert.ok(validaModulo({ titolo: 'T', ordine: 1, blocchi: [{ tipo: 'immagine', src: 'https://evil.example/a.png' }] }, 'c', 'm').errore);
  assert.ok(validaModulo({ titolo: 'T', ordine: 1, blocchi: [{ tipo: 'immagine', src: '/assets/../secret.png' }] }, 'c', 'm').errore);
});

// ---------- regole Firestore (analisi statica: l'emulatore non è disponibile qui) ----------
test('regole Firestore: auth-sito (con il ruolo) non è scrivibile dai client', () => {
  const rules = readFileSync(new URL('../../../firestore.rules', import.meta.url), 'utf8');
  const blocco = rules.match(/match \/auth-sito\/\{discordId\} \{([\s\S]*?)\n    \}/)[1];
  assert.match(blocco, /allow write: if false;/);
  assert.ok(!/allow (create|update|delete)/.test(blocco));
  assert.match(blocco, /request\.auth\.uid == 'discord:' \+ discordId/); // legge solo il proprio
});

test('regole Firestore: le raccolte della formazione sono chiuse ai client', () => {
  const rules = readFileSync(new URL('../../../firestore.rules', import.meta.url), 'utf8');
  const blocco = rules.match(/match \/\{col\}\/\{id\} \{([\s\S]*?)\n    \}/)[1];
  for (const c of ['corsi', 'moduli', 'domande', 'tentativi', 'progressi', 'pratiche-formazione', 'sessioni', 'abilitazioni']) assert.ok(blocco.includes(`'${c}'`), c);
  assert.match(blocco, /&& false/);
  assert.match(rules, /match \/\{document=\*\*\} \{\s*allow read, write: if false;/);
});

// ---------- API del Worker ----------
const cors = {};
const ID_ALLIEVO = '111111111111111111';
const ID_ISTR = '222222222222222222';
const ID_ADMIN = '333333333333333333';
const ID_ISTR2 = '444444444444444444';

function seedStore() {
  const seed = {
    'agenti': {
      [ID_ALLIEVO]: { nome: 'Mario', cognome: 'Rossi', grado: 'Agente', ruolo: 'allievo' },
      [ID_ISTR]: { nome: 'Luca', cognome: 'Bianchi', grado: 'Ispettore', ruolo: 'istruttore' },
      [ID_ISTR2]: { nome: 'Anna', cognome: 'Verdi', grado: 'Ispettore', ruolo: 'istruttore' },
      [ID_ADMIN]: { nome: 'Capo', cognome: 'Comando', grado: 'Questore', ruolo: 'admin' },
      '555555555555555555': { nome: 'Senza', cognome: 'Ruolo', grado: 'Agente' },
    },
    corsi: { [CORSO.id]: validaCorso(CORSO, CORSO.id).dati },
    moduli: {}, domande: {},
  };
  for (const m of MODULI) seed.moduli[`${CORSO.id}__${m.id}`] = validaModulo(m, CORSO.id, m.id).dati;
  for (const d of DOMANDE) seed.domande[`${CORSO.id}__${d.moduloId}__${d.id}`] = validaDomanda(d, CORSO.id, d.moduloId, d.id).dati;
  return memoryStore(seed);
}

function chiamata(store, utente, metodo, percorso, body, ora) {
  const verify = async (t) => (t === 'ok' ? { sub: `discord:${utente}` } : null);
  const request = new Request(`https://w.test/formazione${percorso}`, {
    method: metodo,
    headers: { Authorization: utente === null ? '' : 'Bearer ok', 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handleFormazione(request, {}, { cors, url: new URL(request.url), verify, store, now: () => ora.t, rng: Math.random });
}

async function chiama(...a) {
  const r = await chiamata(...a);
  return { status: r.status, body: await r.json() };
}

const rispostaGiusta = (id) => DOMANDE.find((d) => d.id === id).corretta;

async function superaModulo(store, ora, mid, giuste = true) {
  await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/${mid}/letto`, {}, ora);
  const q = await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/${mid}/quiz`, {}, ora);
  assert.equal(q.status, 200, JSON.stringify(q.body));
  const risposte = {};
  for (const d of q.body.domande) risposte[d.id] = giuste ? rispostaGiusta(d.id) : d.opzioni.find((o) => o.id !== rispostaGiusta(d.id)).id;
  return chiama(store, ID_ALLIEVO, 'POST', `/quiz/${q.body.tentativo.id}/consegna`, { risposte }, ora);
}

test('API: senza token 401; con token ma senza profilo 403; senza store 503', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  assert.equal((await chiama(store, null, 'GET', '/me', undefined, ora)).status, 401);
  assert.equal((await chiama(store, '999999999999999999', 'GET', '/me', undefined, ora)).status, 403);
  const req = new Request('https://w.test/formazione/me', { headers: { Authorization: 'Bearer ok' } });
  const r = await handleFormazione(req, {}, { cors, url: new URL(req.url), verify: async () => ({ sub: 'discord:111111111111111111' }), store: null });
  assert.equal(r.status, 503);
});

test('API permessi: l’allievo non entra in istruttori né admin; l’istruttore non entra in admin', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  assert.equal((await chiama(store, ID_ALLIEVO, 'GET', '/istruttori/coda', undefined, ora)).status, 403);
  assert.equal((await chiama(store, ID_ALLIEVO, 'GET', '/admin/corsi', undefined, ora)).status, 403);
  assert.equal((await chiama(store, ID_ALLIEVO, 'PUT', '/admin/corsi/x', CORSO, ora)).status, 403);
  assert.equal((await chiama(store, ID_ISTR, 'GET', '/istruttori/coda', undefined, ora)).status, 200);
  assert.equal((await chiama(store, ID_ISTR, 'PUT', `/admin/corsi/${CORSO.id}`, CORSO, ora)).status, 403);
  assert.equal((await chiama(store, ID_ADMIN, 'GET', '/admin/corsi', undefined, ora)).status, 200);
  assert.equal((await chiama(store, '555555555555555555', 'GET', '/istruttori/coda', undefined, ora)).status, 403); // senza ruolo = allievo
});

test('API catalogo: filtrato per grado', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  await store.set('corsi', 'alto', validaCorso({ ...CORSO, titolo: 'Corso alto', gradoMinimo: 'Ispettore' }, 'alto').dati);
  const a = await chiama(store, ID_ALLIEVO, 'GET', '/corsi', undefined, ora);
  assert.deepEqual(a.body.corsi.map((c) => c.id), [CORSO.id]);
  const i = await chiama(store, ID_ISTR, 'GET', '/corsi', undefined, ora);
  assert.equal(i.body.corsi.length, 2);
  assert.equal((await chiama(store, ID_ALLIEVO, 'GET', '/corsi/alto', undefined, ora)).status, 404);
});

test('API quiz: il quiz si apre solo dopo la lettura e le risposte corrette non arrivano al browser', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  const prima = await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/preparazione/quiz`, {}, ora);
  assert.equal(prima.status, 403);
  await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/preparazione/letto`, {}, ora);
  const raw = await chiamata(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/preparazione/quiz`, {}, ora);
  const testo = await raw.text();
  assert.equal(raw.status, 200);
  assert.ok(!testo.includes('corretta'));
  assert.ok(!testo.includes('spiegazione'));
  assert.equal(JSON.parse(testo).domande.length, 5);
  // anche il dettaglio del corso e il modulo non contengono domande
  const dett = JSON.stringify((await chiama(store, ID_ALLIEVO, 'GET', `/corsi/${CORSO.id}`, undefined, ora)).body);
  assert.ok(!dett.includes('corretta'));
});

test('API quiz: un modulo bloccato non si legge né si studia', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  assert.equal((await chiama(store, ID_ALLIEVO, 'GET', `/corsi/${CORSO.id}/moduli/fermo-veicolo`, undefined, ora)).status, 403);
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/fermo-veicolo/letto`, {}, ora)).status, 403);
});

test('API quiz: errori con spiegazione solo dopo la consegna, attesa tra i tentativi, tentativo consegnato una volta sola', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  const sbagliato = await superaModulo(store, ora, 'preparazione', false);
  assert.equal(sbagliato.body.esito, 'non_superato');
  assert.equal(sbagliato.body.errori.length, 5);
  assert.ok(sbagliato.body.errori[0].spiegazione.length > 0);
  assert.ok(sbagliato.body.errori[0].corretta);
  // subito dopo: attesa
  const attesa = await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/preparazione/quiz`, {}, ora);
  assert.equal(attesa.status, 429);
  assert.equal(attesa.body.motivo, 'attesa');
  // dopo l'attesa: riparte; alla terza volta sbagliata, tentativi esauriti
  ora.t += 31 * MIN;
  const s2 = await superaModulo(store, ora, 'preparazione', false);
  assert.equal(s2.body.esito, 'non_superato');
  ora.t += 31 * MIN;
  await superaModulo(store, ora, 'preparazione', false);
  ora.t += 31 * MIN;
  const fine = await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/preparazione/quiz`, {}, ora);
  assert.equal(fine.body.motivo, 'tentativi_esauriti');
  // reset da istruttore
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', '/istruttori/reset-tentativi', { allievoId: ID_ALLIEVO, corsoId: CORSO.id, moduloId: 'preparazione' }, ora)).status, 403);
  const reset = await chiama(store, ID_ISTR, 'POST', '/istruttori/reset-tentativi', { allievoId: ID_ALLIEVO, corsoId: CORSO.id, moduloId: 'preparazione' }, ora);
  assert.equal(reset.body.rimossi, 3);
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/preparazione/quiz`, {}, ora)).status, 200);
});

test('API quiz: tentativo altrui o già consegnato rifiutato; scaduto = tutto sbagliato', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/preparazione/letto`, {}, ora);
  const q = await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/moduli/preparazione/quiz`, {}, ora);
  const id = q.body.tentativo.id;
  assert.equal((await chiama(store, ID_ISTR, 'POST', `/quiz/${id}/consegna`, { risposte: {} }, ora)).status, 404);
  ora.t += 120 * MIN; // oltre la durata
  const scaduto = await chiama(store, ID_ALLIEVO, 'POST', `/quiz/${id}/consegna`, { risposte: Object.fromEntries(q.body.domande.map((d) => [d.id, rispostaGiusta(d.id)])) }, ora);
  assert.equal(scaduto.body.scaduto, true);
  assert.equal(scaduto.body.punteggio, 0);
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/quiz/${id}/consegna`, { risposte: {} }, ora)).status, 409);
});

async function completaCorso(store, ora) {
  for (const m of MODULI) {
    const r = await superaModulo(store, ora, m.id, true);
    assert.equal(r.body.esito, 'superato');
  }
}

test('API pratica: bloccata finché non si superano tutti i quiz, poi richiedibile una sola volta', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, {}, ora)).status, 403);
  await superaModulo(store, ora, 'preparazione', true);
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, {}, ora)).status, 403); // manca ancora qualcosa
  await superaModulo(store, ora, 'fermo-veicolo', true);
  await superaModulo(store, ora, 'controllo-esito', true);
  const dett = await chiama(store, ID_ALLIEVO, 'GET', `/corsi/${CORSO.id}`, undefined, ora);
  assert.equal(dett.body.pratica.sbloccata, true);
  assert.equal(dett.body.fase, 3);
  const ok = await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, {}, ora);
  assert.equal(ok.status, 201);
  assert.equal(ok.body.pratica.stato, 'richiesta');
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, {}, ora)).status, 409);
});

test('API pratica: prenotazione di una sessione e posti esauriti', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  await completaCorso(store, ora);
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', '/istruttori/sessioni', { corsoId: CORSO.id, data: ora.t + 1e7, posti: 1, luogo: 'Questura' }, ora)).status, 403);
  const s = await chiama(store, ID_ISTR, 'POST', '/istruttori/sessioni', { corsoId: CORSO.id, data: ora.t + 1e7, posti: 1, luogo: 'Questura' }, ora);
  assert.equal(s.status, 201);
  const lista = await chiama(store, ID_ALLIEVO, 'GET', `/corsi/${CORSO.id}/pratica`, undefined, ora);
  assert.equal(lista.body.sessioni.length, 1);
  assert.equal(lista.body.criteri.length, 6);
  const p = await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, { sessioneId: s.body.sessione.id }, ora);
  assert.equal(p.body.pratica.stato, 'programmata');
  assert.equal((await chiama(store, ID_ALLIEVO, 'GET', `/corsi/${CORSO.id}/pratica`, undefined, ora)).body.sessioni.length, 0); // al completo
});

const GRIGLIA = (livello) => CORSO.griglia.map((c) => ({ criterioId: c.id, livello }));

test('API istruttore: assegna, valuta, esito superata assegna l’abilitazione', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  await completaCorso(store, ora);
  const p = (await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, {}, ora)).body.pratica;
  const coda = await chiama(store, ID_ISTR, 'GET', '/istruttori/coda', undefined, ora);
  assert.equal(coda.body.coda.length, 1);
  assert.equal(coda.body.coda[0].allievo.cognome, 'Rossi');
  // esito senza assegnazione: vietato
  assert.equal((await chiama(store, ID_ISTR, 'POST', `/istruttori/pratiche/${p.id}/esito`, { esito: 'superata', valutazioni: GRIGLIA('corretto') }, ora)).status, 409);
  assert.equal((await chiama(store, ID_ISTR, 'POST', `/istruttori/pratiche/${p.id}/assegna`, {}, ora)).body.pratica.stato, 'in_valutazione');
  // un altro istruttore non può dare l'esito, l'allievo nemmeno
  assert.equal((await chiama(store, ID_ISTR2, 'POST', `/istruttori/pratiche/${p.id}/esito`, { esito: 'superata', valutazioni: GRIGLIA('corretto') }, ora)).status, 403);
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/istruttori/pratiche/${p.id}/esito`, { esito: 'superata', valutazioni: GRIGLIA('corretto') }, ora)).status, 403);
  // griglia incompleta
  assert.equal((await chiama(store, ID_ISTR, 'POST', `/istruttori/pratiche/${p.id}/esito`, { esito: 'superata', valutazioni: GRIGLIA('corretto').slice(1) }, ora)).status, 422);
  const ok = await chiama(store, ID_ISTR, 'POST', `/istruttori/pratiche/${p.id}/esito`, { esito: 'superata', valutazioni: GRIGLIA('corretto'), note: 'Ottimo lavoro' }, ora);
  assert.equal(ok.body.pratica.stato, 'superata');
  assert.equal(ok.body.pratica.percentuale, 100);
  const ab = await store.get('abilitazioni', `${ID_ALLIEVO}__${CORSO.id}`);
  assert.equal(ab.nome, 'Abilitazione posto di blocco');
  assert.ok(ab.scadeIl > ora.t);
  const per = await chiama(store, ID_ALLIEVO, 'GET', '/percorso', undefined, ora);
  assert.equal(per.body.abilitazioni.length, 1);
  assert.equal(per.body.pratiche[0].note, 'Ottimo lavoro');
  const lista = await chiama(store, ID_ALLIEVO, 'GET', '/corsi', undefined, ora);
  assert.equal(lista.body.corsi[0].stato, 'completato');
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, {}, ora)).status, 409); // già abilitato
});

test('API istruttore: esito "da ripetere" non assegna l’abilitazione e consente una nuova richiesta', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  await completaCorso(store, ora);
  const p = (await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, {}, ora)).body.pratica;
  await chiama(store, ID_ISTR, 'POST', `/istruttori/pratiche/${p.id}/assegna`, {}, ora);
  const r = await chiama(store, ID_ISTR, 'POST', `/istruttori/pratiche/${p.id}/esito`, { esito: 'da_ripetere', valutazioni: GRIGLIA('parziale'), note: 'Da migliorare l’uso della radio' }, ora);
  assert.equal(r.body.pratica.stato, 'da_ripetere');
  assert.equal(await store.get('abilitazioni', `${ID_ALLIEVO}__${CORSO.id}`), null);
  assert.equal((await chiama(store, ID_ALLIEVO, 'POST', `/corsi/${CORSO.id}/pratica`, {}, ora)).status, 201);
});

test('API admin: crea corso, modulo e domanda; validazione dei contenuti', async () => {
  const store = seedStore();
  const ora = { t: 1_000_000 };
  const c = await chiama(store, ID_ADMIN, 'PUT', '/admin/corsi/nuovo', { titolo: 'Nuovo', gradoMinimo: 'Agente', griglia: [{ id: 'x', titolo: 'Criterio' }] }, ora);
  assert.equal(c.status, 200);
  assert.equal((await chiama(store, ID_ADMIN, 'PUT', '/admin/corsi/nuovo', { titolo: 'Nuovo', gradoMinimo: 'Boh' }, ora)).status, 422);
  assert.equal((await chiama(store, ID_ADMIN, 'PUT', '/admin/corsi/nuovo/moduli/uno', { titolo: 'Uno', ordine: 1, blocchi: [{ tipo: 'testo', testo: 'Ciao' }] }, ora)).status, 200);
  const d = await chiama(store, ID_ADMIN, 'PUT', '/admin/corsi/nuovo/domande/uno/q1', { testo: 'Domanda?', opzioni: [{ id: 'a', testo: 'Sì' }, { id: 'b', testo: 'No' }], corretta: 'a' }, ora);
  assert.equal(d.status, 200);
  assert.equal((await chiama(store, ID_ADMIN, 'PUT', '/admin/corsi/nuovo/domande/uno/q2', { testo: 'Domanda?', opzioni: [{ id: 'a', testo: 'Sì' }, { id: 'b', testo: 'No' }], corretta: 'c' }, ora)).status, 422);
  // solo l'admin vede le risposte corrette
  const lista = await chiama(store, ID_ADMIN, 'GET', '/admin/corsi/nuovo/domande', undefined, ora);
  assert.equal(lista.body.domande[0].corretta, 'a');
});

test('API config: gradi in ordine e livelli della griglia', async () => {
  const store = seedStore();
  const r = await chiama(store, ID_ALLIEVO, 'GET', '/config', undefined, { t: 1_000_000 });
  assert.equal(r.status, 200);
  assert.equal(r.body.gradi[0], 'Agente');
  assert.deepEqual(Object.keys(r.body.livelli), ['non_svolto', 'parziale', 'corretto']);
});

test('regole Firestore: i contenuti del sito statico sono in sola lettura', () => {
  const rules = readFileSync(new URL('../../../firestore.rules', import.meta.url), 'utf8');
  const blocchi = [...rules.matchAll(/match \/\{col\}\/\{id\} \{([\s\S]*?)\n    \}/g)].map((m) => m[1]);
  const sito = blocchi.find((b) => b.includes("'NOTIZIE'"));
  assert.ok(sito);
  for (const c of ['NOTIZIE', 'REPARTI', 'VEICOLI', 'FOTOPDS']) assert.ok(sito.includes(`'${c}'`), c);
  assert.match(sito, /allow write: if false;/);
  assert.ok(!sito.includes('auth-sito') && !sito.includes('domande'));
});

test('errore dello store: risposta JSON 500 con CORS, non un crash del Worker', async () => {
  const store = { async get() { throw new Error('firestore 403'); }, async list() { return []; }, async set() {}, async delete() {} };
  const req = new Request('https://w.example/formazione/me', { headers: { Authorization: 'Bearer x', Origin: 'https://polizia-iprp.web.app' } });
  const r = await handleFormazione(req, {}, { cors: { 'Access-Control-Allow-Origin': 'https://polizia-iprp.web.app' }, url: new URL(req.url), verify: async () => ({ sub: 'discord:111111111111111111' }), store });
  assert.equal(r.status, 500);
  assert.equal(r.headers.get('Access-Control-Allow-Origin'), 'https://polizia-iprp.web.app');
  assert.match((await r.json()).error, /firestore 403/);
});

// ---------- Cloudflare D1: archivio e gestione degli agenti ----------
import { d1Store } from '../src/formazione/store.js';

function fakeD1() {
  const righe = new Map(); // "col\u0000id" -> json
  const prepara = (sql) => {
    const st = { args: [], bind(...a) { st.args = a; return st; },
      async first() { const [c, i] = st.args; const d = righe.get(`${c}\u0000${i}`); return d === undefined ? null : { data: d }; },
      async run() { const q = sql.trim().toUpperCase();
        if (q.startsWith('INSERT')) righe.set(`${st.args[0]}\u0000${st.args[1]}`, st.args[2]);
        else if (q.startsWith('DELETE')) righe.delete(`${st.args[0]}\u0000${st.args[1]}`);
        return { success: true }; },
      async all() { const [c] = st.args; return { results: [...righe].filter(([k]) => k.startsWith(`${c}\u0000`)).map(([k, v]) => ({ id: k.split('\u0000')[1], data: v })) }; } };
    return st;
  };
  return { prepare: prepara, righe, async batch(sts) { for (const x of sts) await x.run(); return []; } };
}

test('D1: get, set, list con filtro e delete; il campo id nel documento ha la precedenza', async () => {
  const s = d1Store(fakeD1());
  await s.set('moduli', 'c__m', { id: 'm', corsoId: 'c', ordine: 1 });
  await s.set('moduli', 'c__n', { id: 'n', corsoId: 'x', ordine: 2 });
  assert.equal((await s.get('moduli', 'c__m')).id, 'm');
  assert.equal(await s.get('moduli', 'nope'), null);
  assert.deepEqual((await s.list('moduli', { corsoId: 'c' })).map((d) => d.id), ['m']);
  assert.equal((await s.list('moduli')).length, 2);
  await s.set('moduli', 'c__m', { id: 'm', corsoId: 'c', ordine: 9 });
  assert.equal((await s.get('moduli', 'c__m')).ordine, 9);
  await s.delete('moduli', 'c__m');
  assert.equal(await s.get('moduli', 'c__m'), null);
});

test('amministratore da variabile: registrato al primo accesso e sempre admin', async () => {
  const store = d1Store(fakeD1());
  const ora = { t: 1000 };
  const chiamaEnv = async (utente, metodo, percorso, body, env) => {
    const request = new Request(`https://w.test/formazione${percorso}`, { method: metodo, headers: { Authorization: 'Bearer ok', 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
    const r = await handleFormazione(request, env, { cors, url: new URL(request.url), verify: async () => ({ sub: `discord:${utente}` }), store, now: () => ora.t });
    return { status: r.status, body: await r.json() };
  };
  const env = { ADMIN_DISCORD_IDS: '999999999999999999, 888888888888888888' };
  assert.equal((await chiamaEnv('777777777777777777', 'GET', '/me', undefined, env)).status, 403); // sconosciuto
  const me = await chiamaEnv('999999999999999999', 'GET', '/me', undefined, env);
  assert.equal(me.status, 200);
  assert.equal(me.body.me.ruolo, 'admin');
  assert.ok(await store.get('agenti', '999999999999999999'));
  // gestione degli agenti
  assert.equal((await chiamaEnv('999999999999999999', 'PUT', '/admin/agenti/777777777777777777', { nome: 'Mario', cognome: 'Rossi', grado: 'Agente', ruolo: 'allievo' }, env)).status, 200);
  assert.equal((await chiamaEnv('999999999999999999', 'PUT', '/admin/agenti/777777777777777777', { nome: 'Mario', cognome: 'Rossi', grado: 'Boh', ruolo: 'allievo' }, env)).status, 422);
  const lista = await chiamaEnv('999999999999999999', 'GET', '/admin/agenti', undefined, env);
  assert.equal(lista.body.agenti.length, 2);
  assert.equal((await chiamaEnv('777777777777777777', 'GET', '/me', undefined, env)).body.me.ruolo, 'allievo'); // ora registrato
  assert.equal((await chiamaEnv('777777777777777777', 'GET', '/admin/agenti', undefined, env)).status, 403); // non admin
  assert.equal((await chiamaEnv('999999999999999999', 'DELETE', '/admin/agenti/999999999999999999', undefined, env)).status, 422); // non si autorimuove
  assert.equal((await chiamaEnv('999999999999999999', 'DELETE', '/admin/agenti/777777777777777777', undefined, env)).status, 200);
  assert.equal((await chiamaEnv('777777777777777777', 'GET', '/me', undefined, env)).status, 403);
});

// ---------- sincronizzazione dal foglio Google ----------
import { mappaGrado, normalizzaRighe, sincronizzaAgenti } from '../src/formazione/fogli.js';
import { handleRequest } from '../src/handler.js';

const RIGHE = [
  { nome: 'GABRIEL MARTINELLI', matricola: 'PDS - 0006', qualifica: 'Vice Questore Aggiunto', discordId: '1387684968536477756' },
  { nome: 'MATTEO DE MARTINO', matricola: 'PDS - 0039', qualifica: 'Assistente Capo', discordId: '1314929810019188836' },
  { nome: "NICOLO' BRIGHELLA", matricola: 'PDS - 0034', qualifica: 'Vice Sovrintendente', discordId: '991995502998605875' },
  { nome: 'JACOPO ROSSINI', matricola: 'PDS - 0054', qualifica: 'Allievo Agente', discordId: '1195728106967797842' },
  { nome: 'CHRISTIAN ROSSI', matricola: 'PDS - 0040', qualifica: 'Agente Scelto', discordId: '487248662959882241' },
  { nome: 'GERARDO MARINI', matricola: 'PDS - 0096', qualifica: 'Allievo Agente', discordId: '1217163872537018511' },
  { nome: 'MARCO MARINI', matricola: 'PDS - 0062', qualifica: 'Agente in Prova', discordId: '1217163872537018511' }, // ID doppio nel foglio
  { nome: '', matricola: 'PDS - 0108', qualifica: '', discordId: '' }, // riga vuota
];

test('qualifiche del foglio → grado del portale', () => {
  const casi = { 'Allievo Agente': 'Agente', 'Agente in Prova': 'Agente', 'Agente Scelto': 'Agente Scelto', Assistente: 'Assistente', 'Assistente Capo Coordinatore': 'Assistente Capo', 'Vice Sovrintendente': 'Sovrintendente', 'Sovrintendente Capo Coordinatore': 'Sovrintendente', 'Allievo Vice Ispettore': 'Ispettore', 'Ispettore Superiore': 'Ispettore', 'Sostituto Commissario': 'Vice Commissario', 'Commissario Capo': 'Vice Commissario', 'Vice Questore Aggiunto': 'Questore', 'Dirigente Generale di P.S': 'Questore', '': 'Agente' };
  for (const [q, g] of Object.entries(casi)) assert.equal(mappaGrado(q), g, q);
});

test('righe del foglio: nomi in maiuscolo/minuscolo, ID doppi e righe vuote scartati', () => {
  const { agenti, scartate } = normalizzaRighe(RIGHE);
  assert.equal(agenti.length, 6);
  assert.equal(scartate, 1); // il secondo Marini; la riga completamente vuota non conta
  const m = agenti.find((a) => a.id === '1387684968536477756');
  assert.deepEqual([m.nome, m.cognome, m.grado, m.qualifica], ['Gabriel', 'Martinelli', 'Questore', 'Vice Questore Aggiunto']);
  const d = agenti.find((a) => a.matricola === 'PDS - 0039');
  assert.equal(d.cognome, 'De Martino');
  assert.equal(agenti.find((a) => a.matricola === 'PDS - 0034').nome, "Nicolo'");
});

test('sincronizzazione: aggiunge, aggiorna, rimuove e conserva ruoli e agenti inseriti a mano', async () => {
  const store = d1Store(fakeD1());
  await store.set('agenti', '1387684968536477756', { nome: 'Gabriel', cognome: 'Martinelli', grado: 'Ispettore', ruolo: 'admin', fonte: 'fogli' });
  await store.set('agenti', '111111111111111111', { nome: 'Uscito', cognome: 'Dalfoglio', grado: 'Agente', ruolo: 'allievo', fonte: 'fogli' });
  await store.set('agenti', '222222222222222222', { nome: 'Inserito', cognome: 'AMano', grado: 'Agente', ruolo: 'istruttore', fonte: 'manuale' });
  const e = await sincronizzaAgenti(store, RIGHE, 5000);
  assert.deepEqual([e.ok, e.totale, e.aggiunti, e.aggiornati, e.rimossi], [true, 6, 5, 1, 1]);
  const g = await store.get('agenti', '1387684968536477756');
  assert.equal(g.ruolo, 'admin'); // il ruolo non viene toccato
  assert.equal(g.grado, 'Questore'); // il grado sì
  assert.equal(await store.get('agenti', '111111111111111111'), null); // uscito dal foglio
  assert.equal((await store.get('agenti', '222222222222222222')).ruolo, 'istruttore'); // manuale: resta
  assert.equal((await store.get('agenti', '1195728106967797842')).ruolo, 'allievo');
  assert.equal((await store.get('meta', 'sync-fogli')).totale, 6);
  const e2 = await sincronizzaAgenti(store, RIGHE, 6000);
  assert.deepEqual([e2.aggiunti, e2.aggiornati, e2.rimossi], [0, 0, 0]); // nessuna modifica
});

test('sincronizzazione: un foglio vuoto o rotto non cancella nessuno', async () => {
  const store = d1Store(fakeD1());
  await store.set('agenti', '111111111111111111', { nome: 'Uno', cognome: 'Due', grado: 'Agente', ruolo: 'allievo', fonte: 'fogli' });
  const e = await sincronizzaAgenti(store, [], 1);
  assert.equal(e.ok, false);
  assert.ok(await store.get('agenti', '111111111111111111'));
});

test('rotta /formazione/sync/agenti: richiede la chiave, accetta le righe dello script', async () => {
  const store = d1Store(fakeD1());
  const env = { SYNC_KEY: 'chiave-di-prova-molto-lunga', __store: store };
  const post = (chiave, corpo) => handleRequest(new Request('https://w.test/formazione/sync/agenti', { method: 'POST', headers: chiave ? { 'X-Sync-Key': chiave } : {}, body: JSON.stringify(corpo) }), env);
  assert.equal((await post('', { righe: RIGHE })).status, 401);
  assert.equal((await post('sbagliata-sbagliata-sbagliata', { righe: RIGHE })).status, 401);
  assert.equal((await handleRequest(new Request('https://w.test/formazione/sync/agenti', { method: 'POST', body: '{}' }), { __store: store })).status, 401); // senza SYNC_KEY configurata
  const r = await post('chiave-di-prova-molto-lunga', { righe: RIGHE });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).aggiunti, 6);
  assert.equal((await post('chiave-di-prova-molto-lunga', { righe: [] })).status, 422);
});
