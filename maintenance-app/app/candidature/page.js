'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { Btn, Chip, Container } from '../../components/ui';
import { Icon } from '../../components/icons';
import { CandidateItem } from '../../components/CandidateItem';
import { useAgentProfile } from '../../components/useAgentProfile';
import { db } from '../../lib/firebase';

// Lettura delle risposte dal modulo Google (via Google Sheets). Il
// foglio deve essere condiviso come "chiunque abbia il link -
// Visualizzatore" perché questa lettura avvenga senza login Google.
const SHEET_ID = '14IdIkwl3AVXBkC_dx4fRU06H34ba3TA4SEMktNO15Lc';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function findCol(headers, needle) {
  return headers.findIndex((h) => (h || '').toLowerCase().includes(needle));
}

function parseItDate(s) {
  // L'ora del timestamp di Google Forms non ha lo zero iniziale
  // (es. "2.28.04" invece di "02.28.04").
  const m = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2})\.(\d{1,2})\.(\d{1,2})$/.exec((s || '').trim());
  if (!m) return 0;
  return new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +m[6]).getTime();
}

export default function CandidaturePage() {
  const { loading: authLoading, profile, discordId, logout } = useAgentProfile();
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState({ msg: 'Caricamento candidature dal modulo Google...', error: false });
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');

  const currentAgent = profile
    ? { discordId, nome: profile.nome || '', cognome: profile.cognome || '', grado: profile.grado || '' }
    : null;

  useEffect(() => {
    if (authLoading || !currentAgent) return;

    (async () => {
      try {
        const res = await fetch(CSV_URL);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        const rows = parseCSV(text).filter((r) => r.some((v) => v && v.trim() !== ''));
        if (rows.length < 2) throw new Error('Nessuna riga trovata nel foglio');

        const headers = rows[0];
        const colTimestamp = 0;
        const colEmail = findCol(headers, 'indirizzo email');
        const colNome = findCol(headers, 'nome e cognome');
        const colNascita = findCol(headers, 'data di nascita');
        const colTitolo = findCol(headers, 'titolo di studio');
        const colFedina = findCol(headers, 'fedina penale');
        const colCertificato = findCol(headers, 'certificato anamnestico');
        const colPatente = findCol(headers, 'patente');
        const colDiscord = findCol(headers, 'discord');
        const colEta = findCol(headers, 'età ooc');
        const colMotivazione = findCol(headers, 'deciso di entrare');
        const colBackground = findCol(headers, 'raccontaci di te');
        const colPunteggio = findCol(headers, 'punteggio');
        const colConsenso = findCol(headers, 'presa visione');

        const used = new Set(
          [colTimestamp, colEmail, colNome, colNascita, colTitolo, colFedina, colCertificato, colPatente, colDiscord, colEta, colMotivazione, colBackground, colPunteggio, colConsenso].filter(
            (i) => i >= 0
          )
        );

        let list = rows.slice(1).map((r) => {
          const extra = [];
          if (colMotivazione >= 0) extra.push([headers[colMotivazione], r[colMotivazione]]);
          if (colBackground >= 0) extra.push([headers[colBackground], r[colBackground]]);
          headers.forEach((h, i) => {
            if (!used.has(i)) extra.push([h, r[i]]);
          });

          const cDiscordId = colDiscord >= 0 ? r[colDiscord] : '';
          const dataInvio = r[colTimestamp] || '';

          return {
            dataInvio,
            ts: parseItDate(dataInvio),
            email: colEmail >= 0 ? r[colEmail] : '',
            nome: colNome >= 0 ? r[colNome] : '',
            dataNascita: colNascita >= 0 ? r[colNascita] : '',
            titolo: colTitolo >= 0 ? r[colTitolo] : '',
            fedina: colFedina >= 0 ? r[colFedina] : '',
            certificato: colCertificato >= 0 ? r[colCertificato] : '',
            patente: colPatente >= 0 ? r[colPatente] : '',
            discordId: cDiscordId,
            eta: colEta >= 0 ? r[colEta] : '',
            punteggio: colPunteggio >= 0 ? r[colPunteggio] : '',
            decisionId: (cDiscordId + '_' + dataInvio).replace(/[^a-zA-Z0-9]/g, '_'),
            review: null,
            extra,
          };
        });
        list.sort((a, b) => b.ts - a.ts);

        try {
          const snap = await getDocs(collection(db, 'candidature-review'));
          const byId = {};
          snap.forEach((d) => {
            byId[d.id] = d.data();
          });
          list = list.map((c) => {
            const r = byId[c.decisionId];
            return r ? { ...c, review: { stato: r.stato, decisoDa: r.decisoDa, decisoIl: r.decisoIl } } : c;
          });
        } catch (err) {
          console.error(err);
        }

        setCandidates(list);
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setStatus({
          msg: 'Impossibile caricare le candidature. Verifica che il foglio Google sia condiviso come "Chiunque abbia il link - Visualizzatore".',
          error: true,
        });
      }
    })();
  }, [authLoading, currentAgent]);

  async function handleDecide(c, stato) {
    if (!currentAgent) return;
    if (c.review && c.review.decisoDa?.discordId !== currentAgent.discordId) return;
    const review = {
      stato,
      decisoDa: { discordId: currentAgent.discordId, nome: currentAgent.nome, cognome: currentAgent.cognome, grado: currentAgent.grado },
      decisoIl: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'candidature-review', c.decisionId), {
        stato: review.stato,
        decisoDa: review.decisoDa,
        decisoIl: review.decisoIl,
        candidatoNome: c.nome,
        candidatoDiscordId: c.discordId,
        candidatoDataInvio: c.dataInvio,
      });
      setCandidates((list) => list.map((item) => (item.decisionId === c.decisionId ? { ...item, review } : item)));
    } catch (err) {
      console.error(err);
      alert('Errore nel salvataggio della decisione. Riprova.');
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) => (c.nome || '').toLowerCase().includes(q) || (c.discordId || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)
    );
  }, [candidates, query]);

  return (
    <Container className="py-10">
      <section className="flex flex-col gap-6 rounded-3xl bg-surface-alt p-6 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-primary-soft text-on-primary-soft">
          <Icon name="assignment_ind" />
        </div>
        <div className="flex-1">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-primary">Area Personale</span>
          <h1 className="mt-1 font-display text-2xl font-semibold">Gestione Candidature</h1>
          <Chip className="mt-2" role="status">
            {loaded ? `${candidates.length} ${candidates.length === 1 ? 'candidatura' : 'candidature'}` : 'Caricamento...'}
          </Chip>
        </div>
        <div className="flex flex-wrap gap-3">
          <Btn as="a" href="/dashboard" variant="outlined" iconStart="dashboard">
            Torna alla dashboard
          </Btn>
          <Btn as="button" type="button" variant="outlined" iconStart="logout" onClick={logout}>
            Esci dall&apos;account
          </Btn>
        </div>
      </section>

      <section className="mt-8">
        <label className="flex items-center gap-2 rounded-full border border-line px-4 py-2">
          <Icon name="search" />
          <span className="sr-only">Cerca una candidatura</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome, cognome o ID Discord..."
            autoComplete="off"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-dim"
          />
        </label>

        {!loaded ? (
          <div className={`mt-6 text-sm ${status.error ? 'text-on-danger' : 'text-ink-dim'}`} role="status">
            {status.msg}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 text-sm text-ink-dim">Nessuna candidatura trovata.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {filtered.map((c) => (
              <CandidateItem key={c.decisionId} c={c} currentAgent={currentAgent} onDecide={handleDecide} />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
