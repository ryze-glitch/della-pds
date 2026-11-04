// Dati dell'utente per la dashboard (Cloudflare Worker «sportello»: stessa fonte del SISFOR, agenti sincronizzati dal foglio Gerarchia).
import { SPORTELLO_API } from './sportello';

export const DURATA_SESSIONE = 12 * 60 * 60 * 1000; // l'accesso dura 12 ore
const CHIAVE = 'iprp-sessione';

export function sessioneLocale() {
  try { const s = JSON.parse(localStorage.getItem(CHIAVE) || 'null'); return s && s.uid && s.inizio ? s : null; } catch (e) { return null; }
}
export function sessioneValida() {
  const s = sessioneLocale();
  return s && Date.now() - s.inizio <= DURATA_SESSIONE ? s : null;
}
export function azzeraSessione() { try { localStorage.removeItem(CHIAVE); } catch (e) { /* storage non disponibile */ } }

export class ErroreHub extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

export async function caricaIo(user) {
  const token = await user.getIdToken();
  let res;
  try {
    res = await fetch(`${SPORTELLO_API}/formazione/me`, { headers: { Authorization: `Bearer ${token}` } });
  } catch (e) {
    throw new ErroreHub('Impossibile contattare il server.', 0);
  }
  if (!res.ok) throw new ErroreHub(res.status === 403 || res.status === 401 ? 'Account non abilitato.' : 'Il server non risponde.', res.status);
  const d = await res.json();
  return d.me;
}
