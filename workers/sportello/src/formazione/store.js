// Accesso ai dati di Firestore dal Worker, come amministratore (service account).
// Le raccolte della formazione sono chiuse ai client dalle regole: passa tutto da qui.
// `memoryStore` ha la stessa interfaccia e serve ai test.

const BASE = (project) => `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)`;

export function toFs(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFs) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, toFs(x)])) } };
}

export function fromFs(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFs);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromFs(x)]));
  return null;
}

const docOut = (d) => ({ id: d.name.split('/').pop(), ...Object.fromEntries(Object.entries(d.fields || {}).map(([k, x]) => [k, fromFs(x)])) });

function pemToDer(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uStr = (s) => b64u(new TextEncoder().encode(s));

let cached = { token: null, exp: 0 };

async function accessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  if (cached.token && cached.exp - 60 > now) return cached.token;
  const head = b64uStr(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body = b64uStr(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3000 }));
  const key = await crypto.subtle.importKey('pkcs8', pemToDer(sa.private_key), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${head}.${body}`));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${body}.${b64u(sig)}` }),
  });
  if (!res.ok) throw new Error(`token service account: ${res.status}`);
  const j = await res.json();
  cached = { token: j.access_token, exp: now + (j.expires_in || 3000) };
  return cached.token;
}

// Restituisce lo store di produzione, oppure null se il segreto FIREBASE_SERVICE_ACCOUNT manca o non è valido.
export function firestoreStore(env) {
  let sa;
  try {
    sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT || '');
    if (!sa.client_email || !sa.private_key) return null;
  } catch (e) {
    return null;
  }
  const project = sa.project_id || 'polizia-iprp';
  const call = async (path, init = {}) => {
    const res = await fetch(`${BASE(project)}${path}`, { ...init, headers: { Authorization: `Bearer ${await accessToken(sa)}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
    if (res.status === 404 && (init.method || 'GET') === 'GET') return null;
    if (!res.ok) throw new Error(`firestore ${res.status}`);
    return res.status === 204 ? {} : res.json();
  };
  return {
    async get(col, id) {
      const d = await call(`/documents/${col}/${encodeURIComponent(id)}`);
      return d ? docOut(d) : null;
    },
    async set(col, id, data) {
      const fields = toFs(data).mapValue.fields;
      await call(`/documents/${col}/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ fields }) });
    },
    async delete(col, id) {
      await call(`/documents/${col}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    },
    async list(col, where = {}) {
      const filters = Object.entries(where).map(([f, v]) => ({ fieldFilter: { field: { fieldPath: f }, op: 'EQUAL', value: toFs(v) } }));
      const structuredQuery = { from: [{ collectionId: col }], limit: 500 };
      if (filters.length) structuredQuery.where = filters.length === 1 ? filters[0] : { compositeFilter: { op: 'AND', filters } };
      const rows = await call(':runQuery', { method: 'POST', body: JSON.stringify({ structuredQuery }) });
      return (rows || []).filter((r) => r.document).map((r) => docOut(r.document));
    },
  };
}

export function memoryStore(seed = {}) {
  const db = new Map(); // "col/id" -> oggetto
  for (const [col, docs] of Object.entries(seed)) for (const [id, d] of Object.entries(docs)) db.set(`${col}/${id}`, structuredClone(d));
  return {
    db,
    async get(col, id) {
      const d = db.get(`${col}/${id}`);
      return d ? { id, ...structuredClone(d) } : null;
    },
    async set(col, id, data) {
      const { id: _ignored, ...rest } = data;
      db.set(`${col}/${id}`, structuredClone(rest));
    },
    async delete(col, id) {
      db.delete(`${col}/${id}`);
    },
    async list(col, where = {}) {
      const out = [];
      for (const [k, d] of db) {
        if (!k.startsWith(`${col}/`)) continue;
        if (Object.entries(where).every(([f, v]) => d[f] === v)) out.push({ id: k.slice(col.length + 1), ...structuredClone(d) });
      }
      return out;
    },
  };
}
