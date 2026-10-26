# Modalità manutenzione

Il sito online è servito da una sola cartella, scelta da `hosting.public` in `firebase.json`:

| Cartella       | Contenuto                                              |
| -------------- | ------------------------------------------------------ |
| `maintenance/` | schermata "IPRP XI — Sito in manutenzione" (Next.js)   |
| `coming-soon/` | pagina semplice "Sito in Arrivo a Breve..." (file caricato dal proprietario) |
| `site/`        | export statico del sito completo (da `portal/out`)     |

Ora è online il **sito completo** (`"public": "site"`).
Per metterlo in pausa imposta `"public": "coming-soon"` (o `"maintenance"`) e aggiungi sotto `hosting` il blocco
`"rewrites": [{ "source": "**", "destination": "/index.html" }]`, togliendo i `redirects`.

## Rimettere online il sito completo

1. (se serve) rigenera il sito: `cd portal && npm run build`, poi sostituisci il contenuto di `site/` con `portal/out/`.
2. In `firebase.json` imposta `"public": "site"`, togli il blocco `"rewrites"` e rimetti i `"redirects"` delle vecchie pagine
   (`/chi-siamo`, `/reparti`, `/qualifiche` → `/organigramma`, `/concorso` → `/reclutamento`, `/prenota` → `/sportello`).
3. Commit e push su `main`: il deploy parte da solo.
