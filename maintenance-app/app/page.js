export default function MaintenancePage() {
  return (
    <main className="maint">
      <div className="maint-grid" aria-hidden="true" />
      <div className="maint-noise" aria-hidden="true" />

      <div className="maint-frame">
        <div className="maint-mark">
          <img
            className="maint-crest"
            src="/assets/iprp-xi-logo.png"
            alt="Stemma IPRP XI"
            width={672}
            height={717}
          />
          <span className="maint-kicker">IPRP — Aggiornamento in corso</span>
        </div>

        <h1 className="maint-headline">
          La nuova versione
          <br />
          sta arrivando.
        </h1>

        <p className="maint-sub">
          Il sito è offline per il rilascio di <strong>IPRP XI</strong>.
          Torniamo online a breve.
        </p>

        <div className="maint-rule" role="img" aria-label="Lavori in corso">
          <span className="maint-rule-fill" />
        </div>

        <div className="maint-foot">
          <span>Polizia di Stato — Italian Paradise RP</span>
          <span className="maint-tag">XI</span>
        </div>
      </div>
    </main>
  );
}
