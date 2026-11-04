'use client';

import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, CardBody, CardFooter, Chip, Input, Kbd } from '@heroui/react';
import { Ic, P } from '../sisfor/comune';

const X = {
  bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM10 20a2 2 0 0 0 4 0',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  cap: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
  pin: 'M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12ZM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  alert: 'M12 3 2 20h20zM12 10v4M12 17v.5',
};
const AREE = [
  { k: 'gest', tag: 'GESTIONE', t: 'Gestione', d: 'Pratiche dei cittadini, candidature al concorso e comunicati ufficiali.', img: '/foto/denuncia.jpg', btn: 'Apri la gestione' },
  { k: 'funz', tag: 'FUNZIONARI', t: 'Funzionari', d: 'Area riservata ai funzionari: uffici, ordini di servizio e documenti.', img: '/foto/ufficidesk.jpg', btn: 'Apri la pagina', soon: true },
  { k: 'add', tag: 'ADDETTI', t: 'Addetti', d: 'Sportello e servizi al pubblico: richieste, appuntamenti e licenze.', img: '/foto/porto-darmi.jpg', btn: 'Apri la pagina', soon: true },
  { k: 'org', tag: 'ORGANIGRAMMA', t: 'Organigramma', d: 'La struttura della Questura, i reparti e chi ne fa parte.', img: '/foto/bando.jpg', btn: 'Consulta' },
];
const CHIPS = ['Le mie pratiche', 'Riprendi il corso', 'Organigramma', 'Comunicazioni', 'Il mio profilo'];
const Foto = ({ s = 'sm' }) => <Avatar src="/crest.png" size={s} isBordered color="primary" className="flex-none bg-black/40 p-1.5" />;

/* barra a tre isole come quella del sito */
const Isole = () => (
  <div className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-6 pt-6">
    <div className="flex h-14 items-center gap-3 rounded-full border border-white/10 bg-content1/90 px-5 font-extrabold uppercase tracking-wide"><img src="/crest.png" alt="" className="h-8" />Polizia di Stato</div>
    <div className="hidden h-14 items-center gap-1 rounded-full border border-white/10 bg-content1/90 px-2 text-sm md:flex">{['Home', 'Notizie', 'Chi Siamo', 'Qualifiche', 'Prenota', 'Concorso'].map((t) => <span key={t} className="rounded-full px-4 py-2 text-default-400">{t}</span>)}</div>
    <div className="flex h-14 items-center gap-2 rounded-full border border-white/10 bg-content1/90 pl-3 pr-2"><Badge content="2" color="danger" size="sm"><Button isIconOnly variant="light" radius="full" size="sm"><Ic d={X.bell} s={18} /></Button></Badge><Foto /></div>
  </div>
);
const Pagina = ({ children }) => <div className="relative min-h-screen overflow-hidden bg-background"><div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(37,99,235,0.18),transparent_60%)]" /><Isole />{children}</div>;
const Ricerca = () => (<>
  <Input className="mx-auto mt-8 max-w-2xl" size="lg" radius="full" variant="bordered" placeholder="Cerca un’area, una pratica, un documento…" startContent={<Ic d={X.search} s={18} />} endContent={<Kbd keys={['ctrl']}>K</Kbd>} classNames={{ inputWrapper: 'h-14 bg-content1/70' }} />
  <div className="mt-5 flex flex-wrap justify-center gap-2">{CHIPS.map((c) => <Chip key={c} variant="bordered" className="cursor-pointer border-white/20 px-1">{c}</Chip>)}</div>
</>);
const Titolo = ({ children }) => <h2 className="mb-10 text-center text-3xl font-extrabold uppercase tracking-wide md:text-4xl">{children}</h2>;

/* scheda area: foto con etichetta, titolo, testo e pulsante (come “I nostri servizi”) */
const Scheda = ({ a, className = '' }) => (
  <Card className={`overflow-hidden border border-white/10 bg-content1 ${a.soon ? 'opacity-70' : ''} ${className}`} radius="lg" shadow="none">
    <div className="relative h-44 flex-none"><img src={a.img} alt="" className={`h-full w-full object-cover ${a.soon ? 'grayscale' : ''}`} /><div className="absolute inset-0 bg-gradient-to-t from-content1 to-transparent" /><Chip size="sm" color="primary" radius="sm" className="absolute bottom-3 left-4 font-bold uppercase tracking-wider" classNames={{ content: 'text-[10px]' }}>{a.tag}</Chip></div>
    <CardBody className="gap-2 px-6 pb-2 pt-3"><h3 className="text-xl font-extrabold leading-snug">{a.t}</h3><p className="text-sm leading-relaxed text-default-400">{a.d}</p></CardBody>
    <CardFooter className="px-6 pb-6 pt-3">{a.soon ? <Button isDisabled radius="full" size="sm" startContent={<Ic d={X.lock} s={14} />}>In arrivo</Button> : <Button radius="full" color="primary" variant="flat" className="font-semibold">{a.btn}</Button>}</CardFooter>
  </Card>
);
const Sisfor = ({ aperto, altezza = 'min-h-[300px]', compatto }) => (
  <Card isPressable={aperto} fullWidth className={`relative w-full max-w-none overflow-hidden border text-left ${aperto ? 'border-primary/40' : 'border-white/10'}`} radius="lg" shadow="none">
    <img src="/foto/giuramento-header.jpg" alt="" className={`absolute inset-0 h-full w-full object-cover opacity-45 ${aperto ? '' : 'grayscale'}`} /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-primary/10" />
    <CardBody className={`relative justify-center gap-4 p-8 md:p-12 ${altezza}`}>
      <div className="flex flex-wrap items-center gap-3"><Chip size="sm" color={aperto ? 'primary' : 'default'} variant={aperto ? 'solid' : 'flat'} radius="sm" startContent={<span className="pl-1"><Ic d={aperto ? X.cap : X.lock} s={13} /></span>} classNames={{ content: 'text-[11px] font-bold uppercase tracking-wider' }}>{aperto ? 'Sbloccato' : 'Riservato'}</Chip><span className="text-xs text-default-400">Solo per gli Allievi Agenti</span></div>
      <div><div className={`${compatto ? 'text-4xl' : 'text-5xl md:text-6xl'} font-extrabold uppercase tracking-tight`}>SISFOR<span className="text-primary">+</span></div><p className="mt-2 max-w-lg text-default-300">Il sistema di formazione: corsi, quiz, esami e percorso verso l’abilitazione.</p></div>
      {aperto ? <div className="flex flex-wrap items-center gap-4"><Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Entra nel SISFOR</Button><span className="text-sm text-default-400">Riprendi: Posto di blocco · modulo 2 · 43%</span></div>
        : <div className="flex flex-wrap items-center gap-4"><Button isDisabled radius="full" size="lg" startContent={<Ic d={X.lock} s={16} />}>Accesso non disponibile</Button><span className="text-sm text-default-500">Si sblocca con il grado di Allievo Agente.</span></div>}
    </CardBody></Card>
);
const Faq = () => (<div className="mx-auto mt-10 flex max-w-[1200px] flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-content1/60 p-5 md:flex-nowrap"><span className="px-3 font-extrabold">Avvisi dalla Questura</span>{['Richiesta Feste: preavviso di 3 giorni', 'Concorso Agenti: nuove date', 'Porto d’armi: prenotazioni aperte'].map((t) => <span key={t} className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm">{t}</span>)}</div>);
const Piede = () => (<footer className="relative mt-20 border-t border-white/10 bg-content1/50"><div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]"><div><div className="mb-3 flex items-center gap-3 font-extrabold uppercase"><img src="/crest.png" alt="" className="h-9" />Polizia di Stato</div><p className="text-sm text-default-400">Sito ufficiale della Polizia di Stato del server IPRP. Solo a scopo roleplay.</p></div>
  <div><div className="mb-3 text-xs font-bold uppercase tracking-widest">Navigazione</div>{['Home', 'Notizie', 'Chi siamo', 'Qualifiche', 'Prenota', 'Concorso'].map((t) => <div key={t} className="py-1 text-sm text-default-400">{t}</div>)}</div>
  <div><div className="mb-3 text-xs font-bold uppercase tracking-widest">Area Personale</div>{['Dashboard', 'Gestione', 'SISFOR+', 'Esci'].map((t) => <div key={t} className="py-1 text-sm text-default-400">{t}</div>)}</div>
  <div><div className="mb-3 text-xs font-bold uppercase tracking-widest">Contatti</div><div className="flex items-center gap-3 py-1 text-sm text-default-400"><span className="text-primary"><Ic d={X.pin} s={16} /></span>Via dei Peccatori N°761</div><div className="flex items-center gap-3 py-1 text-sm text-default-400"><span className="text-primary"><Ic d={X.phone} s={16} /></span>Tel. 113</div></div></div></footer>);

/* N1 · Come la home: logo, titolo, ricerca e scorciatoie; sotto SISFOR a tutta larghezza e le aree a schede con foto */
function N1({ aperto }) {
  return (<Pagina>
    <header className="relative px-6 pb-16 pt-16 text-center"><img src="/logo-iprp.png" alt="" className="mx-auto h-28" /><h1 className="mt-6 text-5xl font-extrabold uppercase tracking-tight md:text-7xl">Area Personale</h1><p className="mt-3 text-default-400">Buon pomeriggio, Gabriel · Vice Questore Aggiunto</p><Ricerca /></header>
    <main className="relative mx-auto max-w-[1200px] px-6"><Titolo>Formazione</Titolo><Sisfor aperto={aperto} /><div className="mt-16"><Titolo>Le tue <span className="text-primary">aree</span></Titolo></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{AREE.map((a) => <Scheda key={a.k} a={a} />)}</div><Faq /></main><Piede /></Pagina>);
}

/* N2 · Il SISFOR è l'eroe della pagina (foto a tutto schermo con titolo grande); le aree stanno sotto, come “I nostri servizi” */
function N2({ aperto }) {
  return (<Pagina>
    <header className="relative mt-6 overflow-hidden">
      <img src="/foto/giuramento-header.jpg" alt="" className={`absolute inset-0 h-full w-full object-cover opacity-40 ${aperto ? '' : 'grayscale'}`} /><div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-20 text-center"><Chip size="sm" color={aperto ? 'primary' : 'default'} variant={aperto ? 'solid' : 'flat'} startContent={<span className="pl-1"><Ic d={aperto ? X.cap : X.lock} s={13} /></span>}>{aperto ? 'Sbloccato' : 'Riservato agli Allievi Agenti'}</Chip>
        <h1 className="mt-5 text-6xl font-extrabold uppercase tracking-tight md:text-8xl">SISFOR<span className="text-primary">+</span></h1><p className="mx-auto mt-4 max-w-xl text-lg text-default-300">Corsi, quiz, esami e percorso verso l’abilitazione. Buon pomeriggio, Gabriel.</p>
        <div className="mt-8 flex justify-center gap-3">{aperto ? <><Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Entra nel SISFOR</Button><Button radius="full" size="lg" variant="bordered" className="border-white/25">Riprendi il corso</Button></> : <Button isDisabled radius="full" size="lg" startContent={<Ic d={X.lock} s={16} />}>Si sblocca con il grado di Allievo Agente</Button>}</div></div></header>
    <main className="relative mx-auto max-w-[1200px] px-6"><Titolo>Le altre <span className="text-primary">aree</span></Titolo><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{AREE.map((a) => <Scheda key={a.k} a={a} />)}</div><Faq /></main><Piede /></Pagina>);
}

/* N3 · Ricerca e scorciatoie in alto come nella home, poi un'unica riga di cinque schede con il SISFOR più largo */
function N3({ aperto }) {
  const sis = { k: 'sis', tag: 'SISFOR+', t: 'SISFOR+', d: aperto ? 'Corsi, quiz ed esami. Il tuo percorso è al 43%.' : 'Riservato agli Allievi Agenti: si sblocca con il grado.', img: '/foto/giuramento-header.jpg', btn: 'Entra nel SISFOR', soon: !aperto };
  return (<Pagina>
    <header className="relative px-6 pb-14 pt-14 text-center"><h1 className="text-5xl font-extrabold uppercase tracking-tight md:text-7xl">Ciao, <span className="text-primary">Gabriel</span></h1><p className="mt-3 text-default-400">Cosa vuoi fare oggi?</p><Ricerca /></header>
    <main className="relative mx-auto max-w-[1300px] px-6"><div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] [&_h3]:text-lg [&_h3]:break-normal"><Scheda a={sis} className="ring-1 ring-primary/40" />{AREE.map((a) => <Scheda key={a.k} a={a} />)}</div><Faq /></main><Piede /></Pagina>);
}

/* N4 · A due colonne: a sinistra il profilo e gli avvisi, a destra il SISFOR e le aree a schede con foto */
function N4({ aperto }) {
  return (<Pagina>
    <main className="relative mx-auto grid max-w-[1300px] gap-8 px-6 pb-4 pt-12 lg:grid-cols-[340px_1fr]">
      <aside className="flex flex-col gap-5"><Card className="border border-white/10 bg-content1" radius="lg" shadow="none"><CardBody className="items-center gap-3 p-8 text-center"><img src="/logo-iprp.png" alt="" className="h-20" /><Foto s="lg" /><div><div className="text-2xl font-extrabold">Gabriel Martinelli</div><div className="text-sm text-default-400">Vice Questore Aggiunto</div></div><Chip variant="flat">PDS - 0006</Chip></CardBody></Card>
        <Card className="border border-warning/30 bg-warning/5" radius="lg" shadow="none"><CardBody className="gap-3 p-6"><div className="flex items-center gap-2 font-bold text-warning"><Ic d={X.alert} s={17} /> Dalla Questura</div><p className="font-semibold">Richiesta Feste</p><p className="text-sm text-default-400">Avvisare il Questore con almeno 3 giorni di preavviso.</p><Button size="sm" variant="flat" color="warning" radius="full" className="self-start">Leggi</Button></CardBody></Card></aside>
      <section><h1 className="mb-1 text-4xl font-extrabold uppercase tracking-tight">Area Personale</h1><p className="mb-6 text-default-400">Buon pomeriggio, Gabriel.</p><Sisfor aperto={aperto} altezza="min-h-[240px]" compatto />
        <div className="mt-6 grid gap-6 sm:grid-cols-2">{AREE.map((a) => <Scheda key={a.k} a={a} />)}</div></section></main><Piede /></Pagina>);
}

export function Portale3({ v }) {
  const [aperto, setAperto] = useState(true);
  useEffect(() => { setAperto(new URLSearchParams(location.search).get('s') !== 'altro'); }, []);
  const V = { n1: N1, n2: N2, n3: N3, n4: N4 }[v];
  return <V aperto={aperto} />;
}
