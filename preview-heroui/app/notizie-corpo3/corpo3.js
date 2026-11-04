'use client';

import { useMemo, useState } from 'react';
import { CalendarDate } from '@internationalized/date';
import { Avatar, Button, Calendar, Card, CardBody, CardFooter, Chip, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Input, Pagination, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@heroui/react';
import { Ic, P } from '../notizie-header/header';
import { Data, Pagina, TUTTE, Tipo } from '../notizie-corpo/corpo';

const MESI = { Gennaio: 1, Febbraio: 2, Marzo: 3, Aprile: 4, Maggio: 5, Giugno: 6, Luglio: 7, Agosto: 8, Settembre: 9, Ottobre: 10, Novembre: 11, Dicembre: 12 };
const dataDi = (n) => { const [g, m, a] = n.data.split(' '); return new CalendarDate(+a, MESI[m], +g); };
const Lettura = ({ n, aperto, chiudi }) => (
  <Drawer isOpen={aperto} onOpenChange={(o) => !o && chiudi()} placement="right" size="lg" backdrop="blur" classNames={{ base: 'border-l border-white/10' }}>
    <DrawerContent>{(close) => n && (<>
      <DrawerHeader className="flex-col items-start gap-2"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><span className="text-2xl font-extrabold leading-tight">{n.titolo}</span></DrawerHeader>
      <DrawerBody>{n.img && <img src={n.img} alt="" className="mb-3 max-h-72 w-full rounded-2xl bg-black/30 object-contain p-2" />}<p className="leading-relaxed text-default-500">{n.testo}</p><p className="mt-2 font-mono text-xs text-default-500">{n.prot}</p></DrawerBody>
      <DrawerFooter><Button variant="flat" onPress={close}>Chiudi</Button><Button color="primary" startContent={<Ic d={P.doc} s={16} />}>Scarica il comunicato</Button></DrawerFooter>
    </>)}</DrawerContent>
  </Drawer>
);
function useLettura() { const [n, setN] = useState(null); const d = useDisclosure(); return { n, aperto: d.isOpen, apri: (x) => { setN(x); d.onOpen(); }, chiudi: d.onClose }; }

/* E1 · Bacheca a mattoni (colonne di altezze diverse) con lettura in un pannello laterale */
function E1() {
  const L = useLettura();
  const colonne = [[0, 3, 6], [1, 4, 7], [2, 5]];
  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {colonne.map((c, k) => (
          <div key={k} className="flex flex-col gap-5">
            {c.map((idx) => { const n = TUTTE[idx]; return (
              <Card key={n.id} isPressable onPress={() => L.apri(n)} className="group border border-white/10 bg-content1/70 text-left" radius="lg">
                {n.img ? <div className="overflow-hidden bg-black/30"><img src={n.img} alt="" className="w-full object-cover transition duration-500 group-hover:scale-105" style={{ height: 150 + ((idx * 37) % 90) }} /></div> : <div className="flex h-28 items-center justify-center bg-gradient-to-br from-warning/20 to-transparent text-warning"><Ic d={P.mega} s={40} /></div>}
                <CardBody className="gap-2 p-5"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="font-bold leading-snug">{n.titolo}</h3>{idx % 2 === 0 && <p className="line-clamp-3 text-sm text-default-500">{n.testo}</p>}</CardBody>
              </Card>); })}
          </div>
        ))}
      </div>
      <Lettura {...L} />
    </>
  );
}

/* E2 · Prima pagina: notizia di apertura, notizie di spalla e colonna "dal Comando" */
function E2() {
  const L = useLettura();
  const [a, b, c, ...resto] = TUTTE;
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card isPressable onPress={() => L.apri(TUTTE[3])} className="relative min-h-[420px] overflow-hidden border border-white/10 text-left" radius="lg">
          <img src={TUTTE[3].img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <CardBody className="relative justify-end gap-3 p-8"><div className="flex items-center gap-3"><Chip color="primary" size="sm">In apertura</Chip><Data d={TUTTE[3].data} /></div><h2 className="max-w-xl text-4xl font-extrabold leading-tight">{TUTTE[3].titolo}</h2><p className="line-clamp-2 max-w-xl text-default-400">{TUTTE[3].testo}</p></CardBody>
        </Card>
        <Card className="border border-warning/30 bg-warning/5" radius="lg"><CardBody className="gap-4 p-6"><div className="flex items-center gap-2 font-semibold text-warning"><Ic d={P.mega} /> Dal Comando</div>
          {[a, b, c].map((x, k) => (<div key={x.id}>{k > 0 && <Divider className="mb-4" />}<button type="button" onClick={() => L.apri(x)} className="text-left"><Tipo t={x.tipo} /><p className="mt-2 font-semibold leading-snug transition-colors hover:text-primary">{x.titolo}</p><p className="mt-1 text-xs text-default-500">{x.data}</p></button></div>))}
        </CardBody></Card>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TUTTE.slice(4).map((n) => (
          <button key={n.id} type="button" onClick={() => L.apri(n)} className="group flex flex-col gap-3 border-t-2 border-white/15 pt-4 text-left transition-colors hover:border-primary"><div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-black/30">{n.img && <img src={n.img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}</div><Data d={n.data} /><h3 className="font-bold leading-snug">{n.titolo}</h3></button>
        ))}
      </div>
      <Lettura {...L} />
    </>
  );
}

/* E3 · Registro: tabella ordinabile con ricerca, impaginazione e lettura nel pannello */
function E3() {
  const L = useLettura();
  const [q, setQ] = useState(''); const [pag, setPag] = useState(1);
  const righe = TUTTE.filter((n) => (n.titolo + n.tipo + n.prot).toLowerCase().includes(q.toLowerCase()));
  const per = 5; const tot = Math.max(1, Math.ceil(righe.length / per));
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><Input className="max-w-xs" radius="lg" variant="bordered" placeholder="Cerca per titolo, tipo, protocollo…" value={q} onValueChange={(v) => { setQ(v); setPag(1); }} startContent={<Ic d={P.search} />} /><span className="text-sm text-default-500">{righe.length} comunicazioni</span></div>
      <Table aria-label="Registro comunicazioni" selectionMode="single" onRowAction={(k) => L.apri(TUTTE.find((x) => String(x.id) === String(k)))} classNames={{ wrapper: 'border border-white/10 bg-content1/70 p-2', th: 'bg-transparent text-default-500', tr: 'cursor-pointer data-[hover=true]:bg-white/5' }}
        bottomContent={<div className="flex justify-center"><Pagination page={pag} total={tot} onChange={setPag} showControls radius="full" /></div>}>
        <TableHeader><TableColumn>Data</TableColumn><TableColumn>Titolo</TableColumn><TableColumn>Tipo</TableColumn><TableColumn>Protocollo</TableColumn></TableHeader>
        <TableBody emptyContent="Nessun risultato">
          {righe.slice((pag - 1) * per, pag * per).map((n) => (<TableRow key={n.id}><TableCell className="whitespace-nowrap text-default-500">{n.data}</TableCell><TableCell className="font-semibold">{n.titolo}</TableCell><TableCell><Tipo t={n.tipo} /></TableCell><TableCell className="font-mono text-xs text-default-500">{n.prot}</TableCell></TableRow>))}
        </TableBody>
      </Table>
      <Lettura {...L} />
    </>
  );
}

/* E4 · Calendario: scegli un giorno (quelli con notizie sono evidenziati) e leggi cosa è uscito */
function E4() {
  const L = useLettura();
  const date = useMemo(() => TUTTE.map(dataDi), []);
  const [sel, setSel] = useState(date[3]);
  const del = TUTTE.filter((n) => dataDi(n).compare(sel) === 0);
  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col gap-4">
        <Calendar aria-label="Calendario notizie" value={sel} onChange={setSel} isDateUnavailable={() => false} classNames={{ base: 'border border-white/10 bg-content1/70', cellButton: 'data-[unavailable=true]:text-foreground' }} />
        <p className="text-xs text-default-500">Giorni con notizie: {TUTTE.map((n) => n.data.split(' ')[0] + ' ' + n.data.split(' ')[1].slice(0, 3)).join(' · ')}</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">{TUTTE.map((n) => (<Chip key={n.id} as="button" onClick={() => setSel(dataDi(n))} variant={dataDi(n).compare(sel) === 0 ? 'solid' : 'bordered'} color={dataDi(n).compare(sel) === 0 ? 'primary' : 'default'}>{n.data.split(' ').slice(0, 2).join(' ')}</Chip>))}</div>
        {del.length ? del.map((n) => (
          <Card key={n.id} className="border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-4 p-7">
            <div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h2 className="text-2xl font-extrabold leading-tight">{n.titolo}</h2>
            {n.img && <div className="flex h-60 items-center justify-center rounded-2xl bg-black/30"><img src={n.img} alt="" className="h-full object-contain p-3" /></div>}
            <p className="text-default-500">{n.testo}</p>
          </CardBody></Card>
        )) : <Card className="border border-dashed border-white/15 bg-transparent" radius="lg"><CardBody className="py-14 text-center text-default-500">Nessuna notizia in questo giorno.<br />Scegli una data evidenziata.</CardBody></Card>}
      </div>
      <Lettura {...L} />
    </div>
  );
}

/* E5 · "Storie" in alto per i comunicati urgenti + feed largo a zig-zag */
function E5() {
  const L = useLettura();
  const urg = TUTTE.filter((n) => ['Avviso', 'Comunicato'].includes(n.tipo));
  const feed = TUTTE.filter((n) => !['Avviso', 'Comunicato'].includes(n.tipo));
  return (
    <>
      <div className="mb-8 flex items-center gap-5 overflow-x-auto pb-2">
        <span className="flex-none text-xs font-bold uppercase tracking-widest text-default-500">Comunicati</span>
        {urg.map((u) => (<button key={u.id} type="button" onClick={() => L.apri(u)} className="flex w-24 flex-none flex-col items-center gap-2 text-center"><Avatar isBordered color={u.tipo === 'Avviso' ? 'danger' : 'warning'} src="/crest.png" className="h-16 w-16 bg-black/40 p-2" /><span className="line-clamp-2 text-xs leading-tight">{u.titolo}</span></button>))}
      </div>
      <div className="flex flex-col gap-6">
        {feed.map((n, k) => (
          <Card key={n.id} isPressable onPress={() => L.apri(n)} className="overflow-hidden border border-white/10 bg-content1/70 text-left" radius="lg"><div className={`flex flex-col md:flex-row ${k % 2 ? 'md:flex-row-reverse' : ''}`}>
            <div className="relative min-h-[240px] bg-black/30 md:w-1/2"><img src={n.img} alt="" className="absolute inset-0 h-full w-full object-cover" /></div>
            <CardBody className="justify-center gap-3 p-8 md:w-1/2"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="text-2xl font-extrabold leading-tight">{n.titolo}</h3><p className="line-clamp-3 text-default-500">{n.testo}</p><span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary">Leggi <Ic d={P.arrow} s={16} /></span></CardBody>
          </div></Card>
        ))}
      </div>
      <Lettura {...L} />
    </>
  );
}

/* E6 · Carosello a manifesto (locandine verticali) con barra di avanzamento + elenco compatto dei comunicati */
function E6() {
  const L = useLettura();
  const [i, setI] = useState(0);
  const poster = TUTTE.filter((n) => n.img);
  return (
    <>
      <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">In primo piano</h2><div className="flex gap-2"><Button isIconOnly radius="full" variant="flat" isDisabled={i === 0} onPress={() => setI(i - 1)}><span className="rotate-180"><Ic d={P.arrow} /></span></Button><Button isIconOnly radius="full" variant="flat" isDisabled={i >= poster.length - 3} onPress={() => setI(i + 1)}><Ic d={P.arrow} /></Button></div></div>
      <div className="overflow-hidden"><div className="flex gap-5 transition-transform duration-500" style={{ transform: `translateX(calc(-${i} * (33.333% + 7px)))` }}>
        {poster.map((n) => (
          <Card key={n.id} isPressable onPress={() => L.apri(n)} className="relative h-[420px] w-[calc(33.333%-14px)] flex-none overflow-hidden border border-white/10 text-left" radius="lg">
            <img src={n.img} alt="" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <CardBody className="relative justify-end gap-2 p-6"><div className="flex items-center gap-2"><Tipo t={n.tipo} /><span className="text-xs text-white/70">{n.data}</span></div><h3 className="text-xl font-extrabold leading-snug">{n.titolo}</h3></CardBody>
          </Card>
        ))}
      </div></div>
      <Progress aria-label="Avanzamento" size="sm" value={((i + 3) / poster.length) * 100} className="mt-4 max-w-xs" />
      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {TUTTE.filter((n) => !n.img).map((u) => (<Card key={u.id} isPressable onPress={() => L.apri(u)} className="border border-warning/30 bg-warning/5 text-left" radius="lg"><CardBody className="gap-2 p-5"><div className="flex items-center gap-3"><Tipo t={u.tipo} /><Data d={u.data} /></div><h3 className="font-semibold leading-snug">{u.titolo}</h3><p className="line-clamp-2 text-sm text-default-500">{u.testo}</p></CardBody></Card>))}
      </div>
      <Lettura {...L} />
    </>
  );
}

export function Corpo3({ v }) {
  const V = { e1: E1, e2: E2, e3: E3, e4: E4, e5: E5, e6: E6 }[v];
  return <Pagina><V /></Pagina>;
}
