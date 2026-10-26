'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from './icons';
import { Badge } from './ui';
import { CopiaLink } from './CopiaLink';
import { getSaved, removePratica } from '../lib/miePratiche';
import { cercaPratica } from '../lib/sportello';
import { STATI, TIPI_PRATICA } from '../lib/data';

function giorni(p) {
  const ts = p.agg && p.agg.toDate ? p.agg.toDate().getTime() : null;
  return ts ? Math.max(0, Math.floor((Date.now() - ts) / 86400000)) : null;
}

// Le pratiche usate su questo dispositivo, con lo stato aggiornato.
export function MiePratiche({ compact = false }) {
  const [items, setItems] = useState(null);

  const load = useCallback(async () => {
    const saved = getSaved();
    if (!saved.length) {
      setItems([]);
      return;
    }
    setItems(saved.map((p) => ({ ...p, stato: null })));
    const out = await Promise.all(
      saved.map(async (p) => {
        try {
          const r = await cercaPratica(p.code);
          return { ...p, stato: r.pratica ? r.pratica.stato : 'sconosciuta', tipo: (r.pratica && r.pratica.tipo) || p.tipo, agg: r.pratica ? r.pratica.aggiornatoIl || r.pratica.creatoIl : null };
        } catch (e) {
          return { ...p, stato: 'sconosciuta' };
        }
      })
    );
    setItems(out);
  }, []);

  useEffect(() => {
    load();
    window.addEventListener('pds-pratiche', load);
    return () => window.removeEventListener('pds-pratiche', load);
  }, [load]);

  if (items === null) return <p className="py-8 text-center text-sm text-muted">Caricamento…</p>;
  if (items.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted">Non hai ancora pratiche su questo dispositivo.</p>
        <Link href="/sportello/denuncia" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#3fc4d6] hover:underline">
          Presenta una richiesta <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-[#1e2735]">
      {items.slice(0, compact ? 4 : 20).map((p) => {
        const st = p.stato ? STATI[p.stato] : null;
        return (
          <li key={p.code} className="flex items-center gap-3 py-3.5">
            <Link href={`/sportello/pratica?codice=${p.code}`} className="min-w-0 flex-1">
              <div className="font-mono text-[13.5px]">#{p.code}</div>
              <div className="text-xs text-muted">
                {TIPI_PRATICA[p.tipo] || 'Pratica'}
                {giorni(p) !== null && ['ricevuta', 'in_lavorazione', 'in_attesa'].includes(p.stato) ? ` · aggiornata ${giorni(p) === 0 ? 'oggi' : giorni(p) === 1 ? 'ieri' : `${giorni(p)} giorni fa`}` : ''}
              </div>
            </Link>
            {st ? <Badge tone={st.tone}>{st.label}</Badge> : <span className="text-xs text-muted">{p.stato === null ? '…' : 'Non trovata'}</span>}
            <CopiaLink code={p.code} />
            <button type="button" onClick={() => removePratica(p.code)} aria-label={`Rimuovi ${p.code} dall'elenco`} className="rounded-full p-1.5 text-muted transition hover:bg-white/5 hover:text-fg">
              <Icon name="x" size={15} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
