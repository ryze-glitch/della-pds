// Rotte /formazione/* del Worker. Ogni rotta verifica il token e il ruolo lato server.
// Le risposte corrette dei quiz non escono mai prima della consegna.
import { gradoIndex, LIVELLI, GRADI, STATI_PRATICA_LABEL, QUIZ_DEFAULT } from './formazione.js';
import { ruoloDi, puo } from './ruoli.js';
import { configQuiz, estrai, perIlBrowser, puoTentare, correggi } from './quiz.js';
import { statoModuli, tuttiIQuizSuperati, praticaSbloccata, corsoVisibile } from './percorso.js';
import { transizione, valuta, praticaAttiva, scadenzaAbilitazione } from './pratica.js';
import { validaCorso, validaModulo, validaDomanda, ID_RE } from './validazione.js';

const MAX_BODY = 64 * 1024;

function risposta(body, status, cors) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors } });
}
const err = (msg, status, cors, extra = {}) => risposta({ error: msg, ...extra }, status, cors);

const pulisci = (s, max) => String(s || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ').slice(0, max);
const idRandom = () => Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => b.toString(16).padStart(2, '0')).join('');

async function leggiJson(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return { errore: 'Richiesta troppo grande.', status: 413 };
  if (!raw) return { dati: {} };
  try {
    const dati = JSON.parse(raw);
    if (!dati || typeof dati !== 'object' || Array.isArray(dati)) throw new Error('forma');
    return { dati };
  } catch (e) {
    return { errore: 'Formato non valido.', status: 400 };
  }
}

async function abilitazioniValide(store, allievoId, ora) {
  const lista = await store.list('abilitazioni', { allievoId });
  return lista.filter((a) => !a.scadeIl || a.scadeIl > ora);
}

async function caricaCorso(store, cid) {
  const corso = await store.get('corsi', cid);
  if (!corso) return null;
  const moduli = (await store.list('moduli', { corsoId: cid })).sort((a, b) => a.ordine - b.ordine);
  return { corso, moduli };
}

async function progressiDi(store, allievoId, cid) {
  return (await store.get('progressi', `${allievoId}__${cid}`)) || { allievoId, corsoId: cid, moduliLetti: [], quizSuperati: {} };
}

function fase(moduli, progressi, abilitato) {
  if (abilitato) return 4;
  const letti = new Set(progressi.moduliLetti || []);
  if (!moduli.length || !moduli.every((m) => letti.has(m.id))) return 1;
  return tuttiIQuizSuperati(moduli, progressi) ? 3 : 2;
}

async function nomeAllievo(store, id) {
  const p = await store.get('auth-sito', id);
  return p ? { id, nome: p.nome || '', cognome: p.cognome || '', grado: p.grado || '' } : { id, nome: '', cognome: '', grado: '' };
}

export async function handleFormazione(request, env, { cors, url, verify, store, now = Date.now, rng = Math.random }) {
  if (!store) return err('Portale di formazione non configurato.', 503, cors);
  const path = url.pathname.replace(/^\/formazione/, '') || '/';
  const m = request.method;

  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  let claims = null;
  try {
    claims = await verify(token);
  } catch (e) {
    return err('Verifica non riuscita.', 502, cors);
  }
  if (!claims) return err('Non autorizzato.', 401, cors);
  const uid = claims.sub.startsWith('discord:') ? claims.sub.slice(8) : '';
  if (!/^\d{5,25}$/.test(uid)) return err('Non autorizzato.', 403, cors);
  const profilo = await store.get('auth-sito', uid);
  if (!profilo) return err('Non autorizzato.', 403, cors);
  const ruolo = ruoloDi(profilo);
  const io = { id: uid, nome: profilo.nome || '', cognome: profilo.cognome || '', grado: profilo.grado || '', ruolo };
  const ora = now();
  const richiedi = (azione) => (puo(ruolo, azione) ? null : err('Permesso negato.', 403, cors));

  let r;
  let body = {};
  if (m === 'POST' || m === 'PUT') {
    const l = await leggiJson(request);
    if (l.errore) return err(l.errore, l.status, cors);
    body = l.dati;
  }

  // ---------- allievo ----------
  if (path === '/me' && m === 'GET') return risposta({ me: io }, 200, cors);
  if (path === '/config' && m === 'GET') return risposta({ gradi: GRADI, statiPratica: STATI_PRATICA_LABEL, livelli: Object.fromEntries(Object.entries(LIVELLI).map(([k, v]) => [k, v.label])), quiz: QUIZ_DEFAULT }, 200, cors);

  if (path === '/corsi' && m === 'GET') {
    const abil = await abilitazioniValide(store, uid, ora);
    const ottenute = abil.map((a) => a.corsoId);
    const corsi = await store.list('corsi');
    const out = [];
    for (const corso of corsi) {
      if (!corsoVisibile(corso, io.grado, ottenute, ruolo)) continue;
      const cm = await caricaCorso(store, corso.id);
      const pr = await progressiDi(store, uid, corso.id);
      const abilitato = ottenute.includes(corso.id);
      const f = fase(cm.moduli, pr, abilitato);
      const pratiche = (await store.list('pratiche-formazione', { allievoId: uid, corsoId: corso.id })).sort((a, b) => b.richiestaIl - a.richiestaIl);
      const attiva = pratiche.find(praticaAttiva);
      let stato = 'non_iniziato';
      if (abilitato) stato = 'completato';
      else if (attiva) stato = 'pratica_in_corso';
      else if (praticaSbloccata(cm.moduli, pr)) stato = 'pratica_da_prenotare';
      else if ((pr.moduliLetti || []).length) stato = 'in_corso';
      out.push({ id: corso.id, titolo: corso.titolo, descrizione: corso.descrizione, gradoMinimo: corso.gradoMinimo, pubblicato: corso.pubblicato !== false, moduli: cm.moduli.length, fase: f, stato, letti: (pr.moduliLetti || []).length, quizSuperati: Object.keys(pr.quizSuperati || {}).length });
    }
    return risposta({ corsi: out }, 200, cors);
  }

  let mt = path.match(/^\/corsi\/([a-z0-9-]+)$/);
  if (mt && m === 'GET') {
    const cm = await caricaCorso(store, mt[1]);
    const abil = await abilitazioniValide(store, uid, ora);
    if (!cm || !corsoVisibile(cm.corso, io.grado, abil.map((a) => a.corsoId), ruolo)) return err('Corso non trovato.', 404, cors);
    const pr = await progressiDi(store, uid, cm.corso.id);
    const stati = statoModuli(cm.moduli, pr);
    const pratiche = (await store.list('pratiche-formazione', { allievoId: uid, corsoId: cm.corso.id })).sort((a, b) => b.richiestaIl - a.richiestaIl);
    const abilitazione = abil.find((a) => a.corsoId === cm.corso.id) || null;
    return risposta({
      corso: { id: cm.corso.id, titolo: cm.corso.titolo, descrizione: cm.corso.descrizione, gradoMinimo: cm.corso.gradoMinimo, abilitazione: cm.corso.abilitazione },
      moduli: stati.map((s) => ({ ...s, quiz: (({ soglia, domande, maxTentativi, attesaMinuti }) => ({ soglia, domande, maxTentativi, attesaMinuti }))(configQuiz(cm.moduli.find((x) => x.id === s.id))) })),
      pratica: { sbloccata: praticaSbloccata(cm.moduli, pr), attiva: pratiche.find(praticaAttiva) || null, ultima: pratiche[0] || null },
      abilitazione,
      fase: fase(cm.moduli, pr, !!abilitazione),
    }, 200, cors);
  }

  mt = path.match(/^\/corsi\/([a-z0-9-]+)\/moduli\/([a-z0-9-]+)$/);
  if (mt && m === 'GET') {
    const cm = await caricaCorso(store, mt[1]);
    const abil = await abilitazioniValide(store, uid, ora);
    if (!cm || !corsoVisibile(cm.corso, io.grado, abil.map((a) => a.corsoId), ruolo)) return err('Corso non trovato.', 404, cors);
    const pr = await progressiDi(store, uid, mt[1]);
    const stato = statoModuli(cm.moduli, pr).find((s) => s.id === mt[2]);
    if (!stato) return err('Modulo non trovato.', 404, cors);
    if (stato.stato === 'bloccato') return err('Modulo bloccato: completa prima il precedente.', 403, cors);
    const modulo = cm.moduli.find((x) => x.id === mt[2]);
    const idx = cm.moduli.findIndex((x) => x.id === mt[2]);
    return risposta({ modulo: { id: modulo.id, titolo: modulo.titolo, ordine: modulo.ordine, blocchi: modulo.blocchi || [] }, stato, successivo: cm.moduli[idx + 1] ? cm.moduli[idx + 1].id : null }, 200, cors);
  }

  mt = path.match(/^\/corsi\/([a-z0-9-]+)\/moduli\/([a-z0-9-]+)\/letto$/);
  if (mt && m === 'POST') {
    const cm = await caricaCorso(store, mt[1]);
    if (!cm) return err('Corso non trovato.', 404, cors);
    const pr = await progressiDi(store, uid, mt[1]);
    const stato = statoModuli(cm.moduli, pr).find((s) => s.id === mt[2]);
    if (!stato || stato.stato === 'bloccato') return err('Modulo non disponibile.', 403, cors);
    if (!pr.moduliLetti.includes(mt[2])) pr.moduliLetti.push(mt[2]);
    await store.set('progressi', `${uid}__${mt[1]}`, pr);
    return risposta({ ok: true }, 200, cors);
  }

  // inizio quiz: estrae le domande e crea il tentativo
  mt = path.match(/^\/corsi\/([a-z0-9-]+)\/moduli\/([a-z0-9-]+)\/quiz$/);
  if (mt && m === 'POST') {
    const cm = await caricaCorso(store, mt[1]);
    if (!cm) return err('Corso non trovato.', 404, cors);
    const modulo = cm.moduli.find((x) => x.id === mt[2]);
    const pr = await progressiDi(store, uid, mt[1]);
    const stato = statoModuli(cm.moduli, pr).find((s) => s.id === mt[2]);
    if (!modulo || !stato || !stato.quizSbloccato) return err('Quiz non disponibile: leggi prima il modulo.', 403, cors);
    const cfg = configQuiz(modulo);
    const tentativi = await store.list('tentativi', { allievoId: uid, corsoId: mt[1], moduloId: mt[2] });
    const via = puoTentare(tentativi, cfg, ora);
    if (!via.ok) {
      const msg = { gia_superato: 'Quiz già superato.', tentativi_esauriti: 'Tentativi esauriti: chiedi a un istruttore di riaprirlo.', attesa: 'Devi attendere prima del prossimo tentativo.' }[via.motivo];
      return err(msg, 429, cors, { motivo: via.motivo, riprovaTra: via.riprovaTra });
    }
    let tentativo = via.riprendi;
    let domande;
    if (tentativo) {
      domande = (await Promise.all(tentativo.domande.map((id) => store.get('domande', `${mt[1]}__${mt[2]}__${id}`)))).filter(Boolean);
    } else {
      const pool = await store.list('domande', { corsoId: mt[1], moduloId: mt[2] });
      if (pool.length < 1) return err('Il quiz non ha ancora domande.', 409, cors);
      domande = estrai(pool, cfg.domande, rng);
      const id = idRandom();
      tentativo = { id, allievoId: uid, corsoId: mt[1], moduloId: mt[2], domande: domande.map((d) => d.id), creatoIl: ora, scadeIl: ora + cfg.durataMinuti * 60000, soglia: cfg.soglia };
      await store.set('tentativi', id, tentativo);
    }
    return risposta({ tentativo: { id: tentativo.id, scadeIl: tentativo.scadeIl, soglia: cfg.soglia, numero: tentativi.length + (via.riprendi ? 0 : 1), max: cfg.maxTentativi }, domande: domande.map((d) => perIlBrowser(d, rng)) }, 200, cors);
  }

  mt = path.match(/^\/quiz\/([a-f0-9]{20})\/consegna$/);
  if (mt && m === 'POST') {
    const t = await store.get('tentativi', mt[1]);
    if (!t || t.allievoId !== uid) return err('Tentativo non trovato.', 404, cors);
    if (t.consegnatoIl) return err('Tentativo già consegnato.', 409, cors);
    const domande = (await Promise.all(t.domande.map((id) => store.get('domande', `${t.corsoId}__${t.moduloId}__${id}`)))).filter(Boolean);
    const scaduto = ora > t.scadeIl;
    const risposte = scaduto ? {} : body.risposte && typeof body.risposte === 'object' ? body.risposte : {};
    const esito = correggi(domande, risposte, t.soglia);
    await store.set('tentativi', t.id, { ...t, consegnatoIl: ora, scaduto, punteggio: esito.punteggio, esito: esito.esito });
    if (esito.esito === 'superato') {
      const pr = await progressiDi(store, uid, t.corsoId);
      pr.quizSuperati[t.moduloId] = { punteggio: esito.punteggio, data: ora };
      await store.set('progressi', `${uid}__${t.corsoId}`, pr);
    }
    return risposta({ punteggio: esito.punteggio, giuste: esito.giuste, totale: esito.totale, esito: esito.esito, soglia: t.soglia, scaduto, errori: esito.errori }, 200, cors);
  }

  // pratica: sessioni disponibili + criteri
  mt = path.match(/^\/corsi\/([a-z0-9-]+)\/pratica$/);
  if (mt && m === 'GET') {
    const cm = await caricaCorso(store, mt[1]);
    if (!cm) return err('Corso non trovato.', 404, cors);
    const pr = await progressiDi(store, uid, mt[1]);
    const sbloccata = praticaSbloccata(cm.moduli, pr);
    const sessioni = (await store.list('sessioni', { corsoId: mt[1] })).filter((s) => s.data > ora && (s.iscritti || []).length < s.posti).map((s) => ({ id: s.id, data: s.data, luogo: s.luogo, posti: s.posti - (s.iscritti || []).length })).sort((a, b) => a.data - b.data);
    return risposta({ sbloccata, sessioni, criteri: (cm.corso.griglia || []).map((c) => ({ id: c.id, titolo: c.titolo, descrizione: c.descrizione })) }, 200, cors);
  }
  if (mt && m === 'POST') {
    const cm = await caricaCorso(store, mt[1]);
    if (!cm) return err('Corso non trovato.', 404, cors);
    const pr = await progressiDi(store, uid, mt[1]);
    if (!praticaSbloccata(cm.moduli, pr)) return err('Devi prima superare tutti i quiz del corso.', 403, cors);
    const abil = await abilitazioniValide(store, uid, ora);
    if (abil.some((a) => a.corsoId === mt[1])) return err('Hai già questa abilitazione.', 409, cors);
    const esistenti = await store.list('pratiche-formazione', { allievoId: uid, corsoId: mt[1] });
    if (esistenti.some(praticaAttiva)) return err('Hai già una pratica in corso per questo corso.', 409, cors);
    let sessione = null;
    if (body.sessioneId !== undefined) {
      if (typeof body.sessioneId !== 'string' || !/^[a-f0-9]{20}$/.test(body.sessioneId)) return err('Sessione non valida.', 422, cors);
      sessione = await store.get('sessioni', body.sessioneId);
      if (!sessione || sessione.corsoId !== mt[1] || sessione.data <= ora) return err('Sessione non disponibile.', 409, cors);
      if ((sessione.iscritti || []).length >= sessione.posti) return err('Sessione al completo.', 409, cors);
    }
    const id = idRandom();
    const pratica = { id, allievoId: uid, corsoId: mt[1], stato: sessione ? 'programmata' : 'richiesta', richiestaIl: ora, sessioneId: sessione ? sessione.id : null };
    await store.set('pratiche-formazione', id, pratica);
    if (sessione) await store.set('sessioni', sessione.id, { ...sessione, iscritti: [...(sessione.iscritti || []), uid] });
    return risposta({ pratica }, 201, cors);
  }

  if (path === '/percorso' && m === 'GET') {
    const abil = await store.list('abilitazioni', { allievoId: uid });
    const tentativi = (await store.list('tentativi', { allievoId: uid })).filter((t) => t.consegnatoIl).sort((a, b) => b.consegnatoIl - a.consegnatoIl).map((t) => ({ corsoId: t.corsoId, moduloId: t.moduloId, punteggio: t.punteggio, esito: t.esito, data: t.consegnatoIl }));
    const pratiche = (await store.list('pratiche-formazione', { allievoId: uid })).sort((a, b) => b.richiestaIl - a.richiestaIl).map((p) => ({ id: p.id, corsoId: p.corsoId, stato: p.stato, richiestaIl: p.richiestaIl, note: p.stato === 'superata' || p.stato === 'da_ripetere' ? p.note || '' : '', punteggio: p.percentuale ?? null }));
    return risposta({ abilitazioni: abil.map((a) => ({ ...a, scaduta: !!(a.scadeIl && a.scadeIl <= ora) })), tentativi, pratiche }, 200, cors);
  }

  // ---------- istruttori ----------
  if (path.startsWith('/istruttori/')) {
    if ((r = richiedi('valuta'))) return r;

    if (path === '/istruttori/coda' && m === 'GET') {
      const tutte = await store.list('pratiche-formazione');
      const coda = tutte.filter(praticaAttiva).sort((a, b) => a.richiestaIl - b.richiestaIl);
      const out = [];
      for (const p of coda) out.push({ ...p, allievo: await nomeAllievo(store, p.allievoId) });
      return risposta({ coda: out }, 200, cors);
    }

    if (path === '/istruttori/allievi' && m === 'GET') {
      const progressi = await store.list('progressi');
      const corsi = new Map((await store.list('corsi')).map((c) => [c.id, c]));
      const out = [];
      for (const p of progressi) {
        const cm = await caricaCorso(store, p.corsoId);
        if (!cm) continue;
        const abil = await store.get('abilitazioni', `${p.allievoId}__${p.corsoId}`);
        out.push({ allievo: await nomeAllievo(store, p.allievoId), corsoId: p.corsoId, corso: corsi.get(p.corsoId).titolo, moduli: cm.moduli.length, letti: (p.moduliLetti || []).length, quiz: Object.keys(p.quizSuperati || {}).length, fase: fase(cm.moduli, p, !!abil) });
      }
      return risposta({ allievi: out }, 200, cors);
    }

    mt = path.match(/^\/istruttori\/pratiche\/([a-f0-9]{20})\/(assegna|esito)$/);
    if (mt && m === 'GET') return err('Metodo non consentito.', 405, cors);
    if (mt && m === 'POST') {
      const p = await store.get('pratiche-formazione', mt[1]);
      if (!p) return err('Pratica non trovata.', 404, cors);
      if (mt[2] === 'assegna') {
        const a = transizione(p.stato, 'assegna');
        if (!a) return err('La pratica non è assegnabile in questo stato.', 409, cors);
        const nuova = { ...p, stato: a, assegnataA: uid, assegnataNome: `${io.nome} ${io.cognome}`.trim() };
        await store.set('pratiche-formazione', p.id, nuova);
        return risposta({ pratica: nuova }, 200, cors);
      }
      if (p.stato !== 'in_valutazione') return err('La pratica non è in valutazione.', 409, cors);
      if (p.assegnataA !== uid && ruolo !== 'admin') return err('Solo l’istruttore assegnato può inserire l’esito.', 403, cors);
      if (!['superata', 'da_ripetere'].includes(body.esito)) return err('Esito non valido.', 422, cors);
      const corso = await store.get('corsi', p.corsoId);
      if (!corso) return err('Corso non trovato.', 404, cors);
      const v = valuta(corso.griglia || [], body.valutazioni);
      if (v.errore) return err(v.errore, 422, cors);
      const nuovoStato = transizione(p.stato, body.esito === 'superata' ? 'esito_superata' : 'esito_da_ripetere');
      const nuova = { ...p, stato: nuovoStato, valutazione: v.righe, punti: v.punti, percentuale: v.percentuale, note: pulisci(body.note, 1500), valutatoIl: ora, valutatoDa: uid };
      await store.set('pratiche-formazione', p.id, nuova);
      if (nuovoStato === 'superata') {
        await store.set('abilitazioni', `${p.allievoId}__${p.corsoId}`, { allievoId: p.allievoId, corsoId: p.corsoId, nome: (corso.abilitazione && corso.abilitazione.nome) || corso.titolo, ottenutaIl: ora, scadeIl: scadenzaAbilitazione(corso, ora), rilasciataDa: uid });
      }
      return risposta({ pratica: nuova }, 200, cors);
    }

    if (path === '/istruttori/sessioni' && m === 'POST') {
      const corso = ID_RE.test(String(body.corsoId)) ? await store.get('corsi', body.corsoId) : null;
      const data = Number(body.data);
      const posti = Number(body.posti);
      if (!corso || !Number.isFinite(data) || data <= ora || !Number.isInteger(posti) || posti < 1 || posti > 50) return err('Sessione non valida.', 422, cors);
      const id = idRandom();
      const sessione = { id, corsoId: corso.id, data, posti, luogo: pulisci(body.luogo, 120), iscritti: [], creataDa: uid };
      await store.set('sessioni', id, sessione);
      return risposta({ sessione }, 201, cors);
    }

    if (path === '/istruttori/reset-tentativi' && m === 'POST') {
      if (!/^\d{5,25}$/.test(String(body.allievoId)) || !ID_RE.test(String(body.corsoId)) || !ID_RE.test(String(body.moduloId))) return err('Dati non validi.', 422, cors);
      const lista = await store.list('tentativi', { allievoId: body.allievoId, corsoId: body.corsoId, moduloId: body.moduloId });
      for (const t of lista) await store.delete('tentativi', t.id);
      return risposta({ ok: true, rimossi: lista.length }, 200, cors);
    }
    return err('Risorsa non trovata.', 404, cors);
  }

  // ---------- admin ----------
  if (path.startsWith('/admin/')) {
    if ((r = richiedi('amministra'))) return r;

    if (path === '/admin/corsi' && m === 'GET') return risposta({ corsi: await store.list('corsi') }, 200, cors);

    mt = path.match(/^\/admin\/corsi\/([a-z0-9-]+)$/);
    if (mt && m === 'PUT') {
      const v = validaCorso(body, mt[1]);
      if (v.errore) return err(v.errore, 422, cors);
      await store.set('corsi', mt[1], v.dati);
      return risposta({ ok: true }, 200, cors);
    }

    mt = path.match(/^\/admin\/corsi\/([a-z0-9-]+)\/moduli(?:\/([a-z0-9-]+))?$/);
    if (mt && m === 'GET' && !mt[2]) return risposta({ moduli: (await store.list('moduli', { corsoId: mt[1] })).sort((a, b) => a.ordine - b.ordine) }, 200, cors);
    if (mt && mt[2] && m === 'PUT') {
      if (!(await store.get('corsi', mt[1]))) return err('Corso non trovato.', 404, cors);
      const v = validaModulo(body, mt[1], mt[2]);
      if (v.errore) return err(v.errore, 422, cors);
      await store.set('moduli', `${mt[1]}__${mt[2]}`, v.dati);
      return risposta({ ok: true }, 200, cors);
    }

    mt = path.match(/^\/admin\/corsi\/([a-z0-9-]+)\/domande(?:\/([a-z0-9-]+)\/([a-z0-9-]+))?$/);
    if (mt && m === 'GET' && !mt[2]) return risposta({ domande: await store.list('domande', { corsoId: mt[1] }) }, 200, cors);
    if (mt && mt[2] && m === 'PUT') {
      if (!(await store.get('moduli', `${mt[1]}__${mt[2]}`))) return err('Modulo non trovato.', 404, cors);
      const v = validaDomanda(body, mt[1], mt[2], mt[3]);
      if (v.errore) return err(v.errore, 422, cors);
      await store.set('domande', `${mt[1]}__${mt[2]}__${mt[3]}`, v.dati);
      return risposta({ ok: true }, 200, cors);
    }
    return err('Risorsa non trovata.', 404, cors);
  }

  return err('Risorsa non trovata.', 404, cors);
}
