// Applica il tema scelto prima del primo paint (evita il lampo).
const code = `
(function () {
  document.documentElement.classList.add('js');
  try {
    var t = localStorage.getItem('pds-theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
