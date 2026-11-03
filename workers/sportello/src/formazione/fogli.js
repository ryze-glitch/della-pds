// Sincronizzazione degli agenti dal foglio Google "Gerarchia Generale" (scheda MATRICOLE OPERATORI).
// Lo script Apps Script del foglio invia le righe a questo Worker; qui si normalizzano e si aggiorna l'archivio.
import { GRADI } from '../../../../portal/lib/formazione.js';

const ID_RE = /^\d{15,25}$/;

const titolo = (s) =>
  String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/(^|[\s'’-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());

// Qualifica reale della Polizia (molte) → grado del portale (8 livelli, usato per decidere quali corsi si vedono).
export function mappaGrado(qualifica) {
  const q = String(qualifica || '').toLowerCase();
  if (/questore|dirigente/.test(q)) return 'Questore';
  if (/commissario/.test(q)) return 'Vice Commissario';
  if (/ispettore/.test(q)) return 'Ispettore';
  if (/sovrintendente/.test(q)) return 'Sovrintendente';
  if (/assistente capo/.test(q)) return 'Assistente Capo';
  if (/assistente/.test(q)) return 'Assistente';
  if (/agente scelto/.test(q)) return 'Agente Scelto';
  return GRADI[0]; // agente, agente in prova, allievo agente e qualifiche non riconosciute
}

// Righe grezze dallo script → agenti validi (ID Discord numerico, nome e cognome presenti, senza doppioni).
export function normalizzaRighe(righe) {
  const visti = new Set();
  const agenti = [];
  let scartate = 0;
  for (const r of Array.isArray(righe) ? righe : []) {
    const id = String((r && (r.discordId ?? r.id)) || '').trim();
    const parole = titolo(r && r.nome).split(' ').filter(Boolean);
    if (!ID_RE.test(id) || parole.length < 2 || visti.has(id)) {
      if (id || parole.length) scartate++;
      continue;
    }
    visti.add(id);
    const qualifica = String((r && r.qualifica) || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    agenti.push({
      id,
      nome: parole[0].slice(0, 40),
      cognome: parole.slice(1).join(' ').slice(0, 40),
      qualifica,
      grado: mappaGrado(qualifica),
      matricola: String((r && r.matricola) || '').replace(/\s+/g, ' ').trim().slice(0, 20),
    });
  }
  return { agenti, scartate };
}

const MIN_RIGHE = 5; // sotto questa soglia si presume un foglio vuoto o un errore: non si cancella nessuno

// Allinea la raccolta "agenti" al foglio: aggiunge, aggiorna e (solo per chi arriva dal foglio) rimuove.
// Il ruolo (allievo / istruttore / admin) e gli agenti inseriti a mano dall'area admin non vengono toccati.
export async function sincronizzaAgenti(store, righe, ora = Date.now()) {
  const { agenti, scartate } = normalizzaRighe(righe);
  if (agenti.length < MIN_RIGHE) return { ok: false, errore: `Foglio non valido: solo ${agenti.length} agenti riconosciuti.`, scartate };
  const esistenti = new Map((await store.list('agenti')).map((a) => [a.id, a]));
  const scrivi = [];
  let aggiunti = 0;
  let aggiornati = 0;
  for (const a of agenti) {
    const prima = esistenti.get(a.id);
    const dati = { nome: a.nome, cognome: a.cognome, grado: a.grado, qualifica: a.qualifica, matricola: a.matricola, ruolo: (prima && prima.ruolo) || 'allievo', fonte: 'fogli' };
    if (!prima) {
      aggiunti++;
      scrivi.push([a.id, dati]);
    } else if (['nome', 'cognome', 'grado', 'qualifica', 'matricola', 'fonte'].some((k) => prima[k] !== dati[k])) {
      aggiornati++;
      scrivi.push([a.id, dati]);
    }
  }
  const nelFoglio = new Set(agenti.map((a) => a.id));
  const rimuovi = [...esistenti.values()].filter((a) => a.fonte === 'fogli' && !nelFoglio.has(a.id)).map((a) => a.id);
  if (scrivi.length) await store.setMany('agenti', scrivi);
  if (rimuovi.length) await store.deleteMany('agenti', rimuovi);
  const esito = { ok: true, totale: agenti.length, aggiunti, aggiornati, rimossi: rimuovi.length, scartate, ultimaSincronizzazione: ora };
  await store.set('meta', 'sync-fogli', esito);
  return esito;
}
