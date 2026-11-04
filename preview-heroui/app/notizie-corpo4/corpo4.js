'use client';

import { useState } from 'react';
import { Avatar, Badge, Button, Card, CardBody, CardFooter, Chip, Divider, Switch, Tab, Tabs, Tooltip } from '@heroui/react';
import { Ic, P } from '../notizie-header/header';
import { Data, Pagina, TUTTE, Tipo } from '../notizie-corpo/corpo';

const HEART = 'M12 21s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.3 6c-2.3 4.600-9.300 9-9.300 9Z';
const SHARE = 'M4 12v7h16v-7M12 3v12M7 8l5-5 5 5';
const CAT = { Avviso: 'Comunicati', Comunicato: 'Comunicati', Lutto: 'Lutto', Nomine: 'Nomine', Cerimonie: 'Cerimonie' };

/* F1 · Tipografica: titoli enormi in elenco, al passaggio compare l'anteprima con la foto */
function F1() {
  return (
    <div className="mx-auto max-w-5xl">
      {TUTTE.map((n) => (
        <Tooltip key={n.id} placement="right" offset={-120} showArrow={false} delay={0} closeDelay={0} classNames={{ content: 'p-0 overflow-hidden border border-white/15 bg-transparent shadow-2xl' }}
          content={<div className="w-64">{n.img ? <img src={n.img} alt="" className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center bg-warning/20 text-warning"><Ic d={P.mega} s={48} /></div>}<div className="bg-background/90 p-3 text-xs text-default-400">{n.tipo} · {n.data}</div></div>}>
          <a href="#" onClick={(e) => e.preventDefault()} className="group flex items-baseline gap-6 border-b border-white/10 py-6 transition-colors hover:border-primary">
            <span className="w-28 flex-none font-mono text-xs uppercase tracking-widest text-default-500">{n.data.split(' ').slice(0, 2).join(' ')}<br />{n.data.split(' ')[2]}</span>
            <span className="flex-1 text-3xl font-extrabold leading-tight text-white/60 transition-colors duration-300 group-hover:text-white md:text-4xl">{n.titolo}</span>
            <span className="hidden flex-none md:block"><Tipo t={n.tipo} /></span>
            <span className="flex-none text-default-600 transition group-hover:translate-x-2 group-hover:text-primary"><Ic d={P.arrow} s={26} /></span>
          </a>
        </Tooltip>
      ))}
    </div>
  );
}

/* F2 · Bacheca social: colonna centrale come un feed, con segui / condividi / mi piace */
function F2() {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_280px]">
      <div className="flex flex-col gap-5">
        {TUTTE.map((n, k) => (
          <Card key={n.id} className="border border-white/10 bg-content1/70" radius="lg">
            <CardBody className="gap-4 p-5">
              <div className="flex items-center gap-3"><Badge content="" color="success" shape="circle" placement="bottom-right" size="sm"><Avatar src="/crest.png" className="bg-black/40 p-1.5" /></Badge><div className="leading-tight"><div className="font-semibold">Polizia di Stato · Questura di Roma</div><div className="text-xs text-default-500">{n.data} · {n.tipo}</div></div><div className="ml-auto"><Tipo t={n.tipo} /></div></div>
              <div><h3 className="text-xl font-bold leading-snug">{n.titolo}</h3><p className="mt-1.5 text-default-500">{n.testo}</p></div>
              {n.img && <img src={n.img} alt="" className="max-h-80 w-full rounded-2xl bg-black/30 object-cover" />}
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 px-5 py-3"><Button size="sm" variant="light" startContent={<Ic d={HEART} s={16} />}>{12 + k * 7}</Button><Button size="sm" variant="light" startContent={<Ic d={SHARE} s={16} />}>Condividi</Button><span className="ml-auto text-xs text-default-500">{n.prot}</span></CardFooter>
          </Card>
        ))}
      </div>
      <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <Card className="border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-4 p-5"><div className="flex items-center gap-3"><Avatar src="/crest.png" className="bg-black/40 p-1.5" /><div><div className="font-semibold">Sala stampa</div><div className="text-xs text-default-500">Questura di Roma</div></div></div><Switch defaultSelected size="sm">Ricevi gli avvisi</Switch><Switch size="sm">Solo comunicati urgenti</Switch></CardBody></Card>
        <Card className="border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-2 p-5"><span className="text-sm font-semibold">Argomenti</span><div className="flex flex-wrap gap-2">{['Nomine', 'Cerimonie', 'Concorso', 'Porto d’armi', 'Avvisi'].map((c) => (<Chip key={c} variant="flat" size="sm">#{c}</Chip>))}</div></CardBody></Card>
      </aside>
    </div>
  );
}

/* F3 · Schermo diviso: a sinistra la foto fissa che cambia, a destra l'elenco da scorrere */
function F3() {
  const [i, setI] = useState(3);
  const n = TUTTE[i];
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card className="relative h-[520px] overflow-hidden border border-white/10" radius="lg">
          {n.img ? <img key={n.id} src={n.img} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-warning/30 to-background" />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <CardBody className="relative justify-end gap-3 p-7"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h2 className="text-3xl font-extrabold leading-tight">{n.titolo}</h2><p className="line-clamp-3 text-default-400">{n.testo}</p><div><Button color="primary" radius="full" endContent={<Ic d={P.arrow} s={16} />}>Leggi tutto</Button></div></CardBody>
        </Card>
      </div>
      <div className="flex flex-col">
        {TUTTE.map((x, k) => (
          <button key={x.id} type="button" onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} className={`border-b border-white/10 py-7 text-left transition-all ${k === i ? 'pl-4 opacity-100' : 'opacity-50 hover:opacity-80'}`}>
            <div className="flex items-center gap-3 text-xs text-default-500"><span className={`h-2 w-2 rounded-full ${k === i ? 'bg-primary' : 'bg-white/20'}`} />{x.data}<Tipo t={x.tipo} /></div><h3 className="mt-2 text-2xl font-bold leading-snug">{x.titolo}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}

/* F4 · Categorie in verticale a sinistra (con conteggio) e schede delle notizie a destra */
function F4() {
  const cats = ['Tutte', 'Comunicati', 'Nomine', 'Cerimonie', 'Lutto'];
  return (
    <Tabs isVertical placement="start" color="primary" variant="light" aria-label="Categorie" classNames={{ base: 'items-start', tabList: 'w-56 gap-1 rounded-2xl border border-white/10 bg-content1/70 p-2', tab: 'h-12 justify-start px-4', panel: 'flex-1 pl-4 pt-0' }}>
      {cats.map((c) => {
        const lista = TUTTE.filter((n) => c === 'Tutte' || CAT[n.tipo] === c);
        return (
          <Tab key={c} title={<div className="flex w-full items-center justify-between gap-6"><span>{c}</span><Chip size="sm" variant="flat">{lista.length}</Chip></div>}>
            <div className="grid gap-4 md:grid-cols-2">
              {lista.map((n) => (
                <Card key={n.id} className="border border-white/10 bg-content1/70" radius="lg">
                  {n.img && <img src={n.img} alt="" className="h-40 w-full object-cover" />}
                  <CardBody className="gap-2 p-5"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="font-bold leading-snug">{n.titolo}</h3><p className="line-clamp-2 text-sm text-default-500">{n.testo}</p></CardBody>
                </Card>
              ))}
            </div>
          </Tab>
        );
      })}
    </Tabs>
  );
}

/* F5 · Bacheca di sughero: fogli appuntati e leggermente storti */
function F5() {
  const rot = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-[1.5deg]', 'rotate-[1.5deg]', '-rotate-1', 'rotate-2'];
  return (
    <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.04),transparent_40%),#14161c] p-8 md:p-12">
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
        {TUTTE.map((n, k) => (
          <div key={n.id} className={`relative ${rot[k]} transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]`}>
            <span className="absolute -top-3 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-gradient-to-br from-danger to-danger/60 shadow-lg ring-2 ring-black/30" />
            <Card className={`border ${['Avviso', 'Comunicato'].includes(n.tipo) ? 'border-warning/40 bg-warning/10' : 'border-white/10 bg-content1'}`} radius="md" shadow="lg">
              {n.img && <img src={n.img} alt="" className="h-36 w-full rounded-t-lg object-cover" />}
              <CardBody className="gap-2 p-5"><div className="flex items-center gap-2"><Tipo t={n.tipo} /><span className="text-xs text-default-500">{n.data}</span></div><h3 className="font-bold leading-snug">{n.titolo}</h3><p className="line-clamp-3 text-sm text-default-500">{n.testo}</p></CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

/* F6 · Comunicati come fogli ufficiali, con carta intestata, oggetto e firma */
function F6() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      {TUTTE.slice(0, 4).map((n) => (
        <Card key={n.id} className="border border-white/10 bg-[#f6f4ee] text-neutral-900" radius="sm" shadow="lg"><CardBody className="gap-6 p-10 md:p-14">
          <div className="flex items-center gap-4 border-b-2 border-neutral-900/80 pb-5"><img src="/crest.png" alt="" className="h-16" /><div className="leading-tight"><div className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-600">Polizia di Stato</div><div className="text-lg font-extrabold uppercase tracking-wide">Questura di Roma</div></div><div className="ml-auto text-right text-xs text-neutral-600"><div className="font-mono">{n.prot}</div><div>Roma, {n.data}</div></div></div>
          <div><div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Oggetto</div><h3 className="mt-1 font-serif text-2xl font-bold leading-snug">{n.titolo}</h3></div>
          <p className="font-serif text-[17px] leading-relaxed text-neutral-700">{n.testo}</p>
          <div className="flex items-end justify-between pt-4"><div className="text-xs text-neutral-500">Comunicato n. {n.prot.split('/')[1]}<br />Ufficio Stampa</div><div className="text-right"><div className="font-serif text-lg italic text-neutral-700">Il Questore</div><div className="mt-1 h-px w-40 bg-neutral-400" /></div></div>
        </CardBody></Card>
      ))}
    </div>
  );
}

export function Corpo4({ v }) {
  const V = { f1: F1, f2: F2, f3: F3, f4: F4, f5: F5, f6: F6 }[v];
  return <Pagina><V /></Pagina>;
}
