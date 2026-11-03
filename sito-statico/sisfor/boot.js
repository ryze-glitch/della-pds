// Schermata di caricamento dopo l'accesso con Discord. L'avanzamento è "finto" ma credibile: parte veloce, rallenta
// verso il 90% e arriva al 100% solo quando l'area è davvero pronta (done), restando visibile almeno 1,8 secondi.
(function () {
  var MSG = ['Verifica dell’identità…', 'Controllo della registrazione…', 'Preparazione dell’area personale…'];
  var MIN = 1800, el, barra, msg, timer, t0, ultimo = 0, chiuso = false;

  function sk(h, w) { return '<div class="sk" style="height:' + h + 'px' + (w ? ';width:' + w + 'px' : '') + '"></div>'; }

  function show() {
    if (el) return;
    el = document.createElement('div');
    el.className = 'boot';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', 'Accesso in corso');
    el.innerHTML =
      '<div class="boot-ombra" aria-hidden="true"><div class="boot-lato">' + sk(80) + sk(224) + sk(48) + '</div><div class="boot-col">' + sk(48, 288) +
      '<div class="boot-riga">' + sk(96) + sk(96) + sk(96) + '</div>' + sk(160) + '<div class="boot-riga">' + sk(190) + sk(190) + sk(190) + '</div></div></div>' +
      '<div class="boot-velo"></div>' +
      '<div class="boot-centro"><img src="/logo-iprp.png" alt="IPRP"><span class="boot-chip"><i></i>Accesso con Discord</span><p class="boot-msg"></p></div>' +
      '<div class="boot-barra"><b></b></div>';
    document.body.appendChild(el);
    barra = el.querySelector('.boot-barra b');
    msg = el.querySelector('.boot-msg');
    t0 = performance.now();
    imposta(0);
    timer = setInterval(function () {
      var x = Math.min(1, (performance.now() - t0) / 4200);
      imposta(Math.round((1 - Math.pow(1 - x, 2.2)) * 90));
    }, 80);
  }

  function imposta(p) {
    if (p < ultimo) p = ultimo;
    ultimo = p;
    barra.style.width = p + '%';
    msg.textContent = MSG[p < 34 ? 0 : p < 70 ? 1 : 2];
  }

  function chiudi() {
    if (!el || chiuso) return;
    chiuso = true;
    clearInterval(timer);
    imposta(100);
    var e = el;
    setTimeout(function () { e.classList.add('fuori'); setTimeout(function () { e.remove(); }, 550); }, 280);
  }

  // l'area è pronta: attende il tempo minimo, poi chiude
  function done() {
    if (!el) return;
    var resto = MIN - (performance.now() - t0);
    if (resto > 0) setTimeout(chiudi, resto); else chiudi();
  }

  // errore o schermata che richiede l'utente: via subito, senza finta
  function hide() {
    if (!el) return;
    chiuso = true;
    clearInterval(timer);
    el.remove();
    el = null;
  }

  window.IPRPBoot = { show: show, done: done, hide: hide };
})();
