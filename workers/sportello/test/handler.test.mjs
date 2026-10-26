import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../src/handler.js';

const ORIGIN = 'https://polizia-iprp.web.app';
const WEBHOOK = 'https://discord.com/api/webhooks/123456789012345678/abc_DEF-123';
const env = { DISCORD_WEBHOOK_DENUNCE: WEBHOOK, DISCORD_ROLE_DENUNCE: '987654321012345678' };

const denunciaOk = {
  nome: 'Mario', cognome: 'Rossi', telefono: '555 0101', documento: 'AB12345', discord: 'mario#0001',
  reato: 'Furto', luogo: 'Via del Corso 12', data_fatti: '2026-10-01T21:30',
  dinamica: 'Mentre uscivo dal negozio un individuo mi ha sottratto la borsa e si è dato alla fuga a piedi verso il porto.',
  testimoni: '', prove: '', veridicita: true,
};

function req(path, { method = 'POST', body, origin = ORIGIN, ip = '1.1.1.1' } = {}) {
  return new Request(`https://worker.test${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': ip },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function mockDiscord(status = 204) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(null, { status });
  };
  return calls;
}

test('denuncia valida: inoltra un embed su Discord e restituisce il codice', async () => {
  const calls = mockDiscord();
  const res = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '10.0.0.1' }), env);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.match(data.code, /^POL-\d{4}-[A-HJ-NP-Z2-9]{6}$/);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, WEBHOOK);
  const payload = JSON.parse(calls[0].init.body);
  assert.match(payload.content, /<@&987654321012345678>/);
  assert.deepEqual(payload.allowed_mentions, { parse: [], roles: ['987654321012345678'] });
  const embed = payload.embeds[0];
  assert.ok(embed.title.includes(data.code));
  assert.ok(embed.timestamp);
  assert.ok(embed.fields.some((f) => f.name === 'Tipologia di reato' && f.value === 'Furto'));
  assert.ok(!embed.fields.some((f) => /veritieri/i.test(f.name)), 'le dichiarazioni non vanno nell’embed');
});

test('campi invalidi: 422 con errori per campo e nessun invio', async () => {
  const calls = mockDiscord();
  const res = await handleRequest(req('/submit/denuncia', { body: { ...denunciaOk, nome: '', dinamica: 'troppo corta', veridicita: false }, ip: '10.0.0.2' }), env);
  const data = await res.json();
  assert.equal(res.status, 422);
  assert.ok(data.fields.nome && data.fields.dinamica && data.fields.veridicita);
  assert.equal(calls.length, 0);
});

test('origine non autorizzata: 403', async () => {
  mockDiscord();
  const res = await handleRequest(req('/submit/denuncia', { body: denunciaOk, origin: 'https://evil.example', ip: '10.0.0.3' }), env);
  assert.equal(res.status, 403);
});

test('honeypot compilato: finto successo senza inoltro', async () => {
  const calls = mockDiscord();
  const res = await handleRequest(req('/submit/denuncia', { body: { ...denunciaOk, website: 'http://spam' }, ip: '10.0.0.4' }), env);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('webhook non configurato: 503', async () => {
  mockDiscord();
  const res = await handleRequest(req('/submit/pda', { body: {}, ip: '10.0.0.5' }), {});
  assert.equal(res.status, 422); // la validazione precede la configurazione
  const res2 = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '10.0.0.6' }), {});
  assert.equal(res2.status, 503);
});

test('webhook con URL non Discord rifiutato (anti-SSRF)', async () => {
  const calls = mockDiscord();
  const res = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '10.0.0.7' }), { DISCORD_WEBHOOK_DENUNCE: 'https://attacker.example/hook' });
  assert.equal(res.status, 503);
  assert.equal(calls.length, 0);
});

test('menzioni @everyone neutralizzate nel testo utente', async () => {
  const calls = mockDiscord();
  await handleRequest(req('/submit/denuncia', { body: { ...denunciaOk, luogo: 'Piazza @everyone e <@123>' }, ip: '10.0.0.8' }), env);
  const luogo = JSON.parse(calls[0].init.body).embeds[0].fields.find((f) => f.name === 'Luogo dei fatti').value;
  assert.ok(!/@everyone/.test(luogo) && !/<@/.test(luogo));
});

test('rate limit: dalla settima richiesta ravvicinata 429', async () => {
  mockDiscord();
  let last;
  for (let i = 0; i < 8; i++) last = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '10.9.9.9' }), env);
  assert.equal(last.status, 429);
});

test('errore Discord: 502 senza dettagli interni', async () => {
  mockDiscord(500);
  const res = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '10.0.0.10' }), env);
  assert.equal(res.status, 502);
});

test('PDA rinnovo richiede il numero precedente; colloquio con data passata respinto', async () => {
  mockDiscord();
  const pda = {
    tipo: 'Rinnovo', nome: 'Anna', cognome: 'Verdi', nascita: '1990-05-10', telefono: '555 0102', documento: 'CD98765',
    motivazione: 'Rinnovo del porto d’armi ad uso difesa personale per motivi lavorativi.', no_precedenti: true, visita_medica: true,
  };
  const r1 = await handleRequest(req('/submit/pda', { body: pda, ip: '10.0.1.1' }), env);
  assert.equal(r1.status, 422);
  assert.ok((await r1.json()).fields.numero_precedente);
  const r2 = await handleRequest(req('/submit/colloquio', { body: { nome: 'Luca', cognome: 'Bianchi', telefono: '555 0103', ufficio: 'Questore', data_preferita: '2020-01-01', fascia: 'Mattina (09:00–13:00)', motivo: 'Vorrei esporre una proposta di collaborazione.' }, ip: '10.0.1.2' }), env);
  assert.equal(r2.status, 422);
  assert.ok((await r2.json()).fields.data_preferita);
});

const TG = { TELEGRAM_BOT_TOKEN: '123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw_abc', TELEGRAM_CHAT_ID: '-1001234567890' };

test('Telegram: inoltro su Discord e Telegram insieme, senza menzioni e senza backtick', async () => {
  const calls = mockDiscord();
  const res = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '8.8.8.1' }), { ...env, ...TG });
  assert.equal(res.status, 200);
  const tg = calls.find((c) => c.url.startsWith('https://api.telegram.org/bot'));
  assert.ok(tg, 'chiamata a Telegram');
  const body = JSON.parse(tg.init.body);
  assert.equal(body.chat_id, '-1001234567890');
  assert.match(body.text, /Nuova pratica POL-\d{4}-[A-Z0-9]{6}/);
  assert.match(body.text, /Luogo dei fatti: Via del Corso 12/);
  assert.ok(!body.text.includes('`'));
  assert.ok(calls.some((c) => c.url === WEBHOOK), 'chiamata a Discord');
});

test('Telegram: funziona anche da solo (Discord non configurato)', async () => {
  const calls = mockDiscord();
  const res = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '8.8.8.2' }), TG);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  assert.ok(calls[0].url.startsWith('https://api.telegram.org/bot'));
});

test('Telegram in errore ma Discord ok: la pratica è accettata', async () => {
  globalThis.fetch = async (url) => new Response(null, { status: String(url).includes('telegram') ? 500 : 204 });
  const res = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '8.8.8.3' }), { ...env, ...TG });
  assert.equal(res.status, 200);
});

test('Telegram: token non valido ignorato (503 se Discord manca)', async () => {
  mockDiscord();
  const res = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '8.8.8.4' }), { TELEGRAM_BOT_TOKEN: 'x', TELEGRAM_CHAT_ID: '1' });
  assert.equal(res.status, 503);
});

// --- /log (aggiornamenti di stato dagli agenti) e Turnstile -----------------
import { webcrypto } from 'node:crypto';

const b64u = (buf) => Buffer.from(buf).toString('base64url');

async function makeToken({ sub = 'discord:123456789012345678', aud = 'polizia-iprp', iss = 'https://securetoken.google.com/polizia-iprp', exp, kid = 'k' + Math.random().toString(36).slice(2), tamper = false } = {}) {
  const pair = await webcrypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = { ...(await webcrypto.subtle.exportKey('jwk', pair.publicKey)), kid, alg: 'RS256', use: 'sig' };
  const now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: 'RS256', kid, typ: 'JWT' }));
  const payload = b64u(JSON.stringify({ sub, aud, iss, iat: now - 10, exp: exp || now + 3600 }));
  const sig = await webcrypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(`${head}.${payload}`));
  const token = `${head}.${payload}.${b64u(sig)}`;
  return { token: tamper ? token.slice(0, -4) + 'AAAA' : token, jwk };
}

function mockLogFetch({ jwk, agent = true }) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    url = String(url);
    calls.push({ url, init });
    if (url.includes('securetoken@system.gserviceaccount.com')) return new Response(JSON.stringify({ keys: [jwk] }), { status: 200 });
    if (url.includes('firestore.googleapis.com')) {
      return agent ? new Response(JSON.stringify({ fields: { nome: { stringValue: 'Marco' }, cognome: { stringValue: 'Ferrari' } } }), { status: 200 }) : new Response('{}', { status: 403 });
    }
    return new Response(null, { status: 204 });
  };
  return calls;
}

const logBody = { code: 'POL-2026-K7M2QX', stato: 'in_lavorazione', nota: 'Presa in carico' };
const logReq = (token, body = logBody) =>
  new Request('https://worker.test/log', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: ORIGIN, Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });

test('/log: agente valido → messaggio su Discord e Telegram con il suo nome', async () => {
  const { token, jwk } = await makeToken();
  const calls = mockLogFetch({ jwk });
  const res = await handleRequest(logReq(token), { ...env, ...TG });
  assert.equal(res.status, 200);
  const dc = calls.find((c) => c.url === WEBHOOK);
  assert.match(JSON.parse(dc.init.body).content, /POL-2026-K7M2QX → In lavorazione \(agente: Marco Ferrari\)/);
  assert.ok(calls.some((c) => c.url.startsWith('https://api.telegram.org/bot')));
});

test('/log: token manomesso, scaduto o di un altro progetto → 401', async () => {
  for (const opts of [{ tamper: true }, { exp: Math.floor(Date.now() / 1000) - 10 }, { aud: 'altro-progetto' }, { iss: 'https://evil.example' }]) {
    const { token, jwk } = await makeToken(opts);
    mockLogFetch({ jwk });
    const res = await handleRequest(logReq(token), env);
    assert.equal(res.status, 401, JSON.stringify(opts));
  }
});

test('/log: utente non agente (documento non leggibile) → 403, e senza token → 401', async () => {
  const { token, jwk } = await makeToken();
  mockLogFetch({ jwk, agent: false });
  assert.equal((await handleRequest(logReq(token), env)).status, 403);
  assert.equal((await handleRequest(logReq(''), env)).status, 401);
});

test('/log: dati non validi → 422; origine non autorizzata → 403', async () => {
  const { token, jwk } = await makeToken();
  mockLogFetch({ jwk });
  assert.equal((await handleRequest(logReq(token, { code: 'x', stato: 'boh' }), env)).status, 422);
  const bad = new Request('https://worker.test/log', { method: 'POST', headers: { Origin: 'https://evil.example', Authorization: `Bearer ${token}` }, body: '{}' });
  assert.equal((await handleRequest(bad, env)).status, 403);
});

test('Turnstile: richiesto se configurato, token errato → 403, token valido → 200', async () => {
  const withTs = { ...env, TURNSTILE_SECRET: 'sec' };
  let ok = false;
  globalThis.fetch = async (url) => {
    if (String(url).includes('turnstile')) return new Response(JSON.stringify({ success: ok }), { status: 200 });
    return new Response(null, { status: 204 });
  };
  assert.equal((await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '9.9.9.1' }), withTs)).status, 403);
  assert.equal((await handleRequest(req('/submit/denuncia', { body: { ...denunciaOk, turnstile: 'tok' }, ip: '9.9.9.2' }), withTs)).status, 403);
  ok = true;
  assert.equal((await handleRequest(req('/submit/denuncia', { body: { ...denunciaOk, turnstile: 'tok' }, ip: '9.9.9.3' }), withTs)).status, 200);
});

test('/config: espone la site key solo se Turnstile è configurato', async () => {
  const get = () => new Request('https://worker.test/config', { method: 'GET', headers: { Origin: ORIGIN } });
  assert.equal((await (await handleRequest(get(), env)).json()).turnstileSiteKey, null);
  assert.equal((await (await handleRequest(get(), { ...env, TURNSTILE_SITEKEY: '0xAAA', TURNSTILE_SECRET: 's' })).json()).turnstileSiteKey, '0xAAA');
});

// --- Accesso con Google (accounts.google.com) --------------------------------
const GCID = '1234567890-abc.apps.googleusercontent.com';

async function makeGoogleToken({ aud = GCID, iss = 'https://accounts.google.com', email_verified = true, exp } = {}) {
  const pair = await webcrypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const kid = 'g' + Math.random().toString(36).slice(2);
  const jwk = { ...(await webcrypto.subtle.exportKey('jwk', pair.publicKey)), kid, alg: 'RS256', use: 'sig' };
  const now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: 'RS256', kid, typ: 'JWT' }));
  const payload = b64u(JSON.stringify({ iss, aud, sub: '110011', email: 'mario@example.com', name: 'Mario Rossi', email_verified, iat: now - 5, exp: exp || now + 3600 }));
  const sig = await webcrypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(`${head}.${payload}`));
  return { token: `${head}.${payload}.${b64u(sig)}`, jwk };
}

function mockGoogleFetch(jwk) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    url = String(url);
    calls.push({ url, init });
    if (url.includes('oauth2/v3/certs')) return new Response(JSON.stringify({ keys: [jwk] }), { status: 200 });
    return new Response(null, { status: 204 });
  };
  return calls;
}

test('Google: senza token → 401 needLogin; con token valido → 200 e account nell’embed', async () => {
  const genv = { ...env, GOOGLE_CLIENT_ID: GCID };
  const { token, jwk } = await makeGoogleToken();
  const calls = mockGoogleFetch(jwk);
  const no = await handleRequest(req('/submit/denuncia', { body: denunciaOk, ip: '7.7.7.1' }), genv);
  assert.equal(no.status, 401);
  assert.equal((await no.json()).needLogin, true);
  const ok = await handleRequest(req('/submit/denuncia', { body: { ...denunciaOk, googleToken: token }, ip: '7.7.7.2' }), genv);
  assert.equal(ok.status, 200);
  const dc = calls.find((c) => c.url === WEBHOOK);
  const embed = JSON.parse(dc.init.body).embeds[0];
  assert.ok(embed.fields.some((f) => f.name === 'Account Google' && f.value === 'Mario Rossi <mario@example.com>'));
});

test('Google: token con aud/iss errati, scaduto o email non verificata → 401', async () => {
  const genv = { ...env, GOOGLE_CLIENT_ID: GCID };
  const bads = [{ aud: 'altro.apps.googleusercontent.com' }, { iss: 'https://evil.example' }, { exp: Math.floor(Date.now() / 1000) - 5 }, { email_verified: false }];
  let i = 0;
  for (const opts of bads) {
    const { token, jwk } = await makeGoogleToken(opts);
    mockGoogleFetch(jwk);
    const res = await handleRequest(req('/submit/denuncia', { body: { ...denunciaOk, googleToken: token }, ip: `7.7.8.${i++}` }), genv);
    assert.equal(res.status, 401, JSON.stringify(opts));
  }
});

test('Google: /config espone il client id solo se configurato', async () => {
  const get = () => new Request('https://worker.test/config', { method: 'GET', headers: { Origin: ORIGIN } });
  assert.equal((await (await handleRequest(get(), env)).json()).googleClientId, null);
  assert.equal((await (await handleRequest(get(), { ...env, GOOGLE_CLIENT_ID: GCID })).json()).googleClientId, GCID);
});
