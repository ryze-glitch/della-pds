'use client';

import { useState } from 'react';
import { Accordion, AccordionItem, Avatar, Button, Card, CardBody, CardFooter, Chip, Divider, Link, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { Barra, Ic, P } from '../notizie-header/header';
import { COMUNICATI, NOTIZIE } from '../notizie/dati';

const COL = { Lutto: 'default', Nomine: 'primary', Cerimonie: 'success', Avviso: 'danger', Comunicato: 'warning' };
const TUTTE = [...COMUNICATI, ...NOTIZIE].map((n, i) => ({ ...n, prot: `Prot. n. ${2025 - (n.data.includes('2024') ? 1 : 0)}/${String(40 - i * 3).padStart(3, '0')}` }));
const Tipo = ({ t }) => <Chip size="sm" variant="flat" color={COL[t] || 'default'} classNames={{ content: 'font-semibold' }}>{t}</Chip>;
const Data = ({ d }) => <span className="inline-flex items-center gap-1.5 text-xs text-default-500"><Ic d={P.cal} s={13} />{d}</span>;

const Pagina = ({ children }) => (
  <div className="relative min-h-screen overflow-hidden bg-background">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-white/[0.04] to-transparent" />
    <Barra />
    <header className="relative mx-auto max-w-6xl px-6 pb-8 pt-12"><div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary"><span className="h-px w-10 bg-primary" />Sala stampa · Questura di Roma</div><h1 className="mt-3 text-5xl font-extrabold uppercase tracking-tight"><span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">Notizie</span></h1></header>
    <main className="relative mx-auto max-w-6xl px-6 pb-24">{children}</main>
  </div>
);

function Leggi({ n, children }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      {children(onOpen)}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" backdrop="blur" classNames={{ base: 'border border-white/10' }}>
        <ModalContent>{(close) => (<>
          <ModalHeader className="flex-col items-start gap-2"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><span className="text-xl font-bold">{n.titolo}</span></ModalHeader>
          <ModalBody>{n.img && <img src={n.img} alt="" className="mb-2 max-h-64 w-full rounded-xl object-contain" />}<p className="leading-relaxed text-default-600">{n.testo}</p></ModalBody>
          <ModalFooter><Button variant="flat" onPress={close}>Chiudi</Button></ModalFooter>
        </>)}</ModalContent>
      </Modal>
    </>
  );
}

/* B1 · Linea del tempo: data a sinistra, scheda a destra, pallino sulla linea */
function B1() {
  return (
    <div className="relative mx-auto max-w-4xl pl-8 md:pl-44">
      <div className="absolute bottom-0 left-2 top-2 w-px bg-gradient-to-b from-primary via-white/15 to-transparent md:left-36" />
      {TUTTE.map((n) => {
        const [g, m, a] = n.data.split(' ');
        return (
          <div key={n.id} className="relative mb-8">
            <div className="absolute -left-[34px] top-6 h-3 w-3 rounded-full bg-primary ring-4 ring-background md:-left-[42px]" />
            <div className="absolute -left-44 top-3 hidden w-28 text-right md:block"><div className="text-3xl font-extrabold leading-none">{g}</div><div className="text-xs uppercase tracking-wider text-default-500">{m} {a}</div></div>
            <Leggi n={n}>{(open) => (
              <Card isPressable onPress={open} className="w-full border border-white/10 bg-content1/70 text-left" radius="lg"><CardBody className="flex-row gap-5 p-5">
                {n.img && <img src={n.img} alt="" className="hidden h-28 w-40 flex-none rounded-xl bg-black/30 object-contain p-1 sm:block" />}
                <div className="flex flex-col gap-2"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><span className="md:hidden"><Data d={n.data} /></span></div><h3 className="text-lg font-bold leading-snug">{n.titolo}</h3><p className="line-clamp-2 text-sm text-default-500">{n.testo}</p></div>
              </CardBody></Card>
            )}</Leggi>
          </div>
        );
      })}
    </div>
  );
}

/* B2 · Righe editoriali: numero grande, titolo, anteprima e miniatura */
function B2() {
  return (
    <div className="mx-auto max-w-5xl">
      {TUTTE.map((n) => {
        const [g, m, a] = n.data.split(' ');
        return (
          <Leggi key={n.id} n={n}>{(open) => (
            <button type="button" onClick={open} className="group flex w-full items-center gap-6 border-t border-white/10 py-7 text-left transition-colors hover:bg-white/[0.03]">
              <div className="w-24 flex-none text-center"><div className="text-5xl font-extrabold leading-none text-white/90 transition-colors group-hover:text-primary">{g}</div><div className="mt-1 text-[11px] uppercase tracking-widest text-default-500">{m.slice(0, 3)} {a}</div></div>
              <div className="flex-1"><div className="mb-2"><Tipo t={n.tipo} /></div><h3 className="text-xl font-bold leading-snug">{n.titolo}</h3><p className="mt-1.5 line-clamp-2 max-w-2xl text-sm text-default-500">{n.testo}</p></div>
              {n.img && <img src={n.img} alt="" className="hidden h-24 w-36 flex-none rounded-2xl bg-black/30 object-contain p-1 opacity-80 transition group-hover:opacity-100 md:block" />}
              <span className="hidden text-default-500 transition group-hover:translate-x-1 group-hover:text-primary md:block"><Ic d={P.arrow} s={22} /></span>
            </button>
          )}</Leggi>
        );
      })}
      <div className="border-t border-white/10" />
    </div>
  );
}

/* B3 · Griglia a due colonne con immagine a tutta larghezza e piè di scheda */
function B3() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {TUTTE.map((n) => (
        <Leggi key={n.id} n={n}>{(open) => (
          <Card className="border border-white/10 bg-content1/70" radius="lg">
            {n.img ? <div className="flex h-52 items-center justify-center bg-black/30"><img src={n.img} alt="" className="h-full w-full object-contain p-3" /></div> : <div className="flex h-52 items-center justify-center bg-gradient-to-br from-warning/15 to-transparent text-warning"><Ic d={P.mega} s={56} /></div>}
            <CardBody className="gap-2 p-6"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="text-xl font-bold leading-snug">{n.titolo}</h3><p className="line-clamp-3 text-sm text-default-500">{n.testo}</p></CardBody>
            <Divider />
            <CardFooter className="justify-between px-6 py-4"><div className="flex items-center gap-2 text-xs text-default-500"><Avatar src="/crest.png" size="sm" className="bg-black/40 p-1" />Ufficio Stampa</div><Button size="sm" radius="full" color="primary" variant="flat" onPress={open} endContent={<Ic d={P.arrow} s={14} />}>Leggi</Button></CardFooter>
          </Card>
        )}</Leggi>
      ))}
    </div>
  );
}

/* B4 · Comunicati ufficiali: scheda "documento" con protocollo, striscia colorata e testo che si apre */
function B4() {
  const bordo = { Avviso: 'bg-danger', Comunicato: 'bg-warning', Lutto: 'bg-default-400', Nomine: 'bg-primary', Cerimonie: 'bg-success' };
  return (
    <div className="mx-auto max-w-4xl">
      <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={['c1']} itemClasses={{ base: 'relative overflow-hidden border border-white/10 bg-content1/70 shadow-none', trigger: 'py-5', title: 'text-lg font-bold leading-snug', subtitle: 'text-xs' }}>
        {TUTTE.map((n) => (
          <AccordionItem key={n.id} aria-label={n.titolo} indicator={<span className="text-default-500"><Ic d={P.arrow} s={18} /></span>}
            startContent={<div className={`absolute inset-y-0 left-0 w-1.5 ${bordo[n.tipo]}`} />}
            title={<div className="flex flex-col gap-2 pl-2"><div className="flex flex-wrap items-center gap-3"><Tipo t={n.tipo} /><span className="font-mono text-xs text-default-500">{n.prot}</span><Data d={n.data} /></div><span>{n.titolo}</span></div>}>
            <div className="flex flex-col gap-4 pb-4 pl-2 sm:flex-row">{n.img && <img src={n.img} alt="" className="h-36 w-52 flex-none rounded-xl bg-black/30 object-contain p-2" />}<div className="flex flex-col gap-3"><p className="leading-relaxed text-default-500">{n.testo}</p><div className="flex gap-2"><Button size="sm" radius="full" variant="flat" startContent={<Ic d={P.doc} s={14} />}>Scarica il comunicato</Button><Button size="sm" radius="full" variant="light">Condividi</Button></div></div></div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/* B5 · Raggruppate per anno, schede orizzontali compatte */
function B5() {
  const anni = [...new Set(TUTTE.map((n) => n.data.split(' ')[2]))].sort().reverse();
  return (
    <div className="mx-auto max-w-4xl">
      {anni.map((a) => (
        <section key={a} className="mb-10">
          <div className="mb-4 flex items-center gap-4"><span className="text-4xl font-extrabold text-white/90">{a}</span><Divider className="flex-1" /><Chip size="sm" variant="flat">{TUTTE.filter((n) => n.data.includes(a)).length}</Chip></div>
          <div className="flex flex-col gap-3">
            {TUTTE.filter((n) => n.data.includes(a)).map((n) => (
              <Leggi key={n.id} n={n}>{(open) => (
                <Card isPressable onPress={open} className="w-full border border-white/10 bg-content1/70 text-left" radius="lg"><CardBody className="flex-row items-center gap-4 p-3">
                  {n.img ? <img src={n.img} alt="" className="h-16 w-24 flex-none rounded-lg bg-black/30 object-contain" /> : <div className="flex h-16 w-24 flex-none items-center justify-center rounded-lg bg-warning/15 text-warning"><Ic d={P.mega} s={24} /></div>}
                  <div className="min-w-0 flex-1"><div className="mb-1 flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="truncate font-semibold">{n.titolo}</h3></div>
                  <span className="pr-2 text-default-500"><Ic d={P.arrow} s={18} /></span>
                </CardBody></Card>
              )}</Leggi>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* B6 · Elenco a sinistra e lettura a destra (si legge senza cambiare pagina) */
function B6() {
  const [k, setK] = useState(String(TUTTE[3].id));
  const n = TUTTE.find((x) => String(x.id) === k);
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit border border-white/10 bg-content1/70" radius="lg"><CardBody className="p-2">
        <Listbox aria-label="Notizie" selectionMode="single" disallowEmptySelection selectedKeys={[k]} onSelectionChange={(s) => setK([...s][0])} itemClasses={{ base: 'gap-3 rounded-xl px-3 py-3 data-[selected=true]:bg-primary/15' }}>
          {TUTTE.map((x) => (<ListboxItem key={String(x.id)} textValue={x.titolo} description={x.data} classNames={{ title: 'whitespace-normal font-semibold leading-snug' }} startContent={<span className={`h-2 w-2 flex-none rounded-full ${x.tipo === 'Avviso' ? 'bg-danger' : x.tipo === 'Comunicato' ? 'bg-warning' : 'bg-primary'}`} />}>{x.titolo}</ListboxItem>))}
        </Listbox>
      </CardBody></Card>
      <Card className="border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-5 p-8">
        <div className="flex flex-wrap items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /><span className="font-mono text-xs text-default-500">{n.prot}</span></div>
        <h2 className="text-3xl font-extrabold leading-tight">{n.titolo}</h2>
        {n.img && <div className="flex h-72 items-center justify-center rounded-2xl bg-black/30"><img src={n.img} alt="" className="h-full object-contain p-3" /></div>}
        <p className="leading-relaxed text-default-500">{n.testo}</p>
        <div className="flex items-center gap-3"><Avatar src="/crest.png" size="sm" className="bg-black/40 p-1" /><span className="text-sm text-default-500">Ufficio Stampa · Questura di Roma</span><Link href="#" size="sm" className="ml-auto gap-1">Condividi</Link></div>
      </CardBody></Card>
    </div>
  );
}

export function Corpo({ v }) {
  const V = { b1: B1, b2: B2, b3: B3, b4: B4, b5: B5, b6: B6 }[v];
  return <Pagina><V /></Pagina>;
}
