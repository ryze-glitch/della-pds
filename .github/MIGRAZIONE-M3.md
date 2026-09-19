# Sito Polizia di Stato — Material Design 3

Note di manutenzione. Questa cartella (`.github/`) non viene pubblicata da Firebase Hosting.

## Struttura

- `css/m3.css` — tutto lo stile: colori, tipografia, componenti, pagine. Un solo foglio per tutto il sito.
- `js/site.js` — tema chiaro/scuro, header, drawer di navigazione, footer, ripple.
- `*.html` — contenuti delle pagine. Nessun CSS o JS di layout inline.
- Gli script `<script type="module">` di `login.html`, `dashboard.html` e `candidature.html` sono rimasti identici all'originale.

## Cose che si fanno spesso

**Aggiungere o cambiare una voce del menu**
Modifica l'array `NAV` all'inizio di `js/site.js`. Cambia header, drawer e footer di tutte le pagine.
Per le pagine, ogni file ha in cima `<site-header data-active="...">`: il valore deve coincidere con la `key` della voce.
Nel blocco `<noscript>` di ogni pagina c'è la stessa lista di link per chi ha JavaScript disattivato: aggiornala a mano.

**Cambiare il colore del sito**
1. Vai su https://m3.material.io/theme-builder e scegli il nuovo colore sorgente (oggi `#C9A24B`).
2. Sostituisci i blocchi di variabili `--md-sys-color-*` in cima a `css/m3.css` (sezione 1, tema chiaro, scuro e la copia dentro `@media (prefers-color-scheme: dark)`).
Il resto del foglio usa solo quei ruoli, quindi non serve altro.

**Aggiungere un'icona**
Le icone arrivano da Google Fonts e nell'URL di ogni pagina c'è l'elenco di quelle usate (`icon_names=...`, in ordine alfabetico).
Se usi una nuova icona (es. `settings`), aggiungila a quell'elenco in **tutte** le pagine, altrimenti compare il nome scritto a testo.
I nomi validi sono su https://fonts.google.com/icons (usa i nomi canonici, non gli alias).

**Dopo aver modificato `css/m3.css` o `js/site.js`**
Firebase mette in cache CSS e JS per un'ora. Incrementa la versione nei link di tutte le pagine:

    sed -i 's/m3.css?v=1/m3.css?v=2/; s/site.js?v=1/site.js?v=2/' *.html

## Componenti disponibili (classi)

- Bottoni: `.btn` + `.btn--filled | --tonal | --outlined | --text`, con `.btn--icon-start` / `.btn--icon-end` se c'è un'icona.
- Card: `.card` + `.card--elevated | --filled | --tonal | --outlined`.
- Liste: `.list` > `.list-item`.
- Sezioni: `.section`, `.container`, `.section-head` (con `--split` per titolo e testo affiancati).
- Contenuto affiancato: `.feature`, `.feature--reverse`, `.feature--panel`.
- Banner di chiusura: `.banner`.
- Tipografia: `.display-*`, `.headline-*`, `.title-*`, `.body-*`, `.label-*` (scala M3) e `.t-display` / `.t-headline` che crescono con la larghezza dello schermo.

## Firebase Hosting

`firebase.json` è invariato. Con `"public": "."` vengono pubblicati anche `launch.json` e `settings.local.json`;
se non ti servono online, aggiungili all'elenco `ignore`.
