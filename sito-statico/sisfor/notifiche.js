// Campanella delle notifiche: avvisi e notizie recenti dalla raccolta NOTIZIE di Firestore (lettura pubblica).
// Il conteggio dei non letti è salvato nel browser (nessun dato personale, nessun accesso richiesto).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const CONFIG = {
  apiKey: 'AIzaSyBrBkzLE_0MLQEXB9YBDW7G05n6aI_ykA0', authDomain: 'polizia-iprp.firebaseapp.com', projectId: 'polizia-iprp',
  storageBucket: 'polizia-iprp.firebasestorage.app', messagingSenderId: '295622243589', appId: '1:295622243589:web:abfd6d06dac2f95428f36c',
};
const CHIAVE = 'pds-notif-letti';
const GIORNI = 30;
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function leggiLetti() { try { return new Set(JSON.parse(localStorage.getItem(CHIAVE) || '[]')); } catch (e) { return new Set(); } }
function salvaLetti(set) { try { localStorage.setItem(CHIAVE, JSON.stringify([...set].slice(-200))); } catch (e) { /* storage non disponibile */ } }

function parseData(s) {
  if (!s || typeof s !== 'string') return null;
  s = s.trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = s.toLowerCase().match(/^(\d{1,2})\s+([a-zà-ù]+)\s+(\d{4})$/);
  if (m) { const i = MESI.indexOf(m[2]); if (i >= 0) return new Date(+m[3], i, +m[1]); }
  return null;
}
function campoTitolo(d) {
  for (const k of ['Titolo', 'titolo', 'Titolo della notizia', 'Titolo notizia', 'Oggetto']) if (typeof d[k] === 'string' && d[k].trim()) return d[k].trim();
  return '';
}
function titoloDi(d) {
  const c = campoTitolo(d); if (c) return c;
  const t = (d['Descrizione'] || '').trim();
  return t.length > 70 ? t.slice(0, 67) + '…' : (t || 'Notizia');
}
function corto(t, n) { t = (t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; }
function dataIt(d) { return d ? d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear() : ''; }

async function carica() {
  const db = getFirestore(initializeApp(CONFIG, 'notifiche'));
  const snap = await getDocs(collection(db, 'NOTIZIE'));
  const oggi = new Date(); oggi.setHours(0, 0, 0, 0);
  const limite = new Date(oggi); limite.setDate(limite.getDate() - GIORNI);
  const avvisi = [], notizie = [];
  snap.forEach((doc) => {
    const d = doc.data();
    if (d['visibile'] === 'no') {
      const sc = parseData(d['Scadenza']);
      if (!sc || sc >= oggi) avvisi.push({ id: 'a:' + doc.id, tipo: 'Avviso', titolo: corto(d['Descrizione'], 90) || 'Avviso', testo: sc ? 'Fino al ' + dataIt(sc) : '', data: null, href: null });
    } else {
      const dt = parseData(d['Data della notizia']);
      notizie.push({ id: 'n:' + doc.id, tipo: 'Notizia', titolo: titoloDi(d), testo: campoTitolo(d) ? corto(d['Descrizione'], 110) : '', data: dt, href: 'notizie.html' });
    }
  });
  notizie.sort((a, b) => (b.data || 0) - (a.data || 0));
  let recenti = notizie.filter((n) => n.data && n.data >= limite);
  let ultime = false;
  if (!avvisi.length && !recenti.length) { recenti = notizie.slice(0, 3); ultime = true; }
  return { voci: [...avvisi, ...recenti].slice(0, 8), ultime };
}

function init() {
  const vecchio = document.querySelector('.nav-bell');
  if (!vecchio) return;
  const isola = vecchio.parentElement;
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'nav-bell'; btn.setAttribute('aria-label', 'Notifiche'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-haspopup', 'true');
  btn.innerHTML = vecchio.innerHTML + '<span class="nav-badge" hidden></span>';
  isola.replaceChild(btn, vecchio);
  const badge = btn.querySelector('.nav-badge');

  const pannello = document.createElement('div');
  pannello.className = 'notif-panel'; pannello.setAttribute('data-lenis-prevent', ''); pannello.setAttribute('role', 'dialog'); pannello.setAttribute('aria-label', 'Notifiche'); pannello.hidden = true;
  pannello.innerHTML = '<div class="notif-head"><strong>Notifiche</strong><button type="button" class="notif-all">Segna come lette</button></div><div class="notif-list"><p class="notif-empty">Caricamento…</p></div>';
  (document.getElementById('navbar') || document.body).appendChild(pannello);
  const lista = pannello.querySelector('.notif-list');
  const tutte = pannello.querySelector('.notif-all');

  let voci = [], ultime = false, errore = false;
  const letti = leggiLetti();
  const nonLetti = () => voci.filter((v) => !letti.has(v.id)).length;

  function disegna() {
    const n = nonLetti();
    badge.hidden = n === 0; badge.textContent = n > 9 ? '9+' : String(n);
    btn.setAttribute('aria-label', n ? 'Notifiche, ' + n + (n === 1 ? ' nuova' : ' nuove') : 'Notifiche');
    tutte.hidden = n === 0;
    lista.innerHTML = '';
    if (errore) { lista.innerHTML = '<p class="notif-empty">Le notifiche non sono disponibili al momento.</p>'; return; }
    if (!voci.length) { lista.innerHTML = '<p class="notif-empty">Nessuna notifica.</p>'; return; }
    if (ultime) { const p = document.createElement('p'); p.className = 'notif-sub'; p.textContent = 'Ultime notizie'; lista.appendChild(p); }
    voci.forEach((v) => {
      const el = document.createElement(v.href ? 'a' : 'div');
      if (v.href) el.href = v.href;
      el.className = 'notif-item' + (letti.has(v.id) ? '' : ' nuova');
      const tag = document.createElement('span'); tag.className = 'notif-tag ' + (v.tipo === 'Avviso' ? 'avviso' : ''); tag.textContent = v.tipo;
      const t = document.createElement('b'); t.textContent = v.titolo;
      el.append(tag, t);
      const meta = [v.data ? dataIt(v.data) : '', v.tipo === 'Avviso' ? v.testo : ''].filter(Boolean).join(' · ');
      if (v.tipo === 'Notizia' && v.testo) { const p = document.createElement('p'); p.textContent = v.testo; el.appendChild(p); }
      if (meta) { const m = document.createElement('small'); m.textContent = meta; el.appendChild(m); }
      el.addEventListener('click', () => { letti.add(v.id); salvaLetti(letti); disegna(); });
      lista.appendChild(el);
    });
  }
  function apri(si) { pannello.hidden = !si; btn.setAttribute('aria-expanded', si ? 'true' : 'false'); }
  btn.addEventListener('click', (e) => { e.stopPropagation(); apri(pannello.hidden); });
  tutte.addEventListener('click', () => { voci.forEach((v) => letti.add(v.id)); salvaLetti(letti); disegna(); });
  document.addEventListener('click', (e) => { if (!pannello.hidden && !pannello.contains(e.target) && e.target !== btn) apri(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pannello.hidden) { apri(false); btn.focus(); } });

  disegna();
  carica().then((r) => { voci = r.voci; ultime = r.ultime; disegna(); }).catch(() => { errore = true; disegna(); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
