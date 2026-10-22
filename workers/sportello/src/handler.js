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

export function buildEmbed(form, clean, code) {
  const fields = [
    { name: 'Codice pratica', value: `\`${code}\``, inline: true },
    { name: 'Tipo', value: form.title, inline: true },
  ];
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

export async function handleRequest(request, env = {}) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGINS ? String(env.ALLOWED_ORIGINS).split(',').map((s) => s.trim()) : DEFAULT_ORIGINS;
  const originOk = !!origin && allowed.includes(origin);
  const cors = originOk ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : { Vary: 'Origin' };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...cors, 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' },
    });
  }

  if (url.pathname === '/health') {
    const configured = {};
    for (const f of Object.values(FORMS)) configured[f.id] = WEBHOOK_RE.test(env[`DISCORD_WEBHOOK_${f.discord.channel}`] || '');
    return json({ ok: true, configured }, 200, cors);
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

  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimited(ip, Date.now())) return json({ error: 'Troppe richieste ravvicinate. Riprova tra qualche minuto.' }, 429, cors, { 'Retry-After': '300' });

  const { errors, clean } = validate(form.id, body);
  if (Object.keys(errors).length) return json({ error: 'Controlla i campi evidenziati.', fields: errors }, 422, cors);

  const channel = form.discord.channel;
  const webhook = env[`DISCORD_WEBHOOK_${channel}`];
  if (!webhook || !WEBHOOK_RE.test(webhook)) {
    return json({ error: 'Lo Sportello non è ancora collegato a Discord. Contatta un amministratore del server.' }, 503, cors);
  }

  const code = genCode();
  const role = /^\d{5,25}$/.test(env[`DISCORD_ROLE_${channel}`] || '') ? env[`DISCORD_ROLE_${channel}`] : null;
  const payload = {
    username: 'Sportello Telematico IPRP',
    content: `${role ? `<@&${role}> ` : ''}Nuova pratica **${code}** — ${form.title}`,
    embeds: [buildEmbed(form, clean, code)],
    allowed_mentions: role ? { parse: [], roles: [role] } : { parse: [] },
  };

  let res;
  try {
    res = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (e) {
    return json({ error: 'Invio non riuscito, riprova tra poco.' }, 502, cors);
  }
  if (!res.ok) {
    console.error('Discord webhook error', res.status);
    return json({ error: 'Invio non riuscito, riprova tra poco.' }, 502, cors);
  }
  return json({ ok: true, code }, 200, cors);
}
