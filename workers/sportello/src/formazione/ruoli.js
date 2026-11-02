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
