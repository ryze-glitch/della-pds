// Scroll morbido (Lenis), agganciato al ciclo di GSAP così le animazioni allo scorrimento restano sincronizzate.
(function () {
  if (!window.Lenis || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  var l = new Lenis({ duration: 1.0, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.5 });
  window.__lenis = l;
  if (window.gsap && window.ScrollTrigger) {
    l.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { l.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    (function r(t) { l.raf(t); requestAnimationFrame(r); })(0);
  }
  // i link con #ancora scorrono in modo morbido
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    var el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); l.scrollTo(el, { offset: -90 }); }
  });
})();
