'use client';

import { useMemo, useState } from 'react';
import { Accordion, AccordionItem, Button, Chip, Input } from '@heroui/react';
import { Barra, Ic, P } from '../notizie-header/header';
import { TUTTE } from '../notizie-corpo/corpo';
import './testa.css';

const URG = ['Avviso', 'Comunicato'];
const FILTRI = { tutte: () => true, notizia: (n) => !URG.includes(n.tipo), comunicato: (n) => URG.includes(n.tipo) };
const COL = { Avviso: 'danger', Comunicato: 'warning', Lutto: 'default', Nomine: 'primary', Cerimonie: 'success' };

/* Intestazione IDENTICA a quella già pubblicata sul sito (stessi stili e stesso markup) */
function TestaReale({ f, setF }) {
  return (
    <header className="np-head" style={{ paddingBottom: 140 }}>
      <div className="np-photo" aria-hidden="true"><img src="/foto/giuramento-header.jpg" alt="" /></div>
      <div className="np-inner">
        <div className="np-kicker"><span></span>Sala stampa · Questura di Roma</div>
        <h1>Notizie</h1>
        <div className="np-bar">
          <p>Comunicazioni ufficiali e aggiornamenti dalla Polizia di Stato.</p>
          <div className="np-side">
            <span className="np-crest" aria-hidden="true"><img src="/crest.png" alt="" /></span>
            <div className="np-tabs" role="tablist">
              {[['tutte', 'Tutte'], ['notizia', 'Notizie'], ['comunicato', 'Comunicati']].map(([k, l]) => (<button key={k} type="button" role="tab" className={f === k ? 'on' : ''} onClick={() => setF(k)}>{l}</button>))}
            </div>
          </div>
        </div>
        <a className="np-evid" href="#"><img src="/foto/king.png" alt="" /><span><em>In evidenza</em><strong>Cambio Dirigenti in Questura di Roma</strong></span></a>
      </div>
    </header>
  );
}

export function Nuova() {
  const [f, setF] = useState('tutte');
  const [q, setQ] = useState('');
  const lista = useMemo(() => TUTTE.filter((n) => FILTRI[f](n) && (n.titolo + ' ' + n.testo).toLowerCase().includes(q.toLowerCase())), [f, q]);
  const anni = [...new Set(lista.map((n) => n.data.split(' ')[2]))];

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-x-0 top-0 z-20"><Barra /></div>
      <TestaReale f={f} setF={setF} />
      <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Input className="max-w-xs" value={q} onValueChange={setQ} radius="full" variant="bordered" placeholder="Cerca nelle notizie…" startContent={<Ic d={P.search} />} />
            <span className="text-sm text-default-500">{lista.length} {lista.length === 1 ? 'risultato' : 'risultati'}</span>
          </div>
          {!lista.length && <p className="rounded-2xl border border-dashed border-white/15 py-20 text-center text-default-500">Nessuna comunicazione trovata.</p>}
          {anni.map((a) => (
            <section key={a} className="mb-10">
              <div className="mb-1 flex items-center gap-4"><span className="text-5xl font-extrabold text-white/15">{a}</span><span className="h-px flex-1 bg-white/10" /></div>
              <Accordion selectionMode="single" variant="light" showDivider={false} itemClasses={{ base: 'border-b border-white/10 px-0', trigger: 'items-start gap-5 py-6', title: 'text-xl font-bold leading-snug', subtitle: 'mt-1', indicator: 'mt-2', content: 'pb-8' }}>
                {lista.filter((n) => n.data.endsWith(a)).map((n) => {
                  const [g, m] = n.data.split(' ');
                  return (
                    <AccordionItem key={n.id} aria-label={n.titolo}
                      startContent={<div className="w-14 flex-none text-center"><div className="text-3xl font-extrabold leading-none">{g}</div><div className="mt-1 text-[11px] uppercase tracking-widest text-default-500">{m.slice(0, 3)}</div></div>}
                      title={n.titolo}
                      subtitle={<span className="flex items-center gap-2"><Chip size="sm" variant="flat" color={COL[n.tipo]}>{n.tipo}</Chip><span className="font-mono text-[11px] text-default-500">{n.prot}</span></span>}>
                      <div className="flex flex-col gap-5 pl-[76px]">
                        {n.img && <img src={n.img} alt="" className="max-h-72 w-full rounded-2xl bg-black/30 object-cover" />}
                        <p className="leading-relaxed text-default-400">{n.testo}</p>
                        <div className="flex gap-2"><Button size="sm" radius="full" variant="flat" startContent={<Ic d={P.doc} s={14} />}>Scarica il comunicato</Button><Button size="sm" radius="full" variant="light">Condividi</Button></div>
                      </div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
