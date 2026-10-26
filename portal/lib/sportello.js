import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { CODE_REGEX, normalizzaCodice } from './forms';

// URL pubblico del Cloudflare Worker che inoltra le pratiche su Discord.
// Il webhook Discord NON è mai nel client: sta nei secret del Worker.
export const SPORTELLO_API = process.env.NEXT_PUBLIC_SPORTELLO_API || 'https://iprp-sportello.ryze63131.workers.dev';

export class SubmitError extends Error {
  constructor(message, fields, needLogin = false) {
    super(message);
    this.fields = fields || null;
    this.needLogin = needLogin;
  }
}

export async function inviaPratica(formId, values) {
  let res;
  try {
    res = await fetch(`${SPORTELLO_API}/submit/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
  } catch (e) {
    throw new SubmitError('Impossibile contattare lo Sportello. Controlla la connessione e riprova.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.code) {
    throw new SubmitError(data.error || 'Lo Sportello non ha accettato la richiesta. Riprova tra poco.', data.fields, !!data.needLogin);
  }

  // Registra lo stato (senza dati personali) per il tracciamento pubblico.
  // Non si attende: l'invio su Discord è già avvenuto e non deve restare
  // bloccato se Firestore è lento o offline.
  setDoc(doc(db, 'pratiche', data.code), {
    tipo: formId,
    stato: 'ricevuta',
    creatoIl: serverTimestamp(),
    aggiornamenti: [],
  }).catch((e) => console.warn('Stato pratica non registrato', e));
  return data;
}

export async function cercaPratica(input) {
  const code = normalizzaCodice(input);
  if (!CODE_REGEX.test(code)) return { error: 'Il codice non è nel formato corretto (es. POL-2026-K7M2QX).' };
  const snap = await getDoc(doc(db, 'pratiche', code));
  if (!snap.exists()) return { error: 'Nessuna pratica trovata con questo codice. Se l’hai appena inviata, riprova tra qualche istante.' };
  return { code, pratica: snap.data() };
}
