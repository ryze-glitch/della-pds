// Si rimonta a ogni navigazione: dissolvenza d'ingresso a ogni cambio pagina.
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
