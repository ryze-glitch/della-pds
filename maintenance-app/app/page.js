export default function MaintenancePage() {
  return (
    <main className="maint">
      <div className="maint-aurora" aria-hidden="true">
        <span className="blob blob--a" />
        <span className="blob blob--b" />
        <span className="blob blob--c" />
      </div>

      <div className="maint-card">
        <div className="maint-logo-wrap">
          <span className="maint-logo-glow" aria-hidden="true" />
          <img
            className="maint-logo"
            src="/assets/iprp-xi-logo.png"
            alt="Stemma IPRP XI"
            width={672}
            height={717}
          />
        </div>

        <p className="maint-eyebrow">
          <span className="maint-dot" aria-hidden="true" />
          Aggiornamento in corso
        </p>

        <h1 className="maint-title">IPRP XI</h1>

        <p className="maint-body">
          Stiamo lavorando al rilascio della nuova versione del sito.
          Il ritorno online è previsto a breve: grazie per la pazienza.
        </p>

        <div className="maint-progress" role="img" aria-label="Lavori in corso">
          <span className="maint-progress-bar" />
        </div>

        <p className="maint-footer">Polizia di Stato — Italian Paradise RP</p>
      </div>
    </main>
  );
}
