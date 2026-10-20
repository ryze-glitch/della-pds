// Eseguito subito in <head>: applica il tema scelto (niente lampo),
// marca la pagina "con JS" per le animazioni e, se per qualche motivo
// gli script non partono, dopo 6s sblocca comunque i contenuti.
const code = `
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('pds-theme');
    if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
  } catch (e) {}
  setTimeout(function () { if (!window.__introDone) d.classList.add('anim-failsafe'); }, 6000);
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
