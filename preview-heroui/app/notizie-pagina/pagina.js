'use client';

import { useState } from 'react';
import { Accordion, AccordionItem, Avatar, Button, Card, CardBody, Chip, Divider, Popover, PopoverContent, PopoverTrigger, Switch, Tab, Tabs } from '@heroui/react';
import { Barra, Ic, P } from '../notizie-header/header';
import { Testo } from '../notizie-header2/header';
import { Data, TUTTE, Tipo } from '../notizie-corpo/corpo';

const UP = 'M12 19V5M6 11l6-6 6 6';

/* Intestazione già scelta: foto che sfuma a destra + scheda "In evidenza" */
const Testa = () => (
  <div className="relative min-h-[520px] overflow-hidden bg-background">
    <div className="absolute inset-y-0 right-0 w-[70%] [mask-image:linear-gradient(to_right,transparent,black_55%)]"><img src="/foto/giuramento.png" alt="" className="h-full w-full object-cover" /></div>
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    <div className="relative"><Barra />
      <Testo />
      <div className="relative mx-auto hidden max-w-6xl px-6 md:block"><div className="absolute -top-0 right-6 flex items-center gap-4 rounded-2xl border border-white/15 bg-background/60 p-3 pr-5 backdrop-blur-xl"><img src="/foto/king.png" alt="" className="h-16 w-24 rounded-xl object-cover" /><div><Chip size="sm" color="warning" variant="flat">In evidenza</Chip><p className="mt-1 text-sm font-semibold">Cambio Dirigenti in Questura di Roma</p></div></div></div>
    </div>
  </div>
);
const Corpo = ({ children }) => <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-14">{children}</main>;
const NOTIZIE = TUTTE.filter((n) => !['Avviso', 'Comunicato'].includes(n.tipo));
const COMUN = TUTTE.filter((n) => ['Avviso', 'Comunicato'].includes(n.tipo));

/* I1 · Pannelli orizzontali: passando sopra uno, si allarga e mostra il testo */
function I1() {
  const [a, setA] = useState(3);
  return (
    <div className="flex h-[480px] gap-3">
      {TUTTE.map((n, k) => (
        <div key={n.id} onMouseEnter={() => setA(k)} onClick={() => setA(k)} className={`relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 transition-all duration-500 ${k === a ? 'flex-[6]' : 'flex-1'}`}>
          {n.img ? <img src={n.img} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-b from-warning/25 to-background" />}
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 ${k === a ? 'to-transparent' : 'to-black/50'}`} />
          {k === a ? (
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-7"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="text-3xl font-extrabold leading-tight">{n.titolo}</h3><p className="line-clamp-3 max-w-xl text-white/80">{n.testo}</p><div><Button color="primary" radius="full" endContent={<Ic d={P.arrow} s={16} />}>Leggi</Button></div></div>
          ) : (
            <div className="absolute inset-0 flex items-end justify-center p-3"><span className="whitespace-nowrap text-sm font-bold" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.titolo}</span></div>
          )}
        </div>
      ))}
    </div>
  );
}

/* I2 · Schede che si impilano mentre scorri (ognuna resta appiccicata in alto) */
function I2() {
  return (
    <div className="pb-24">
      {TUTTE.map((n, k) => (
        <div key={n.id} className="sticky mb-10" style={{ top: 96 + k * 22 }}>
          <Card className="overflow-hidden border border-white/10 bg-content1" radius="lg" shadow="lg"><div className="grid md:grid-cols-[1fr_1.1fr]">
            <CardBody className="justify-center gap-3 p-9"><div className="flex items-center gap-3"><span className="font-mono text-sm text-default-500">{String(k + 1).padStart(2, '0')} / {String(TUTTE.length).padStart(2, '0')}</span><Tipo t={n.tipo} /></div><h3 className="text-3xl font-extrabold leading-tight">{n.titolo}</h3><p className="line-clamp-3 text-default-500">{n.testo}</p><Data d={n.data} /></CardBody>
            <div className="relative h-72 bg-black/30 md:h-auto">{n.img ? <img src={n.img} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-warning/25 to-transparent text-warning"><Ic d={P.mega} s={64} /></div>}</div>
          </div></Card>
        </div>
      ))}
    </div>
  );
}

/* I3 · Coverflow 3D: la scheda al centro è grande, le altre girate ai lati */
function I3() {
  const [c, setC] = useState(3);
  return (
    <div>
      <div className="relative mx-auto h-[460px] max-w-5xl overflow-hidden" style={{ perspective: 1400 }}>
        {TUTTE.map((n, k) => { const d = k - c; if (Math.abs(d) > 2) return null; return (
          <div key={n.id} onClick={() => setC(k)} className="absolute left-1/2 top-4 h-[420px] w-[360px] cursor-pointer transition-all duration-500" style={{ transform: `translateX(calc(-50% + ${d * 300}px)) rotateY(${d * -38}deg) scale(${d === 0 ? 1 : 0.86})`, zIndex: 10 - Math.abs(d), opacity: Math.abs(d) === 2 ? 0.55 : 1 }}>
            <Card className="relative h-full overflow-hidden border border-white/15" radius="lg" shadow="lg">
              {n.img ? <img src={n.img} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-warning/30 to-background" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <CardBody className="relative justify-end gap-2 p-6"><div className="flex items-center gap-2"><Tipo t={n.tipo} /><span className="text-xs text-white/70">{n.data}</span></div><h3 className="text-xl font-extrabold leading-snug">{n.titolo}</h3>{d === 0 && <p className="line-clamp-3 text-sm text-white/75">{n.testo}</p>}</CardBody>
            </Card>
          </div>); })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-3"><Button isIconOnly radius="full" variant="flat" isDisabled={c === 0} onPress={() => setC(c - 1)}><span className="rotate-180"><Ic d={P.arrow} /></span></Button><span className="w-16 text-center text-sm text-default-500">{c + 1} / {TUTTE.length}</span><Button isIconOnly radius="full" variant="flat" isDisabled={c === TUTTE.length - 1} onPress={() => setC(c + 1)}><Ic d={P.arrow} /></Button></div>
    </div>
  );
}

/* I4 · Come un canale annunci di Discord: messaggi dell'Ufficio Stampa con riquadro colorato */
function I4() {
  const col = { Avviso: '#f31260', Comunicato: '#f5a524', Lutto: '#9ca3af', Nomine: '#2563eb', Cerimonie: '#17c964' };
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#14161c]">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4"><span className="text-2xl text-default-500">#</span><span className="font-bold">comunicati-ufficiali</span><Divider orientation="vertical" className="h-5" /><span className="text-sm text-default-500">Notizie e avvisi della Questura di Roma</span></div>
      <div className="flex flex-col">
        {TUTTE.map((n, k) => (
          <div key={n.id} className="group flex gap-4 px-6 py-4 transition-colors hover:bg-white/[0.03]">
            <Avatar src="/crest.png" className="mt-1 h-11 w-11 flex-none bg-black/40 p-1.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><span className="font-semibold">Polizia di Stato</span><Chip size="sm" color="primary" variant="solid" radius="sm" classNames={{ base: 'h-4 px-1', content: 'px-0.5 text-[10px] font-bold' }}>UFFICIALE</Chip><span className="text-xs text-default-500">{n.data}</span></div>
              <div className="mt-2 flex max-w-xl gap-0 overflow-hidden rounded-md bg-[#1b1e26]" style={{ borderLeft: `4px solid ${col[n.tipo]}` }}>
                <div className="flex-1 p-4"><div className="text-xs font-semibold" style={{ color: col[n.tipo] }}>{n.tipo.toUpperCase()}</div><div className="mt-1 font-bold text-[#7aa2ff]">{n.titolo}</div><p className="mt-1.5 text-sm leading-relaxed text-default-400">{n.testo}</p>{n.img && <img src={n.img} alt="" className="mt-3 max-h-60 rounded-lg object-cover" />}<div className="mt-3 text-[11px] text-default-500">Ufficio Stampa · {n.prot}</div></div>
              </div>
              <div className="mt-2 flex gap-2">{[['Letto', 12 + k * 3], ['Condiviso', 3 + k]].map(([l, v]) => (<span key={l} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-default-400">{l} {v}</span>))}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* I5 · Anno in un colpo d'occhio: griglia dei mesi con un punto per ogni uscita, clic per leggere */
function I5() {
  const MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  const NM = { Gennaio: 0, Febbraio: 1, Marzo: 2, Aprile: 3, Maggio: 4, Giugno: 5, Luglio: 6, Agosto: 7, Settembre: 8, Ottobre: 9, Novembre: 10, Dicembre: 11 };
  const [sel, setSel] = useState('2025-4');
  const mese = (n) => { const [, m, a] = n.data.split(' '); return `${a}-${NM[m]}`; };
  const lista = TUTTE.filter((n) => mese(n) === sel);
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <Card className="h-fit border border-white/10 bg-content1/70" radius="lg"><CardBody className="gap-6 p-6">
        {['2025', '2024'].map((a) => (
          <div key={a}><div className="mb-3 text-2xl font-extrabold">{a}</div>
            <div className="grid grid-cols-6 gap-2">
              {MESI.map((m, k) => { const q = TUTTE.filter((n) => mese(n) === `${a}-${k}`); const on = sel === `${a}-${k}`; return (
                <button key={m} type="button" onClick={() => setSel(`${a}-${k}`)} className={`flex h-20 flex-col items-center justify-between rounded-xl border p-2 transition-colors ${on ? 'border-primary bg-primary/15' : q.length ? 'border-white/15 bg-white/5 hover:bg-white/10' : 'border-white/5 text-default-600'}`}><span className="text-xs">{m}</span><span className="flex gap-1">{q.map((x) => (<span key={x.id} className={`h-2.5 w-2.5 rounded-full ${x.tipo === 'Avviso' ? 'bg-danger' : x.tipo === 'Comunicato' ? 'bg-warning' : 'bg-primary'}`} />))}</span></button>); })}
            </div></div>
        ))}
        <div className="flex gap-4 text-xs text-default-500"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-primary" />Notizie</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-warning" />Comunicati</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-danger" />Avvisi</span></div>
      </CardBody></Card>
      <div className="flex flex-col gap-4">
        {lista.length ? lista.map((n) => (<Card key={n.id} className="border border-white/10 bg-content1/70" radius="lg">{n.img && <img src={n.img} alt="" className="h-48 w-full object-cover" />}<CardBody className="gap-2 p-6"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="text-xl font-bold leading-snug">{n.titolo}</h3><p className="text-default-500">{n.testo}</p></CardBody></Card>)) : <Card className="border border-dashed border-white/15 bg-transparent" radius="lg"><CardBody className="py-16 text-center text-default-500">Nessuna uscita in questo mese.</CardBody></Card>}
      </div>
    </div>
  );
}

/* I6 · Due colonne con funzioni diverse: Notizie (ampia, con foto) e Comunicati (stretta, a fisarmonica) */
function I6() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
      <section><h2 className="mb-5 flex items-center gap-3 text-2xl font-extrabold">Notizie<Chip size="sm" variant="flat">{NOTIZIE.length}</Chip></h2>
        <div className="flex flex-col gap-5">{NOTIZIE.map((n) => (
          <Card key={n.id} className="border border-white/10 bg-content1/70" radius="lg"><div className="grid sm:grid-cols-[220px_1fr]"><img src={n.img} alt="" className="h-44 w-full object-cover sm:h-full" /><CardBody className="gap-2 p-6"><div className="flex items-center gap-3"><Tipo t={n.tipo} /><Data d={n.data} /></div><h3 className="text-lg font-bold leading-snug">{n.titolo}</h3><p className="line-clamp-2 text-sm text-default-500">{n.testo}</p></CardBody></div></Card>))}</div></section>
      <aside className="lg:sticky lg:top-6 lg:self-start"><div className="rounded-3xl border border-warning/30 bg-warning/5 p-5"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-extrabold text-warning"><Ic d={P.mega} /> Comunicati e avvisi</h2></div>
        <Accordion variant="light" defaultExpandedKeys={['c1']} itemClasses={{ title: 'font-semibold leading-snug', subtitle: 'text-xs', trigger: 'py-3' }}>
          {COMUN.map((c) => (<AccordionItem key={c.id} aria-label={c.titolo} title={c.titolo} subtitle={`${c.tipo} · ${c.data}`}><p className="pb-3 text-sm text-default-400">{c.testo}</p></AccordionItem>))}
        </Accordion>
        <Divider className="my-3" /><Switch defaultSelected size="sm">Avvisami dei nuovi comunicati</Switch></div></aside>
    </div>
  );
}

export function Pagina7({ v }) {
  const V = { i1: I1, i2: I2, i3: I3, i4: I4, i5: I5, i6: I6 }[v];
  return (<div className="min-h-screen bg-background"><Testa /><Corpo><V /></Corpo></div>);
}
