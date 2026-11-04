// Sessione dell'Area Personale: ricorda chi ha fatto l'accesso con Discord per 12 ore
// e mostra la sua foto nella barra del sito al posto di «Area Personale».
(function () {
  var CHIAVE = 'iprp-sessione';
  var DURATA = 12 * 60 * 60 * 1000;
  function leggi() {
    try { var s = JSON.parse(localStorage.getItem(CHIAVE) || 'null'); return s && s.uid && s.inizio ? s : null; } catch (e) { return null; }
  }
  function scaduta(s) { s = s || leggi(); return !s || Date.now() - s.inizio > DURATA; }
  function valida() { var s = leggi(); return s && !scaduta(s) ? s : null; }
  function svuota() { try { localStorage.removeItem(CHIAVE); } catch (e) { /* storage non disponibile */ } }
  function salva(d) { try { localStorage.setItem(CHIAVE, JSON.stringify({ uid: d.uid, nome: d.nome || '', avatar: d.avatar || '', inizio: Date.now() })); } catch (e) { /* storage non disponibile */ } }
  window.IPRPSessione = { leggi: leggi, valida: valida, scaduta: scaduta, svuota: svuota, salva: salva, DURATA: DURATA };

  // Barra del sito: se c'è una sessione valida il pulsante diventa subito la foto dell'agente.
  function barra() {
    var a = document.querySelector('.navbar-wrapper .nav-area');
    if (!a) return;
    var s = valida();
    if (!s) { if (leggi()) svuota(); return; }
    if (!s.avatar) return;
    var vecchio = a.innerHTML;
    var img = new Image();
    img.alt = ''; img.decoding = 'async'; img.width = 40; img.height = 40; img.src = s.avatar;
    img.onerror = function () { a.classList.remove('nav-area-foto'); a.innerHTML = vecchio; };
    a.classList.add('nav-area-foto');
    a.setAttribute('aria-label', 'Apri la tua Area Personale' + (s.nome ? ' (' + s.nome + ')' : ''));
    a.setAttribute('title', s.nome ? s.nome + ' · Area Personale' : 'Area Personale');
    a.innerHTML = '';
    a.appendChild(img);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', barra); else barra();
})();
