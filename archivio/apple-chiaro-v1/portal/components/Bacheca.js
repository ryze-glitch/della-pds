'use client';

import Link from 'next/link';
import { Icon } from './icons';
import { Widget } from './Widget';
import { useComunicati } from './useComunicati';

function fmtData(d) {
  try {
    const dt = d && d.toDate ? d.toDate() : new Date(String(d) + 'T12:00:00');
    return dt.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
  } catch (e) {
    return '';
  }
}

// Bacheca dei comunicati reali: la sezione resta, vuota se non ce ne sono.
export function Bacheca({ max = 5, href = '/notizie', tone }) {
  const list = useComunicati(max);
  return (
    <Widget icon="news" title="Bacheca" href={href} tone={tone}>
      {!list || list.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">{list === null ? 'Caricamento…' : 'Nessun comunicato al momento.'}</p>
      ) : (
      <ul className="divide-y divide-line">
        {list.map((c) => (
          <li key={c.id}>
            <Link href={`/notizie#c-${c.id}`} className="block py-4 transition hover:opacity-90">
              <div className="flex items-center justify-between text-[12.2px] text-muted">
                <span className="flex items-center gap-2">
                  <Icon name="user" size={15} /> Questura
                </span>
                <span>{fmtData(c.data)}</span>
              </div>
              <div className="mt-1.5 text-[15.3px] leading-snug">{c.titolo}</div>
              <div className={`mt-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide ${c.tipo === 'Allerta' ? 'text-bad' : 'text-link'}`}>
                <Icon name="clipboard" size={14} /> {c.tipo}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      )}
    </Widget>
  );
}
