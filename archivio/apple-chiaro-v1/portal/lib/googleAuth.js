// Accesso con Google tramite Google Identity Services (accounts.google.com).
// NON usa Firebase Auth: il browser ottiene un ID token firmato da Google, che il
// Worker verifica lato server. Il token resta solo in sessionStorage (chiude con la scheda).
const KEY = 'pds-google';

function decode(jwt) {
  try {
    const p = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(p.padEnd(Math.ceil(p.length / 4) * 4, '=')))));
  } catch (e) {
    return null;
  }
}

export function saveCredential(credential) {
  const c = decode(credential);
  if (!c) return null;
  const user = { token: credential, name: c.name || '', email: c.email || '', picture: c.picture || '', exp: c.exp || 0 };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(user));
  } catch (e) {
    /* storage non disponibile */
  }
  return user;
}

export function getGoogleUser() {
  try {
    const u = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (!u || !u.token || u.exp * 1000 < Date.now() + 60000) return null;
    return u;
  } catch (e) {
    return null;
  }
}

export function clearGoogleUser() {
  try {
    sessionStorage.removeItem(KEY);
  } catch (e) {
    /* ignora */
  }
  if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.disableAutoSelect();
  }
}
