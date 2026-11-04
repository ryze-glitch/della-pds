'use client';

import { useEffect, useState } from 'react';
import { Accordion, AccordionItem, Alert, Avatar, Button, Card, CardBody, Chip, Divider, Input, Link, Modal, ModalContent, Progress, Tab, Tabs, User } from '@heroui/react';
import { Ic, P } from '../notizie-header/header';
import { Data, Pagina, TUTTE, Tipo } from '../notizie-corpo/corpo';

const CAT = { Avviso: 'Comunicati', Comunicato: 'Comunicati', Lutto: 'Lutto', Nomine: 'Nomine', Cerimonie: 'Cerimonie' };
const ST = 'M12 3l2.5 6 6.500.5-5 4.300 1.600 6.400L12 16.600 6.400 20.200 8 13.800 3 9.500 9.500 9z';

/* H1 · Pagina-hub: avvisi attivi, tre ultime notizie, archivio ad anni a fisarmonica */
function H1() {
  const av = TUTTE.filter((n) => n.tipo === 'Avviso');
  const ultime = TUTTE.filter((n) => n.img).slice(0, 3);
  const anni = [...new Set(TUTTE.map((n) => n.data.split(' ')[2]))].sort().reverse();
  return (
    <div className="flex flex-col gap-12">
      {av.map((a) => <Alert key={a.id} color="danger" variant="faded" title={`${a.titolo} · ${a.data}`} description={a.testo} endContent={<Button size="sm" color="danger" variant="flat" radius="full">Leggi</Button>} />)}
      <section><div className="mb-4 flex items-end justify-between"><h2 className="text-2xl font-extrabold">Ultime notizie</h2><Link href="#" size="sm">Vedi tutte</Link></div>
        <div className="grid gap-5 md:grid-cols-3">{ultime.map((n) => (<Card key={n.id} className="border border-white/10 bg-content1/70" radius="lg"><img src={n.img} alt="" className="h-44 w-full object-cover" /><CardBody className="gap-2 p-5"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="font-bold leading-snug">{n.titolo}</h3></CardBody></Card>))}</div></section>
      <section><h2 className="mb-4 text-2xl font-extrabold">Archivio</h2>
        <Accordion variant="splitted" defaultExpandedKeys={['2025']} itemClasses={{ base: 'border border-white/10 bg-content1/70 shadow-none', title: 'text-lg font-bold' }}>
          {anni.map((a) => (<AccordionItem key={a} title={a} subtitle={`${TUTTE.filter((n) => n.data.includes(a)).length} comunicazioni`}>
            <div className="flex flex-col divide-y divide-white/10">{TUTTE.filter((n) => n.data.includes(a)).map((n) => (<a key={n.id} href="#" className="flex items-center gap-4 py-3 transition-colors hover:text-primary"><span className="w-28 flex-none text-xs text-default-500">{n.data}</span><span className="flex-1 font-semibold">{n.titolo}</span><Tipo t={n.tipo} /></a>))}</div>
          </AccordionItem>))}
        </Accordion>
      </section>
    </div>
  );
}

/* H2 · Ricerca al centro (stile Spotlight): scrivi e filtra, con argomenti suggeriti */
function H2() {
  const [q, setQ] = useState(''); const [c, setC] = useState('Tutte');
  const ris = TUTTE.filter((n) => (c === 'Tutte' || CAT[n.tipo] === c) && (n.titolo + n.testo).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-3xl">
      <Input autoFocus size="lg" radius="lg" variant="bordered" placeholder="Cerca tra notizie e comunicati…" value={q} onValueChange={setQ} startContent={<Ic d={P.search} s={20} />} endContent={<kbd className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-default-500">/</kbd>} classNames={{ inputWrapper: 'h-16 bg-content1/70 backdrop-blur-xl' }} />
      <div className="my-5 flex flex-wrap gap-2">{['Tutte', 'Comunicati', 'Nomine', 'Cerimonie', 'Lutto'].map((x) => (<Chip key={x} as="button" onClick={() => setC(x)} variant={c === x ? 'solid' : 'bordered'} color={c === x ? 'primary' : 'default'}>{x}</Chip>))}</div>
      <Card className="border border-white/10 bg-content1/70" radius="lg"><CardBody className="p-2">
        {ris.map((n, k) => (<div key={n.id}>{k > 0 && <Divider className="mx-3 w-auto" />}<a href="#" className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5">
          {n.img ? <img src={n.img} alt="" className="h-14 w-20 flex-none rounded-lg object-cover" /> : <div className="flex h-14 w-20 flex-none items-center justify-center rounded-lg bg-warning/15 text-warning"><Ic d={P.mega} s={22} /></div>}
          <div className="min-w-0 flex-1"><div className="truncate font-semibold">{n.titolo}</div><div className="truncate text-sm text-default-500">{n.testo}</div></div><div className="flex-none text-right"><Tipo t={n.tipo} /><div className="mt-1 text-[11px] text-default-500">{n.data}</div></div></a></div>))}
        {!ris.length && <p className="p-10 text-center text-default-500">Nessun risultato per “{q}”.</p>}
      </CardBody></Card>
      <p className="mt-3 text-center text-xs text-default-500">{ris.length} risultati</p>
    </div>
  );
}

/* H3 · Stile documentazione: indice fisso a sinistra e sezioni per categoria con grandi titoli */
function H3() {
  const sez = ['Comunicati', 'Nomine', 'Lutto', 'Cerimonie'];
  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <nav className="lg:sticky lg:top-6 lg:self-start"><div className="mb-3 text-xs font-bold uppercase tracking-widest text-default-500">In questa pagina</div>
        <ul className="flex flex-col border-l border-white/10">{sez.map((s, k) => (<li key={s}><a href={`#${s}`} className={`-ml-px block border-l-2 py-2 pl-4 text-sm transition-colors ${k === 0 ? 'border-primary font-semibold text-primary' : 'border-transparent text-default-500 hover:text-white'}`}>{s} <span className="text-default-600">({TUTTE.filter((n) => CAT[n.tipo] === s).length})</span></a></li>))}</ul></nav>
      <div className="flex flex-col gap-14">
        {sez.map((s) => (
          <section key={s} id={s}><h2 className="mb-1 text-4xl font-extrabold tracking-tight">{s}</h2><Divider className="mb-6" />
            <div className="flex flex-col gap-5">{TUTTE.filter((n) => CAT[n.tipo] === s).map((n) => (
              <article key={n.id} className="grid gap-5 md:grid-cols-[1fr_200px]"><div><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="mt-2 text-xl font-bold leading-snug">{n.titolo}</h3><p className="mt-2 text-default-500">{n.testo}</p></div>{n.img && <img src={n.img} alt="" className="h-32 w-full rounded-xl bg-black/30 object-cover" />}</article>))}</div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* H4 · Storie a schermo intero: griglia di copertine verticali; il clic apre il visualizzatore con le barre di avanzamento */
function H4() {
  const [i, setI] = useState(null);
  const [p, setP] = useState(0);
  useEffect(() => { if (i === null) return; setP(0); const t = setInterval(() => setP((x) => { if (x >= 100) { setI((k) => (k + 1 < TUTTE.length ? k + 1 : null)); return 0; } return x + 2; }), 100); return () => clearInterval(t); }, [i]);
  const n = i !== null ? TUTTE[i] : null;
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {TUTTE.map((x, k) => (
          <button key={x.id} type="button" onClick={() => setI(k)} className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 text-left">
            {x.img ? <img src={x.img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" /> : <div className="absolute inset-0 bg-gradient-to-br from-warning/30 to-background" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-3"><Avatar isBordered color={['Avviso', 'Comunicato'].includes(x.tipo) ? 'warning' : 'primary'} src="/crest.png" size="sm" className="bg-black/50 p-1" /><span className="text-xs font-semibold">{x.tipo}</span></div>
            <div className="absolute inset-x-0 bottom-0 p-4"><div className="text-[11px] text-white/70">{x.data}</div><div className="mt-1 font-bold leading-snug">{x.titolo}</div></div>
          </button>
        ))}
      </div>
      <Modal isOpen={i !== null} onOpenChange={() => setI(null)} size="full" backdrop="blur" hideCloseButton classNames={{ base: 'bg-black/90' }}>
        <ModalContent>{n && (
          <div className="relative mx-auto flex h-full w-full max-w-md flex-col">
            <div className="absolute inset-x-4 top-4 z-20 flex gap-1.5">{TUTTE.map((_, k) => (<Progress key={k} aria-label="step" size="sm" value={k < i ? 100 : k === i ? p : 0} classNames={{ base: 'flex-1', track: 'h-1 bg-white/25', indicator: 'bg-white' }} />))}</div>
            {n.img ? <img src={n.img} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-warning/40 to-black" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
            <div className="absolute inset-x-0 top-10 z-20 flex items-center gap-3 px-4"><Avatar src="/crest.png" size="sm" className="bg-black/50 p-1" /><div className="text-sm font-semibold">Polizia di Stato<div className="text-[11px] font-normal text-white/60">{n.data}</div></div><Button isIconOnly variant="light" radius="full" className="ml-auto" onPress={() => setI(null)}>✕</Button></div>
            <button type="button" aria-label="Precedente" className="absolute inset-y-0 left-0 z-10 w-1/3" onClick={() => setI(Math.max(0, i - 1))} /><button type="button" aria-label="Successiva" className="absolute inset-y-0 right-0 z-10 w-1/3" onClick={() => (i + 1 < TUTTE.length ? setI(i + 1) : setI(null))} />
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 p-6"><Tipo t={n.tipo} /><h2 className="text-3xl font-extrabold leading-tight">{n.titolo}</h2><p className="text-white/80">{n.testo}</p></div>
          </div>)}</ModalContent>
      </Modal>
    </>
  );
}

/* H5 · Bacheca a colonne (tipo kanban): una colonna per categoria */
function H5() {
  const col = ['Comunicati', 'Nomine', 'Cerimonie', 'Lutto'];
  const col2 = { Comunicati: 'warning', Nomine: 'primary', Cerimonie: 'success', Lutto: 'default' };
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {col.map((c) => { const lista = TUTTE.filter((n) => CAT[n.tipo] === c); return (
        <div key={c} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between px-3 pt-2"><div className="flex items-center gap-2 font-bold"><span className={`h-2.5 w-2.5 rounded-full bg-${col2[c] === 'default' ? 'default-400' : col2[c]}`} />{c}</div><Chip size="sm" variant="flat" color={col2[c]}>{lista.length}</Chip></div>
          {lista.map((n) => (<Card key={n.id} isPressable className="border border-white/10 bg-content1 text-left" radius="lg" shadow="sm">{n.img && <img src={n.img} alt="" className="h-28 w-full object-cover" />}<CardBody className="gap-1.5 p-4"><span className="text-[11px] text-default-500">{n.data}</span><span className="font-semibold leading-snug">{n.titolo}</span></CardBody></Card>))}
        </div>); })}
    </div>
  );
}

/* H6 · Linea del tempo orizzontale: asse al centro, schede sopra e sotto in alternanza */
function H6() {
  return (
    <div className="overflow-x-auto pb-6">
      <div className="relative flex w-max items-center gap-6 px-6 py-4" style={{ minHeight: 560 }}>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-primary via-white/20 to-transparent" />
        {TUTTE.map((n, k) => (
          <div key={n.id} className="relative w-72 flex-none">
            <span className="absolute left-1/2 top-1/2 z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-background" />
            <div className={`absolute left-0 right-0 ${k % 2 ? 'top-[calc(50%+34px)]' : 'bottom-[calc(50%+34px)]'}`}>
              <div className={`mx-auto h-8 w-px bg-white/20 ${k % 2 ? '-mt-8 mb-0 translate-y-0' : 'hidden'}`} />
              <Card className="border border-white/10 bg-content1/80" radius="lg">{n.img && <img src={n.img} alt="" className="h-28 w-full object-cover" />}<CardBody className="gap-1.5 p-4"><div className="flex items-center gap-2"><Tipo t={n.tipo} /><span className="text-[11px] text-default-500">{n.data}</span></div><h3 className="text-sm font-bold leading-snug">{n.titolo}</h3></CardBody></Card>
            </div>
            <div className="h-1" />
          </div>
        ))}
        <div className="h-1 w-6 flex-none" />
      </div>
    </div>
  );
}

export function Corpo6({ v }) {
  const V = { h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6 }[v];
  return <Pagina><V /></Pagina>;
}
