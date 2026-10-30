import { auth } from './firebase';
import { SPORTELLO_API } from './sportello';

// Invia al Worker il log di un aggiornamento di stato (verrà inoltrato su Discord/Telegram).
// Usa il token Firebase dell'agente: il Worker lo verifica. Non blocca mai l'interfaccia.
export async function logAggiornamento({ code, stato, nota, assegnataA }) {
  try {
    const user = auth.currentUser;
    if (!user) return false;
    const token = await user.getIdToken();
    const res = await fetch(`${SPORTELLO_API}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code, stato, nota, assegnataA }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Log aggiornamento non inviato', e);
    return false;
  }
}
