'use client';

import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, CardBody, Chip, Divider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Progress, Tab, Tabs, Tooltip } from '@heroui/react';
import { Ic, P } from '../sisfor/comune';

const X = {
  bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM10 20a2 2 0 0 0 4 0',
  folder: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 3a4 4 0 0 1 0 8M22 21a7 7 0 0 0-5-6.700',
  badge: 'M5 4h14v12l-7 5-7-5zM9 9h6M9 13h6',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  mega: 'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1ZM17 8a5 5 0 0 1 0 8',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12l2-1-1-3-2 .5-1.5-1.500.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6 8.500 4 8l-1 3 2 1v2l-2 1 1 3 2-.5 1.500 1.500-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.500-1.500 2 .5 1-3-2-1z',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
};
const G = 'border border-white/10 bg-content1/70';
const ACC = { primary: 'bg-primary/15 text-primary', success: 'bg-success/15 text-success', warning: 'bg-warning/15 text-warning', danger: 'bg-danger/15 text-danger', secondary: 'bg-secondary/15 text-secondary', default: 'bg-white/10 text-default-600' };
const SEZIONI = [
  { k: 'gest', t: 'Gestione', d: 'Pratiche, candidature e comunicati', n: '3 da lavorare', ic: X.folder, c: 'warning' },
  { k: 'funz', t: 'Funzionari', d: 'Area riservata ai funzionari', n: 'Dirigenza e uffici', ic: X.badge, c: 'primary' },
  { k: 'addetti', t: 'Addetti', d: 'Sportello e servizi al pubblico', n: '2 richieste aperte', ic: X.users, c: 'success' },
  { k: 'doc', t: 'Documenti', d: 'Modulistica e regolamenti', n: '12 documenti', ic: X.doc, c: 'secondary' },
  { k: 'com', t: 'Comunicazioni interne', d: 'Avvisi e ordini di servizio', n: '2 nuove', ic: X.mega, c: 'danger' },
  { k: 'imp', t: 'Il mio profilo', d: 'Dati, foto e preferenze', n: 'Matricola PDS - 0006', ic: X.gear, c: 'default' },
];
const VISTE = { tu: 'Tu (prova)', allievo: 'Allievo agente', altro: 'Altro grado' };
const Foto = ({ s = 'sm' }) => <Avatar src="/crest.png" size={s} isBordered color="primary" className="flex-none bg-black/40 p-1.5" />;

/* Selettore dell'anteprima: serve solo per vedere come appare ai diversi gradi */
function Vista({ v, setV }) {
  return (<div className="flex items-center gap-3"><span className="hidden text-[11px] uppercase tracking-widest text-default-500 md:block">Anteprima accesso</span>
    <Tabs size="sm" radius="full" selectedKey={v} onSelectionChange={setV} aria-label="Vista" classNames={{ tabList: 'bg-white/5' }}>{Object.entries(VISTE).map(([k, l]) => <Tab key={k} title={l} />)}</Tabs></div>);
}
const Testa = ({ v, setV }) => (
  <Navbar maxWidth="xl" isBordered classNames={{ base: 'bg-background/95' }}>
    <NavbarBrand className="gap-3"><img src="/logo-iprp.png" alt="" className="h-9" /><div className="leading-tight"><div className="font-extrabold">Area Personale</div><div className="text-[11px] text-default-500">Polizia di Stato · IPRP</div></div></NavbarBrand>
    <NavbarContent justify="center" className="hidden lg:flex"><NavbarItem><Vista v={v} setV={setV} /></NavbarItem></NavbarContent>
    <NavbarContent justify="end"><NavbarItem><Badge content="2" color="danger" size="sm"><Button isIconOnly variant="light" radius="full"><Ic d={X.bell} /></Button></Badge></NavbarItem><NavbarItem><Button size="sm" variant="flat" radius="full">Torna al sito</Button></NavbarItem><NavbarItem><Foto /></NavbarItem></NavbarContent>
  </Navbar>
);
const Sotto = ({ v, setV }) => <div className="mx-auto mb-4 flex max-w-6xl justify-center px-6 lg:hidden"><Vista v={v} setV={setV} /></div>;

/* Card del SISFOR: sbloccata per gli allievi agenti (e per te), bloccata per gli altri */
function Sisfor({ aperto, hero }) {
  const corpo = (
    <Card isPressable={aperto} fullWidth className={`relative w-full max-w-none overflow-hidden border ${aperto ? 'border-primary/40' : 'border-white/10'} text-left`} radius="lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-indigo-700/30 to-background" />
      <img src="/foto/giuramento-header.jpg" alt="" className={`absolute inset-0 h-full w-full object-cover opacity-25 ${aperto ? '' : 'grayscale'}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <CardBody className={`relative gap-4 ${hero ? 'p-9 md:p-12' : 'p-7'}`}>
        <div className="flex items-center gap-3"><Chip size="sm" color={aperto ? 'primary' : 'default'} variant={aperto ? 'solid' : 'flat'} startContent={<span className="pl-1"><Ic d={aperto ? P.book : X.lock} s={13} /></span>}>{aperto ? 'Sbloccato' : 'Riservato'}</Chip><span className="text-xs text-default-400">Solo per gli Allievi Agenti</span></div>
        <div><div className={`${hero ? 'text-5xl' : 'text-3xl'} font-extrabold tracking-tight`}>SISFOR<span className="text-primary">+</span></div><p className="mt-1 max-w-lg text-default-400">Il sistema di formazione: corsi, quiz, esami e percorso verso l’abilitazione.</p></div>
        {aperto ? (<div className="flex flex-wrap items-center gap-5"><div className="min-w-[220px] max-w-xs flex-1"><div className="mb-1 flex justify-between text-xs text-default-400"><span>Posto di blocco · modulo 2</span><span>43%</span></div><Progress aria-label="pc" value={43} size="sm" color="primary" /></div><Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Entra nel SISFOR</Button></div>)
          : (<div className="flex flex-wrap items-center gap-4"><Button isDisabled radius="full" size="lg" startContent={<Ic d={X.lock} s={17} />}>Accesso non disponibile</Button><span className="max-w-xs text-sm text-default-500">Si sblocca quando ottieni il grado di Allievo Agente.</span></div>)}
      </CardBody>
    </Card>
  );
  return aperto ? corpo : <Tooltip content="Disponibile solo agli Allievi Agenti" placement="top" showArrow>{corpo}</Tooltip>;
}
const Tessera = ({ s }) => (
  <Card isPressable className={`${G} group text-left transition-colors hover:border-white/25`} radius="lg"><CardBody className="gap-5 p-6">
    <div className="flex items-start justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${ACC[s.c]}`}><Ic d={s.ic} s={24} /></span><span className="text-default-600 transition group-hover:translate-x-1 group-hover:text-white"><Ic d={P.arrow} s={20} /></span></div>
    <div><div className="text-lg font-extrabold">{s.t}</div><div className="mt-0.5 text-sm text-default-500">{s.d}</div></div>
    <Chip size="sm" variant="flat" color={s.c === 'default' ? 'default' : s.c} className="self-start">{s.n}</Chip>
  </CardBody></Card>
);
const Saluto = ({ aperto }) => (<div className="mb-8"><p className="text-sm text-default-500">Buon pomeriggio</p><h1 className="text-4xl font-extrabold tracking-tight">Gabriel Martinelli</h1><p className="mt-1 text-default-500">Vice Questore Aggiunto · PDS - 0006</p></div>);

/* L1 · Hub: il SISFOR in grande in cima, sotto le altre sezioni */
function L1({ aperto }) {
  return (<main className="mx-auto max-w-6xl px-6 pb-16 pt-8"><Saluto /><Sisfor aperto={aperto} hero />
    <h2 className="mb-4 mt-10 text-sm font-bold uppercase tracking-widest text-default-500">Le tue aree</h2>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{SEZIONI.map((s) => <Tessera key={s.k} s={s} />)}</div></main>);
}

/* L2 · Barra laterale con le sezioni e il SISFOR in evidenza; a destra il riepilogo */
function L2({ aperto }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 pb-16 pt-8">
      <aside className="hidden w-64 flex-none flex-col gap-2 md:flex">
        {SEZIONI.map((s, k) => (<button key={s.k} type="button" className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${k === 0 ? 'bg-white/10 text-white' : 'text-default-400 hover:bg-white/5 hover:text-white'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-xl ${ACC[s.c]}`}><Ic d={s.ic} s={16} /></span>{s.t}</button>))}
        <Divider className="my-2" />
        <button type="button" disabled={!aperto} className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-extrabold ${aperto ? 'border-primary/50 bg-primary/15 text-primary' : 'cursor-not-allowed border-white/10 bg-white/[0.03] text-default-500'}`}><Ic d={aperto ? P.book : X.lock} s={18} />SISFOR+<span className="ml-auto text-[10px] font-semibold uppercase tracking-widest opacity-70">{aperto ? 'Entra' : 'Allievi'}</span></button>
      </aside>
      <main className="flex-1"><Saluto />
        <div className="grid gap-5 lg:grid-cols-2"><div className="lg:col-span-2"><Sisfor aperto={aperto} /></div>
          {SEZIONI.slice(0, 4).map((s) => <Tessera key={s.k} s={s} />)}</div></main>
    </div>
  );
}

/* L3 · Due fasce: in alto "Le aree di servizio", in basso il SISFOR a tutta larghezza come percorso */
function L3({ aperto }) {
  const sbloccate = [['Recluta', true], ['Allievo agente', true], ['Agente', false], ['Agente scelto', false]];
  return (
    <main className="mx-auto max-w-6xl px-6 pb-16 pt-8"><Saluto />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{SEZIONI.slice(0, 3).map((s) => <Tessera key={s.k} s={s} />)}</div>
      <div className="my-8 flex items-center gap-4"><Divider className="flex-1" /><span className="text-xs font-bold uppercase tracking-[0.3em] text-default-500">Formazione</span><Divider className="flex-1" /></div>
      <Sisfor aperto={aperto} hero />
      <Card className={`${G} mt-5`} radius="lg"><CardBody className="gap-4 p-6"><div className="flex items-center justify-between"><div className="font-bold">Come si sblocca</div><Chip size="sm" variant="flat" color={aperto ? 'success' : 'default'}>{aperto ? 'Accesso attivo' : 'Accesso non attivo'}</Chip></div>
        <div className="flex items-center">{sbloccate.map(([t, ok], k) => (<div key={t} className="flex flex-1 items-center"><div className="flex flex-col items-center gap-1.5"><span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${k === 1 ? 'bg-primary text-white ring-4 ring-primary/25' : ok ? 'bg-white/15' : 'border border-white/20 text-default-500'}`}>{k + 1}</span><span className={`text-[11px] ${k === 1 ? 'font-bold text-primary' : 'text-default-500'}`}>{t}</span></div>{k < 3 && <span className="mx-2 h-px flex-1 bg-white/15" />}</div>))}</div>
        <p className="text-sm text-default-500">Il SISFOR è aperto a chi ha il grado di <b className="text-foreground">Allievo Agente</b>. Gli amministratori possono accedere per verifica.</p></CardBody></Card>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">{SEZIONI.slice(3).map((s) => <Tessera key={s.k} s={s} />)}</div>
    </main>
  );
}

export function Portale({ v }) {
  const [vista, setVista] = useState('tu');
  useEffect(() => { const s = new URLSearchParams(location.search).get('s'); if (s && VISTE[s]) setVista(s); }, []);
  const aperto = vista !== 'altro';
  const V = { l1: L1, l2: L2, l3: L3 }[v];
  return (<div className="min-h-screen bg-background"><Testa v={vista} setV={setVista} /><div className="pt-4"><Sotto v={vista} setV={setVista} /></div><V aperto={aperto} /></div>);
}
