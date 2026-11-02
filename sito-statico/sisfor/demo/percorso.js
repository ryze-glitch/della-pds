// Percorso di un corso: sblocco in sequenza di moduli, quiz e pratica. Funzioni pure.
import { gradoIndex } from './formazione.js';

// progressi: { moduliLetti: [moduloId], quizSuperati: { [moduloId]: { punteggio, data } } }
export function statoModuli(moduli, progressi) {
  const letti = new Set((progressi && progressi.moduliLetti) || []);
  const quiz = (progressi && progressi.quizSuperati) || {};
  const ordinati = moduli.slice().sort((a, b) => a.ordine - b.ordine);
  let precedenteCompleto = true;
  return ordinati.map((m) => {
    const letto = letti.has(m.id);
    const superato = !!quiz[m.id];
    const sbloccato = precedenteCompleto;
    const completo = letto && superato;
    // Il quiz si apre dopo aver letto il modulo; il modulo successivo dopo aver superato il quiz.
    const stato = !sbloccato ? 'bloccato' : completo ? 'completato' : 'in_corso';
    const out = { id: m.id, ordine: m.ordine, titolo: m.titolo, stato, letto, quizSbloccato: sbloccato && letto, quizSuperato: superato, punteggio: superato ? quiz[m.id].punteggio : null };
    precedenteCompleto = precedenteCompleto && completo;
    return out;
  });
}

export function tuttiIQuizSuperati(moduli, progressi) {
  const quiz = (progressi && progressi.quizSuperati) || {};
  return moduli.length > 0 && moduli.every((m) => !!quiz[m.id]);
}

// La pratica si può richiedere solo dopo aver superato tutti i quiz del corso.
export function praticaSbloccata(moduli, progressi) {
  return tuttiIQuizSuperati(moduli, progressi);
}

// Un corso è visibile se il grado è sufficiente e le abilitazioni richieste sono già state ottenute.
export function corsoVisibile(corso, grado, abilitazioniOttenute, ruolo) {
  if (ruolo === 'admin') return true;
  if (corso.pubblicato === false) return false;
  const min = corso.gradoMinimo ? gradoIndex(corso.gradoMinimo) : 0;
  if (min < 0) return false; // grado minimo non riconosciuto: nascosto per prudenza
  if (gradoIndex(grado) < min) return false;
  const ok = new Set(abilitazioniOttenute || []);
  return (corso.richiede || []).every((id) => ok.has(id));
}
