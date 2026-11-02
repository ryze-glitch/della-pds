'use client';

import { useState } from 'react';
import { Button, Card, CardBody, Chip, Divider, Input, Kbd, Listbox, ListboxItem, Tab, Tabs } from '@heroui/react';
import { VARIANTI3 } from '../navbar/variants3';

export const Ic = ({ d, s = 20 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const P = {
  file: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v2a3 3 0 0 0 3 3M16 6h4v2a3 3 0 0 1-3 3M12 13v4M8 21h8M10 17h4',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4',
  pin: 'M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12ZM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  alert: 'M12 3 2 20h20zM12 10v4M12 17v.5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
};

export const SERVIZI = [
  { k: 'den', t: 'Denuncia online', s: 'Segnala un fatto senza venire in sede', i: P.file },
  { k: 'arm', t: "Porto d'armi", s: 'Richiedi o rinnova il porto', i: P.shield },
  { k: 'col', t: 'Prenota un colloquio', s: 'Scegli giorno e orario', i: P.cal },
  { k: 'con', t: 'Concorso pubblico', s: 'Entra nella Polizia di Stato', i: P.trophy },
];

export const glass = 'border border-white/10 bg-content1/60 shadow-xl shadow-black/40 backdrop-blur-2xl';

export function Sfondo({ children, v }) {
  const Nav = VARIANTI3.m;
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* al posto della foto della sede (nel sito vero c'è la fotografia con la sua sfumatura scura) */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(37,99,235,0.35),transparent_55%),radial-gradient(ellipse_at_15%_75%,rgba(120,130,160,0.22),transparent_50%),linear-gradient(180deg,#0b0d14,#090a0f)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.02)_0_2px,transparent_2px_46px)]" />
      <Nav />
      <main className="relative">{children}</main>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-widest text-default-500">{v}</p>
    </div>
  );
}

// ---- A: editoriale a sinistra, stemma grande a destra
function A() {
  return (
    <Sfondo v="A · Editoriale a sinistra">
      <section className="mx-auto grid min-h-screen max-w-[1200px] items-center gap-10 px-6 pb-20 pt-32 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Chip variant="flat" color="primary" size="lg" startContent={<span className="ml-1 h-2 w-2 rounded-full bg-success" />} classNames={{ content: 'font-semibold' }}>Italian Paradise XI · Questura IPRP</Chip>
          <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[1.02] tracking-wide sm:text-7xl">Polizia<br />di Stato</h1>
          <p className="mt-5 max-w-md text-lg text-default-500">Sicurezza, legalità e servizio ai cittadini. Denunce, pratiche e colloqui direttamente online.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Scopri i servizi</Button>
            <Button variant="bordered" radius="full" size="lg" className="border-white/20 font-semibold">Denuncia online</Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-default-500">
            <span className="flex items-center gap-2"><Ic d={P.pin} s={16} />Via dei Peccatori N°761</span>
            <Divider orientation="vertical" className="h-4" />
            <span className="flex items-center gap-2"><Ic d={P.phone} s={16} />Tel. 113</span>
          </div>
        </div>
        <div className="hidden justify-center md:flex"><img src="/crest.png" alt="" className="h-[420px] w-auto drop-shadow-[0_20px_60px_rgba(37,99,235,0.35)]" /></div>
      </section>
    </Sfondo>
  );
}

// ---- B: centrata, schede dei servizi sotto il titolo
function B() {
  return (
    <Sfondo v="B · Centrata con servizi rapidi">
      <section className="mx-auto flex min-h-screen max-w-[1100px] flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
        <img src="/crest.png" alt="" className="h-24 w-auto drop-shadow-2xl" />
        <h1 className="mt-5 text-5xl font-extrabold uppercase tracking-wide sm:text-7xl">Polizia di Stato</h1>
        <p className="mt-3 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVIZI.map((s) => (
            <Card key={s.k} isPressable isHoverable className={`${glass} text-left`}>
              <CardBody className="gap-3 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Ic d={s.i} s={22} /></span>
                <div><p className="font-semibold">{s.t}</p><p className="mt-1 text-sm text-default-500">{s.s}</p></div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </Sfondo>
  );
}

// ---- C: titolo a sinistra, scheda di vetro con elenco servizi a destra
function C() {
  return (
    <Sfondo v="C · Titolo + scheda servizi">
      <section className="mx-auto grid min-h-screen max-w-[1200px] items-center gap-10 px-6 pb-20 pt-32 md:grid-cols-2">
        <div>
          <img src="/crest.png" alt="" className="h-20 w-auto" />
          <h1 className="mt-6 text-5xl font-extrabold uppercase leading-[1.02] tracking-wide sm:text-6xl">Polizia<br />di Stato</h1>
          <p className="mt-4 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
          <Button color="primary" radius="full" size="lg" className="mt-8 font-semibold" endContent={<Ic d={P.down} s={18} />}>Scopri i servizi</Button>
        </div>
        <Card className={`${glass} max-w-md justify-self-end`}>
          <CardBody className="p-3">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-widest text-default-500">Di cosa hai bisogno?</p>
            <Listbox aria-label="Servizi" variant="flat" itemClasses={{ base: 'rounded-2xl px-3 py-3 gap-3 data-[hover=true]:bg-white/10', title: 'font-semibold', description: 'text-default-500' }}>
              {SERVIZI.map((s) => (
                <ListboxItem key={s.k} description={s.s} startContent={<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><Ic d={s.i} /></span>} endContent={<Ic d={P.arrow} s={16} />}>{s.t}</ListboxItem>
              ))}
            </Listbox>
          </CardBody>
        </Card>
      </section>
    </Sfondo>
  );
}

// ---- D: centrata con barra di ricerca
function D() {
  return (
    <Sfondo v="D · Centrata con ricerca">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
        <img src="/crest.png" alt="" className="h-24 w-auto drop-shadow-2xl" />
        <h1 className="mt-5 text-5xl font-extrabold uppercase tracking-wide sm:text-7xl">Polizia di Stato</h1>
        <p className="mt-3 text-default-500">Come possiamo aiutarti?</p>
        <Input
          aria-label="Cerca un servizio" placeholder="Cerca un servizio, una pratica, una notizia…" radius="full" size="lg" className="mt-8"
          startContent={<Ic d={P.search} s={18} />} endContent={<Kbd keys={['command']}>K</Kbd>}
          classNames={{ inputWrapper: `h-14 ${glass} data-[hover=true]:bg-content1/80`, input: 'text-base' }}
        />
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {['Denuncia online', "Porto d'armi", 'Prenota un colloquio', 'Concorso', 'Stato della pratica'].map((t) => (
            <Chip key={t} as="button" variant="bordered" className="cursor-pointer border-white/15 transition-colors hover:bg-white/10">{t}</Chip>
          ))}
        </div>
        <p className="mt-10 text-sm text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
      </section>
    </Sfondo>
  );
}

// ---- E: titolo in basso a sinistra, barra informazioni di vetro in fondo
function E() {
  const info = [
    { i: P.pin, t: 'Indirizzo', s: 'Via dei Peccatori N°761' },
    { i: P.phone, t: 'Telefono', s: '113' },
    { i: P.alert, t: 'Emergenza', s: 'Chiama il 112' },
    { i: P.cal, t: 'Sportello', s: 'Prenotazione online' },
  ];
  return (
    <Sfondo v="E · Titolo in basso + barra informazioni">
      <section className="mx-auto flex min-h-screen max-w-[1250px] flex-col justify-end px-6 pb-20 pt-32">
        <img src="/crest.png" alt="" className="mb-6 h-20 w-auto self-start" />
        <h1 className="text-6xl font-extrabold uppercase leading-[0.98] tracking-wide sm:text-8xl">Polizia<br />di Stato</h1>
        <Card className={`${glass} mt-10`}>
          <CardBody className="grid gap-4 p-5 sm:grid-cols-2 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            {info.map((x, i) => (
              <div key={x.t} className="flex items-center gap-4 lg:flex-1">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-primary/15 text-primary"><Ic d={x.i} s={20} /></span>
                <div><p className="text-xs uppercase tracking-widest text-default-500">{x.t}</p><p className="font-semibold">{x.s}</p></div>
                {i < info.length - 1 ? <Divider orientation="vertical" className="ml-auto hidden h-10 lg:block" /> : null}
              </div>
            ))}
            <Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Scopri i servizi</Button>
          </CardBody>
        </Card>
      </section>
    </Sfondo>
  );
}

// ---- F: schede per profilo (Cittadini · Aspiranti · Agenti)
const PROFILI = {
  cit: { t: 'Cittadini', d: 'Denunce, porto d’armi, colloqui e stato delle tue pratiche, senza code.', b: ['Denuncia online', 'Prenota un colloquio'] },
  asp: { t: 'Aspiranti agenti', d: 'Requisiti, prove e iscrizione al concorso pubblico per entrare in Polizia.', b: ['Concorso pubblico', 'Qualifiche'] },
  age: { t: 'Agenti', d: 'Area personale, corsi di formazione SISFOR+ e gestione delle pratiche.', b: ['Area Personale', 'Formazione'] },
};
function F() {
  const [k, setK] = useState('cit');
  const p = PROFILI[k];
  return (
    <Sfondo v="F · Percorsi per profilo">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
        <img src="/crest.png" alt="" className="h-24 w-auto drop-shadow-2xl" />
        <h1 className="mt-5 text-5xl font-extrabold uppercase tracking-wide sm:text-7xl">Polizia di Stato</h1>
        <p className="mt-3 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
        <Tabs aria-label="Profilo" selectedKey={k} onSelectionChange={setK} radius="full" size="lg" className="mt-10" classNames={{ tabList: `${glass} p-1.5`, cursor: 'bg-primary', tabContent: 'group-data-[selected=true]:text-white font-semibold' }}>
          {Object.entries(PROFILI).map(([id, x]) => <Tab key={id} title={x.t} />)}
        </Tabs>
        <Card className={`${glass} mt-4 w-full`}>
          <CardBody className="items-center gap-5 p-6">
            <p className="max-w-md text-center text-default-600">{p.d}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button color="primary" radius="full" className="font-semibold">{p.b[0]}</Button>
              <Button variant="bordered" radius="full" className="border-white/20 font-semibold">{p.b[1]}</Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </Sfondo>
  );
}

export const HEROES = { a: A, b: B, c: C, d: D, e: E, f: F };
