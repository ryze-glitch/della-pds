// Costanti del portale di formazione, condivise da sito e Worker (come forms.js).
// I gradi sono in ordine dal più basso al più alto: per cambiarli basta modificare questo elenco.
export const GRADI = [
  'Agente',
  'Agente Scelto',
  'Assistente',
  'Assistente Capo',
  'Sovrintendente',
  'Ispettore',
  'Vice Commissario',
  'Questore',
];

// Ruoli del portale, salvati nella raccolta agenti del database D1.
export const RUOLI = ['allievo', 'istruttore', 'admin'];

// Stati della pratica (esame pratico).
export const STATI_PRATICA = ['richiesta', 'programmata', 'in_valutazione', 'superata', 'da_ripetere'];
export const STATI_PRATICA_LABEL = {
  richiesta: 'Richiesta',
  programmata: 'Programmata',
  in_valutazione: 'In valutazione',
  superata: 'Superata',
  da_ripetere: 'Da ripetere',
};

// Livelli della griglia di valutazione: etichetta e punti.
export const LIVELLI = {
  non_svolto: { label: 'Non svolto', punti: 0 },
  parziale: { label: 'Parziale', punti: 1 },
  corretto: { label: 'Corretto', punti: 2 },
};

// Valori predefiniti del quiz di un modulo (ogni modulo può sovrascriverli).
export const QUIZ_DEFAULT = { soglia: 70, domande: 5, maxTentativi: 3, attesaMinuti: 30, durataMinuti: 30 };

export function gradoIndex(grado) {
  const i = GRADI.indexOf(String(grado || ''));
  return i; // -1 se sconosciuto
}
