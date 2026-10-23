# Sportello Telematico — Worker Discord

Riceve i moduli del portale (denuncia, porto d'armi, colloquio), li valida lato
server, genera il codice pratica `POL-AAAA-XXXXXX` e invia un **embed** sul canale
Discord della fazione. Il webhook Discord resta nei secret del Worker: non è mai
nel sito.

## Setup (una volta sola)

```bash
cd workers/sportello
npm install
npx wrangler login

# 1. Webhook: Discord → Impostazioni canale → Integrazioni → Webhook → Copia URL
npx wrangler secret put DISCORD_WEBHOOK_DENUNCE
npx wrangler secret put DISCORD_WEBHOOK_PDA
npx wrangler secret put DISCORD_WEBHOOK_COLLOQUI

# 2. (facoltativo) ruolo da taggare nell'embed: ID ruolo (modalità sviluppatore)
npx wrangler secret put DISCORD_ROLE_DENUNCE
npx wrangler secret put DISCORD_ROLE_PDA
npx wrangler secret put DISCORD_ROLE_COLLOQUI

# 3. Pubblica
npx wrangler deploy
```

Il Worker risponde su `https://iprp-sportello.<tuo-account>.workers.dev`. Se l'URL è
diverso da quello di default, impostalo prima del build del sito con
`NEXT_PUBLIC_SPORTELLO_API=https://...` (oppure modifica `portal/lib/sportello.js`).

Verifica: `GET /health` mostra quali webhook sono configurati.

## Sicurezza

- CORS solo per le origini in `ALLOWED_ORIGINS` (`wrangler.toml`).
- Validazione lato server con le **stesse** regole del client (`portal/lib/forms.js`).
- Honeypot anti-bot, limite 6 richieste / 10 min per IP (per isolate; per un limite
  globale usa Cloudflare Rate Limiting o Turnstile).
- L'URL del webhook deve essere un vero URL Discord (anti-SSRF).
- `allowed_mentions` vuoto: nessun `@everyone` possibile dal testo degli utenti.

## Test

```bash
npm test
```

## Stesso handler come route Next.js (hosting Node, non Firebase Hosting statico)

`src/handler.js` usa solo API standard. Su un hosting con runtime Node basta:

```js
// app/api/sportello/[form]/route.js
import { handleRequest } from '@/workers/sportello/src/handler';
export const POST = (req) => handleRequest(req, process.env);
export const OPTIONS = POST;
```

(Con `output: 'export'`, come oggi su Firebase Hosting, le route API non sono
supportate: per questo il Worker.)
