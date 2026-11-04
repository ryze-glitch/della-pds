'use client';

import { useMemo, useState } from 'react';
import { Avatar, Button, Card, CardBody, Chip, Divider, Input, Tab, Tabs, Tooltip, ScrollShadow } from '@heroui/react';
import { Ic, P } from '../notizie-header/header';
import { Data, Pagina, TUTTE, Tipo } from '../notizie-corpo/corpo';

const Punto = ({ t }) => <span className={`h-2 w-2 flex-none rounded-full ${t === 'Avviso' ? 'bg-danger' : t === 'Comunicato' ? 'bg-warning' : t === 'Lutto' ? 'bg-default-400' : t === 'Cerimonie' ? 'bg-success' : 'bg-primary'}`} />;
const Cerca = <Ic d={P.search} />;
const Autore = () => (<div className="flex items-center gap-3"><Avatar src="/crest.png" size="sm" className="bg-black/40 p-1" /><span className="text-sm text-default-500">Ufficio Stampa · Questura di Roma</span></div>);
const Corpo = ({ n }) => (
  <>
    <div className="flex flex-wrap items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /><span className="font-mono text-xs text-default-500">{n.prot}</span></div>
    <h2 className="text-3xl font-extrabold leading-tight">{n.titolo}</h2>
    {n.img && <div className="flex h-72 items-center justify-center rounded-2xl bg-black/30"><img src={n.img} alt="" className="h-full object-contain p-3" /></div>}
    <p className="leading-relaxed text-default-500">{n.testo}</p>
  </>
);
function useSel(iniz = 3) { const [i, setI] = useState(iniz); return [i, setI, TUTTE[i]]; }
const Nav = ({ i, setI }) => (
  <div className="flex items-center justify-between">
    <Button size="sm" variant="flat" radius="full" isDisabled={i === 0} onPress={() => setI(i - 1)} startContent={<span className="rotate-180"><Ic d={P.arrow} s={14} /></span>}>Più recente</Button>
    <span className="text-xs text-default-500">{i + 1} di {TUTTE.length}</span>
    <Button size="sm" variant="flat" radius="full" isDisabled={i === TUTTE.length - 1} onPress={() => setI(i + 1)} endContent={<Ic d={P.arrow} s={14} />}>Meno recente</Button>
  </div>
);

/* D1 · come la B6, ma con ricerca, filtri sopra l'elenco e frecce precedente/successiva */
function D1() {
  const [i, setI, n] = useSel();
  const [q, setQ] = useState(''); const [f, setF] = useState('tutte');
  const lista = TUTTE.map((x, k) => ({ ...x, k })).filter((x) => (f === 'tutte' || (f === 'comunicati' ? ['Avviso', 'Comunicato'].includes(x.tipo) : !['Avviso', 'Comunicato'].includes(x.tipo))) && x.titolo.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-3 p-4">
        <Input size="sm" radius="lg" variant="bordered" placeholder="Cerca…" value={q} onValueChange={setQ} startContent={Cerca} />
        <Tabs size="sm" radius="full" color="primary" selectedKey={f} onSelectionChange={setF} fullWidth aria-label="Filtro"><Tab key="tutte" title="Tutte" /><Tab key="notizie" title="Notizie" /><Tab key="comunicati" title="Comunicati" /></Tabs>
        <div className="flex flex-col gap-1">
          {lista.map((x) => (
            <button key={x.id} type="button" onClick={() => setI(x.k)} className={`flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${x.k === i ? 'bg-primary/15' : 'hover:bg-white/5'}`}><span className="mt-1.5"><Punto t={x.tipo} /></span><span><span className="block font-semibold leading-snug">{x.titolo}</span><span className="text-xs text-default-500">{x.data}</span></span></button>
          ))}
          {!lista.length && <p className="p-4 text-center text-sm text-default-500">Nessun risultato</p>}
        </div>
      </CardBody></Card>
      <Card className="border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-5 p-8"><Corpo n={n} /><Divider /><Nav i={i} setI={setI} /></CardBody></Card>
    </div>
  );
}

/* D2 · elenco con miniature e lettura con immagine grande in testa */
function D2() {
  const [i, setI, n] = useSel();
  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="flex flex-col gap-3">
        {TUTTE.map((x, k) => (
          <Card key={x.id} isPressable onPress={() => setI(k)} className={`border bg-content1/70 text-left ${k === i ? 'border-primary' : 'border-white/10'}`} radius="lg"><CardBody className="flex-row items-center gap-3 p-3">
            {x.img ? <img src={x.img} alt="" className="h-14 w-20 flex-none rounded-lg bg-black/30 object-contain" /> : <div className="flex h-14 w-20 flex-none items-center justify-center rounded-lg bg-warning/15 text-warning"><Ic d={P.mega} s={22} /></div>}
            <div className="min-w-0"><div className="text-[11px] text-default-500">{x.data}</div><div className="line-clamp-2 text-sm font-semibold leading-snug">{x.titolo}</div></div>
          </CardBody></Card>
        ))}
      </div>
      <Card className="overflow-hidden border border-white/10 bg-content1/70" radius="lg">
        <div className="relative flex h-64 items-center justify-center bg-black/40">{n.img ? <><img src={n.img} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-25 blur-2xl" /><img src={n.img} alt="" className="relative h-full object-contain p-4" /></> : <span className="text-warning"><Ic d={P.mega} s={72} /></span>}</div>
        <CardBody className="gap-4 p-8"><div className="flex flex-wrap items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /><span className="font-mono text-xs text-default-500">{n.prot}</span></div><h2 className="text-3xl font-extrabold leading-tight">{n.titolo}</h2><p className="leading-relaxed text-default-500">{n.testo}</p><Divider /><Autore /></CardBody>
      </Card>
    </div>
  );
}

/* D3 · schede in alto (Notizie / Comunicati), elenco raggruppato per anno, lettura con scorri-e-vai */
function D3() {
  const [i, setI, n] = useSel();
  const [f, setF] = useState('tutte');
  const anni = [...new Set(TUTTE.map((x) => x.data.split(' ')[2]))].sort().reverse();
  const ok = (x) => f === 'tutte' || (f === 'comunicati' ? ['Avviso', 'Comunicato'].includes(x.tipo) : !['Avviso', 'Comunicato'].includes(x.tipo));
  return (
    <>
      <div className="mb-5"><Tabs variant="underlined" color="primary" selectedKey={f} onSelectionChange={setF} aria-label="Sezione"><Tab key="tutte" title="Tutte" /><Tab key="notizie" title="Notizie" /><Tab key="comunicati" title="Comunicati e avvisi" /></Tabs></div>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <ScrollShadow className="max-h-[640px]">
          {anni.map((a) => (
            <div key={a} className="mb-4"><div className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-default-500">{a}<Divider className="flex-1" /></div>
              {TUTTE.map((x, k) => ({ ...x, k })).filter((x) => x.data.includes(a) && ok(x)).map((x) => (
                <button key={x.id} type="button" onClick={() => setI(x.k)} className={`mb-1 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${x.k === i ? 'bg-primary/15' : 'hover:bg-white/5'}`}><span className="w-10 flex-none text-center"><span className="block text-lg font-extrabold leading-none">{x.data.split(' ')[0]}</span><span className="text-[10px] uppercase text-default-500">{x.data.split(' ')[1].slice(0, 3)}</span></span><span className="text-sm font-semibold leading-snug">{x.titolo}</span></button>
              ))}
            </div>
          ))}
        </ScrollShadow>
        <Card className="border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-5 p-8"><Corpo n={n} /><Divider /><Nav i={i} setI={setI} /></CardBody></Card>
      </div>
    </>
  );
}

/* D4 · striscia orizzontale di date in alto, lettura a tutta larghezza sotto (comoda anche da telefono) */
function D4() {
  const [i, setI, n] = useSel();
  return (
    <>
      <ScrollShadow orientation="horizontal" className="mb-6 flex gap-3 pb-2">
        {TUTTE.map((x, k) => (
          <button key={x.id} type="button" onClick={() => setI(k)} className={`w-44 flex-none rounded-2xl border p-4 text-left transition-colors ${k === i ? 'border-primary bg-primary/15' : 'border-white/10 bg-content1/70 hover:bg-white/5'}`}><div className="flex items-center gap-2 text-[11px] text-default-500"><Punto t={x.tipo} />{x.data}</div><div className="mt-2 line-clamp-3 text-sm font-semibold leading-snug">{x.titolo}</div></button>
        ))}
      </ScrollShadow>
      <Card className="mx-auto max-w-3xl border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-5 p-8 md:p-10"><Corpo n={n} /><Divider /><Autore /><Nav i={i} setI={setI} /></CardBody></Card>
    </>
  );
}

/* D5 · tre colonne: date sottili con suggerimento, lettura al centro, ultimi comunicati a destra */
function D5() {
  const [i, setI, n] = useSel();
  const com = TUTTE.filter((x) => ['Avviso', 'Comunicato'].includes(x.tipo));
  return (
    <div className="grid gap-6 lg:grid-cols-[84px_1fr_300px]">
      <div className="flex flex-row gap-2 lg:flex-col">
        {TUTTE.map((x, k) => (
          <Tooltip key={x.id} content={x.titolo} placement="right" showArrow><button type="button" onClick={() => setI(k)} className={`flex h-16 w-full flex-col items-center justify-center rounded-2xl border transition-colors ${k === i ? 'border-primary bg-primary/15' : 'border-white/10 bg-content1/70 hover:bg-white/5'}`}><span className="text-xl font-extrabold leading-none">{x.data.split(' ')[0]}</span><span className="text-[10px] uppercase text-default-500">{x.data.split(' ')[1].slice(0, 3)} {x.data.split(' ')[2].slice(2)}</span></button></Tooltip>
        ))}
      </div>
      <Card className="border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-5 p-8"><Corpo n={n} /><Divider /><Autore /></CardBody></Card>
      <Card className="h-fit border border-warning/30 bg-warning/5" radius="lg"><CardBody className="gap-4 p-5"><div className="flex items-center gap-2 font-semibold text-warning"><Ic d={P.mega} /> Ultimi comunicati</div>{com.map((c) => (<div key={c.id}><Tipo t={c.tipo} /><p className="mt-1.5 text-sm font-semibold leading-snug">{c.titolo}</p><p className="text-xs text-default-500">{c.data}</p></div>))}</CardBody></Card>
    </div>
  );
}

/* D6 · elenco e lettura nella stessa scheda, divisi da una linea (più compatta e "da applicazione") */
function D6() {
  const [i, setI, n] = useSel();
  return (
    <Card className="overflow-hidden border border-white/10 bg-content1/70" radius="lg"><div className="grid lg:grid-cols-[330px_1fr]">
      <div className="border-b border-white/10 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4"><span className="font-semibold">Tutte le comunicazioni</span><Chip size="sm" variant="flat">{TUTTE.length}</Chip></div><Divider />
        <ScrollShadow className="max-h-[640px]">
          {TUTTE.map((x, k) => (
            <button key={x.id} type="button" onClick={() => setI(k)} className={`flex w-full items-start gap-3 border-l-2 px-5 py-4 text-left transition-colors ${k === i ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-white/5'}`}><span className="mt-1.5"><Punto t={x.tipo} /></span><span><span className="block text-sm font-semibold leading-snug">{x.titolo}</span><span className="text-xs text-default-500">{x.tipo} · {x.data}</span></span></button>
          ))}
        </ScrollShadow>
      </div>
      <div className="flex flex-col gap-5 p-8"><Corpo n={n} /><Divider /><Nav i={i} setI={setI} /></div>
    </div></Card>
  );
}

export function Corpo2({ v }) {
  const V = { d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6 }[v];
  return <Pagina><V /></Pagina>;
}
