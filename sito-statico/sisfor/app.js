// SISFOR+ IPRP — area personale e portale di formazione (applicazione a una pagina, percorsi con #/…).
// Tutta la logica sensibile (correzione, sblocco, ruoli) sta nel Worker: qui solo la presentazione.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBrBkzLE_0MLQEXB9YBDW7G05n6aI_ykA0',
  authDomain: 'polizia-iprp.firebaseapp.com',
  projectId: 'polizia-iprp',
  appId: '1:295622243589:web:abfd6d06dac2f95428f36c',
};
const API = 'https://iprp-sportello.ryze63131.workers.dev/formazione';
const auth = getAuth(initializeApp(firebaseConfig));

const $app = document.getElementById('app');
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const data = (ms) => (ms ? new Date(ms).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }) : '—');
const dataOra = (ms) => new Date(ms).toLocaleString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const nomeCompleto = (a) => `${a.nome || ''} ${a.cognome || ''}`.trim() || 'Agente';

let me = null;
let config = { gradi: [], livelli: { non_svolto: 'Non svolto', parziale: 'Parziale', corretto: 'Corretto' } };
let timer = null;

async function api(path, { method = 'GET', body } = {}) {
  const u = auth.currentUser;
  if (!u) {
    const e = new Error('Non hai effettuato l’accesso.');
    e.status = 401;
    throw e;
  }
  const token = await u.getIdToken();
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let d = {};
  try {
    d = await res.json();
  } catch (e) {
    /* risposta non JSON */
  }
  if (!res.ok) {
    const e = new Error(d.error || 'Qualcosa è andato storto. Riprova.');
    e.status = res.status;
    e.data = d;
    throw e;
  }
  return d;
}

// ---------- pezzi di interfaccia ----------
const PILL = {
  non_iniziato: ['grigio', 'Da iniziare'],
  in_corso: ['corso', 'In corso'],
  pratica_da_prenotare: ['ambra', 'Pratica da prenotare'],
  pratica_in_corso: ['corso', 'Pratica in corso'],
  completato: ['ok', 'Completato'],
  bloccato: ['grigio', '<i class="fas fa-lock" aria-hidden="true"></i> Bloccato'],
  superato: ['ok', 'Superato'],
  disponibile: ['corso', 'Disponibile'],
  richiesta: ['ambra', 'Richiesta'],
  programmata: ['corso', 'Programmata'],
  in_valutazione: ['corso', 'In valutazione'],
  superata: ['ok', 'Superata'],
  da_ripetere: ['rosso', 'Da ripetere'],
};
const pill = (k) => `<span class="pill ${PILL[k][0]}">${PILL[k][1]}</span>`;
const num = (i) => String(i + 1).padStart(2, '0');

function fasi(f) {
  const nomi = ['Moduli', 'Quiz', 'Pratica', 'Abilitazione'];
  return `<ol class="fasi" aria-label="Percorso del corso">${nomi
    .map((n, i) => {
      const k = f > i + 1 || f === 4 ? 'fatta' : f === i + 1 ? 'attiva' : 'futura';
      const t = k === 'fatta' ? 'Completato' : k === 'attiva' ? 'In corso' : 'Da fare';
      return `<li class="${k}"><div class="seg" aria-hidden="true"></div><b>${num(i)} ${n}</b><small>${t}</small></li>`;
    })
    .join('')}</ol>`;
}

function intestazione(titolo, sotto, crumbs = []) {
  const c = crumbs.length
    ? `<nav class="crumbs" aria-label="Percorso"><a href="#/">I miei corsi</a>${crumbs
        .map((x, i) => (x.href && i < crumbs.length - 1 ? `<span aria-hidden="true">›</span><a href="${x.href}">${esc(x.t)}</a>` : `<span aria-hidden="true">›</span><span aria-current="page">${esc(x.t)}</span>`))
        .join('')}</nav>`
    : '';
  return `${c}<h1 class="titolo">${titolo}</h1>${sotto ? `<p class="sottotitolo">${sotto}</p>` : ''}`;
}

function barra(attivo) {
  const ruolo = me.ruolo;
  const voci = [
    ['#/', 'I miei corsi', 'fa-graduation-cap', 'corsi'],
    ['#/percorso', 'Il mio percorso', 'fa-route', 'percorso'],
  ];
  if (ruolo === 'istruttore' || ruolo === 'admin') voci.push(['#/istruttori', 'Istruttori', 'fa-clipboard-check', 'istruttori']);
  if (ruolo === 'admin') voci.push(['#/admin', 'Admin', 'fa-sliders', 'admin']);
  return `<div class="bar"><nav class="tabs" aria-label="Area personale">${voci
    .map(([h, t, ic, k]) => `<a href="${h}" ${attivo === k ? 'aria-current="page"' : ''}><i class="fas ${ic}" aria-hidden="true"></i>${t}</a>`)
    .join('')}<a href="/gestione/pratiche"><i class="fas fa-folder-open" aria-hidden="true"></i>Gestione</a></nav>
    <div class="who"><div><strong>${esc(nomeCompleto(me))}</strong> <span>· ${esc(me.grado || 'Agente')}</span></div><button class="btn linea piccolo" data-az="esci">Esci</button></div></div>`;
}

const caricamento = () => ($app.innerHTML = '<div class="caricamento"><i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i> Caricamento…</div>');
const avviso = (t, tipo = '', ic = 'fa-circle-info') => `<div class="avviso ${tipo}" role="${tipo === 'err' ? 'alert' : 'status'}"><i class="fas ${ic}" aria-hidden="true"></i><div>${t}</div></div>`;

function mostra(attivo, html) {
  clearInterval(timer);
  $app.innerHTML = barra(attivo) + html;
  $app.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

function erroreVista(e, attivo = '') {
  if (e.status === 401 || e.status === 403) return mostraGate(e.status === 403 ? 'negato' : '');
  const html = `<div style="margin-top:20px">${avviso(esc(e.message), 'err', 'fa-triangle-exclamation')}</div><div class="azioni"><a class="btn" href="#/">Torna ai miei corsi</a></div>`;
  if (me) mostra(attivo, html);
  else $app.innerHTML = html;
}

function mostraGate(motivo) {
  clearInterval(timer);
  me = null;
  const msg =
    motivo === 'negato'
      ? avviso('Il tuo account Discord non risulta abilitato. Chiedi a un amministratore di registrarti.', 'err', 'fa-lock')
      : '';
  $app.innerHTML = `<div class="hero-gate"><img src="/logo-iprp.png" alt="Stemma della Polizia di Stato IPRP">
    <h1 class="titolo">Area <span>Personale</span></h1>
    <p class="sottotitolo">Accedi con il tuo account Discord per studiare i corsi, fare i quiz di verifica e prenotare gli esami pratici.</p>
    ${msg}
    <a class="btn" href="/login?next=/sisfor"><i class="fab fa-discord" aria-hidden="true"></i> Accedi con Discord</a></div>`;
}

// ---------- viste ----------
async function vistaHome() {
  caricamento();
  const { corsi } = await api('/corsi');
  const prossimo = corsi.find((c) => ['in_corso', 'pratica_da_prenotare', 'pratica_in_corso'].includes(c.stato)) || corsi.find((c) => c.stato === 'non_iniziato');
  const testoProssimo = { in_corso: 'Continua il corso', pratica_da_prenotare: 'Prenota l’esame pratico', pratica_in_corso: 'Segui la tua pratica', non_iniziato: 'Inizia il corso' };
  let html = `<h1 class="titolo" style="margin-bottom:8px">I miei <span>corsi</span></h1>`;
  if (prossimo) {
    html += `<div class="card alto" style="margin-top:26px"><div class="eyebrow">Prossimo passo</div>
      <h2 style="font-size:clamp(1.6rem,3.4vw,2.4rem);font-weight:800;margin:10px 0 4px;line-height:1.1">${esc(prossimo.titolo)}</h2>
      <p style="color:var(--text-muted)">${prossimo.moduli} moduli · grado minimo ${esc(prossimo.gradoMinimo)}</p>
      ${fasi(prossimo.fase)}
      <a class="btn bianco" href="#/corso/${esc(prossimo.id)}" style="color:#0b1020">${testoProssimo[prossimo.stato]} <i class="fas fa-arrow-right" aria-hidden="true"></i></a></div>`;
  }
  html += `<h2 class="sez">Tutti i corsi</h2>`;
  if (!corsi.length) {
    html += `<div class="vuoto">Nessun corso disponibile per il tuo grado al momento.</div>`;
  } else {
    html += `<ul class="righe">${corsi
      .map(
        (c, i) => `<li><a class="riga" href="#/corso/${esc(c.id)}"><span class="n">${num(i)}</span>
        <span class="t"><b>${esc(c.titolo)}</b><small>${esc(c.descrizione || `${c.moduli} moduli`)}</small></span>${pill(c.stato)}<i class="fas fa-arrow-right" aria-hidden="true"></i></a></li>`
      )
      .join('')}</ul>`;
  }
  mostra('corsi', html);
}

async function vistaCorso(cid) {
  caricamento();
  const d = await api(`/corsi/${cid}`);
  const c = d.corso;
  let html = intestazione(esc(c.titolo), esc(c.descrizione || ''), [{ t: c.titolo }]);
  html += fasi(d.fase);
  if (d.abilitazione) {
    html += avviso(`Hai ottenuto <strong>${esc(d.abilitazione.nome)}</strong> il ${data(d.abilitazione.ottenutaIl)}${d.abilitazione.scadeIl ? ` · valida fino al ${data(d.abilitazione.scadeIl)}` : ''}.`, 'ok', 'fa-circle-check');
  }
  html += `<h2 class="sez">01 · Moduli</h2><ul class="righe">${d.moduli
    .map((m, i) => {
      const bl = m.stato === 'bloccato';
      const corpo = `<span class="n">${num(i)}</span><span class="t"><b>${esc(m.titolo)}</b><small>${bl ? 'Completa prima il modulo precedente.' : m.letto ? 'Letto' : 'Da leggere'}</small></span>${pill(m.stato)}${bl ? '' : '<i class="fas fa-arrow-right" aria-hidden="true"></i>'}`;
      return `<li>${bl ? `<div class="riga bloccata">${corpo}</div>` : `<a class="riga" href="#/corso/${esc(cid)}/modulo/${esc(m.id)}">${corpo}</a>`}</li>`;
    })
    .join('')}</ul>`;
  html += `<h2 class="sez">02 · Quiz di verifica</h2><ul class="righe">${d.moduli
    .map((m, i) => {
      const k = m.quizSuperato ? 'superato' : m.quizSbloccato ? 'disponibile' : 'bloccato';
      const sub = m.quizSuperato ? `Superato con ${m.punteggio}%` : m.quizSbloccato ? `${m.quiz.domande} domande · soglia ${m.quiz.soglia}% · max ${m.quiz.maxTentativi} tentativi` : 'Si sblocca dopo aver letto il modulo.';
      const corpo = `<span class="n">${num(i)}</span><span class="t"><b>Quiz · ${esc(m.titolo)}</b><small>${sub}</small></span>${pill(k)}${k === 'disponibile' ? '<i class="fas fa-arrow-right" aria-hidden="true"></i>' : ''}`;
      return `<li>${k === 'disponibile' ? `<a class="riga" href="#/corso/${esc(cid)}/modulo/${esc(m.id)}/quiz">${corpo}</a>` : `<div class="riga ${k === 'bloccato' ? 'bloccata' : ''}">${corpo}</div>`}</li>`;
    })
    .join('')}</ul>`;
  const p = d.pratica;
  const stPratica = p.attiva ? p.attiva.stato : d.abilitazione ? 'superata' : p.sbloccata ? 'disponibile' : 'bloccato';
  const subP = p.attiva ? 'Segui lo stato e le sessioni.' : d.abilitazione ? 'Esame pratico superato.' : p.sbloccata ? 'Hai superato tutti i quiz: puoi prenotare.' : 'Si sblocca dopo aver superato tutti i quiz del corso.';
  const apri = (p.sbloccata && !d.abilitazione) || p.attiva;
  const corpoP = `<span class="n">03</span><span class="t"><b>Esame pratico</b><small>${subP}</small></span>${stPratica === 'disponibile' ? '<span class="pill ambra">Pratica da prenotare</span>' : pill(stPratica)}${apri ? '<i class="fas fa-arrow-right" aria-hidden="true"></i>' : ''}`;
  html += `<h2 class="sez">03 · Pratica e abilitazione</h2><ul class="righe"><li>${apri ? `<a class="riga" href="#/corso/${esc(cid)}/pratica">${corpoP}</a>` : `<div class="riga ${stPratica === 'bloccato' ? 'bloccata' : ''}">${corpoP}</div>`}</li>
    <li><div class="riga ${d.abilitazione ? '' : 'bloccata'}"><span class="n">04</span><span class="t"><b>${esc(c.abilitazione && c.abilitazione.nome ? c.abilitazione.nome : 'Abilitazione')}</b><small>${d.abilitazione ? 'Ottenuta' : 'Si ottiene superando l’esame pratico.'}</small></span>${d.abilitazione ? pill('completato') : pill('bloccato')}</div></li></ul>`;
  mostra('corsi', html);
}

function paragrafi(t) {
  return String(t)
    .split(/\n{2,}|\n/)
    .filter((x) => x.trim())
    .map((x) => `<p>${esc(x)}</p>`)
    .join('');
}
function embedYT(url) {
  const m = String(url).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,20})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : '';
}

async function vistaModulo(cid, mid) {
  caricamento();
  const [d, corso] = await Promise.all([api(`/corsi/${cid}/moduli/${mid}`), api(`/corsi/${cid}`)]);
  const m = d.modulo;
  const stato = corso.moduli.find((x) => x.id === mid);
  let html = intestazione(esc(m.titolo), `Modulo ${m.ordine} di ${corso.moduli.length}`, [{ t: corso.corso.titolo, href: `#/corso/${cid}` }, { t: m.titolo }]);
  html += `<div class="contenuto" style="margin-top:34px">${m.blocchi
    .map((b) => {
      if (b.tipo === 'testo') return paragrafi(b.testo);
      if (b.tipo === 'immagine') return `<img src="${esc(b.src)}" alt="${esc(b.alt || '')}">`;
      const e = embedYT(b.url);
      return e ? `<div class="video"><iframe src="${esc(e)}" title="${esc(b.titolo || 'Video del modulo')}" allowfullscreen loading="lazy"></iframe></div>` : '';
    })
    .join('') || '<p>Questo modulo non ha ancora contenuti.</p>'}</div>`;
  html += `<div class="azioni">`;
  if (stato.quizSuperato) {
    html += d.successivo ? `<a class="btn" href="#/corso/${esc(cid)}/modulo/${esc(d.successivo)}">Modulo successivo <i class="fas fa-arrow-right" aria-hidden="true"></i></a>` : `<a class="btn" href="#/corso/${esc(cid)}">Torna al corso</a>`;
  } else {
    html += `<button class="btn" data-az="letto" data-c="${esc(cid)}" data-m="${esc(mid)}">Ho letto il modulo: vai al quiz <i class="fas fa-arrow-right" aria-hidden="true"></i></button>`;
  }
  html += `<a class="btn linea" href="#/corso/${esc(cid)}">Torna al corso</a></div><div id="esito-az"></div>`;
  mostra('corsi', html);
}

// ----- quiz -----
let Q = null;
async function vistaQuiz(cid, mid) {
  caricamento();
  let r;
  try {
    r = await api(`/corsi/${cid}/moduli/${mid}/quiz`, { method: 'POST', body: {} });
  } catch (e) {
    if (e.status === 429) {
      const min = e.data && e.data.riprovaTra ? Math.ceil(e.data.riprovaTra / 60) : 0;
      const msg = e.data && e.data.motivo === 'attesa' ? `Devi attendere ancora circa ${min} minuti prima del prossimo tentativo.` : e.message;
      mostra('corsi', intestazione('Quiz non disponibile', '', [{ t: 'Quiz' }]) + `<div style="margin-top:24px">${avviso(esc(msg), 'err', 'fa-clock')}</div><div class="azioni"><a class="btn" href="#/corso/${esc(cid)}">Torna al corso</a></div>`);
      return;
    }
    throw e;
  }
  Q = { cid, mid, id: r.tentativo.id, scade: r.tentativo.scadeIl, soglia: r.tentativo.soglia, domande: r.domande, risp: {}, i: 0, numero: r.tentativo.numero, max: r.tentativo.max };
  disegnaQuiz();
}

function disegnaQuiz() {
  const q = Q.domande[Q.i];
  const ultima = Q.i === Q.domande.length - 1;
  const scelta = Q.risp[q.id];
  const html = `<div class="quiz" style="margin-top:6px">
    <div class="quiz-testa"><span>Tentativo ${Q.numero} di ${Q.max} · soglia ${Q.soglia}%</span><span id="tempo" aria-hidden="true"></span></div>
    <nav aria-label="Avanzamento del quiz"><ol class="griglia">${Q.domande
      .map((d, i) => `<li class="${i === Q.i ? 'corrente' : Q.risp[d.id] ? 'data' : ''}"><button data-az="vai" data-i="${i}" aria-label="Domanda ${i + 1}${Q.risp[d.id] ? ', risposta data' : ''}" ${i === Q.i ? 'aria-current="step"' : ''}>${i + 1}</button></li>`)
      .join('')}</ol></nav>
    <form data-form="quiz"><fieldset><legend class="domanda"><span class="eyebrow" style="display:block;margin-bottom:8px">Domanda ${Q.i + 1} di ${Q.domande.length}${q.tipo === 'situazionale' ? ' · situazione' : ''}</span>${esc(q.testo)}</legend>
      <div class="opzioni">${q.opzioni.map((o) => `<label class="opzione"><input type="radio" name="r" value="${esc(o.id)}" ${scelta === o.id ? 'checked' : ''}><span>${esc(o.testo)}</span></label>`).join('')}</div></fieldset>
    <div class="azioni"><button type="button" class="btn linea" data-az="prec" ${Q.i === 0 ? 'disabled' : ''}>Precedente</button>
      <button type="submit" class="btn" id="conferma" ${scelta ? '' : 'disabled'}>${ultima ? 'Consegna il quiz' : 'Conferma e continua'} <i class="fas fa-arrow-right" aria-hidden="true"></i></button></div></form></div>`;
  mostra('corsi', intestazione('Quiz', '', [{ t: 'Quiz' }]).replace('<h1 class="titolo">Quiz</h1>', '<h1 class="titolo" style="font-size:1.4rem">Quiz di verifica</h1>') + html);
  const tick = () => {
    const s = Math.max(0, Math.floor((Q.scade - Date.now()) / 1000));
    const el = document.getElementById('tempo');
    if (el) el.textContent = `Tempo rimasto ${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  tick();
  timer = setInterval(tick, 1000);
  const primo = $app.querySelector('input[name="r"]');
  if (primo) primo.closest('.opzioni').querySelector('input:checked, input')?.focus({ preventScroll: true });
}

async function consegna() {
  const btn = document.getElementById('conferma');
  if (btn) btn.disabled = true;
  try {
    const r = await api(`/quiz/${Q.id}/consegna`, { method: 'POST', body: { risposte: Q.risp } });
    const ok = r.esito === 'superato';
    let html = intestazione(ok ? 'Quiz <span>superato</span>' : 'Quiz non superato', '', [{ t: 'Risultato' }]);
    html += `<div class="card ${ok ? 'alto' : ''}" style="margin-top:26px"><div class="eyebrow">Il tuo punteggio</div><div class="punteggio" style="margin:10px 0">${r.punteggio}%</div>
      <p style="color:var(--text-muted)">${r.giuste} risposte giuste su ${r.totale} · soglia ${r.soglia}%</p>${r.scaduto ? `<div style="margin-top:14px">${avviso('Il tempo è scaduto: le risposte non sono state contate.', 'err', 'fa-clock')}</div>` : ''}</div>`;
    if (r.errori.length) {
      html += `<h2 class="sez">Le risposte sbagliate</h2>${r.errori
        .map((e) => `<div class="errore-q"><b>${esc(e.testo)}</b><p>La tua risposta: ${esc(e.scelta || 'nessuna')}</p><p>Risposta corretta: <em>${esc(e.corretta || '—')}</em></p>${e.spiegazione ? `<p>${esc(e.spiegazione)}</p>` : ''}</div>`)
        .join('')}`;
    }
    html += `<div class="azioni"><a class="btn" href="#/corso/${esc(Q.cid)}">${ok ? 'Continua il corso' : 'Torna al corso'} <i class="fas fa-arrow-right" aria-hidden="true"></i></a>${ok ? '' : `<a class="btn linea" href="#/corso/${esc(Q.cid)}/modulo/${esc(Q.mid)}">Rivedi il modulo</a>`}</div>`;
    Q = null;
    mostra('corsi', html);
  } catch (e) {
    erroreVista(e, 'corsi');
  }
}

// ----- pratica -----
async function vistaPratica(cid) {
  caricamento();
  const [d, corso] = await Promise.all([api(`/corsi/${cid}/pratica`), api(`/corsi/${cid}`)]);
  const att = corso.pratica.attiva;
  let html = intestazione('Esame <span>pratico</span>', esc(corso.corso.titolo), [{ t: corso.corso.titolo, href: `#/corso/${cid}` }, { t: 'Esame pratico' }]);
  html += fasi(corso.fase);
  if (att) {
    html += `<div class="card alto"><div class="eyebrow">La tua pratica</div><h3 style="margin-top:8px">${pill(att.stato)}</h3>
      <p style="color:var(--text-muted);margin-top:10px">Richiesta il ${data(att.richiestaIl)}${att.assegnataNome ? ` · istruttore: ${esc(att.assegnataNome)}` : ''}.</p></div>`;
  } else if (!d.sbloccata) {
    html += avviso('L’esame pratico si sblocca dopo aver superato tutti i quiz del corso.', '', 'fa-lock');
  } else if (corso.abilitazione) {
    html += avviso('Hai già ottenuto questa abilitazione.', 'ok', 'fa-circle-check');
  } else {
    html += `<h2 class="sez">Sessioni disponibili</h2>`;
    html += d.sessioni.length
      ? `<ul class="righe">${d.sessioni.map((s, i) => `<li><div class="riga"><span class="n">${num(i)}</span><span class="t"><b>${dataOra(s.data)}</b><small>${esc(s.luogo || 'Luogo da definire')} · ${s.posti} ${s.posti === 1 ? 'posto libero' : 'posti liberi'}</small></span><button class="btn piccolo" data-az="prenota" data-c="${esc(cid)}" data-s="${esc(s.id)}">Prenota</button></div></li>`).join('')}</ul>`
      : `<div class="vuoto">Nessuna sessione in programma. Puoi richiedere l’esame: un istruttore ti contatterà.</div>`;
    html += `<div class="azioni"><button class="btn bianco" data-az="prenota" data-c="${esc(cid)}" data-s="">Richiedi l’esame senza sessione</button></div>`;
  }
  html += `<h2 class="sez">Criteri di valutazione</h2><ul class="righe">${d.criteri.map((c, i) => `<li><div class="riga"><span class="n">${num(i)}</span><span class="t"><b>${esc(c.titolo)}</b><small>${esc(c.descrizione || '')}</small></span></div></li>`).join('')}</ul>
    <p class="sottotitolo" style="margin-top:14px">Per ogni criterio l’istruttore assegna: ${Object.values(config.livelli).map(esc).join(', ')}.</p><div id="esito-az" style="margin-top:20px"></div>`;
  mostra('corsi', html);
}

// ----- percorso -----
async function vistaPercorso() {
  caricamento();
  const [p, c] = await Promise.all([api('/percorso'), api('/corsi')]);
  const titoli = Object.fromEntries(c.corsi.map((x) => [x.id, x.titolo]));
  const t = (id) => esc(titoli[id] || id);
  let html = `<h1 class="titolo">Il mio <span>percorso</span></h1><h2 class="sez">Abilitazioni ottenute</h2>`;
  html += p.abilitazioni.length
    ? `<ul class="righe">${p.abilitazioni.map((a, i) => `<li><div class="riga"><span class="n">${num(i)}</span><span class="t"><b>${esc(a.nome)}</b><small>Ottenuta il ${data(a.ottenutaIl)}${a.scadeIl ? ` · scade il ${data(a.scadeIl)}` : ' · senza scadenza'}</small></span>${a.scaduta ? '<span class="pill rosso">Scaduta</span>' : pill('completato')}</div></li>`).join('')}</ul>`
    : '<div class="vuoto">Non hai ancora abilitazioni.</div>';
  const inCorso = c.corsi.filter((x) => x.stato !== 'completato');
  html += `<h2 class="sez">Corsi in corso</h2>`;
  html += inCorso.length
    ? `<ul class="righe">${inCorso.map((x, i) => `<li><a class="riga" href="#/corso/${esc(x.id)}"><span class="n">${num(i)}</span><span class="t"><b>${esc(x.titolo)}</b><small>Fase ${x.fase} di 4</small></span>${pill(x.stato)}<i class="fas fa-arrow-right" aria-hidden="true"></i></a></li>`).join('')}</ul>`
    : '<div class="vuoto">Nessun corso in corso.</div>';
  html += `<h2 class="sez">Pratiche e note dell’istruttore</h2>`;
  html += p.pratiche.length
    ? `<div class="scorri"><table><thead><tr><th>Corso</th><th>Richiesta</th><th>Stato</th><th>Punteggio</th><th>Note</th></tr></thead><tbody>${p.pratiche.map((x) => `<tr><td>${t(x.corsoId)}</td><td>${data(x.richiestaIl)}</td><td>${pill(x.stato)}</td><td>${x.punteggio != null ? x.punteggio + '%' : '—'}</td><td>${esc(x.note || '—')}</td></tr>`).join('')}</tbody></table></div>`
    : '<div class="vuoto">Nessuna pratica richiesta.</div>';
  html += `<h2 class="sez">Storico dei quiz</h2>`;
  html += p.tentativi.length
    ? `<div class="scorri"><table><thead><tr><th>Data</th><th>Corso</th><th>Modulo</th><th>Punteggio</th><th>Esito</th></tr></thead><tbody>${p.tentativi.map((x) => `<tr><td>${data(x.data)}</td><td>${t(x.corsoId)}</td><td>${esc(x.moduloId)}</td><td>${x.punteggio}%</td><td>${x.esito === 'superato' ? pill('superato') : '<span class="pill rosso">Non superato</span>'}</td></tr>`).join('')}</tbody></table></div>`
    : '<div class="vuoto">Nessun quiz svolto.</div>';
  mostra('percorso', html);
}

// ----- area istruttori -----
async function vistaIstruttori(sel) {
  if (!(me.ruolo === 'istruttore' || me.ruolo === 'admin')) return location.replace('#/');
  caricamento();
  const [{ coda }, { allievi }, { corsi }] = await Promise.all([api('/istruttori/coda'), api('/istruttori/allievi'), api('/corsi')]);
  let html = `<h1 class="titolo">Area <span>istruttori</span></h1><h2 class="sez">Coda delle richieste pratiche</h2>`;
  html += coda.length
    ? `<ul class="righe">${coda
        .map((p, i) => {
          const mia = p.assegnataA === me.id;
          const az = p.stato === 'in_valutazione' ? (mia || me.ruolo === 'admin' ? `<a class="btn piccolo" href="#/istruttori/${esc(p.id)}">Valuta</a>` : `<span class="pill grigio">In carico a ${esc(p.assegnataNome || 'altro istruttore')}</span>`) : `<button class="btn piccolo" data-az="assegna" data-p="${esc(p.id)}">Prendi in carico</button>`;
          return `<li><div class="riga"><span class="n">${num(i)}</span><span class="t"><b>${esc(nomeCompleto(p.allievo))} <span style="color:var(--text-muted);font-weight:400">· ${esc(p.allievo.grado)}</span></b><small>${esc(corsi.find((c) => c.id === p.corsoId)?.titolo || p.corsoId)} · richiesta il ${data(p.richiestaIl)}</small></span>${pill(p.stato)}${az}</div></li>`;
        })
        .join('')}</ul>`
    : '<div class="vuoto">Nessuna richiesta in coda.</div>';
  html += `<h2 class="sez">Allievi e avanzamento</h2>`;
  html += allievi.length
    ? `<div class="scorri"><table><thead><tr><th>Allievo</th><th>Corso</th><th>Moduli letti</th><th>Quiz superati</th><th>Fase</th></tr></thead><tbody>${allievi.map((a) => `<tr><td>${esc(nomeCompleto(a.allievo))}<br><small style="color:var(--text-muted)">${esc(a.allievo.grado)}</small></td><td>${esc(a.corso)}</td><td>${a.letti}/${a.moduli}</td><td>${a.quiz}/${a.moduli}</td><td>0${a.fase} di 04</td></tr>`).join('')}</tbody></table></div>`
    : '<div class="vuoto">Nessun allievo ha ancora iniziato un corso.</div>';
  html += `<h2 class="sez">Nuova sessione d’esame</h2><form class="card" data-form="sessione"><div class="grid2">
    <label class="campo">Corso<select name="corsoId" required>${corsi.map((c) => `<option value="${esc(c.id)}">${esc(c.titolo)}</option>`).join('')}</select></label>
    <label class="campo">Data e ora<input type="datetime-local" name="data" required></label>
    <label class="campo">Posti<input type="number" name="posti" min="1" max="50" value="4" required></label>
    <label class="campo">Luogo<input type="text" name="luogo" maxlength="120" placeholder="Es. Questura, piazzale"></label></div>
    <button class="btn" type="submit">Crea la sessione</button><div id="esito-az" style="margin-top:16px"></div></form>`;
  html += `<h2 class="sez">Riapri i tentativi di un quiz</h2><form class="card" data-form="reset"><div class="grid2">
    <label class="campo">ID Discord dell’allievo<input type="text" name="allievoId" inputmode="numeric" pattern="\\d{5,25}" required></label>
    <label class="campo">Corso<select name="corsoId" required>${corsi.map((c) => `<option value="${esc(c.id)}">${esc(c.titolo)}</option>`).join('')}</select></label>
    <label class="campo">Modulo (identificativo)<input type="text" name="moduloId" required placeholder="es. preparazione"></label></div>
    <button class="btn linea" type="submit">Azzera i tentativi</button><div id="esito-az2" style="margin-top:16px"></div></form>`;
  if (sel) {
    const p = coda.find((x) => x.id === sel);
    if (!p) html = avviso('Pratica non trovata o già conclusa.', 'err') + html;
    else {
      const g = await api(`/corsi/${p.corsoId}/pratica`);
      html =
        `<div class="card alto" style="margin-top:6px"><div class="eyebrow">Valutazione</div><h2 style="font-size:1.7rem;font-weight:800;margin:8px 0 4px">${esc(nomeCompleto(p.allievo))}</h2>
        <p style="color:var(--text-muted)">${esc(corsi.find((c) => c.id === p.corsoId)?.titolo || p.corsoId)} · ${esc(p.allievo.grado)}</p>
        <form data-form="esito" data-p="${esc(p.id)}" style="margin-top:20px">${g.criteri
          .map(
            (c) => `<fieldset class="crit"><legend><b>${esc(c.titolo)}</b></legend><small>${esc(c.descrizione || '')}</small><div class="livelli">${Object.entries(config.livelli)
              .map(([k, l]) => `<label><input type="radio" name="c_${esc(c.id)}" value="${k}" required>${esc(l)}</label>`)
              .join('')}</div></fieldset>`
          )
          .join('')}
        <label class="campo" style="margin-top:14px">Note per l’allievo<textarea name="note" maxlength="1500"></textarea></label>
        <div class="azioni"><button class="btn" type="submit" data-esito="superata">Esame superato</button><button class="btn rosso" type="submit" data-esito="da_ripetere">Da ripetere</button><a class="btn linea" href="#/istruttori">Annulla</a></div><div id="esito-az" style="margin-top:16px"></div></form></div>` + html;
    }
  }
  mostra('istruttori', html);
}

// ----- area admin -----
const SLUG = '[a-z0-9][a-z0-9-]{0,40}';
async function vistaAdmin(parti) {
  if (me.ruolo !== 'admin') return location.replace('#/');
  caricamento();
  const [, cid, tipo, a, b] = parti; // admin / corso / :cid / modulo|domanda / ...
  if (!cid) {
    const { corsi } = await api('/admin/corsi');
    return mostra('admin', `<h1 class="titolo">Area <span>admin</span></h1><p class="sottotitolo">Crea e modifica corsi, moduli, domande dei quiz e griglie di valutazione, e scegli da quale grado si vede ogni corso.</p>
      <div class="azioni"><a class="btn" href="#/admin/nuovo"><i class="fas fa-plus" aria-hidden="true"></i> Nuovo corso</a></div><h2 class="sez">Corsi</h2>${
        corsi.length
          ? `<ul class="righe">${corsi.map((c, i) => `<li><a class="riga" href="#/admin/${esc(c.id)}"><span class="n">${num(i)}</span><span class="t"><b>${esc(c.titolo)}</b><small>Visibile dal grado ${esc(c.gradoMinimo)} · ${c.pubblicato === false ? 'bozza' : 'pubblicato'}</small></span>${c.pubblicato === false ? '<span class="pill grigio">Bozza</span>' : pill('completato').replace('Completato', 'Pubblicato')}<i class="fas fa-arrow-right" aria-hidden="true"></i></a></li>`).join('')}</ul>`
          : '<div class="vuoto">Nessun corso. Creane uno.</div>'
      }`);
  }
  const nuovo = cid === 'nuovo';
  const { corsi } = await api('/admin/corsi');
  const corso = nuovo ? { titolo: '', descrizione: '', gradoMinimo: config.gradi[0], richiede: [], pubblicato: false, abilitazione: { nome: '', scadenzaMesi: 0 }, griglia: [] } : corsi.find((c) => c.id === cid);
  if (!corso) return mostra('admin', avviso('Corso non trovato.', 'err'));
  const crumb = (t2) => intestazione(esc(t2), '', []).replace(/<nav.*?<\/nav>/, '');
  if (!tipo) {
    const [{ moduli }, { domande }] = nuovo ? [{ moduli: [] }, { domande: [] }] : await Promise.all([api(`/admin/corsi/${cid}/moduli`), api(`/admin/corsi/${cid}/domande`)]);
    let html = `<nav class="crumbs" aria-label="Percorso"><a href="#/admin">Admin</a><span aria-hidden="true">›</span><span aria-current="page">${nuovo ? 'Nuovo corso' : esc(corso.titolo)}</span></nav><h1 class="titolo" style="font-size:clamp(1.8rem,4vw,2.8rem)">${nuovo ? 'Nuovo <span>corso</span>' : esc(corso.titolo)}</h1>`;
    html += `<form class="card" data-form="corso" data-nuovo="${nuovo ? 1 : 0}" style="margin-top:26px">
      ${nuovo ? `<label class="campo">Identificativo<small>Minuscole, numeri e trattini. Non si cambia dopo.</small><input type="text" name="id" required pattern="${SLUG}" placeholder="es. posto-di-blocco"></label>` : `<input type="hidden" name="id" value="${esc(cid)}">`}
      <label class="campo">Titolo<input type="text" name="titolo" required maxlength="120" value="${esc(corso.titolo)}"></label>
      <label class="campo">Descrizione<textarea name="descrizione" maxlength="1000">${esc(corso.descrizione || '')}</textarea></label>
      <div class="grid2"><label class="campo">Grado minimo (dal quale il corso è visibile)<select name="gradoMinimo">${config.gradi.map((g) => `<option ${g === corso.gradoMinimo ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></label>
      <label class="campo">Abilitazioni richieste<small>Identificativi dei corsi, separati da virgola.</small><input type="text" name="richiede" value="${esc((corso.richiede || []).join(', '))}"></label>
      <label class="campo">Nome dell’abilitazione<input type="text" name="abNome" maxlength="120" value="${esc((corso.abilitazione || {}).nome || '')}"></label>
      <label class="campo">Scadenza in mesi<small>0 = senza scadenza.</small><input type="number" name="abMesi" min="0" max="120" value="${esc((corso.abilitazione || {}).scadenzaMesi || 0)}"></label></div>
      <label class="check"><input type="checkbox" name="pubblicato" ${corso.pubblicato !== false ? 'checked' : ''}> Pubblicato (visibile agli allievi)</label>
      <h2 class="sez" style="margin-top:30px">Griglia dell’esame pratico</h2><div id="griglia-righe">${(corso.griglia || []).map((c) => rigaCriterio(c)).join('')}</div>
      <button type="button" class="btn linea piccolo" data-az="add-criterio"><i class="fas fa-plus" aria-hidden="true"></i> Aggiungi criterio</button>
      <div class="azioni"><button class="btn" type="submit">Salva il corso</button></div><div id="esito-az" style="margin-top:16px"></div></form>`;
    if (!nuovo) {
      html += `<h2 class="sez">Moduli</h2>${moduli.length ? `<ul class="righe">${moduli.map((m, i) => `<li><a class="riga" href="#/admin/${esc(cid)}/modulo/${esc(m.id)}"><span class="n">${num(i)}</span><span class="t"><b>${esc(m.titolo)}</b><small>Ordine ${m.ordine} · ${domande.filter((d) => d.moduloId === m.id).length} domande</small></span><i class="fas fa-arrow-right" aria-hidden="true"></i></a></li>`).join('')}</ul>` : '<div class="vuoto">Nessun modulo.</div>'}<div class="azioni"><a class="btn linea" href="#/admin/${esc(cid)}/modulo/nuovo"><i class="fas fa-plus" aria-hidden="true"></i> Nuovo modulo</a></div>`;
      html += `<h2 class="sez">Domande dei quiz</h2>${domande.length ? `<div class="scorri"><table><thead><tr><th>Modulo</th><th>Domanda</th><th>Tipo</th><th></th></tr></thead><tbody>${domande.map((d) => `<tr><td>${esc(d.moduloId)}</td><td>${esc(d.testo)}</td><td>${d.tipo === 'situazionale' ? 'Situazionale' : 'Standard'}</td><td><a class="testo-link" href="#/admin/${esc(cid)}/domanda/${esc(d.moduloId)}/${esc(d.id)}">Modifica</a></td></tr>`).join('')}</tbody></table></div>` : '<div class="vuoto">Nessuna domanda.</div>'}<div class="azioni"><a class="btn linea" href="#/admin/${esc(cid)}/domanda/${esc(moduli[0] ? moduli[0].id : 'nuovo')}/nuova"><i class="fas fa-plus" aria-hidden="true"></i> Nuova domanda</a></div>`;
    }
    return mostra('admin', html);
  }
  if (tipo === 'modulo') {
    const { moduli } = await api(`/admin/corsi/${cid}/moduli`);
    const nuovoM = a === 'nuovo';
    const m = nuovoM ? { titolo: '', ordine: moduli.length + 1, blocchi: [{ tipo: 'testo', testo: '' }], quiz: {} } : moduli.find((x) => x.id === a);
    if (!m) return mostra('admin', avviso('Modulo non trovato.', 'err'));
    const q = m.quiz || {};
    return mostra('admin', `<nav class="crumbs" aria-label="Percorso"><a href="#/admin">Admin</a><span aria-hidden="true">›</span><a href="#/admin/${esc(cid)}">${esc(corso.titolo)}</a><span aria-hidden="true">›</span><span aria-current="page">${nuovoM ? 'Nuovo modulo' : esc(m.titolo)}</span></nav>
      <h1 class="titolo" style="font-size:clamp(1.8rem,4vw,2.8rem)">${nuovoM ? 'Nuovo <span>modulo</span>' : esc(m.titolo)}</h1>
      <form class="card" data-form="modulo" data-c="${esc(cid)}" style="margin-top:26px">
      ${nuovoM ? `<label class="campo">Identificativo<input type="text" name="id" required pattern="${SLUG}" placeholder="es. preparazione"></label>` : `<input type="hidden" name="id" value="${esc(m.id)}">`}
      <div class="grid2"><label class="campo">Titolo<input type="text" name="titolo" required maxlength="120" value="${esc(m.titolo)}"></label><label class="campo">Ordine<input type="number" name="ordine" min="1" max="99" required value="${esc(m.ordine)}"></label></div>
      <h2 class="sez">Contenuto</h2><div id="blocchi">${(m.blocchi || []).map((b2) => rigaBlocco(b2)).join('')}</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px"><button type="button" class="btn linea piccolo" data-az="add-blocco" data-t="testo">+ Testo</button><button type="button" class="btn linea piccolo" data-az="add-blocco" data-t="immagine">+ Immagine</button><button type="button" class="btn linea piccolo" data-az="add-blocco" data-t="video">+ Video YouTube</button></div>
      <h2 class="sez">Quiz del modulo</h2><div class="grid2">
      <label class="campo">Soglia di superamento (%)<input type="number" name="soglia" min="1" max="100" value="${esc(q.soglia ?? 70)}"></label>
      <label class="campo">Domande estratte a ogni tentativo<input type="number" name="domande" min="1" max="100" value="${esc(q.domande ?? 5)}"></label>
      <label class="campo">Tentativi massimi<input type="number" name="maxTentativi" min="1" max="50" value="${esc(q.maxTentativi ?? 3)}"></label>
      <label class="campo">Attesa tra i tentativi (minuti)<input type="number" name="attesaMinuti" min="0" max="10080" value="${esc(q.attesaMinuti ?? 30)}"></label>
      <label class="campo">Durata (minuti)<input type="number" name="durataMinuti" min="1" max="240" value="${esc(q.durataMinuti ?? 30)}"></label></div>
      <div class="azioni"><button class="btn" type="submit">Salva il modulo</button></div><div id="esito-az" style="margin-top:16px"></div></form>`);
  }
  if (tipo === 'domanda') {
    const { moduli } = await api(`/admin/corsi/${cid}/moduli`);
    const { domande } = await api(`/admin/corsi/${cid}/domande`);
    const nuovaD = b === 'nuova';
    const d = nuovaD ? { moduloId: a === 'nuovo' ? '' : a, tipo: 'standard', testo: '', opzioni: [{ id: 'a', testo: '' }, { id: 'b', testo: '' }], corretta: 'a', spiegazione: '' } : domande.find((x) => x.moduloId === a && x.id === b);
    if (!d) return mostra('admin', avviso('Domanda non trovata.', 'err'));
    if (!moduli.length) return mostra('admin', avviso('Crea prima un modulo.', 'err'));
    return mostra('admin', `<nav class="crumbs" aria-label="Percorso"><a href="#/admin">Admin</a><span aria-hidden="true">›</span><a href="#/admin/${esc(cid)}">${esc(corso.titolo)}</a><span aria-hidden="true">›</span><span aria-current="page">${nuovaD ? 'Nuova domanda' : 'Domanda'}</span></nav>
      <h1 class="titolo" style="font-size:clamp(1.8rem,4vw,2.8rem)">${nuovaD ? 'Nuova <span>domanda</span>' : 'Modifica <span>domanda</span>'}</h1>
      <form class="card" data-form="domanda" data-c="${esc(cid)}" style="margin-top:26px">
      <div class="grid2">${nuovaD ? `<label class="campo">Identificativo<input type="text" name="id" required pattern="${SLUG}" placeholder="es. d1"></label>` : `<input type="hidden" name="id" value="${esc(d.id)}">`}
      <label class="campo">Modulo<select name="moduloId" ${nuovaD ? '' : 'disabled'}>${moduli.map((m) => `<option value="${esc(m.id)}" ${m.id === d.moduloId ? 'selected' : ''}>${esc(m.titolo)}</option>`).join('')}</select>${nuovaD ? '' : `<input type="hidden" name="moduloId" value="${esc(d.moduloId)}">`}</label>
      <label class="campo">Tipo<select name="tipo"><option value="standard" ${d.tipo !== 'situazionale' ? 'selected' : ''}>Standard</option><option value="situazionale" ${d.tipo === 'situazionale' ? 'selected' : ''}>Situazionale</option></select></label></div>
      <label class="campo">Testo della domanda<textarea name="testo" required maxlength="600">${esc(d.testo)}</textarea></label>
      <fieldset><legend class="eyebrow" style="margin-bottom:12px">Opzioni (da 2 a 6) · seleziona quella corretta</legend><div id="opzioni-righe">${d.opzioni.map((o, i) => rigaOpzione(o, d.corretta === o.id, i)).join('')}</div></fieldset>
      <button type="button" class="btn linea piccolo" data-az="add-opzione"><i class="fas fa-plus" aria-hidden="true"></i> Aggiungi opzione</button>
      <label class="campo" style="margin-top:20px">Spiegazione (mostrata se la risposta è sbagliata)<textarea name="spiegazione" maxlength="800">${esc(d.spiegazione || '')}</textarea></label>
      <div class="azioni"><button class="btn" type="submit">Salva la domanda</button></div><div id="esito-az" style="margin-top:16px"></div></form>`);
  }
}
const rigaCriterio = (c = { id: '', titolo: '', descrizione: '' }) => `<div class="riga-form" data-riga="criterio"><label class="campo">Identificativo<input type="text" data-k="id" pattern="${SLUG}" required value="${esc(c.id)}"></label><label class="campo">Criterio<input type="text" data-k="titolo" maxlength="140" required value="${esc(c.titolo)}"></label><label class="campo">Descrizione<input type="text" data-k="descrizione" maxlength="400" value="${esc(c.descrizione || '')}"></label><button type="button" class="btn rosso piccolo" data-az="rimuovi" aria-label="Rimuovi il criterio">Rimuovi</button></div>`;
const rigaBlocco = (b) => {
  const base = (inner) => `<div class="card" style="margin-bottom:12px;padding:18px" data-riga="blocco" data-t="${b.tipo}"><div class="eyebrow" style="margin-bottom:10px">${{ testo: 'Testo', immagine: 'Immagine', video: 'Video YouTube' }[b.tipo]}</div>${inner}<button type="button" class="btn rosso piccolo" data-az="rimuovi" aria-label="Rimuovi il blocco">Rimuovi</button></div>`;
  if (b.tipo === 'testo') return base(`<label class="campo"><span class="sr-only">Testo</span><textarea data-k="testo" maxlength="6000">${esc(b.testo || '')}</textarea></label>`);
  if (b.tipo === 'immagine') return base(`<label class="campo">Percorso dell’immagine<small>Dentro la cartella del sito, es. /assets/foto.webp</small><input type="text" data-k="src" value="${esc(b.src || '')}"></label><label class="campo">Descrizione (testo alternativo)<input type="text" data-k="alt" maxlength="200" value="${esc(b.alt || '')}"></label>`);
  return base(`<label class="campo">Link YouTube<input type="text" data-k="url" value="${esc(b.url || '')}"></label><label class="campo">Titolo del video<input type="text" data-k="titolo" maxlength="120" value="${esc(b.titolo || '')}"></label>`);
};
const rigaOpzione = (o, giusta, i) => `<div class="riga-form" data-riga="opzione" style="grid-template-columns:auto 1fr auto"><label class="check"><input type="radio" name="corretta" value="${'abcdef'[i]}" ${giusta ? 'checked' : ''} required><span class="sr-only">Opzione ${i + 1} corretta</span><b aria-hidden="true">${'ABCDEF'[i]}</b></label><label class="campo" style="margin:0"><span class="sr-only">Testo dell’opzione ${i + 1}</span><input type="text" data-k="testo" maxlength="300" required value="${esc(o.testo)}"></label><button type="button" class="btn rosso piccolo" data-az="rimuovi" aria-label="Rimuovi l’opzione">Rimuovi</button></div>`;

// ---------- eventi ----------
function esitoMsg(sel, html) {
  const el = document.getElementById(sel);
  if (el) el.innerHTML = html;
}
function raccogli(riga, selector = '[data-riga]') {
  return [...document.querySelectorAll(selector)].map((r) => Object.fromEntries([...r.querySelectorAll('[data-k]')].map((i) => [i.dataset.k, i.value])));
}

$app.addEventListener('click', async (ev) => {
  const t = ev.target.closest('[data-az]');
  if (!t) return;
  const az = t.dataset.az;
  try {
    if (az === 'esci') {
      await signOut(auth);
    } else if (az === 'letto') {
      t.disabled = true;
      await api(`/corsi/${t.dataset.c}/moduli/${t.dataset.m}/letto`, { method: 'POST', body: {} });
      location.hash = `#/corso/${t.dataset.c}/modulo/${t.dataset.m}/quiz`;
    } else if (az === 'vai') {
      Q.i = Number(t.dataset.i);
      disegnaQuiz();
    } else if (az === 'prec') {
      Q.i = Math.max(0, Q.i - 1);
      disegnaQuiz();
    } else if (az === 'prenota') {
      t.disabled = true;
      await api(`/corsi/${t.dataset.c}/pratica`, { method: 'POST', body: t.dataset.s ? { sessioneId: t.dataset.s } : {} });
      route();
    } else if (az === 'assegna') {
      t.disabled = true;
      await api(`/istruttori/pratiche/${t.dataset.p}/assegna`, { method: 'POST', body: {} });
      location.hash = `#/istruttori/${t.dataset.p}`;
    } else if (az === 'rimuovi') {
      t.closest('[data-riga]').remove();
    } else if (az === 'add-criterio') {
      document.getElementById('griglia-righe').insertAdjacentHTML('beforeend', rigaCriterio());
    } else if (az === 'add-blocco') {
      document.getElementById('blocchi').insertAdjacentHTML('beforeend', rigaBlocco({ tipo: t.dataset.t }));
    } else if (az === 'add-opzione') {
      const box = document.getElementById('opzioni-righe');
      if (box.children.length >= 6) return;
      box.insertAdjacentHTML('beforeend', rigaOpzione({ testo: '' }, false, box.children.length));
    }
  } catch (e) {
    if (e.status === 401 || e.status === 403) return mostraGate('negato');
    t.disabled = false;
    const box = document.getElementById('esito-az');
    if (box) box.innerHTML = avviso(esc(e.message), 'err', 'fa-triangle-exclamation');
    else alert(e.message);
  }
});

$app.addEventListener('change', (ev) => {
  if (ev.target.name === 'r' && Q) {
    Q.risp[Q.domande[Q.i].id] = ev.target.value;
    const b = document.getElementById('conferma');
    if (b) b.disabled = false;
    const g = $app.querySelectorAll('.griglia li')[Q.i];
    if (g) g.classList.add('data');
  }
});

$app.addEventListener('submit', async (ev) => {
  const f = ev.target.closest('[data-form]');
  if (!f) return;
  ev.preventDefault();
  const k = f.dataset.form;
  const out = f.querySelector('#esito-az') || document.getElementById('esito-az');
  const ok = (m) => out && (out.innerHTML = avviso(m, 'ok', 'fa-circle-check'));
  const ko = (e) => out && (out.innerHTML = avviso(esc(e.message), 'err', 'fa-triangle-exclamation'));
  const fd = new FormData(f);
  try {
    if (k === 'quiz') {
      const q = Q.domande[Q.i];
      if (!Q.risp[q.id]) return;
      if (Q.i < Q.domande.length - 1) {
        Q.i++;
        disegnaQuiz();
      } else {
        const mancanti = Q.domande.filter((d) => !Q.risp[d.id]).length;
        if (mancanti && !confirm(`Hai ${mancanti} ${mancanti === 1 ? 'domanda' : 'domande'} senza risposta (contano come sbagliate). Consegnare comunque?`)) return;
        await consegna();
      }
    } else if (k === 'sessione') {
      const ms = new Date(fd.get('data')).getTime();
      await api('/istruttori/sessioni', { method: 'POST', body: { corsoId: fd.get('corsoId'), data: ms, posti: Number(fd.get('posti')), luogo: fd.get('luogo') } });
      ok('Sessione creata.');
      f.reset();
    } else if (k === 'reset') {
      const r = await api('/istruttori/reset-tentativi', { method: 'POST', body: { allievoId: fd.get('allievoId'), corsoId: fd.get('corsoId'), moduloId: fd.get('moduloId') } });
      document.getElementById('esito-az2').innerHTML = avviso(`Tentativi azzerati: ${r.rimossi}.`, 'ok', 'fa-circle-check');
    } else if (k === 'esito') {
      const esito = ev.submitter ? ev.submitter.dataset.esito : '';
      const valutazioni = [...f.querySelectorAll('.crit')].map((c) => ({ criterioId: c.querySelector('input').name.slice(2), livello: (c.querySelector('input:checked') || {}).value }));
      await api(`/istruttori/pratiche/${f.dataset.p}/esito`, { method: 'POST', body: { esito, valutazioni, note: fd.get('note') } });
      location.hash = '#/istruttori';
    } else if (k === 'corso') {
      const id = fd.get('id');
      const body = {
        titolo: fd.get('titolo'), descrizione: fd.get('descrizione'), gradoMinimo: fd.get('gradoMinimo'),
        richiede: String(fd.get('richiede') || '').split(',').map((s) => s.trim()).filter(Boolean),
        pubblicato: fd.get('pubblicato') === 'on',
        abilitazione: { nome: fd.get('abNome') || fd.get('titolo'), scadenzaMesi: Number(fd.get('abMesi') || 0) },
        griglia: raccogli(f, '[data-riga="criterio"]'),
      };
      await api(`/admin/corsi/${id}`, { method: 'PUT', body });
      if (f.dataset.nuovo === '1') location.hash = `#/admin/${id}`;
      else ok('Corso salvato.');
    } else if (k === 'modulo') {
      const cid = f.dataset.c;
      const blocchi = [...f.querySelectorAll('[data-riga="blocco"]')].map((r) => ({ tipo: r.dataset.t, ...Object.fromEntries([...r.querySelectorAll('[data-k]')].map((i) => [i.dataset.k, i.value])) }));
      const body = { titolo: fd.get('titolo'), ordine: Number(fd.get('ordine')), blocchi, quiz: { soglia: Number(fd.get('soglia')), domande: Number(fd.get('domande')), maxTentativi: Number(fd.get('maxTentativi')), attesaMinuti: Number(fd.get('attesaMinuti')), durataMinuti: Number(fd.get('durataMinuti')) } };
      await api(`/admin/corsi/${cid}/moduli/${fd.get('id')}`, { method: 'PUT', body });
      ok('Modulo salvato.');
    } else if (k === 'domanda') {
      const cid = f.dataset.c;
      const righe = [...f.querySelectorAll('[data-riga="opzione"]')];
      const opzioni = righe.map((r, i) => ({ id: 'abcdef'[i], testo: r.querySelector('[data-k="testo"]').value }));
      const idx = righe.findIndex((r) => r.querySelector('input[type=radio]').checked);
      const body = { tipo: fd.get('tipo'), testo: fd.get('testo'), opzioni, corretta: idx >= 0 ? 'abcdef'[idx] : '', spiegazione: fd.get('spiegazione') };
      await api(`/admin/corsi/${cid}/domande/${fd.get('moduloId')}/${fd.get('id')}`, { method: 'PUT', body });
      ok('Domanda salvata.');
    }
  } catch (e) {
    if (e.status === 401) return mostraGate('');
    ko(e);
    const b = f.querySelector('[type=submit]');
    if (b) b.disabled = false;
  }
});

// ---------- router ----------
async function route() {
  if (!me) return;
  const h = (location.hash || '#/').replace(/^#\/?/, '');
  const p = h.split('/').filter(Boolean);
  Q = Q && p[2] === 'modulo' && p[4] === 'quiz' ? Q : null;
  try {
    if (!p.length) await vistaHome();
    else if (p[0] === 'corso' && p[1] && p[2] === 'modulo' && p[3] && p[4] === 'quiz') await vistaQuiz(p[1], p[3]);
    else if (p[0] === 'corso' && p[1] && p[2] === 'modulo' && p[3]) await vistaModulo(p[1], p[3]);
    else if (p[0] === 'corso' && p[1] && p[2] === 'pratica') await vistaPratica(p[1]);
    else if (p[0] === 'corso' && p[1]) await vistaCorso(p[1]);
    else if (p[0] === 'percorso') await vistaPercorso();
    else if (p[0] === 'istruttori') await vistaIstruttori(p[1]);
    else if (p[0] === 'admin') await vistaAdmin(['admin', p[1] === 'nuovo' ? 'nuovo' : p[1], p[2], p[3], p[4]]);
    else await vistaHome();
  } catch (e) {
    erroreVista(e);
  }
}
window.addEventListener('hashchange', route);

onAuthStateChanged(auth, async (u) => {
  if (!u) return mostraGate('');
  try {
    caricamento();
    const [m, c] = await Promise.all([api('/me'), api('/config')]);
    me = m.me;
    config = c;
    document.title = 'Area Personale · SISFOR+ IPRP';
    route();
  } catch (e) {
    if (e.status === 403 || e.status === 401) return mostraGate(e.status === 403 ? 'negato' : '');
    // errore del server o di rete: l'accesso è riuscito, quindi non rimandare al login
    const motivo = e.status === 503 ? 'Il portale di formazione non è ancora attivo: manca la configurazione sul server.' : e.message || 'Impossibile contattare il server.';
    $app.innerHTML = `<div class="hero-gate"><h1 class="titolo">Area <span>Personale</span></h1>
      ${avviso(esc(motivo), 'err', 'fa-triangle-exclamation')}
      <p class="sottotitolo" style="margin:14px auto 0">Hai effettuato l’accesso, ma il servizio non risponde. Riprova tra poco.</p>
      <button class="btn" type="button" onclick="location.reload()" style="margin-top:22px"><i class="fas fa-rotate" aria-hidden="true"></i> Riprova</button></div>`;
  }
});
