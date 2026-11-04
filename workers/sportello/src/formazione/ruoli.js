// Permessi per ruolo. Ogni rotta del Worker li controlla lato server.
import { RUOLI } from '../../../../portal/lib/formazione.js';

export function ruoloDi(profilo) {
  const r = profilo && profilo.ruolo;
  return RUOLI.includes(r) ? r : 'allievo'; // ruolo assente o non valido: il più basso
}

const PERMESSI = {
  allievo: ['studia'],
  istruttore: ['studia', 'valuta'],
  admin: ['studia', 'valuta', 'amministra'],
};

export function puo(ruolo, azione) {
  return (PERMESSI[ruolo] || []).includes(azione);
}

// Il SISFOR è la sezione di formazione riservata agli Allievi Agenti. Istruttori e amministratori entrano sempre
// (gli istruttori per valutare, gli amministratori per gestire e per provare). La qualifica arriva dal foglio Gerarchia.
export function ePerAllievi(profilo) {
  const testo = `${(profilo && profilo.qualifica) || ''} ${(profilo && profilo.grado) || ''}`;
  return /\ballievo\b/i.test(testo);
}

export function accedeSisfor(profilo, ruolo) {
  return ruolo === 'admin' || ruolo === 'istruttore' || ePerAllievi(profilo);
}
