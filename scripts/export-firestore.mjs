#!/usr/bin/env node
// Esporta in JSON le raccolte Firestore indicate (default: auth-sito e candidature-review).
//   GOOGLE_APPLICATION_CREDENTIALS=chiave-servizio.json node scripts/export-firestore.mjs [raccolta ...]
// Non ha dipendenze: firma da sé il token del service account. Scrive in backup/<data>/<raccolta>.json
// e NON modifica né cancella nulla su Firestore. La cartella backup/ è ignorata da git (dati personali).
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createSign } from 'node:crypto';

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error('Imposta GOOGLE_APPLICATION_CREDENTIALS con il percorso del JSON del service account.');
  process.exit(1);
}
const key = JSON.parse(readFileSync(keyPath, 'utf8'));
const project = process.env.FIREBASE_PROJECT || key.project_id || 'polizia-iprp';
const collections = process.argv.slice(2).length ? process.argv.slice(2) : ['auth-sito', 'candidature-review'];

const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'RS256', typ: 'JWT' });
  const body = b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3000 });
  const sig = createSign('RSA-SHA256').update(`${head}.${body}`).sign(key.private_key, 'base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${body}.${sig}` }),
  });
  if (!res.ok) throw new Error(`Token non ottenuto: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

// Converte i valori tipizzati di Firestore REST in JSON semplice.
function fromValue(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('geoPointValue' in v) return v.geoPointValue;
  if ('referenceValue' in v) return v.referenceValue;
  if ('bytesValue' in v) return v.bytesValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromValue(x)]));
  return null;
}

const token = await accessToken();
const day = new Date().toISOString().slice(0, 10);
const dir = `backup/${day}`;
mkdirSync(dir, { recursive: true });

for (const col of collections) {
  const docs = [];
  let pageToken = '';
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${col}?pageSize=300${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`${col}: ${res.status} ${await res.text()}`);
    const j = await res.json();
    for (const d of j.documents || []) {
      docs.push({ id: d.name.split('/').pop(), ...Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, fromValue(v)])) });
    }
    pageToken = j.nextPageToken || '';
  } while (pageToken);
  writeFileSync(`${dir}/${col}.json`, JSON.stringify(docs, null, 2));
  console.log(`${col}: ${docs.length} documenti -> ${dir}/${col}.json`);
}
