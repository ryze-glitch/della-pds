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

// Bacheca dei comunicati reali: se non ce ne sono, non mostra nulla.
export function Bacheca({ max = 5, href = '/notizie' }) {
  const list = useComunicati(max);
  if (!list || list.length === 0) return null;
  return (
    <Widget icon="news" title="Bacheca" href={href}>
      <ul className="divide-y divide-[#1e2735]">
        {list.map((c) => (
          <li key={c.id}>
            <Link href={`/notizie#c-${c.id}`} className="block py-4 transition hover:opacity-90">
              <div className="flex items-center justify-between text-[13.5px] text-[#c9d2e0]">
                <span className="flex items-center gap-2">
                  <Icon name="user" size={15} /> Questura
                </span>
                <span>{fmtData(c.data)}</span>
              </div>
              <div className="mt-1.5 text-[17px] leading-snug">{c.titolo}</div>
              <div className={`mt-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide ${c.tipo === 'Allerta' ? 'text-[#ff6b7d]' : 'text-[#3fc4d6]'}`}>
                <Icon name="clipboard" size={14} /> {c.tipo}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Widget>
  );
}
