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


## Telegram (facoltativo)

Le pratiche possono essere inoltrate anche a un bot Telegram (es. `@sitepdsbot`), da solo o insieme a Discord:

```
npx wrangler secret put TELEGRAM_BOT_TOKEN   # token da @BotFather (NON metterlo in chat o nel repo)
npx wrangler secret put TELEGRAM_CHAT_ID     # ID della chat/gruppo che riceve le pratiche
npx wrangler deploy
```

Per ottenere il `TELEGRAM_CHAT_ID`: scrivi al bot (o aggiungilo a un gruppo) e apri
`https://api.telegram.org/bot<TOKEN>/getUpdates`: il valore è `message.chat.id`.
Se Telegram non risponde ma Discord sì, la pratica viene comunque accettata.


## Accesso con Google (accounts.google.com)

Se imposti `GOOGLE_CLIENT_ID`, il sito chiede di accedere con Google prima di inviare una richiesta.
L'accesso usa *Google Identity Services* (pagina `accounts.google.com`), **non Firebase**: il Worker
verifica la firma dell'ID token con le chiavi pubbliche di Google e inserisce nome ed e-mail nel log Discord/Telegram.

1. Console Google Cloud → *API e servizi* → *Credenziali* → *Crea credenziali* → *ID client OAuth* → tipo **Applicazione web**.
2. In *Origini JavaScript autorizzate* aggiungi `https://polizia-iprp.web.app` (e `https://polizia-iprp.firebaseapp.com`).
3. Copia l'ID client (finisce con `.apps.googleusercontent.com`), poi:
   ```
   npx wrangler secret put GOOGLE_CLIENT_ID
   ```
4. Schermata di consenso OAuth: nome app, e-mail di supporto; stato "In produzione" per far accedere chiunque.

Senza `GOOGLE_CLIENT_ID` l'accesso non è richiesto.

## Log degli aggiornamenti di stato

Quando un agente cambia lo stato di una pratica dall'area riservata, il sito chiama `POST /log` con il suo
token Firebase. Il Worker verifica il token e che l'utente sia un agente (leggendo `auth-sito` con il suo token),
poi scrive il log su Discord (`DISCORD_WEBHOOK_LOG`, altrimenti `DISCORD_WEBHOOK_DENUNCE`) e Telegram.
