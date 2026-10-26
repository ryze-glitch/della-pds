// Handler dello Sportello Telematico IPRP.
// Usa solo API standard (Request/Response/fetch/crypto): gira identico come
// Cloudflare Worker (src/index.js) o come route handler Next.js su hosting
// Node (vedi README). Il webhook Discord vive SOLO nelle variabili d'ambiente.
import { FORMS, validate, CODE_ALPHABET } from '../../../portal/lib/forms.js';

const DEFAULT_ORIGINS = [
  'https://polizia-iprp.web.app',
  'https://polizia-iprp.firebaseapp.com',
  'http://localhost:3000',
];
const MAX_BODY = 32 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 6;
const CODE_RE = /^POL-\d{4}-[A-HJ-NP-Z2-9]{6}$/;
const TG_TOKEN_RE = /^\d{6,12}:[\w-]{30,}$/;
const TG_CHAT_RE = /^(-?\d{5,20}|@\w{4,})$/;
const WEBHOOK_RE = /^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;

// Rate limit "best effort" per isolate: basta contro abusi banali. Per un
// limite globale usare Cloudflare Rate Limiting / Turnstile.
const hits = new Map();

function json(body, status, cors, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors, ...extra },
  });
}

function genCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let s = '';
  for (const b of bytes) s += CODE_ALPHABET[b % CODE_ALPHABET.length]; // 256 % 32 === 0: nessun bias
  return `POL-${new Date().getUTCFullYear()}-${s}`;
}

function rateLimited(ip, now) {
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  return list.length > RATE_MAX;
}

function chunk(text, size = 1000) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out.length ? out : ['—'];
}

export function buildEmbed(form, clean, code, account) {
  const fields = [
    { name: 'Codice pratica', value: `\`${code}\``, inline: true },
    { name: 'Tipo', value: form.title, inline: true },
  ];
  if (account) fields.push({ name: 'Account Google', value: account, inline: false });
  for (const section of form.sections) {
    for (const f of section.fields) {
      if (f.embed === false || f.type === 'checkbox') continue;
      const v = clean[f.name];
      if (!v) continue;
      const label = f.label.replace(/ — facoltativo/i, '').replace(/ \(facoltativo\)/i, '');
      if (v.length > 60 || f.type === 'textarea') {
        chunk(v).forEach((c, i) => fields.push({ name: i === 0 ? label : `${label} (continua)`, value: c, inline: false }));
      } else {
        fields.push({ name: label, value: v, inline: f.inline !== false });
      }
    }
  }
  return {
    title: `${form.discord.title} — ${code}`,
    description: form.discord.description,
    color: form.discord.color,
    fields: fields.slice(0, 25),
    timestamp: new Date().toISOString(),
    footer: { text: 'Sportello Telematico — Questura IPRP' },
  };
}

export function telegramConfigured(env) {
  return TG_TOKEN_RE.test(env.TELEGRAM_BOT_TOKEN || '') && TG_CHAT_RE.test(String(env.TELEGRAM_CHAT_ID || ''));
}

// Testo semplice (niente formattazione: i dati dei cittadini non devono essere interpretati).
export function buildTelegramText(form, clean, code, account) {
  const embed = buildEmbed(form, clean, code, account);
  const lines = [`Nuova pratica ${code} — ${form.title}`, ''];
  for (const f of embed.fields) {
    if (f.name === 'Codice pratica' || f.name === 'Tipo') continue;
    lines.push(`${f.name}: ${String(f.value).replace(/`/g, '')}`);
  }
  lines.push('', 'Sportello Telematico — Questura IPRP');
  return lines.join('\n').slice(0, 3900);
}

async function sendTelegram(env, text) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
  });
  if (!res.ok) {
    let why = '';
    try {
      why = (await res.json()).description || '';
    } catch (e) {
      /* corpo non JSON */
    }
    throw new Error(`telegram ${res.status} ${why}`.trim());
  }
}


// ---------------------------------------------------------------------------
// Verifica del token Firebase degli agenti (per /log) e Turnstile (anti-bot)
// ---------------------------------------------------------------------------
const FIREBASE_PROJECT = 'polizia-iprp';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const STATI = ['ricevuta', 'in_lavorazione', 'in_attesa', 'conclusa', 'respinta'];
const STATI_LABEL = { ricevuta: 'Ricevuta', in_lavorazione: 'In lavorazione', in_attesa: 'In attesa di documenti', conclusa: 'Conclusa', respinta: 'Respinta' };
const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const jwksCaches = {};

function b64urlToBytes(str) {
  const b = atob(str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '='));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}
function b64urlJson(str) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(str)));
}

async function getJwks(url, force = false) {
  const c = jwksCaches[url];
  if (!force && c && Date.now() - c.at < 3600e3) return c.keys;
  const res = await fetch(url);
  if (!res.ok) throw new Error('jwks');
  const { keys } = await res.json();
  jwksCaches[url] = { at: Date.now(), keys };
  return keys;
}

// Verifica la firma RS256 di un JWT con le chiavi pubbliche indicate; ritorna i claim (senza altri controlli).
async function verifyJwtSignature(token, jwksUrl) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  let header;
  let claims;
  try {
    header = b64urlJson(parts[0]);
    claims = b64urlJson(parts[1]);
  } catch (e) {
    return null;
  }
  if (header.alg !== 'RS256' || !header.kid) return null;
  // se la chiave non è in cache (rotazione) si riscarica l'elenco una volta
  let jwk = (await getJwks(jwksUrl)).find((k) => k.kid === header.kid);
  if (!jwk) jwk = (await getJwks(jwksUrl, true)).find((k) => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  return ok ? claims : null;
}

// Token Firebase (agenti): firma + iss/aud/exp.
export async function verifyFirebaseToken(token) {
  const claims = await verifyJwtSignature(token, JWKS_URL);
  if (!claims) return null;
  const now = Math.floor(Date.now() / 1000);
  if (claims.aud !== FIREBASE_PROJECT || claims.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT}`) return null;
  if (!claims.sub || typeof claims.sub !== 'string' || !(claims.exp > now) || claims.iat > now + 300) return null;
  return claims;
}

// ID token di "Accedi con Google" (accounts.google.com): firma + iss/aud/exp + email verificata.
export async function verifyGoogleIdToken(token, clientId) {
  if (!clientId) return null;
  const claims = await verifyJwtSignature(token, GOOGLE_JWKS_URL);
  if (!claims) return null;
  const now = Math.floor(Date.now() / 1000);
  if (claims.iss !== 'https://accounts.google.com' && claims.iss !== 'accounts.google.com') return null;
  if (claims.aud !== clientId || !claims.sub || !(claims.exp > now)) return null;
  if (claims.email_verified !== true && claims.email_verified !== 'true') return null;
  return claims;
}

// L'utente è un agente se riesce a leggere il proprio documento auth-sito
// (le regole Firestore lo consentono solo a lui, con il suo token).
async function agentInfo(claims, token) {
  const id = claims.sub.startsWith('discord:') ? claims.sub.slice(8) : null;
  if (!id || !/^\d{5,25}$/.test(id)) return null;
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/auth-sito/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const doc = await res.json();
  const f = doc.fields || {};
  const name = `${f.nome?.stringValue || ''} ${f.cognome?.stringValue || ''}`.trim();
  return { id, name: name || 'Agente' };
}

async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token || typeof token !== 'string' || token.length > 2048) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  if (ip && ip !== 'unknown') body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = await res.json();
    return data.success === true;
  } catch (e) {
    return false;
  }
}

// Messaggio di log (senza dati personali del cittadino) su Discord e/o Telegram.
async function postLog(env, text) {
  const tasks = [];
  const hook = env.DISCORD_WEBHOOK_LOG || env.DISCORD_WEBHOOK_DENUNCE;
  if (hook && WEBHOOK_RE.test(hook)) {
    tasks.push(
      fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Sportello Telematico IPRP', content: text, allowed_mentions: { parse: [] } }),
      }).then((r) => {
        if (!r.ok) throw new Error(`discord ${r.status}`);
      })
    );
  }
  if (telegramConfigured(env)) tasks.push(sendTelegram(env, text));
  const results = await Promise.allSettled(tasks);
  results.forEach((r) => r.status === 'rejected' && console.error('Log non inviato:', r.reason && r.reason.message));
  return results.some((r) => r.status === 'fulfilled');
}

export async function handleRequest(request, env = {}) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGINS ? String(env.ALLOWED_ORIGINS).split(',').map((s) => s.trim()) : DEFAULT_ORIGINS;
  const originOk = !!origin && allowed.includes(origin);
  const cors = originOk ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : { Vary: 'Origin' };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...cors, 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '86400' },
    });
  }

  if (url.pathname === '/health') {
    const configured = {};
    for (const f of Object.values(FORMS)) configured[f.id] = WEBHOOK_RE.test(env[`DISCORD_WEBHOOK_${f.discord.channel}`] || '');
    configured.telegram = telegramConfigured(env);
    return json({ ok: true, configured }, 200, cors);
  }

  if (url.pathname === '/config' && request.method === 'GET') {
    return json(
      {
        turnstileSiteKey: env.TURNSTILE_SITEKEY && env.TURNSTILE_SECRET ? String(env.TURNSTILE_SITEKEY) : null,
        googleClientId: env.GOOGLE_CLIENT_ID ? String(env.GOOGLE_CLIENT_ID) : null,
      },
      200,
      cors
    );
  }

  if (url.pathname === '/log' && request.method === 'POST') {
    if (!originOk) return json({ error: 'Origine non autorizzata.' }, 403, cors);
    const auth = request.headers.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    let claims = null;
    try {
      claims = await verifyFirebaseToken(token);
    } catch (e) {
      return json({ error: 'Verifica non riuscita.' }, 502, cors);
    }
    if (!claims) return json({ error: 'Non autorizzato.' }, 401, cors);
    const agent = await agentInfo(claims, token);
    if (!agent) return json({ error: 'Non autorizzato.' }, 403, cors);
    let b;
    try {
      b = JSON.parse(await request.text());
    } catch (e) {
      return json({ error: 'Formato non valido.' }, 400, cors);
    }
    const code = String((b && b.code) || '');
    if (!CODE_RE.test(code) || !STATI.includes(b.stato)) return json({ error: 'Dati non validi.' }, 422, cors);
    const nota = String(b.nota || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/@(everyone|here)/gi, '@\u200b$1').slice(0, 300);
    const assegn = b.assegnataA ? String(b.assegnataA).replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0, 60) : '';
    const text = `Pratica ${code} → ${STATI_LABEL[b.stato]} (agente: ${agent.name})${assegn ? `\nAssegnata a: ${assegn}` : ''}${nota ? `\nNota: ${nota}` : ''}`;
    const ok = await postLog(env, text);
    return ok ? json({ ok: true }, 200, cors) : json({ error: 'Log non inviato.' }, 502, cors);
  }

  const m = url.pathname.match(/^\/submit\/([a-z]+)$/);
  if (!m || request.method !== 'POST') return json({ error: 'Risorsa non trovata.' }, 404, cors);
  if (!originOk) return json({ error: 'Origine non autorizzata.' }, 403, cors);

  const form = FORMS[m[1]];
  if (!form) return json({ error: 'Modulo sconosciuto.' }, 404, cors);

  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return json({ error: 'Richiesta troppo grande.' }, 413, cors);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'Richiesta troppo grande.' }, 413, cors);

  let body;
  try {
    body = JSON.parse(raw);
  } catch (e) {
    return json({ error: 'Formato della richiesta non valido.' }, 400, cors);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Formato della richiesta non valido.' }, 400, cors);

  // Honeypot: i bot compilano il campo nascosto. Risposta "di successo" senza inoltro.
  if (typeof body.website === 'string' && body.website.trim() !== '') return json({ ok: true, code: genCode() }, 200, cors);

  // Accesso con Google (accounts.google.com) obbligatorio se il Worker ha GOOGLE_CLIENT_ID.
  let account = null;
  if (env.GOOGLE_CLIENT_ID) {
    let g = null;
    try {
      g = await verifyGoogleIdToken(body.googleToken, String(env.GOOGLE_CLIENT_ID));
    } catch (e) {
      return json({ error: 'Verifica dell’accesso non riuscita, riprova.' }, 502, cors);
    }
    if (!g) return json({ error: 'Accedi con il tuo account Google per inviare la richiesta.', needLogin: true }, 401, cors);
    const clean = (v) => String(v || '').replace(/[\u0000-\u001F\u007F`]/g, ' ').replace(/@(everyone|here)/gi, '@\u200b$1').slice(0, 80);
    account = `${clean(g.name)} <${clean(g.email)}>`.trim();
  }

  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
  if (!(await verifyTurnstile(env, body.turnstile, ip))) return json({ error: 'Verifica anti-bot non superata. Ricarica la pagina e riprova.' }, 403, cors);
  if (rateLimited(ip, Date.now())) return json({ error: 'Troppe richieste ravvicinate. Riprova tra qualche minuto.' }, 429, cors, { 'Retry-After': '300' });

  const { errors, clean } = validate(form.id, body);
  if (Object.keys(errors).length) return json({ error: 'Controlla i campi evidenziati.', fields: errors }, 422, cors);

  const channel = form.discord.channel;
  const webhook = env[`DISCORD_WEBHOOK_${channel}`];
  const discordOk = !!webhook && WEBHOOK_RE.test(webhook);
  const telegramOk = telegramConfigured(env);
  if (!discordOk && !telegramOk) {
    return json({ error: 'Lo Sportello non è ancora collegato. Contatta un amministratore del server.' }, 503, cors);
  }

  const code = genCode();
  const tasks = [];

  if (discordOk) {
    const role = /^\d{5,25}$/.test(env[`DISCORD_ROLE_${channel}`] || '') ? env[`DISCORD_ROLE_${channel}`] : null;
    const payload = {
      username: 'Sportello Telematico IPRP',
      content: `${role ? `<@&${role}> ` : ''}Nuova pratica **${code}** — ${form.title}`,
      embeds: [buildEmbed(form, clean, code, account)],
      allowed_mentions: role ? { parse: [], roles: [role] } : { parse: [] },
    };
    tasks.push(
      fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((res) => {
        if (!res.ok) throw new Error(`discord ${res.status}`);
      })
    );
  }
  if (telegramOk) tasks.push(sendTelegram(env, buildTelegramText(form, clean, code, account)));

  // La pratica è accettata se almeno un canale l'ha ricevuta.
  const results = await Promise.allSettled(tasks);
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('Inoltro pratica non riuscito:', r.reason && r.reason.message);
  });
  if (!results.some((r) => r.status === 'fulfilled')) return json({ error: 'Invio non riuscito, riprova tra poco.' }, 502, cors);
  return json({ ok: true, code }, 200, cors);
}
