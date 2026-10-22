// Applica il tema scelto prima del primo paint, marca la pagina "con JS"
// per le animazioni e, se gli script non partono, sblocca i contenuti.
const code = `
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('pds-theme');
    if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
  } catch (e) {}
  setTimeout(function () { d.classList.add('anim-failsafe'); }, 5000);
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
