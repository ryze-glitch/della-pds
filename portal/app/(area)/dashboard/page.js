'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { Badge, Container } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { useAgentProfile } from '../../../components/useAgentProfile';
import { db } from '../../../lib/firebase';
import { STATI, TIPI_PRATICA } from '../../../lib/data';

const QUICK = [
  ['file-text', 'Gestione pratiche', 'Aggiorna lo stato delle richieste dello Sportello', '/pratiche'],
  ['clipboard', 'Candidature', 'Valuta le candidature al reclutamento', '/candidature'],
  ['users', 'Organigramma', 'Struttura e gradi della Questura', '/organigramma'],
];

function fmt(ts) {
  try {
    return ts && ts.toDate ? ts.toDate().toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
  } catch (e) {
    return '—';
  }
}

export default function DashboardPage() {
  const { loading, profile } = useAgentProfile();
  const [pratiche, setPratiche] = useState(null);

  useEffect(() => {
    if (loading || !profile) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'pratiche'), orderBy('creatoIl', 'desc'), limit(100)));
        setPratiche(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
        setPratiche([]);
      }
    })();
  }, [loading, profile]);

  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente' : '';
  const count = (st) => (pratiche ? pratiche.filter((p) => p.stato === st).length : '—');
  const stats = [
    ['Da prendere in carico', count('ricevuta')],
    ['In lavorazione', count('in_lavorazione')],
    ['In attesa di documenti', count('in_attesa')],
    ['Concluse', count('conclusa')],
  ];

  return (
    <Container className="py-8 md:py-10">
      <h1 className="text-[25px] font-normal">{nome ? `Ciao, ${nome}` : 'Dashboard'}</h1>
      <p className="mt-1 text-[#c9d2e0]">{profile ? `${profile.grado || 'Agente'} · Questura IPRP` : 'Caricamento…'}</p>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(([label, n]) => (
          <div key={label} className="rounded-[20px] border border-[#242d3b] p-5">
            <div className="text-sm text-muted">{label}</div>
            <div className="mt-2 text-4xl font-semibold tabular-nums">{n}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[20px] border border-[#242d3b] p-6">
          <div className="flex items-center justify-between border-b border-[#242d3b] pb-4">
            <h2 className="flex items-center gap-3 text-xl font-medium">
              <Icon name="file-text" size={26} strokeWidth={1.4} className="text-[#17a8bd]" /> Ultime pratiche
            </h2>
            <Link href="/pratiche" className="text-sm font-medium text-[#17a8bd] hover:underline">
              Vedi tutte
            </Link>
          </div>
          {pratiche === null ? (
            <p className="py-10 text-center text-sm text-muted">Caricamento…</p>
          ) : pratiche.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">Nessuna pratica da mostrare.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-muted">
                  <th className="py-3 pr-3 font-medium">Codice</th>
                  <th className="py-3 pr-3 font-medium">Tipo</th>
                  <th className="hidden py-3 pr-3 font-medium sm:table-cell">Data</th>
                  <th className="py-3 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody>
                {pratiche.slice(0, 7).map((p) => {
                  const st = STATI[p.stato] || STATI.ricevuta;
                  return (
                    <tr key={p.id} className="border-t border-[#1e2735]">
                      <td className="py-3 pr-3 font-mono">#{p.id}</td>
                      <td className="py-3 pr-3">{TIPI_PRATICA[p.tipo] || p.tipo}</td>
                      <td className="hidden py-3 pr-3 text-muted sm:table-cell">{fmt(p.creatoIl)}</td>
                      <td className="py-3">
                        <Badge tone={st.tone}>{st.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-[20px] border border-[#242d3b] p-6">
          <h2 className="border-b border-[#242d3b] pb-4 text-xl font-medium">Strumenti</h2>
          <div className="divide-y divide-[#1e2735]">
            {QUICK.map(([icon, title, text, href]) => (
              <Link key={href} href={href} className="group flex items-center gap-4 py-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#0f3947] text-[#17a8bd]">
                  <Icon name={icon} size={20} strokeWidth={1.5} />
                </span>
                <span className="flex-1">
                  <span className="block font-medium">{title}</span>
                  <span className="block text-[13px] text-muted">{text}</span>
                </span>
                <Icon name="chevron" size={18} className="text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
