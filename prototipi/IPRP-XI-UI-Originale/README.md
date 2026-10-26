# IPRP XI — Interfaccia originale recuperata

**Milestone 01: fedeltà visiva alla UI scura mostrata negli screenshot.**

## Avvio

Aprire `index.html` con Chrome/Edge. Non servono npm, Node, database o un server per l'anteprima.

In alternativa, nella cartella del progetto:

```bash
python -m http.server 8000
```

Aprire `http://localhost:8000`.

## Cosa è effettivamente presente

- La homepage riusa il markup e gli stili di produzione esportati dal browser (le misure, i colori, il font e le immagini non sono stati reinterpretati).
- Asset originali: stemma, immagini della Questura, icone del sito e font Poppins.
- Navigazione locale tramite URL con `#/...`, evidenziazione del menu e apertura mobile della sidebar.
- Pagina Denuncia online fedele all'impostazione degli screenshot, con stato di accesso visivo e modalità demo del modulo in tre passaggi.
- Pagine placeholder coerenti con la UI per Porto d'armi, Colloquio, Pratiche, Comunicati, Reclutamento, Organigramma, Area Agenti.
- Nessun dato inserito viene salvato o inviato.

## Cosa NON è presente

Lo ZIP di partenza è una **copia compilata di un sito Next.js**. Non contiene file originali `src/`, `app/`, `components/`, configurazioni delle API, credenziali o codice backend modificabile. Questo progetto NON costituisce il sorgente Next.js recuperato né una replica delle funzioni backend.

Google OAuth, Discord OAuth, invio denunce, recupero pratiche, bacheca online, gestione candidature e database sono **deliberatamente disabilitati** per la demo. Non sono disponibili account operativi.

## Struttura

```text
index.html                 markup reale della homepage, con Next.js runtime rimosso
_next/static/css/         CSS compilato del sito originale (ripulito nei percorsi font)
_next/static/media/       font originali
assets/                   stemma, foto, favicon originali
src/preview.css           integrazioni CSS per le pagine ricostruite
src/app.js                navigazione e interazioni locali dimostrative
```

## Per riprendere lo sviluppo autentico

Recuperare il repository Next.js originale (GitHub/GitLab o cartella di sviluppo contenente `package.json`, `app/` o `src/`). A quel punto mantenere direttamente i componenti originali, le integrazioni e il sistema di autenticazione, evitando un inutile rewrite completo. La presente anteprima serve a **congelare e verificare la direzione grafica**.

Il sito è un progetto di gioco di ruolo FiveM non affiliato ad alcuna istituzione reale.
