// Menu a comparsa della barra del sito (schermi stretti): ricostruito dalle voci già presenti in .nav-center.
(function () {
  var wrap = document.getElementById('navbar') || document.querySelector('.navbar-wrapper');
  if (!wrap) return;
  var burger = wrap.querySelector('.nav-burger');
  var centro = wrap.querySelector('.nav-center');
  if (!burger || !centro) return;
  var pannello = document.createElement('div');
  pannello.className = 'nav-panel';
  pannello.id = 'nav-panel';
  pannello.setAttribute('aria-label', 'Menu');
  centro.querySelectorAll('a').forEach(function (a) {
    var href = a.getAttribute('href');
    var testo = a.textContent.replace(/\s+/g, ' ').trim();
    if (!testo) return;
    var l = document.createElement('a');
    l.href = href || '#';
    l.textContent = testo;
    if (a.closest('.dropdown-menu')) l.className = 'sub';
    else if (a.classList.contains('active-link')) l.className = 'active-link';
    if (href === '#') { l.removeAttribute('href'); l.style.opacity = '.7'; l.style.pointerEvents = 'none'; }
    pannello.appendChild(l);
  });
  wrap.appendChild(pannello);
  burger.addEventListener('click', function () {
    var aperto = pannello.classList.toggle('open');
    burger.setAttribute('aria-expanded', aperto ? 'true' : 'false');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pannello.classList.remove('open'); });
})();
