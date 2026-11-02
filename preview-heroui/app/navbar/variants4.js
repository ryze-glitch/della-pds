'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Avatar, Badge, Breadcrumbs, BreadcrumbItem, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Popover,
  PopoverContent, PopoverTrigger, Tab, Tabs,
} from '@heroui/react';

const P = {
  home: 'M3 10 12 3l9 7v10H3zM9 20v-7h6v7',
  news: 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h6M8 13h6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  medal: 'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-3.5-1L7 21l5-3 5 3-1.5-8',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  file: 'M7 3h7l4 4v14H7zM14 3v5h5M9 13h6M9 17h6',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  plus: 'M12 5v14M5 12h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  x: 'M6 6l12 12M18 6 6 18',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  grad: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
};
const Ic = ({ n, s = 22 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);
const VOCI = [
  { t: 'Home', i: 'home' }, { t: 'Notizie', i: 'news' }, { t: 'Chi Siamo', i: 'shield' },
  { t: 'Qualifiche', i: 'medal' }, { t: 'Prenota', i: 'cal' }, { t: 'Concorso', i: 'trophy' },
];
const Logo = () => <a href="#" className="flex items-center gap-3"><img src="/crest.png" alt="" className="h-9 w-auto" /><span className="font-extrabold uppercase tracking-wide">Polizia IPRP</span></a>;

// ---- P: barra verticale fluttuante sul bordo destro, le etichette si aprono al passaggio
function Pp() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5">
        <Logo />
        <Button color="primary" radius="full" className="h-11 font-semibold" endContent={<Ic n="lock" s={16} />}>Area Personale</Button>
      </header>
      <nav aria-label="Navigazione principale" className="fixed right-5 top-1/2 z-50 -translate-y-1/2">
        <ul className="flex flex-col items-end gap-2 rounded-[2rem] border border-white/10 bg-content1/75 p-2 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          {VOCI.map((v, i) => (
            <li key={v.t}>
              <a href="#" aria-current={i === 0 ? 'page' : undefined} className={`group flex h-12 items-center gap-0 overflow-hidden rounded-full pl-3.5 pr-3.5 transition-all duration-300 hover:gap-3 hover:pr-5 ${i === 0 ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
                <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[8rem] group-hover:opacity-100 group-focus-visible:max-w-[8rem] group-focus-visible:opacity-100">{v.t}</span>
                <Ic n={v.i} />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

// ---- Q: due livelli — contesto (Sportello) + sotto-voci a linguetta con percorso
function Q() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1300px] items-center justify-between px-6">
        <Logo />
        <Tabs aria-label="Sezioni" radius="full" size="sm" selectedKey="servizi" classNames={{ tabList: 'bg-content2/70', cursor: 'bg-primary', tabContent: 'group-data-[selected=true]:text-white font-medium' }}>
          <Tab key="sito" title="Sito" /><Tab key="servizi" title="Servizi" /><Tab key="area" title="Area personale" />
        </Tabs>
        <Button color="primary" radius="full" className="h-10 font-semibold">Accedi</Button>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6">
          <Tabs aria-label="Servizi" variant="underlined" selectedKey="den" classNames={{ tabList: 'gap-6 p-0', cursor: 'bg-primary', tab: 'h-12 px-0', tabContent: 'font-medium group-data-[selected=true]:text-primary' }}>
            <Tab key="den" title="Denuncia online" /><Tab key="pda" title="Porto d'armi" /><Tab key="col" title="Colloquio" /><Tab key="pra" title="Stato pratica" />
          </Tabs>
          <Breadcrumbs size="sm" className="hidden md:block"><BreadcrumbItem>Home</BreadcrumbItem><BreadcrumbItem>Servizi</BreadcrumbItem><BreadcrumbItem>Denuncia online</BreadcrumbItem></Breadcrumbs>
        </div>
      </div>
    </header>
  );
}

// ---- R: menu a schermo intero con tipografia gigante
function R() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between px-6 py-5">
        <Logo />
        <Button radius="full" variant={open ? 'solid' : 'flat'} className="h-12 px-6 font-semibold" onPress={() => setOpen((o) => !o)} aria-expanded={open} endContent={<Ic n={open ? 'x' : 'menu'} s={18} />}>{open ? 'Chiudi' : 'Menu'}</Button>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.nav aria-label="Menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex flex-col justify-center bg-background/95 px-8 backdrop-blur-2xl sm:px-16">
            <ul className="mx-auto w-full max-w-5xl">
              {[...VOCI.map((v) => v.t), 'Area Personale'].map((t, i) => (
                <motion.li key={t} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i, type: 'spring', stiffness: 220, damping: 24 }} className="border-b border-white/10">
                  <a href="#" className="group flex items-baseline gap-6 py-3 sm:py-4">
                    <span className="w-10 text-sm font-semibold text-primary">0{i + 1}</span>
                    <span className="text-4xl font-extrabold uppercase tracking-wide transition-all group-hover:translate-x-3 group-hover:text-primary sm:text-6xl">{t}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mx-auto mt-8 w-full max-w-5xl text-sm text-default-500">Via dei Peccatori N°761 · Tel. 113 · In caso di emergenza reale chiama il 112</p>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}

// ---- S: stile app mobile — barra in alto compatta e barra in basso con pulsante centrale in rilievo
function S() {
  const tab = [{ t: 'Home', i: 'home' }, { t: 'Notizie', i: 'news' }, null, { t: 'Prenota', i: 'cal' }, { t: 'Profilo', i: 'user' }];
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-background/70 px-5 py-4 backdrop-blur-xl">
        <Logo />
        <Badge content="2" color="danger" size="sm" shape="circle"><Button isIconOnly variant="flat" radius="full" aria-label="Notifiche" className="h-11 w-11"><Ic n="bell" /></Button></Badge>
      </header>
      <nav aria-label="Navigazione principale" className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[560px] px-3 pb-3">
        <ul className="relative grid grid-cols-5 items-end rounded-[2rem] border border-white/10 bg-content1/90 px-2 pb-2 pt-3 shadow-2xl shadow-black/70 backdrop-blur-2xl">
          {tab.map((v, i) => v ? (
            <li key={v.t}><a href="#" aria-current={i === 0 ? 'page' : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${i === 0 ? 'text-primary' : 'text-default-500'}`}><Ic n={v.i} /> {v.t}</a></li>
          ) : (
            <li key="fab" className="flex justify-center"><a href="#" aria-label="Presenta una denuncia" className="-mt-9 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-white shadow-xl shadow-primary/40"><Ic n="plus" s={28} /></a></li>
          ))}
        </ul>
      </nav>
    </>
  );
}

// ---- T: intestazione da app con contesti, notifiche a comparsa e menu utente
function T() {
  const notifiche = [['Quiz superato', 'Posto di blocco · modulo 2', '5 min fa'], ['Pratica programmata', 'Sessione del 12 novembre', '2 h fa'], ['Nuovo corso disponibile', 'Comunicazioni radio e codici', 'ieri']];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[1300px] items-center justify-between gap-4 px-6">
        <Logo />
        <Tabs aria-label="Sezioni" radius="full" variant="bordered" selectedKey="corsi" className="hidden md:block" classNames={{ tabList: 'border-white/15', cursor: 'bg-primary', tabContent: 'font-medium group-data-[selected=true]:text-white' }}>
          <Tab key="corsi" title="I miei corsi" /><Tab key="perc" title="Il mio percorso" /><Tab key="istr" title="Istruttori" /><Tab key="ges" title="Gestione" />
        </Tabs>
        <div className="flex items-center gap-2">
          <Popover placement="bottom-end" defaultOpen offset={14}>
            <PopoverTrigger>
              <Button isIconOnly variant="flat" radius="full" aria-label="Notifiche" className="h-11 w-11"><Badge content="3" color="danger" size="sm" shape="circle"><Ic n="bell" /></Badge></Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] border border-white/10 bg-content1 p-0">
              <div className="flex w-full items-center justify-between px-4 py-3"><p className="font-bold">Notifiche</p><Link href="#" size="sm">Segna come lette</Link></div>
              <Divider />
              {notifiche.map(([t, d, q]) => (
                <a key={t} href="#" className="flex w-full items-start gap-3 px-4 py-3 transition-colors hover:bg-content2">
                  <span className="mt-1 h-2 w-2 flex-none rounded-full bg-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{t}</span><span className="block truncate text-xs text-default-500">{d}</span></span>
                  <span className="text-[11px] text-default-500">{q}</span>
                </a>
              ))}
            </PopoverContent>
          </Popover>
          <Dropdown placement="bottom-end">
            <DropdownTrigger><button type="button" aria-label="Menu utente" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"><Avatar name="MR" color="primary" isBordered /></button></DropdownTrigger>
            <DropdownMenu aria-label="Utente"><DropdownItem key="p" description="Agente · Allievo" isReadOnly className="opacity-100">Mario Rossi</DropdownItem><DropdownItem key="pr">Il mio profilo</DropdownItem><DropdownItem key="g">Gestione</DropdownItem><DropdownItem key="e" color="danger" className="text-danger">Esci</DropdownItem></DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export const VARIANTI4 = { p: Pp, q: Q, r: R, s: S, t: T };
export const NOMI4 = {
  p: 'P · Barra verticale sul bordo destro',
  q: 'Q · Due livelli con sotto-voci e percorso',
  r: 'R · Menu a schermo intero',
  s: 'S · Stile app con pulsante centrale',
  t: 'T · Intestazione con notifiche e menu utente',
};
