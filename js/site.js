/* =====================================================================
   Polizia di Stato — Italian Paradise RP
   Comportamenti condivisi da tutte le pagine (nessuna dipendenza):
   1. tema chiaro / scuro / automatico con toggle
   2. header (top app bar + navigation drawer) e footer, definiti UNA volta
   3. ripple sui componenti interattivi
   Va incluso nell'<head> senza "defer": applica il tema prima del primo
   paint (evita il lampo di tema sbagliato) e registra gli elementi
   <site-header> e <site-footer> prima che il parser li incontri.
   ===================================================================== */
(function () {
  'use strict';

  var THEME_KEY = 'pds-theme';
  var root = document.documentElement;

  /* ---------------------------------------------------------------
     Voci di navigazione: modificale qui e cambiano su tutto il sito.
     --------------------------------------------------------------- */
  var NAV = [
    { key: 'home', href: '/home', label: 'Home', icon: 'home' },
    { key: 'notizie', href: '/notizie', label: 'Notizie', icon: 'newspaper' },
    { key: 'chi-siamo', href: '/chi-siamo', label: 'Chi Siamo', icon: 'local_police' },
    { key: 'qualifiche', href: '/qualifiche', label: 'Qualifiche', icon: 'military_tech' },
    { key: 'prenota', href: '/prenota', label: 'Prenota', icon: 'event' },
    { key: 'concorso', href: '/concorso', label: 'Concorso', icon: 'how_to_reg' },
  ];
  var AREA = { key: 'area', href: '/login', label: 'Area Personale', icon: 'person' };

  var THEMES = {
    auto: { icon: 'brightness_auto', label: 'automatico' },
    light: { icon: 'light_mode', label: 'chiaro' },
    dark: { icon: 'dark_mode', label: 'scuro' },
  };
  var THEME_ORDER = ['auto', 'light', 'dark'];

  /* ---------------------------------------------------------------
     1. TEMA
     --------------------------------------------------------------- */
  function readStored() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }
  function writeStored(mode) {
    try {
      if (mode === 'light' || mode === 'dark') localStorage.setItem(THEME_KEY, mode);
      else localStorage.removeItem(THEME_KEY);
    } catch (e) {
      /* storage non disponibile: il tema vale solo per la sessione */
    }
  }
  function currentMode() {
    var m = root.getAttribute('data-theme');
    return m === 'light' || m === 'dark' ? m : 'auto';
  }
  function syncThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    var c = getComputedStyle(root).getPropertyValue('--md-sys-color-surface').trim();
    if (c) meta.setAttribute('content', c);
  }
  function applyTheme(mode) {
    if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
    else root.removeAttribute('data-theme');
    syncThemeColor();
    var btn = document.getElementById('themeBtn');
    if (btn) paintThemeButton(btn);
  }
  function paintThemeButton(btn) {
    var t = THEMES[currentMode()];
    btn.querySelector('.icon').textContent = t.icon;
    btn.setAttribute('aria-label', 'Tema ' + t.label + '. Tocca per cambiare tema');
    btn.setAttribute('title', 'Tema ' + t.label);
  }

  applyTheme(readStored());
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemChange = function () {
      syncThemeColor();
    };
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }
  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY) applyTheme(e.newValue);
  });

  /* ---------------------------------------------------------------
     2. HEADER, DRAWER, FOOTER
     --------------------------------------------------------------- */
  function icon(name, extra) {
    return '<span class="icon' + (extra ? ' ' + extra : '') + '" aria-hidden="true">' + name + '</span>';
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      if (this.__ready) return;
      this.__ready = true;

      var active = this.getAttribute('data-active') || '';
      var areaActive = active === AREA.key;

      var pills = NAV.map(function (n) {
        return (
          '<a class="nav-pill" href="' +
          n.href +
          '"' +
          (n.key === active ? ' aria-current="page"' : '') +
          '>' +
          n.label +
          '</a>'
        );
      }).join('');

      var items = NAV.map(function (n) {
        return (
          '<a class="drawer-item" href="' +
          n.href +
          '"' +
          (n.key === active ? ' aria-current="page"' : '') +
          '>' +
          icon(n.icon) +
          n.label +
          '</a>'
        );
      }).join('');

      this.innerHTML =
        '<header class="top-app-bar" id="topAppBar">' +
        '<div class="top-app-bar__inner">' +
        '<button class="icon-btn menu-btn" type="button" id="menuBtn" aria-label="Apri il menu di navigazione" aria-haspopup="dialog" aria-expanded="false" aria-controls="navDrawer">' +
        icon('menu') +
        '</button>' +
        '<a class="brand" href="/home" aria-label="Polizia di Stato, vai alla home">' +
        '<img src="/assets/crest-sm.png" width="26" height="40" alt="" decoding="async">' +
        '<span>Polizia di Stato</span>' +
        '</a>' +
        '<nav class="top-nav" aria-label="Navigazione principale">' +
        pills +
        '</nav>' +
        '<div class="top-actions">' +
        '<button class="icon-btn" type="button" id="themeBtn">' +
        icon('brightness_auto') +
        '</button>' +
        '<a class="icon-btn person-btn" href="' +
        AREA.href +
        '" aria-label="' +
        AREA.label +
        '"' +
        (areaActive ? ' aria-current="page"' : '') +
        '>' +
        icon('person', areaActive ? 'icon--fill' : '') +
        '</a>' +
        '<a class="btn btn--icon-start ' +
        (areaActive ? 'btn--filled' : 'btn--tonal') +
        '" href="' +
        AREA.href +
        '"' +
        (areaActive ? ' aria-current="page"' : '') +
        '>' +
        icon('person', areaActive ? 'icon--fill' : '') +
        AREA.label +
        '</a>' +
        '</div>' +
        '</div>' +
        '</header>' +
        '<dialog class="nav-drawer" id="navDrawer" aria-label="Menu di navigazione">' +
        '<div class="drawer-head">' +
        '<img src="/assets/crest-sm.png" width="26" height="40" alt="" decoding="async">' +
        '<span>Polizia di Stato</span>' +
        '<button class="icon-btn" type="button" id="drawerClose" aria-label="Chiudi il menu">' +
        icon('close') +
        '</button>' +
        '</div>' +
        '<nav aria-label="Navigazione principale">' +
        items +
        '</nav>' +
        '<hr class="drawer-divider">' +
        '<div class="drawer-section">Riservato agli agenti</div>' +
        '<a class="drawer-item" href="' +
        AREA.href +
        '"' +
        (areaActive ? ' aria-current="page"' : '') +
        '>' +
        icon(AREA.icon) +
        AREA.label +
        '</a>' +
        '</dialog>';

      var bar = this.querySelector('#topAppBar');
      var drawer = this.querySelector('#navDrawer');
      var menuBtn = this.querySelector('#menuBtn');
      var closeBtn = this.querySelector('#drawerClose');
      var themeBtn = this.querySelector('#themeBtn');

      /* Stato di scroll: la barra passa da "surface" a "surface-container" */
      var onScroll = function () {
        bar.classList.toggle('is-scrolled', window.scrollY > 4);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      /* Navigation drawer modale (<dialog>: focus trap, Esc, top layer) */
      if (typeof drawer.showModal !== 'function') {
        menuBtn.hidden = true;
      } else {
        menuBtn.addEventListener('click', function () {
          drawer.showModal();
          menuBtn.setAttribute('aria-expanded', 'true');
        });
        closeBtn.addEventListener('click', function () {
          drawer.close();
        });
        drawer.addEventListener('click', function (e) {
          var r = drawer.getBoundingClientRect();
          var outside =
            e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
          if (outside) drawer.close();
        });
        drawer.addEventListener('close', function () {
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.focus();
        });
        window.addEventListener('resize', function () {
          if (drawer.open && window.innerWidth >= 1120) drawer.close();
        });
      }

      /* Toggle tema: automatico → chiaro → scuro */
      paintThemeButton(themeBtn);
      themeBtn.addEventListener('click', function () {
        var next = THEME_ORDER[(THEME_ORDER.indexOf(currentMode()) + 1) % THEME_ORDER.length];
        writeStored(next);
        applyTheme(next === 'auto' ? null : next);
      });
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      if (this.__ready) return;
      this.__ready = true;
      var explore = NAV.map(function (n) {
        return '<li><a class="footer-link" href="' + n.href + '">' + n.label + '</a></li>';
      }).join('');
      this.innerHTML =
        '<footer class="site-footer">' +
        '<div class="container">' +
        '<div class="footer-grid">' +
        '<div class="footer-brand">' +
        '<a class="brand" href="/home">' +
        '<img src="/assets/crest-sm.png" width="26" height="40" alt="" loading="lazy" decoding="async">' +
        '<span>Polizia di Stato</span>' +
        '</a>' +
        '<p class="body-medium">Sito ufficiale della Polizia di Stato — Italian Paradise RP. Progetto portfolio, contenuti a scopo dimostrativo per la community FiveM.</p>' +
        '</div>' +
        '<div class="footer-col"><h2>Esplora</h2><ul>' +
        explore +
        '</ul></div>' +
        '<div class="footer-col"><h2>Servizi</h2><ul>' +
        '<li><a class="footer-link" href="/prenota">Prenotazioni</a></li>' +
        '<li><a class="footer-link" href="/prenota">URP</a></li>' +
        '<li><a class="footer-link" href="/prenota">Porto d\'armi</a></li>' +
        '</ul></div>' +
        '<div class="footer-col"><h2>Community</h2><ul>' +
        '<li><a class="footer-link" href="#">Discord IPRP</a></li>' +
        '<li><a class="footer-link" href="#">Regolamento</a></li>' +
        '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
        '<span>© 2026 Polizia di Stato — Italian Paradise RP. Server FiveM, contenuti fittizi.</span>' +
        '<span>Termini &amp; Privacy</span>' +
        '</div>' +
        '</div>' +
        '</footer>';
    }
  }

  if (window.customElements) {
    if (!customElements.get('site-header')) customElements.define('site-header', SiteHeader);
    if (!customElements.get('site-footer')) customElements.define('site-footer', SiteFooter);
  }

  /* ---------------------------------------------------------------
     3. RIPPLE (M3): onda che parte dal punto di contatto
     --------------------------------------------------------------- */
  var RIPPLE_TARGETS =
    '.btn, .icon-btn, .nav-pill, .drawer-item, .card--link, .list-item--link, ' +
    '.chip--link, .carousel__item, .cand-head, .cand-btn, .footer-link, .quick-link';
  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  document.addEventListener(
    'pointerdown',
    function (e) {
      if (e.button > 0 || reduceMotion.matches) return;
      var el = e.target.closest ? e.target.closest(RIPPLE_TARGETS) : null;
      if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      var rect = el.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 2;
      var wave = document.createElement('span');
      wave.className = 'ripple';
      wave.style.width = wave.style.height = size + 'px';
      wave.style.left = e.clientX - rect.left - size / 2 + 'px';
      wave.style.top = e.clientY - rect.top - size / 2 + 'px';
      el.appendChild(wave);
      wave.addEventListener('animationend', function () {
        wave.remove();
      });
    },
    { passive: true },
  );

  /* Il tema colore della barra del browser va allineato quando il CSS è pronto */
  document.addEventListener('DOMContentLoaded', syncThemeColor);
})();
