'use client';

import { useState } from 'react';
import { Button, Card, CardBody, Chip, Tab, Tabs, ScrollShadow } from '@heroui/react';
import { Ic, P } from '../notizie-header/header';
import { Pagina, TUTTE } from '../notizie-corpo/corpo';

const CARTA = 'border border-black/5 bg-[#f6f4ee] text-neutral-900';
const Firma = ({ n }) => (<div className="flex items-end justify-between pt-3"><div className="text-[11px] leading-tight text-neutral-500">Comunicato n. {n.prot.split('/')[1]}<br />Ufficio Stampa</div><div className="text-right"><div className="font-serif italic text-neutral-700">Il Questore</div><div className="mt-1 h-px w-28 bg-neutral-400" /></div></div>);
const Testata = ({ n, piccola }) => (
  <div className="flex items-center gap-3 border-b-2 border-neutral-900/80 pb-3"><img src="/crest.png" alt="" className={piccola ? 'h-10' : 'h-14'} /><div className="leading-tight"><div className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600">Polizia di Stato</div><div className={`${piccola ? 'text-sm' : 'text-base'} font-extrabold uppercase tracking-wide`}>Questura di Roma</div></div><div className="ml-auto text-right text-[11px] text-neutral-600"><div className="font-mono">{n.prot}</div><div>Roma, {n.data}</div></div></div>
);
const Allegato = ({ n, className = '' }) => n.img ? (
  <figure className={`inline-block -rotate-2 bg-white p-2 pb-6 shadow-lg ring-1 ring-black/10 ${className}`}><img src={n.img} alt="" className="h-28 w-40 object-cover" /><figcaption className="mt-1 text-center font-mono text-[9px] uppercase tracking-widest text-neutral-500">Allegato</figcaption></figure>
) : null;
const Foglio = ({ n, piccola, className = '', children }) => (
  <Card className={`${CARTA} ${className}`} radius="sm" shadow="lg"><CardBody className={`gap-4 ${piccola ? 'p-6' : 'p-9'}`}>
    <Testata n={n} piccola={piccola} />
    <div><div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Oggetto</div><h3 className={`mt-1 font-serif font-bold leading-snug ${piccola ? 'text-lg' : 'text-2xl'}`}>{n.titolo}</h3></div>
    <p className={`font-serif leading-relaxed text-neutral-700 ${piccola ? 'text-[15px]' : 'text-[17px]'}`}>{n.testo}</p>
    {children}
    <Firma n={n} />
  </CardBody></Card>
);

/* G1 · Due colonne di fogli più piccoli, con la foto come allegato incollato */
function G1() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {TUTTE.map((n) => (
        <div key={n.id} className="relative">
          <Foglio n={n} piccola>{n.img && <div className="-mb-2 mt-1"><Allegato n={n} /></div>}</Foglio>
        </div>
      ))}
    </div>
  );
}

/* G2 · Fascicolo: elenco di mini-fogli a sinistra, foglio grande (formato A4) a destra */
function G2() {
  const [i, setI] = useState(0);
  const n = TUTTE[i];
  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <ScrollShadow className="flex max-h-[720px] flex-col gap-3 pr-1">
        {TUTTE.map((x, k) => (
          <button key={x.id} type="button" onClick={() => setI(k)} className={`rounded-md p-3 text-left transition-all ${CARTA} ${k === i ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}>
            <div className="flex items-center justify-between text-[10px] text-neutral-500"><span className="font-mono">{x.prot}</span><span>{x.data}</span></div><div className="mt-1 font-serif font-bold leading-snug">{x.titolo}</div>
            <div className="mt-2 space-y-1"><div className="h-1 rounded bg-neutral-300" /><div className="h-1 w-5/6 rounded bg-neutral-300" /><div className="h-1 w-2/3 rounded bg-neutral-300" /></div>
          </button>
        ))}
      </ScrollShadow>
      <div className="mx-auto w-full max-w-2xl"><Foglio n={n}>{n.img && <Allegato n={n} className="self-start" />}</Foglio></div>
    </div>
  );
}

/* G3 · Pila di fogli sovrapposti: tocchi un foglio e viene in primo piano */
function G3() {
  const [top, setTop] = useState(0);
  const ordine = [top, ...TUTTE.map((_, k) => k).filter((k) => k !== top)];
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative" style={{ height: 420 + 7 * 58 }}>
        {ordine.slice().reverse().map((k, pos) => {
          const n = TUTTE[k]; const livello = ordine.length - 1 - pos; // 0 = in cima
          return (
            <div key={n.id} onClick={() => setTop(k)} className="absolute inset-x-0 cursor-pointer transition-all duration-500" style={{ top: livello === 0 ? 0 : 400 + (livello - 1) * 58, zIndex: 20 - livello, transform: `rotate(${livello === 0 ? 0 : (k % 2 ? 0.6 : -0.6)}deg)` }}>
              {livello === 0 ? <Foglio n={n}>{n.img && <Allegato n={n} className="self-start" />}</Foglio>
                : <Card className={CARTA} radius="sm" shadow="md"><CardBody className="flex-row items-center justify-between gap-4 px-7 py-3"><span className="font-serif font-bold">{n.titolo}</span><span className="flex-none font-mono text-[11px] text-neutral-500">{n.data}</span></CardBody></Card>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* G4 · Scorrimento orizzontale di fogli con aggancio e frecce */
function G4() {
  const [i, setI] = useState(0);
  return (
    <>
      <div className="mb-4 flex items-center justify-between"><span className="text-sm text-default-500">{i + 1} di {TUTTE.length}</span><div className="flex gap-2"><Button isIconOnly radius="full" variant="flat" isDisabled={i === 0} onPress={() => setI(i - 1)}><span className="rotate-180"><Ic d={P.arrow} /></span></Button><Button isIconOnly radius="full" variant="flat" isDisabled={i === TUTTE.length - 1} onPress={() => setI(i + 1)}><Ic d={P.arrow} /></Button></div></div>
      <div className="overflow-hidden"><div className="flex gap-6 transition-transform duration-500" style={{ transform: `translateX(calc(-${i} * (min(560px, 86vw) + 24px)))` }}>
        {TUTTE.map((n, k) => (<div key={n.id} className={`w-[min(560px,86vw)] flex-none transition-opacity ${k === i ? 'opacity-100' : 'opacity-40'}`}><Foglio n={n} piccola>{n.img && <Allegato n={n} className="self-start" />}</Foglio></div>))}
      </div></div>
    </>
  );
}

/* G5 · Margine a sinistra con data e anno fissi (come note a margine) e foglio largo a destra */
function G5() {
  const anni = [...new Set(TUTTE.map((n) => n.data.split(' ')[2]))].sort().reverse();
  return (
    <div className="mx-auto max-w-5xl">
      {anni.map((a) => (
        <div key={a} className="mb-12 grid gap-6 md:grid-cols-[140px_1fr]">
          <div className="md:sticky md:top-6 md:self-start"><div className="text-6xl font-extrabold leading-none text-white/20">{a}</div><div className="mt-2 text-xs uppercase tracking-widest text-default-500">{TUTTE.filter((n) => n.data.includes(a)).length} comunicazioni</div></div>
          <div className="flex flex-col gap-6">
            {TUTTE.filter((n) => n.data.includes(a)).map((n) => (
              <div key={n.id} className="relative"><span className="absolute -left-[22px] top-8 hidden h-2.5 w-2.5 rounded-full bg-primary md:block" /><Foglio n={n} piccola>{n.img && <Allegato n={n} className="self-start" />}</Foglio></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* G6 · Cartellina con linguette (Tutte / Comunicati / Nomine / Cerimonie) e fogli compatti dentro */
function G6() {
  const [t, setT] = useState('tutte');
  const cat = { tutte: () => true, comunicati: (n) => ['Avviso', 'Comunicato'].includes(n.tipo), nomine: (n) => n.tipo === 'Nomine', cerimonie: (n) => n.tipo === 'Cerimonie' };
  const lista = TUTTE.filter(cat[t]);
  return (
    <div>
      <Tabs selectedKey={t} onSelectionChange={setT} variant="solid" radius="sm" aria-label="Cartellina" classNames={{ tabList: 'gap-1 bg-transparent p-0', tab: 'h-11 rounded-b-none rounded-t-lg px-6', tabContent: 'group-data-[selected=true]:text-neutral-900 font-semibold', cursor: '!bg-[#f6f4ee] shadow-none rounded-b-none rounded-t-lg' }}>
        <Tab key="tutte" title="Tutte" /><Tab key="comunicati" title="Comunicati" /><Tab key="nomine" title="Nomine" /><Tab key="cerimonie" title="Cerimonie" />
      </Tabs>
      <div className="rounded-b-2xl rounded-tr-2xl bg-[#f6f4ee] p-6 shadow-xl md:p-8">
        <div className="divide-y divide-neutral-300 text-neutral-900">
          {lista.map((n) => (
            <div key={n.id} className="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[170px_1fr_auto]">
              <div className="text-[11px] text-neutral-500"><div className="font-mono">{n.prot}</div><div>{n.data}</div><Chip size="sm" variant="flat" className="mt-2 bg-neutral-900/10 text-neutral-700">{n.tipo}</Chip></div>
              <div><h3 className="font-serif text-xl font-bold leading-snug">{n.titolo}</h3><p className="mt-1.5 font-serif leading-relaxed text-neutral-700">{n.testo}</p></div>
              {n.img && <Allegato n={n} className="self-start justify-self-end" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Corpo5({ v }) {
  const V = { g1: G1, g2: G2, g3: G3, g4: G4, g5: G5, g6: G6 }[v];
  return <Pagina><V /></Pagina>;
}
