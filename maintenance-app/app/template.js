// Il template si rimonta a ogni navigazione: l'animazione di ingresso
// riparte a ogni cambio di pagina (dissolvenza + leggera salita).
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
