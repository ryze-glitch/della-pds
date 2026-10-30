// Definizione dei moduli dello Sportello + validazione, senza dipendenze.
// Una sola fonte di verità: la usano sia il client (rendering e validazione
// in tempo reale) sia il Cloudflare Worker (validazione lato server e
// costruzione dell'embed Discord), così le regole non possono divergere.

export const TIPI_REATO = ['Furto', 'Rapina', 'Aggressione', 'Truffa', 'Altro'];
export const TIPI_PDA = ['Difesa personale', 'Uso sportivo', 'Rinnovo'];
export const UFFICI = [
  'Questore',
  'Vice Questore Vicario',
  'Dirigente Reparto Volanti',
  'Dirigente Squadra Investigativa',
  'Dirigente Nucleo Operativo Speciale',
  'Dirigente Polizia Stradale',
  'Dirigente URP',
];
export const FASCE = ['Mattina (09:00–13:00)', 'Pomeriggio (14:00–18:00)', 'Sera (19:00–23:00)'];

const RE_NOME = /^[\p{L}][\p{L}' -]{1,39}$/u;
const RE_TEL = /^[0-9 +()-]{5,20}$/;
const RE_DOC = /^[A-Za-z0-9 -]{5,20}$/;

const anagrafica = [
  { name: 'nome', label: 'Nome (IC)', type: 'text', required: true, pattern: RE_NOME, patternMsg: 'Usa solo lettere (2–40 caratteri).', autoComplete: 'given-name', width: 'half', inline: true },
  { name: 'cognome', label: 'Cognome (IC)', type: 'text', required: true, pattern: RE_NOME, patternMsg: 'Usa solo lettere (2–40 caratteri).', autoComplete: 'family-name', width: 'half', inline: true },
  { name: 'telefono', label: 'Numero di telefono (IC)', type: 'tel', required: true, pattern: RE_TEL, patternMsg: 'Inserisci un numero valido (cifre, spazi, + ( ) -).', hint: 'Il numero del tuo telefono in gioco.', autoComplete: 'tel', width: 'half', inline: true },
  { name: 'documento', label: "Numero documento d'identità (IC)", type: 'text', required: true, pattern: RE_DOC, patternMsg: 'Da 5 a 20 caratteri alfanumerici.', width: 'half', inline: true },
];

const discordField = {
  name: 'discord',
  label: 'Discord (OOC) — facoltativo',
  type: 'text',
  max: 40,
  hint: 'Solo se vuoi essere ricontattato su Discord dallo staff.',
  width: 'half',
  inline: true,
};

export const FORMS = {
  denuncia: {
    id: 'denuncia',
    title: 'Denuncia online',
    submitLabel: 'Invia la denuncia',
    discord: { channel: 'DENUNCE', title: 'Nuova denuncia online', color: 0xb42318, description: 'Denuncia presentata allo Sportello Telematico.' },
    sections: [
      { title: 'Dati del querelante', fields: [...anagrafica, discordField] },
      {
        title: 'I fatti',
        fields: [
          { name: 'reato', label: 'Tipologia di reato', type: 'select', options: TIPI_REATO, required: true, width: 'half', inline: true },
          { name: 'reato_altro', label: 'Specifica il tipo di reato', type: 'text', required: true, max: 80, showWhen: { field: 'reato', equals: 'Altro' }, width: 'half', inline: true },
          { name: 'luogo', label: 'Luogo dei fatti', type: 'text', required: true, min: 3, max: 120, placeholder: 'es. Via del Corso, davanti alla banca', width: 'half', inline: true },
          { name: 'data_fatti', label: 'Data e ora dei fatti', type: 'datetime', required: true, noFuture: true, width: 'half', inline: true },
          { name: 'dinamica', label: 'Dinamica dei fatti', type: 'textarea', required: true, min: 50, max: 1500, rows: 6, hint: 'Racconta in modo chiaro cosa è successo, in ordine cronologico (almeno 50 caratteri).' },
        ],
      },
      {
        title: 'Testimoni e prove',
        fields: [
          { name: 'testimoni', label: 'Testimoni (facoltativo)', type: 'textarea', max: 600, rows: 3, hint: 'Nome IC ed eventuale contatto delle persone presenti.' },
          { name: 'prove', label: 'Note aggiuntive e link alle prove (facoltativo)', type: 'textarea', max: 800, rows: 3, hint: 'Link a screenshot o clip (Imgur, YouTube, Discord…).' },
        ],
      },
      {
        title: 'Dichiarazioni',
        fields: [
          { name: 'veridicita', label: 'Dichiaro che i fatti esposti sono veritieri (in-character) e di aver letto il regolamento del server.', type: 'checkbox', required: true, embed: false },
        ],
      },
    ],
  },

  pda: {
    id: 'pda',
    title: "Porto d'armi (PDA)",
    submitLabel: 'Invia la richiesta',
    discord: { channel: 'PDA', title: "Richiesta Porto d'Armi", color: 0x1d4f91, description: "Richiesta presentata allo Sportello Telematico." },
    sections: [
      {
        title: 'Tipo di richiesta',
        fields: [
          { name: 'tipo', label: 'Tipo di richiesta', type: 'select', options: TIPI_PDA, required: true, width: 'half', inline: true },
          { name: 'numero_precedente', label: 'Numero del PDA da rinnovare', type: 'text', required: true, max: 20, showWhen: { field: 'tipo', equals: 'Rinnovo' }, width: 'half', inline: true },
        ],
      },
      {
        title: 'Dati anagrafici',
        fields: [
          anagrafica[0],
          anagrafica[1],
          { name: 'nascita', label: 'Data di nascita (IC)', type: 'date', required: true, noFuture: true, minAge: 18, hint: 'Serve la maggiore età in-character (18+).', width: 'half', inline: true },
          anagrafica[2],
          anagrafica[3],
          { name: 'residenza', label: 'Residenza (IC) — facoltativo', type: 'text', max: 120, width: 'half', inline: true },
          discordField,
        ],
      },
      {
        title: 'Motivazione',
        fields: [{ name: 'motivazione', label: 'Motivo della richiesta', type: 'textarea', required: true, min: 30, max: 800, rows: 5, hint: 'Spiega perché ti serve il porto d’armi (almeno 30 caratteri).' }],
      },
      {
        title: 'Dichiarazioni',
        fields: [
          { name: 'no_precedenti', label: 'Dichiaro di non avere precedenti penali in-character.', type: 'checkbox', required: true, embed: false },
          { name: 'visita_medica', label: "Mi impegno a presentare in Questura il certificato di idoneità psicofisica (visita medica) prima del rilascio.", type: 'checkbox', required: true, embed: false },
        ],
      },
    ],
  },

  colloquio: {
    id: 'colloquio',
    title: 'Colloquio con i Dirigenti',
    submitLabel: 'Richiedi il colloquio',
    discord: { channel: 'COLLOQUI', title: 'Richiesta di colloquio', color: 0xc59b27, description: 'Richiesta di appuntamento con la dirigenza.' },
    sections: [
      { title: 'Dati del richiedente', fields: [...anagrafica.slice(0, 3), discordField] },
      {
        title: "L'appuntamento",
        fields: [
          { name: 'ufficio', label: 'Con chi vuoi parlare', type: 'select', options: UFFICI, required: true, width: 'half', inline: true },
          { name: 'data_preferita', label: 'Data preferita', type: 'date', required: true, minToday: true, width: 'half', inline: true },
          { name: 'fascia', label: 'Fascia oraria', type: 'select', options: FASCE, required: true, width: 'half', inline: true },
          { name: 'motivo', label: 'Motivo del colloquio', type: 'textarea', required: true, min: 20, max: 800, rows: 5 },
        ],
      },
    ],
  },
};

export const FORM_IDS = Object.keys(FORMS);

// ---------------------------------------------------------------------------
// Validazione
// ---------------------------------------------------------------------------

export function isVisible(field, values) {
  if (!field.showWhen) return true;
  return values[field.showWhen.field] === field.showWhen.equals;
}

const DAY = 24 * 3600 * 1000;

function toDate(v, type) {
  const d = new Date(type === 'date' ? `${v}T12:00:00` : v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function sanitize(value, max = 4096) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/@(everyone|here)/gi, '@​$1')
    .replace(/<@/g, '<​@')
    .trim()
    .slice(0, max);
}

export function validateField(field, raw, values) {
  if (!isVisible(field, values)) return null;

  if (field.type === 'checkbox') {
    return field.required && raw !== true ? 'Devi accettare questa dichiarazione per proseguire.' : null;
  }

  const v = sanitize(raw, (field.max || 200) + 50);
  if (!v) return field.required ? 'Campo obbligatorio.' : null;

  if (field.min && v.length < field.min) return `Inserisci almeno ${field.min} caratteri (ora ${v.length}).`;
  if (field.max && v.length > field.max) return `Massimo ${field.max} caratteri.`;
  if (field.pattern && !field.pattern.test(v)) return field.patternMsg || 'Formato non valido.';
  if (field.type === 'select' && !field.options.includes(v)) return 'Seleziona una voce dell’elenco.';

  if (field.type === 'date' || field.type === 'datetime') {
    const d = toDate(v, field.type);
    if (!d) return 'Data non valida.';
    if (field.noFuture && d.getTime() > Date.now() + DAY) return 'La data non può essere nel futuro.';
    if (field.minToday && d.getTime() < Date.now() - DAY) return 'Scegli una data da oggi in poi.';
    if (field.minAge) {
      const limit = new Date();
      limit.setFullYear(limit.getFullYear() - field.minAge);
      if (d.getTime() > limit.getTime() + DAY) return `Serve un’età minima di ${field.minAge} anni (IC).`;
    }
  }
  return null;
}

export function validate(formId, values) {
  const form = FORMS[formId];
  const errors = {};
  const clean = {};
  if (!form) return { errors: { _form: 'Modulo sconosciuto.' }, clean };
  for (const section of form.sections) {
    for (const field of section.fields) {
      if (!isVisible(field, values)) continue;
      const err = validateField(field, values[field.name], values);
      if (err) errors[field.name] = err;
      clean[field.name] = field.type === 'checkbox' ? values[field.name] === true : sanitize(values[field.name], field.max || 200);
    }
  }
  return { errors, clean };
}

export function emptyValues(formId) {
  const values = {};
  for (const section of FORMS[formId].sections) {
    for (const f of section.fields) values[f.name] = f.type === 'checkbox' ? false : '';
  }
  return values;
}

// ---------------------------------------------------------------------------
// Codice pratica: POL-AAAA-XXXXXX (alfabeto senza caratteri ambigui)
// ---------------------------------------------------------------------------

export const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const CODE_REGEX = /^POL-\d{4}-[A-HJ-NP-Z2-9]{6}$/;

export function normalizzaCodice(input) {
  return String(input || '')
    .toUpperCase()
    .replace(/[#\s]/g, '')
    .replace(/[‐‑–—]/g, '-');
}
