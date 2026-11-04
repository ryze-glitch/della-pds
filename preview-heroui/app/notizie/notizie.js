'use client';

import { useState } from 'react';
import { Accordion, AccordionItem, Avatar, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Image, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, useDisclosure } from '@heroui/react';
import { COMUNICATI, NOTIZIE } from './dati';

const Ic = ({ d, s = 16 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const P = {
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  megafono: 'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1ZM17 8a5 5 0 0 1 0 8',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  alert: 'M12 3 2 20h20zM12 10v4M12 17v.5',
  pin: 'M12 17v5M8 3h8l-1 7 3 3H6l3-3z',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
};
const COL = { Lutto: 'default', Nomine: 'primary', Cerimonie: 'success', Avviso: 'danger', Comunicato: 'warning' };
const TUTTE = [...COMUNICATI, ...NOTIZIE];

const Pagina = ({ children }) => (
  <div className="relative min-h-screen overflow-hidden">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(37,99,235,0.28),transparent_60%)]" />
    <header className="relative px-6 pb-10 pt-14 text-center">
      <Chip color="primary" variant="flat" size="sm" startContent={<Ic d={P.megafono} s={14} />} classNames={{ content: 'font-semibold' }}>Sala stampa</Chip>
      <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Notizie e <span className="text-primary">Comunicati</span></h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-default-500">Comunicazioni ufficiali, nomine, cerimonie e avvisi alla cittadinanza della Questura di Roma.</p>
    </header>
    <main className="relative mx-auto max-w-6xl px-5 pb-24">{children}</main>
  </div>
);

const Tipo = ({ t }) => <Chip size="sm" variant="flat" color={COL[t] || 'default'} classNames={{ content: 'font-semibold' }}>{t}</Chip>;
const Data = ({ d }) => <span className="inline-flex items-center gap-1.5 text-xs text-default-500"><Ic d={P.cal} s={13} />{d}</span>;

function Leggi({ n, children }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      {children(onOpen)}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" backdrop="blur" classNames={{ base: 'border border-white/10' }}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex-col items-start gap-2"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><span className="text-xl font-bold">{n.titolo}</span></ModalHeader>
              <ModalBody>{n.img && <img src={n.img} alt="" className="mb-2 max-h-64 w-full rounded-xl object-contain" />}<p className="leading-relaxed text-default-600">{n.testo}</p></ModalBody>
              <ModalFooter><Button variant="flat" onPress={close}>Chiudi</Button></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

/* N1 · Rivista: notizia in evidenza + griglia, filtri a schede */
function N1() {
  const [sel, setSel] = useState('tutte');
  const lista = TUTTE.filter((n) => sel === 'tutte' || (sel === 'comunicati' ? COMUNICATI.includes(n) : NOTIZIE.includes(n)));
  const [h, ...resto] = lista.filter((n) => n.img);
  const senza = lista.filter((n) => !n.img);
  return (
    <>
      <div className="mb-8 flex justify-center">
        <Tabs selectedKey={sel} onSelectionChange={setSel} radius="full" color="primary" variant="solid" aria-label="Filtro">
          <Tab key="tutte" title="Tutte" /><Tab key="notizie" title="Notizie" /><Tab key="comunicati" title="Comunicati e avvisi" />
        </Tabs>
      </div>
      {h && (
        <Leggi n={h}>{(open) => (
          <Card isPressable onPress={open} className="mb-6 w-full border border-white/10 bg-content1/70 md:flex-row" radius="lg">
            <img src={h.img} alt="" className="h-64 w-full bg-black/30 object-contain p-4 md:h-auto md:w-[42%]" />
            <CardBody className="justify-center gap-3 p-8 text-left">
              <div className="flex items-center gap-3"><Tipo t={h.tipo} /><Data d={h.data} /></div>
              <h2 className="text-2xl font-bold leading-snug md:text-3xl">{h.titolo}</h2>
              <p className="line-clamp-3 text-default-500">{h.testo}</p>
              <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary">Leggi tutto <Ic d={P.arrow} /></span>
            </CardBody>
          </Card>
        )}</Leggi>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resto.map((n) => (
          <Leggi key={n.id} n={n}>{(open) => (
            <Card isPressable onPress={open} className="border border-white/10 bg-content1/70 text-left" radius="lg">
              <div className="flex h-44 items-center justify-center bg-black/30"><img src={n.img} alt="" className="h-full w-full object-contain p-3" /></div>
              <CardBody className="gap-2 p-5"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="font-semibold leading-snug">{n.titolo}</h3><p className="line-clamp-2 text-sm text-default-500">{n.testo}</p></CardBody>
            </Card>
          )}</Leggi>
        ))}
        {senza.map((n) => (
          <Leggi key={n.id} n={n}>{(open) => (
            <Card isPressable onPress={open} className="border border-warning/30 bg-warning/5 text-left" radius="lg">
              <CardBody className="gap-2 p-5"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="font-semibold leading-snug">{n.titolo}</h3><p className="line-clamp-3 text-sm text-default-500">{n.testo}</p></CardBody>
            </Card>
          )}</Leggi>
        ))}
      </div>
    </>
  );
}

/* N2 · Feed + barra laterale con comunicati fissati, ricerca e archivio */
function N2() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-6">
        {NOTIZIE.map((n) => (
          <Card key={n.id} className="border border-white/10 bg-content1/70" radius="lg">
            <CardHeader className="gap-3 px-6 pt-5">
              <Avatar src="/crest.png" size="sm" radius="full" className="bg-black/40 p-1" />
              <div className="flex flex-col"><span className="text-sm font-semibold">Ufficio Stampa · Questura di Roma</span><Data d={n.data} /></div>
              <div className="ml-auto"><Tipo t={n.tipo} /></div>
            </CardHeader>
            <CardBody className="gap-3 px-6 pb-2">
              <h2 className="text-xl font-bold leading-snug">{n.titolo}</h2>
              <p className="text-default-500">{n.testo}</p>
              <div className="flex h-56 items-center justify-center rounded-xl bg-black/30"><img src={n.img} alt="" className="h-full object-contain p-3" /></div>
            </CardBody>
            <CardFooter className="px-6 pb-5"><Link href="#" size="sm" className="gap-1">Leggi il comunicato <Ic d={P.arrow} s={14} /></Link></CardFooter>
          </Card>
        ))}
      </div>
      <aside className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
        <Input placeholder="Cerca nelle notizie…" radius="lg" variant="bordered" startContent={<Ic d={P.search} />} />
        <Card className="border border-danger/30 bg-danger/5" radius="lg">
          <CardHeader className="gap-2 px-5 pt-4 font-semibold text-danger"><Ic d={P.pin} /> Comunicati in evidenza</CardHeader>
          <CardBody className="gap-4 px-5 pb-5">
            {COMUNICATI.map((c, i) => (
              <div key={c.id}>{i > 0 && <Divider className="mb-4" />}<div className="flex items-center gap-2"><Tipo t={c.tipo} /><Data d={c.data} /></div><p className="mt-1.5 font-semibold leading-snug">{c.titolo}</p><p className="mt-1 text-sm text-default-500">{c.testo}</p></div>
            ))}
          </CardBody>
        </Card>
        <Card className="border border-white/10 bg-content1/70" radius="lg">
          <CardHeader className="px-5 pt-4 font-semibold">Archivio</CardHeader>
          <CardBody className="gap-2 px-5 pb-5 text-sm">
            {[['2025', 1], ['2024', 4]].map(([a, n]) => (<div key={a} className="flex items-center justify-between"><span>{a}</span><Chip size="sm" variant="flat">{n}</Chip></div>))}
          </CardBody>
        </Card>
      </aside>
    </div>
  );
}

/* N3 · Bollettino: righe compatte con data a sinistra e testo a fisarmonica */
function N3() {
  const righe = [...COMUNICATI, ...NOTIZIE];
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><Input className="max-w-xs" placeholder="Cerca…" radius="full" variant="bordered" startContent={<Ic d={P.search} />} /><div className="flex gap-2"><Chip variant="flat" color="primary">Tutti</Chip><Chip variant="bordered">Notizie</Chip><Chip variant="bordered">Comunicati</Chip></div></div>
      <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={['c1']} itemClasses={{ base: 'border border-white/10 bg-content1/70 shadow-none', title: 'font-semibold leading-snug', trigger: 'py-4' }}>
        {righe.map((n) => {
          const [g, m, a] = n.data.split(' ');
          return (
            <AccordionItem key={n.id} aria-label={n.titolo} startContent={<div className={`flex h-14 w-14 flex-none flex-col items-center justify-center rounded-xl ${n.tipo === 'Avviso' ? 'bg-danger/15 text-danger' : 'bg-primary/15 text-primary'}`}><span className="text-lg font-extrabold leading-none">{g}</span><span className="text-[10px] uppercase tracking-wider">{m.slice(0, 3)} {a?.slice(2)}</span></div>} title={n.titolo} subtitle={<Tipo t={n.tipo} />}>
              <div className="flex flex-col gap-3 pb-3 sm:flex-row">{n.img && <img src={n.img} alt="" className="h-32 w-44 flex-none rounded-xl bg-black/30 object-contain p-2" />}<p className="leading-relaxed text-default-500">{n.testo}</p></div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

/* N4 · Cinema: banner di avviso urgente, notizia grande e striscia di miniature */
function N4() {
  const [i, setI] = useState(0);
  const n = NOTIZIE[i];
  return (
    <>
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-danger/30 bg-danger/10 px-5 py-3 text-sm"><span className="text-danger"><Ic d={P.alert} s={18} /></span><span><b>{COMUNICATI[0].titolo}.</b> <span className="text-default-500">{COMUNICATI[0].testo}</span></span></div>
      <Card className="relative overflow-hidden border border-white/10" radius="lg">
        <div className="relative h-[440px] bg-black/40"><img src={n.img} alt="" className="absolute inset-y-0 right-0 h-full w-full object-contain object-right p-6 md:w-[55%]" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" /></div>
        <div className="absolute inset-y-0 left-0 flex w-full flex-col justify-center gap-3 p-10 md:w-[55%]"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h2 className="max-w-3xl text-3xl font-extrabold leading-tight">{n.titolo}</h2><p className="max-w-2xl text-default-500">{n.testo}</p><div><Button color="primary" radius="full" endContent={<Ic d={P.arrow} />}>Leggi la notizia</Button></div></div>
      </Card>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
        {NOTIZIE.map((m, k) => (
          <Card key={m.id} isPressable onPress={() => setI(k)} className={`border bg-content1/70 text-left ${k === i ? 'border-primary' : 'border-white/10'}`} radius="lg">
            <div className="flex h-24 items-center justify-center bg-black/30"><img src={m.img} alt="" className="h-full object-contain p-2" /></div>
            <CardBody className="gap-1 p-3"><span className="text-[11px] text-default-500">{m.data}</span><span className="line-clamp-2 text-xs font-semibold leading-snug">{m.titolo}</span></CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}

/* N5 · Bento: mosaico di riquadri di dimensioni diverse con comunicati in evidenza */
function N5() {
  return (
    <div className="grid auto-rows-[200px] gap-4 md:grid-cols-4">
      {[
        { n: NOTIZIE[0], c: 'md:col-span-2 md:row-span-2' },
        { n: COMUNICATI[0], c: 'md:col-span-2', av: 1 },
        { n: NOTIZIE[1], c: '' },
        { n: NOTIZIE[2], c: '' },
        { n: COMUNICATI[1], c: '', av: 1 },
        { n: NOTIZIE[3], c: 'md:col-span-2' },
        { n: COMUNICATI[2], c: '', av: 1 },
        { n: NOTIZIE[4], c: 'md:col-span-2' },
      ].map(({ n, c, av }) => (
        <Leggi key={n.id} n={n}>{(open) => (
          <Card isPressable onPress={open} className={`relative overflow-hidden border text-left ${av ? 'border-warning/30 bg-gradient-to-br from-warning/15 to-content1/60' : 'border-white/10 bg-content1/70'} ${c}`} radius="lg">
            {n.img && <img src={n.img} alt="" className="absolute inset-0 h-full w-full object-contain p-4 opacity-70" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="relative mt-auto flex w-full flex-col gap-2 p-5"><div className="flex items-center gap-2"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className={`font-bold leading-snug ${c.includes('row-span-2') ? 'text-2xl' : 'text-base'}`}>{n.titolo}</h3>{c.includes('row-span-2') && <p className="line-clamp-3 text-sm text-default-400">{n.testo}</p>}</div>
          </Card>
        )}</Leggi>
      ))}
    </div>
  );
}

export function Notizie({ v }) {
  const V = { n1: N1, n2: N2, n3: N3, n4: N4, n5: N5 }[v];
  return <Pagina><V /></Pagina>;
}
