# Questura IPRP XI — UI fedele al layout DidUP (prototipo v2)

Questa è una replica **grafica nuova** delle proporzioni e dell'impostazione visiva del portale Argo DidUP Famiglia del materiale fornito dall'utente, adattata all'attuale sito pubblico `https://polizia-iprp.web.app/`.

## Avvio

Apri `index.html` nel browser. Funziona localmente senza installazioni, server o backend; il font Poppins viene caricato da Google Fonts se disponibile, altrimenti si utilizza un font di sistema.

## Elementi riprodotti dal riferimento

- Barra superiore fissa, altezza 60 px.
- Barra laterale fissa, larghezza 256 px e modalità compatta (rail).
- Palette di riferimento: sfondo #EEF5F9, turchese #00A4B8, grigio scuro #2A3547, schede bianche.
- Schede ombreggiate e arrotondate, tipografia compatta.
- Dashboard in tre colonne, come le sei schede distribuite nella schermata DidUP caricata: riepilogo, calendario, bacheca, sportello, promemoria, attività.
- Interazioni: navigazione via hash, filtri e ricerca bacheca, pulsanti settimana/giorno, tema chiaro/scuro, barra laterale comprimibile, menu mobile, notifiche dimostrative.

## Contenuti IPRP XI

L'architettura delle sezioni segue il sito già online: Sportello telematico (denuncia, porto d'armi, colloquio, stato pratica), Comunicati, Reclutamento, Organigramma, Reparti, Gradi, Area Agenti. Dove ha senso sono presenti link diretti alle pagine online.

## Cosa NON fa

- Non sostituisce né modifica il sito `polizia-iprp.web.app`.
- I form sono solo grafici: **nessun dato è inviato o memorizzato**.
- Non implementa login OAuth Discord, Firebase, database, turni, pratica reale, notifiche vere.
- Non riutilizza il logo Argo, codice minificato, dati personali o screenshot della pagina DidUP archiviata.
- Non è una copia pixel-perfect: per arrivare al match visivo finale è utile confrontare schermate a identica dimensione/zoom e rifinire.

## Prossimo passo tecnico

Inserire questo tema in una nuova app **Vue 3 + Vuetify** e collegarla al backend già esistente. Non costruire un'autenticazione finta: mantenere il login del portale attuale e adottare API e permessi corretti.

Progetto FiveM roleplay indipendente e non affiliato alla Polizia di Stato italiana.
