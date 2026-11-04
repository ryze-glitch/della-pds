// Animazioni comuni: comparsa allo scorrimento, cambio vista nell'Area Personale e dissolvenza tra le pagine.
(function () {
  var ridotto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  root.classList.add('anim');
  if (!ridotto) {
    root.classList.add('tr-on');
    setTimeout(function () { root.classList.remove('tr-on'); }, 700);
    window.addEventListener('pageshow', function (e) { if (e.persisted) root.classList.remove('tr-out'); });
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(h)) return;
      var u; try { u = new URL(a.href, location.href); } catch (_) { return; }
      if (u.origin !== location.origin) return;
      if (u.pathname === location.pathname && u.search === location.search) return;
      e.preventDefault();
      root.classList.add('tr-out');
      location.href = u.href; // la vecchia pagina resta visibile finché la nuova non è pronta: l'animazione corre mentre carica
    });
    // precarica la pagina appena il cursore/dito si avvicina al link
    var gia = {};
    function precarica(e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self')) return;
      var u; try { u = new URL(a.href, location.href); } catch (_) { return; }
      if (u.origin !== location.origin || u.pathname === location.pathname || gia[u.pathname] || /^(mailto:|tel:)/i.test(a.getAttribute('href'))) return;
      gia[u.pathname] = 1;
      var l = document.createElement('link'); l.rel = 'prefetch'; l.href = u.href; l.as = 'document';
      document.head.appendChild(l);
    }
    document.addEventListener('mouseover', precarica, { passive: true });
    document.addEventListener('touchstart', precarica, { passive: true });
    document.addEventListener('focusin', precarica);
  }
  if (ridotto || !('IntersectionObserver' in window)) { root.classList.remove('anim'); return; }

  var io = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('in'); io.unobserve(v.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  function prepara(lista, passo) {
    var ritardo = 0;
    lista.forEach(function (el) {
      if (el.classList.contains('rv') || el.classList.contains('gs-reveal') || el.classList.contains('gs-card')) return;
      el.classList.add('rv');
      el.style.setProperty('--d', (ritardo * (passo || 0.08)).toFixed(2) + 's');
      ritardo = Math.min(ritardo + 1, 6);
      io.observe(el);
    });
  }

  // footer, fascia FAQ e voci delle pagine interne senza animazione propria
  prepara([].slice.call(document.querySelectorAll('.site-footer .sf-grid > *, .site-footer .sf-bar')), 0.1);
  prepara([].slice.call(document.querySelectorAll('.faq-bar li')), 0.1);
  prepara([].slice.call(document.querySelectorAll('.timeline-item, .gerarchia-item, .reparto-fb-card, .mezzo-card')), 0.07);

  // Area Personale e login: ogni volta che la vista cambia, i blocchi entrano uno dopo l'altro
  var app = document.getElementById('app');
  if (app) {
    var anima = function () {
      var figli = [].slice.call(app.children).filter(function (e) { return !e.classList.contains('caricamento'); });
      figli.forEach(function (el, i) {
        el.classList.remove('rv', 'in');
        el.classList.add('rv');
        el.style.setProperty('--d', Math.min(i, 6) * 0.07 + 's');
        requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
      });
    };
    var timer = null, ultimo = '';
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var firma = app.children.length + ':' + (app.firstElementChild ? app.firstElementChild.className : '');
        if (firma !== ultimo || !app.querySelector('.rv.in')) { ultimo = firma; anima(); }
      }, 30);
    }).observe(app, { childList: true });
  } else {
    // pagine semplici (es. login): i blocchi principali entrano subito, uno dopo l'altro
    var iniziali = [].slice.call(document.querySelectorAll('main > *, .login-card')).filter(function (e) { return !e.classList.contains('gs-reveal') && !e.classList.contains('rv'); });
    iniziali.forEach(function (el, i) {
      el.classList.add('rv');
      el.style.setProperty('--d', Math.min(i, 6) * 0.09 + 's');
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    });
  }

})();
