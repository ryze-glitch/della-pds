'use client';

import { useMemo, useState } from 'react';
import { Accordion, AccordionItem, Button, Chip, Input, Listbox, ListboxItem, ScrollShadow } from '@heroui/react';
import { Ic, P } from '../notizie-header/header';
import { TUTTE } from '../notizie-corpo/corpo';

const URG = ['Avviso', 'Comunicato'];
const FILTRI = [
  ['tutte', 'Tutte', () => true],
  ['notizie', 'Notizie', (n) => !URG.includes(n.tipo)],
  ['comunicati', 'Comunicati e avvisi', (n) => URG.includes(n.tipo)],
  ['nomine', 'Nomine', (n) => n.tipo === 'Nomine'],
  ['cerimonie', 'Cerimonie', (n) => n.tipo === 'Cerimonie'],
];
const COL = { Avviso: 'danger', Comunicato: 'warning', Lutto: 'default', Nomine: 'primary', Cerimonie: 'success' };

export function Nuova() {
  const [f, setF] = useState('tutte');
  const [q, setQ] = useState('');
  const lista = useMemo(() => {
    const fn = FILTRI.find((x) => x[0] === f)[2];
    return TUTTE.filter((n) => fn(n) && (n.titolo + ' ' + n.testo).toLowerCase().includes(q.toLowerCase()));
  }, [f, q]);
  const anni = [...new Set(lista.map((n) => n.data.split(' ')[2]))];

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[430px_1fr]">
      {/* colonna fissa */}
      <aside className="relative flex flex-col justify-between overflow-hidden border-b border-white/10 p-8 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <img src="/foto/giuramento.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <div className="relative flex items-center gap-3"><img src="/crest.png" alt="" className="h-10" /><span className="text-sm font-extrabold uppercase tracking-wide">Polizia di Stato</span></div>
        <div className="relative my-10 flex flex-col gap-6">
          <div><div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">Sala stampa · Questura di Roma</div><h1 className="text-6xl font-extrabold uppercase leading-none tracking-tight lg:text-7xl">Notizie</h1><p className="mt-4 max-w-xs text-default-400">Comunicazioni ufficiali, nomine, cerimonie e avvisi alla cittadinanza.</p></div>
          <Input value={q} onValueChange={setQ} radius="lg" variant="bordered" placeholder="Cerca…" startContent={<Ic d={P.search} />} classNames={{ inputWrapper: 'bg-background/50 backdrop-blur-md' }} />
          <Listbox aria-label="Filtri" selectionMode="single" disallowEmptySelection selectedKeys={[f]} onSelectionChange={(s) => setF([...s][0])} itemClasses={{ base: 'rounded-xl px-4 py-3 data-[selected=true]:bg-primary/20 data-[selected=true]:text-primary', title: 'font-semibold' }}>
            {FILTRI.map(([k, label, fn]) => (<ListboxItem key={k} endContent={<Chip size="sm" variant="flat">{TUTTE.filter(fn).length}</Chip>}>{label}</ListboxItem>))}
          </Listbox>
        </div>
        <a href="#" className="relative flex items-center gap-4 rounded-2xl border border-white/15 bg-background/60 p-3 pr-5 backdrop-blur-xl transition-colors hover:border-primary"><img src="/foto/king.png" alt="" className="h-14 w-20 rounded-xl object-cover" /><div><Chip size="sm" color="warning" variant="flat">In evidenza</Chip><p className="mt-1 text-sm font-semibold leading-snug">Cambio Dirigenti in Questura di Roma</p></div></a>
      </aside>

      {/* elenco */}
      <main className="px-6 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between text-sm text-default-500"><span>{lista.length} {lista.length === 1 ? 'risultato' : 'risultati'}</span>{(f !== 'tutte' || q) && <Button size="sm" variant="light" onPress={() => { setF('tutte'); setQ(''); }}>Azzera filtri</Button>}</div>
          {!lista.length && <p className="rounded-2xl border border-dashed border-white/15 py-20 text-center text-default-500">Nessuna comunicazione trovata.</p>}
          {anni.map((a) => (
            <section key={a} className="mb-12">
              <div className="mb-2 flex items-center gap-4"><span className="text-5xl font-extrabold text-white/15">{a}</span><span className="h-px flex-1 bg-white/10" /></div>
              <Accordion selectionMode="single" variant="light" showDivider={false} itemClasses={{ base: 'group border-b border-white/10 px-0', trigger: 'items-start gap-5 py-6', title: 'text-xl font-bold leading-snug', subtitle: 'mt-1', indicator: 'mt-2', content: 'pb-8' }}>
                {lista.filter((n) => n.data.endsWith(a)).map((n) => {
                  const [g, m] = n.data.split(' ');
                  return (
                    <AccordionItem key={n.id} aria-label={n.titolo}
                      startContent={<div className="w-14 flex-none text-center"><div className="text-3xl font-extrabold leading-none">{g}</div><div className="mt-1 text-[11px] uppercase tracking-widest text-default-500">{m.slice(0, 3)}</div></div>}
                      title={<span>{n.titolo}</span>}
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
