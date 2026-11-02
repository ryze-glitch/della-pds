// Validazione dei contenuti inseriti dagli admin (corsi, moduli, domande).
import { GRADI } from './formazione.js';

export const ID_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;
const txt = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const strip = (s) => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

export function validaCorso(b, id) {
  if (!b || typeof b !== 'object') return { errore: 'Corso non valido.' };
  if (!ID_RE.test(id)) return { errore: 'Identificativo del corso non valido (minuscole, numeri e trattini).' };
  if (!txt(b.titolo, 120)) return { errore: 'Titolo mancante o troppo lungo.' };
  if (b.descrizione !== undefined && (typeof b.descrizione !== 'string' || b.descrizione.length > 1000)) return { errore: 'Descrizione troppo lunga.' };
  if (!GRADI.includes(b.gradoMinimo)) return { errore: 'Grado minimo non valido.' };
  const richiede = Array.isArray(b.richiede) ? b.richiede : [];
  if (richiede.some((r) => !ID_RE.test(r)) || richiede.length > 20) return { errore: 'Abilitazioni richieste non valide.' };
  const griglia = Array.isArray(b.griglia) ? b.griglia : [];
  if (griglia.length > 30) return { errore: 'Troppi criteri nella griglia.' };
  const visti = new Set();
  for (const c of griglia) {
    if (!c || !ID_RE.test(c.id) || visti.has(c.id) || !txt(c.titolo, 140) || (c.descrizione !== undefined && String(c.descrizione).length > 400)) return { errore: 'Criterio della griglia non valido.' };
    visti.add(c.id);
  }
  const ab = b.abilitazione || {};
  if (!txt(ab.nome || b.titolo, 120)) return { errore: 'Nome dell’abilitazione non valido.' };
  const mesi = ab.scadenzaMesi === undefined || ab.scadenzaMesi === null ? 0 : Number(ab.scadenzaMesi);
  if (!Number.isInteger(mesi) || mesi < 0 || mesi > 120) return { errore: 'Scadenza dell’abilitazione non valida.' };
  return {
    dati: {
      titolo: strip(b.titolo.trim()),
      descrizione: strip(b.descrizione || ''),
      gradoMinimo: b.gradoMinimo,
      richiede,
      pubblicato: b.pubblicato !== false,
      abilitazione: { nome: strip((ab.nome || b.titolo).trim()), scadenzaMesi: mesi },
      griglia: griglia.map((c) => ({ id: c.id, titolo: strip(c.titolo.trim()), descrizione: strip(c.descrizione || '') })),
    },
  };
}

const BLOCCHI = ['testo', 'immagine', 'video'];
const YT_RE = /^https:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/|www\.youtube-nocookie\.com\/embed\/)[\w-]{6,20}([&?][\w=&%-]*)?$/;

export function validaModulo(b, cid, mid) {
  if (!ID_RE.test(cid) || !ID_RE.test(mid)) return { errore: 'Identificativi non validi.' };
  if (!b || !txt(b.titolo, 120)) return { errore: 'Titolo del modulo mancante o troppo lungo.' };
  const ordine = Number(b.ordine);
  if (!Number.isInteger(ordine) || ordine < 1 || ordine > 99) return { errore: 'Ordine non valido (1-99).' };
  const blocchi = Array.isArray(b.blocchi) ? b.blocchi : [];
  if (blocchi.length > 60) return { errore: 'Troppi blocchi di contenuto.' };
  const out = [];
  for (const x of blocchi) {
    if (!x || !BLOCCHI.includes(x.tipo)) return { errore: 'Tipo di blocco non valido.' };
    if (x.tipo === 'testo') {
      if (!txt(x.testo, 6000)) return { errore: 'Blocco di testo vuoto o troppo lungo.' };
      out.push({ tipo: 'testo', testo: strip(x.testo) });
    } else if (x.tipo === 'immagine') {
      if (typeof x.src !== 'string' || !/^\/assets\/[\w./-]{1,120}$/.test(x.src) || x.src.includes('..')) return { errore: 'Le immagini devono stare in /assets/.' };
      out.push({ tipo: 'immagine', src: x.src, alt: strip(String(x.alt || '').slice(0, 200)) });
    } else {
      if (typeof x.url !== 'string' || !YT_RE.test(x.url)) return { errore: 'Il video deve essere un link YouTube.' };
      out.push({ tipo: 'video', url: x.url, titolo: strip(String(x.titolo || '').slice(0, 120)) });
    }
  }
  const q = b.quiz || {};
  return { dati: { corsoId: cid, id: mid, titolo: strip(b.titolo.trim()), ordine, blocchi: out, quiz: { soglia: q.soglia, domande: q.domande, maxTentativi: q.maxTentativi, attesaMinuti: q.attesaMinuti, durataMinuti: q.durataMinuti } } };
}

export function validaDomanda(b, cid, mid, did) {
  if (!ID_RE.test(cid) || !ID_RE.test(mid) || !ID_RE.test(did)) return { errore: 'Identificativi non validi.' };
  if (!b || !txt(b.testo, 600)) return { errore: 'Testo della domanda mancante o troppo lungo.' };
  const opzioni = Array.isArray(b.opzioni) ? b.opzioni : [];
  if (opzioni.length < 2 || opzioni.length > 6) return { errore: 'Servono da 2 a 6 opzioni.' };
  const ids = new Set();
  for (const o of opzioni) {
    if (!o || !/^[a-f0-9a-z]{1,3}$/.test(String(o.id)) || ids.has(o.id) || !txt(o.testo, 300)) return { errore: 'Opzione non valida.' };
    ids.add(o.id);
  }
  if (!ids.has(b.corretta)) return { errore: 'La risposta corretta deve essere una delle opzioni.' };
  if (b.tipo !== undefined && !['standard', 'situazionale'].includes(b.tipo)) return { errore: 'Tipo di domanda non valido.' };
  return {
    dati: {
      corsoId: cid, moduloId: mid, id: did, tipo: b.tipo || 'standard', testo: strip(b.testo.trim()),
      opzioni: opzioni.map((o) => ({ id: String(o.id), testo: strip(o.testo.trim()) })),
      corretta: b.corretta, spiegazione: strip(String(b.spiegazione || '').slice(0, 800)),
    },
  };
}
