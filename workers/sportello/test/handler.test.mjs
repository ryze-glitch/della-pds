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
