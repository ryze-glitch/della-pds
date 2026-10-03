// Applica il tema salvato PRIMA del primo paint, per evitare il lampo
// del tema sbagliato. Eseguito come script inline e sincrono in <head>.
const code = `
(function () {
  try {
    var stored = localStorage.getItem('pds-theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
