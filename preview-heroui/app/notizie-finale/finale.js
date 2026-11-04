'use client';

import { Card, CardBody, Link } from '@heroui/react';
import { Barra, Ic, P } from '../notizie-header/header';
import { TUTTE } from '../notizie-corpo/corpo';
import '../notizie-nuova/testa.css';

const CARTA = 'border border-black/5 bg-[#f6f4ee] text-neutral-900';
const COMUN = TUTTE.filter((n) => ['Avviso', 'Comunicato'].includes(n.tipo));
const NOTIZIE = TUTTE.filter((n) => !['Avviso', 'Comunicato'].includes(n.tipo));
const [APERTURA, ...ALTRE] = NOTIZIE;

/* Header identico a quello già pubblicato */
function Testa() {
  return (
    <header className="np-head" style={{ paddingBottom: 140 }}>
      <div className="np-photo" aria-hidden="true"><img src="/foto/giuramento-header.jpg" alt="" /></div>
      <div className="np-inner">
        <div className="np-kicker"><span></span>Sala stampa · Questura di Roma</div>
        <h1>Notizie</h1>
        <div className="np-bar">
          <p>Comunicazioni ufficiali e aggiornamenti dalla Polizia di Stato.</p>
          <div className="np-side"><span className="np-crest" aria-hidden="true"><img src="/crest.png" alt="" /></span>
            <div className="np-tabs">{['Tutte', 'Notizie', 'Comunicati'].map((l, k) => (<button key={l} type="button" className={k === 0 ? 'on' : ''}>{l}</button>))}</div></div>
        </div>
        <a className="np-evid" href="#"><img src="/foto/king.png" alt="" /><span><em>In evidenza</em><strong>Cambio Dirigenti in Questura di Roma</strong></span></a>
      </div>
    </header>
  );
}

/* pezzi grafici "carta ufficiale" usati solo dentro le celle */
const Testata = ({ n, s }) => (
  <div className="flex items-center gap-3 border-b-2 border-neutral-900/80 pb-3"><img src="/crest.png" alt="" className={s ? 'h-9' : 'h-12'} /><div className="leading-tight"><div className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-600">Polizia di Stato</div><div className={`${s ? 'text-xs' : 'text-sm'} font-extrabold uppercase tracking-wide`}>Questura di Roma</div></div><div className="ml-auto text-right text-[10px] leading-tight text-neutral-600"><div className="font-mono">{n.prot}</div><div>Roma, {n.data}</div></div></div>
);
const Allegato = ({ src, className = '' }) => (
  <figure className={`inline-block bg-white p-1.5 pb-5 shadow-lg ring-1 ring-black/10 ${className}`}><img src={src} alt="" className="h-full w-full object-cover" /><figcaption className="mt-0.5 text-center font-mono text-[8px] uppercase tracking-widest text-neutral-500">Allegato</figcaption></figure>
);
const Firma = () => (<div className="flex items-end justify-between pt-2"><div className="text-[10px] leading-tight text-neutral-500">Ufficio Stampa</div><div className="text-right"><div className="font-serif text-sm italic text-neutral-700">Il Questore</div><div className="mt-0.5 h-px w-24 bg-neutral-400" /></div></div>);

export function Finale() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-x-0 top-0 z-20"><Barra /></div>
      <Testa />
      <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-8">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* cella grande: la notizia in apertura */}
          <Card className={CARTA} radius="sm" shadow="lg" isPressable><CardBody className="gap-4 p-8 text-left">
            <Testata n={APERTURA} />
            <div className="grid flex-1 gap-6 md:grid-cols-[1fr_230px]">
              <div className="flex flex-col gap-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Oggetto · In apertura</div>
                <h2 className="font-serif text-[1.9rem] font-bold leading-tight">{APERTURA.titolo}</h2>
                <p className="font-serif text-[16px] leading-relaxed text-neutral-700">{APERTURA.testo}</p>
              </div>
              <div className="flex items-start justify-center md:pt-4"><Allegato src={APERTURA.img} className="h-56 w-48 -rotate-2" /></div>
            </div>
            <Firma />
          </CardBody></Card>

          {/* colonna: Dalla Questura */}
          <Card className={CARTA} radius="sm" shadow="lg"><CardBody className="gap-3 p-7">
            <div className="flex items-center gap-3 border-b-2 border-neutral-900/80 pb-3"><img src="/crest.png" alt="" className="h-9" /><div className="text-sm font-extrabold uppercase tracking-wide">Dalla Questura</div></div>
            {COMUN.map((c, k) => (
              <div key={c.id} className={k ? 'border-t border-neutral-300 pt-4' : 'pt-1'}>
                <div className="flex items-center gap-3"><span className={`rounded-sm border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${c.tipo === 'Avviso' ? 'border-red-700 text-red-700' : 'border-amber-700 text-amber-700'}`}>{c.tipo}</span><span className="font-mono text-[10px] text-neutral-500">{c.prot}</span></div>
                <div className="mt-2 font-serif text-[17px] font-bold leading-snug">{c.titolo}</div>
                <div className="mt-1 text-[11px] text-neutral-500">Roma, {c.data}</div>
              </div>
            ))}
            <div className="mt-auto pt-2"><Link href="#" size="sm" className="gap-1 !text-neutral-700">Tutti i comunicati <Ic d={P.arrow} s={14} /></Link></div>
          </CardBody></Card>
        </div>

        {/* le quattro notizie sotto */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ALTRE.map((n) => (
            <Card key={n.id} className={CARTA} radius="sm" shadow="lg" isPressable><CardBody className="gap-3 p-5 text-left">
              <div className="flex items-center justify-between text-[10px] text-neutral-500"><span className="font-mono">{n.prot}</span><span>{n.data}</span></div>
              <div className="-mx-1 flex justify-center"><Allegato src={n.img} className="h-32 w-full -rotate-1" /></div>
              <h3 className="font-serif text-lg font-bold leading-snug">{n.titolo}</h3>
              <Firma />
            </CardBody></Card>
          ))}
        </div>
      </main>
    </div>
  );
}
