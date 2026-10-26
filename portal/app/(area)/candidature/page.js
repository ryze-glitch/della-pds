'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { Badge, Container } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { CandidateItem } from '../../../components/CandidateItem';
import { useAgentProfile } from '../../../components/useAgentProfile';
import { db } from '../../../lib/firebase';

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
    <Container className="py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22.5px] font-normal">Gestione candidature</h1>
          <p className="mt-1 text-sm text-[color:var(--sh-sec)]">Valuta le candidature al reclutamento.</p>
        </div>
        <Badge tone="blue">{loaded ? `${candidates.length} ${candidates.length === 1 ? 'candidatura' : 'candidature'}` : 'Caricamento…'}</Badge>
      </div>

      <section className="mt-7">
        <label className="flex h-12 items-center gap-3 rounded-full border border-[color:var(--sh-in)] px-5 focus-within:border-link focus-within:ring-2 focus-within:ring-link/25">
          <Icon name="search" size={17} className="text-muted" />
          <span className="sr-only">Cerca una candidatura</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome, cognome o ID Discord..."
            autoComplete="off"
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-muted"
          />
        </label>

        {!loaded ? (
          <div className={`mt-6 text-sm ${status.error ? 'text-bad' : 'text-muted'}`} role="status">
            {status.msg}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 text-sm text-muted">Nessuna candidatura trovata.</div>
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
