// Pratica (esame pratico): stati, transizioni e valutazione con griglia. Funzioni pure.
import { LIVELLI } from './formazione.js';

const ATTIVE = ['richiesta', 'programmata', 'in_valutazione'];
export const praticaAttiva = (p) => ATTIVE.includes(p.stato);

// Transizioni consentite per azione.
const TRANSIZIONI = {
  programma: { da: ['richiesta'], a: 'programmata' },
  assegna: { da: ['richiesta', 'programmata'], a: 'in_valutazione' },
  esito_superata: { da: ['in_valutazione'], a: 'superata' },
  esito_da_ripetere: { da: ['in_valutazione'], a: 'da_ripetere' },
};

export function transizione(stato, azione) {
  const t = TRANSIZIONI[azione];
  if (!t || !t.da.includes(stato)) return null;
  return t.a;
}

// Controlla che ogni criterio della griglia abbia un livello valido e calcola il punteggio.
export function valuta(griglia, valutazioni) {
  const per = new Map((valutazioni || []).map((v) => [v.criterioId, v.livello]));
  const righe = [];
  let punti = 0;
  let max = 0;
  for (const c of griglia) {
    const livello = per.get(c.id);
    if (!LIVELLI[livello]) return { errore: `Livello mancante o non valido per «${c.titolo}».` };
    righe.push({ criterioId: c.id, livello });
    punti += LIVELLI[livello].punti;
    max += 2;
  }
  return { righe, punti, max, percentuale: max ? Math.round((punti / max) * 100) : 0 };
}

// Scadenza dell'abilitazione in millisecondi (null = senza scadenza).
export function scadenzaAbilitazione(corso, ora) {
  const mesi = corso.abilitazione && Number(corso.abilitazione.scadenzaMesi);
  if (!mesi || mesi <= 0) return null;
  const d = new Date(ora);
  d.setUTCMonth(d.getUTCMonth() + mesi);
  return d.getTime();
}
