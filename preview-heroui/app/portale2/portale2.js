'use client';

import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, CardBody, Chip, Divider, Input, Kbd, Progress, ScrollShadow, Tab, Tabs, Tooltip } from '@heroui/react';
import { Ic, P } from '../sisfor/comune';

const X = {
  bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM10 20a2 2 0 0 0 4 0',
  folder: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 3a4 4 0 0 1 0 8M22 21a7 7 0 0 0-5-6.700',
  badge: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  org: 'M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  cap: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
};
const G = 'border border-white/10 bg-content1/70';
const AREE = [
  { k: 'gest', t: 'Gestione', d: 'Pratiche, candidature, comunicati', ic: X.folder, c: 'from-amber-500/25 to-amber-500/5', txt: 'text-warning', stato: '3 da lavorare' },
  { k: 'funz', t: 'Funzionari', d: 'Area dei funzionari', ic: X.badge, c: 'from-blue-500/25 to-blue-500/5', txt: 'text-primary', soon: true },
  { k: 'add', t: 'Addetti', d: 'Sportello e servizi', ic: X.users, c: 'from-emerald-500/25 to-emerald-500/5', txt: 'text-success', soon: true },
  { k: 'org', t: 'Organigramma', d: 'La struttura della Questura', ic: X.org, c: 'from-violet-500/25 to-violet-500/5', txt: 'text-secondary', stato: 'Consulta' },
];
const Foto = ({ s = 'md' }) => <Avatar src="/crest.png" size={s} isBordered color="primary" className="flex-none bg-black/40 p-1.5" />;
const Fondo = () => <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(ellipse_at_50%_-15%,rgba(37,99,235,0.28),transparent_60%)]" />;
const Barra = ({ cerca }) => (
  <header className="relative z-10 mx-auto flex max-w-6xl items-center gap-4 px-6 py-5">
    <img src="/crest.png" alt="" className="h-9" /><div className="leading-tight"><div className="font-extrabold">Area Personale</div><div className="text-[11px] text-default-500">Polizia di Stato · IPRP</div></div>
    {cerca && <Input className="mx-auto hidden max-w-sm md:flex" size="sm" radius="full" variant="bordered" placeholder="Cerca…" startContent={<Ic d={X.search} s={16} />} endContent={<Kbd keys={['command']}>K</Kbd>} />}
    <div className="ml-auto flex items-center gap-3"><Badge content="2" color="danger" size="sm"><Button isIconOnly variant="light" radius="full"><Ic d={X.bell} /></Button></Badge><Button size="sm" variant="flat" radius="full" className="hidden sm:flex">Torna al sito</Button><Foto s="sm" /></div>
  </header>
);
const Chip2 = ({ aperto }) => <Chip size="sm" color={aperto ? 'primary' : 'default'} variant={aperto ? 'solid' : 'flat'} startContent={<span className="pl-1"><Ic d={aperto ? X.cap : X.lock} s={13} /></span>}>{aperto ? 'Sbloccato' : 'Riservato agli Allievi Agenti'}</Chip>;

/* M1 · Bento: SISFOR in un grande riquadro, accanto riquadri di misure diverse per aree e avvisi */
function M1({ aperto }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background"><Fondo /><Barra />
      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-4">
        <p className="text-sm text-default-500">Buon pomeriggio</p><h1 className="mb-7 text-4xl font-extrabold tracking-tight">Gabriel Martinelli</h1>
        <div className="grid auto-rows-[170px] gap-4 md:grid-cols-4">
          <Card className={`relative overflow-hidden border md:col-span-2 md:row-span-2 ${aperto ? 'border-primary/40' : 'border-white/10'}`} radius="lg" isPressable={aperto}>
            <img src="/foto/giuramento-header.jpg" alt="" className={`absolute inset-0 h-full w-full object-cover opacity-40 ${aperto ? '' : 'grayscale'}`} /><div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-primary/20" />
            <CardBody className="relative justify-between p-8 text-left"><Chip2 aperto={aperto} />
              <div><div className="text-6xl font-extrabold tracking-tight">SISFOR<span className="text-primary">+</span></div><p className="mt-2 max-w-sm text-default-300">Corsi, quiz, esami e percorso verso l’abilitazione.</p>
                {aperto ? <div className="mt-5 flex items-center gap-4"><Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Entra</Button><div className="w-44"><div className="mb-1 text-[11px] text-default-400">Modulo 2 · 43%</div><Progress aria-label="p" value={43} size="sm" /></div></div>
                  : <Button isDisabled className="mt-5" radius="full" size="lg" startContent={<Ic d={X.lock} s={16} />}>Accesso non disponibile</Button>}</div></CardBody></Card>
          {AREE.map((a, k) => (
            <Card key={a.k} isPressable={!a.soon} className={`${G} relative overflow-hidden text-left ${k === 0 ? 'md:row-span-2' : ''} ${k === 3 ? 'md:col-span-4 md:h-[120px]' : ''} ${a.soon ? 'opacity-60' : ''}`} radius="lg"><div className={`absolute inset-0 bg-gradient-to-br ${a.c}`} />
              <CardBody className="relative justify-between p-6"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-black/30 ${a.txt}`}><Ic d={a.ic} s={22} /></span><div><div className="text-lg font-extrabold">{a.t}</div><div className="text-sm text-default-400">{a.d}</div>{(a.stato || a.soon) && <Chip size="sm" variant="flat" className="mt-2">{a.soon ? 'In arrivo' : a.stato}</Chip>}</div></CardBody></Card>))}
        </div>
      </main>
    </div>
  );
}

/* M2 · Lanciatore: saluto al centro e una fila di grandi icone, come uno schermo di applicazioni */
function M2({ aperto }) {
  const tutte = [{ k: 'sis', t: 'SISFOR+', ic: X.cap, c: 'from-blue-500 to-indigo-700', bloccata: !aperto, speciale: true }, ...AREE.map((a) => ({ ...a, c: { gest: 'from-amber-500 to-orange-700', funz: 'from-sky-500 to-blue-700', add: 'from-emerald-500 to-teal-700', org: 'from-violet-500 to-purple-700' }[a.k], bloccata: a.soon }))];
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background"><Fondo /><Barra />
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
        <Foto s="lg" /><h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">Buon pomeriggio, Gabriel</h1><p className="mt-2 text-default-500">Vice Questore Aggiunto · PDS - 0006</p>
        <div className="mt-14 flex flex-wrap items-end justify-center gap-8">
          {tutte.map((a) => (
            <Tooltip key={a.k} content={a.bloccata ? (a.speciale ? 'Riservato agli Allievi Agenti' : 'In arrivo') : a.t} showArrow>
              <button type="button" className={`group flex flex-col items-center gap-3 ${a.bloccata ? 'opacity-50' : ''}`}>
                <span className={`relative flex items-center justify-center rounded-[28px] bg-gradient-to-br ${a.c} text-white shadow-2xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105 ${a.speciale ? 'h-32 w-32' : 'h-24 w-24'} ${a.bloccata && a.speciale ? 'grayscale' : ''}`}><Ic d={a.ic} s={a.speciale ? 52 : 38} />{a.bloccata && <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-background text-default-400"><Ic d={X.lock} s={14} /></span>}</span>
                <span className={`font-semibold ${a.speciale ? 'text-lg' : 'text-sm'}`}>{a.t}</span>
              </button>
            </Tooltip>))}
        </div>
        {!aperto && <p className="mt-10 text-sm text-default-500">Il SISFOR si sblocca con il grado di Allievo Agente.</p>}
      </main>
    </div>
  );
}

/* M3 · Profilo a sinistra, aree a destra come righe con stato; il SISFOR è il banner in cima */
function M3({ aperto }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background"><Fondo /><Barra />
      <main className="relative mx-auto grid max-w-6xl gap-6 px-6 pb-16 pt-4 lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-5">
          <Card className={G} radius="lg"><CardBody className="items-center gap-3 p-7 text-center"><Foto s="lg" /><div><div className="text-xl font-extrabold">Gabriel Martinelli</div><div className="text-sm text-default-500">Vice Questore Aggiunto</div><Chip size="sm" variant="flat" className="mt-2">PDS - 0006</Chip></div><Divider /><div className="grid w-full grid-cols-2 gap-3 text-center"><div><div className="text-2xl font-extrabold">3</div><div className="text-[11px] uppercase tracking-wider text-default-500">Pratiche</div></div><div><div className="text-2xl font-extrabold">2</div><div className="text-[11px] uppercase tracking-wider text-default-500">Avvisi</div></div></div></CardBody></Card>
          <Card className="border border-warning/30 bg-warning/5" radius="lg"><CardBody className="gap-2 p-6"><div className="flex items-center gap-2 font-bold text-warning"><Ic d={P.shield} s={17} /> Dalla Questura</div><p className="font-semibold">Richiesta Feste</p><p className="text-sm text-default-500">Avvisare il Questore con almeno 3 giorni di preavviso.</p></CardBody></Card>
        </aside>
        <section className="flex flex-col gap-4">
          <Card isPressable={aperto} className={`relative overflow-hidden border ${aperto ? 'border-primary/40' : 'border-white/10'}`} radius="lg"><div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-background to-background" />
            <CardBody className="relative flex-row items-center gap-6 p-7 text-left"><span className={`flex h-16 w-16 flex-none items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 ${aperto ? '' : 'grayscale'}`}><Ic d={X.cap} s={32} /></span>
              <div className="flex-1"><div className="flex items-center gap-3"><span className="text-2xl font-extrabold">SISFOR<span className="text-primary">+</span></span><Chip2 aperto={aperto} /></div><p className="text-sm text-default-400">Formazione degli Allievi Agenti: corsi, quiz, esami.</p></div>
              {aperto ? <Button color="primary" radius="full" className="font-semibold" endContent={<Ic d={P.arrow} s={16} />}>Entra</Button> : <Button isDisabled radius="full" startContent={<Ic d={X.lock} s={15} />}>Bloccato</Button>}</CardBody></Card>
          {AREE.map((a) => (
            <Card key={a.k} isPressable={!a.soon} className={`${G} text-left ${a.soon ? 'opacity-60' : ''}`} radius="lg"><CardBody className="flex-row items-center gap-5 p-5"><span className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br ${a.c} ${a.txt}`}><Ic d={a.ic} s={22} /></span><div className="flex-1"><div className="font-bold">{a.t}</div><div className="text-sm text-default-500">{a.d}</div></div>{a.soon ? <Chip size="sm" variant="flat">In arrivo</Chip> : <><Chip size="sm" variant="flat">{a.stato}</Chip><Ic d={P.arrow} s={18} /></>}</CardBody></Card>))}
        </section>
      </main>
    </div>
  );
}

/* M4 · Ricerca al centro con scorciatoie, schede per ambito e un carosello di aree */
function M4({ aperto }) {
  const [t, setT] = useState('tutte');
  const lista = [{ k: 'sis', t: 'SISFOR+', d: aperto ? 'Entra nella formazione' : 'Riservato agli Allievi Agenti', ic: X.cap, c: 'from-blue-500/30 to-indigo-600/10', txt: 'text-primary', amb: 'formazione', bloccata: !aperto }, ...AREE.map((a) => ({ ...a, amb: a.k === 'org' ? 'consultazione' : 'lavoro', bloccata: a.soon }))].filter((a) => t === 'tutte' || a.amb === t);
  return (
    <div className="relative min-h-screen overflow-hidden bg-background"><Fondo /><Barra />
      <main className="relative mx-auto max-w-4xl px-6 pb-16 pt-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">Cosa vuoi fare, Gabriel?</h1>
        <Input className="mx-auto mt-8 max-w-2xl" size="lg" radius="full" variant="bordered" placeholder="Cerca un’area, una pratica, un documento…" startContent={<Ic d={X.search} s={20} />} classNames={{ inputWrapper: 'h-16 bg-content1/70' }} />
        <div className="mt-5 flex flex-wrap justify-center gap-2">{['Le mie pratiche', 'Riprendi il corso', 'Organigramma', 'Comunicazioni'].map((c) => <Chip key={c} variant="bordered" className="cursor-pointer">{c}</Chip>)}</div>
        <div className="mt-12 flex justify-center"><Tabs selectedKey={t} onSelectionChange={setT} radius="full" color="primary" aria-label="Ambito"><Tab key="tutte" title="Tutte" /><Tab key="formazione" title="Formazione" /><Tab key="lavoro" title="Lavoro" /><Tab key="consultazione" title="Consultazione" /></Tabs></div>
        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          {lista.map((a) => (<Card key={a.k} isPressable={!a.bloccata} className={`${G} relative overflow-hidden ${a.bloccata ? 'opacity-60' : ''}`} radius="lg"><div className={`absolute inset-0 bg-gradient-to-br ${a.c}`} /><CardBody className="relative flex-row items-center gap-5 p-6"><span className={`flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-black/30 ${a.txt}`}><Ic d={a.ic} s={26} /></span><div className="flex-1"><div className="text-lg font-extrabold">{a.t}</div><div className="text-sm text-default-400">{a.d}</div></div><span className="text-default-400"><Ic d={a.bloccata ? X.lock : P.arrow} s={18} /></span></CardBody></Card>))}
        </div>
      </main>
    </div>
  );
}

export function Portale2({ v }) {
  const [aperto, setAperto] = useState(true);
  useEffect(() => { setAperto(new URLSearchParams(location.search).get('s') !== 'altro'); }, []);
  const V = { m1: M1, m2: M2, m3: M3, m4: M4 }[v];
  return <V aperto={aperto} />;
}
