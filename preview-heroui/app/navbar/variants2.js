'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Avatar, Button, Divider, Input, Kbd, Link, Listbox, ListboxItem, Modal, ModalContent, Navbar, NavbarBrand, NavbarContent,
  NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Tab, Tabs, Tooltip,
} from '@heroui/react';

const P = {
  home: 'M3 10 12 3l9 7v10H3zM9 20v-7h6v7',
  news: 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h6M8 13h6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  medal: 'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-3.5-1L7 21l5-3 5 3-1.5-8',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  chev: 'm6 9 6 6 6-6',
  file: 'M7 3h7l4 4v14H7zM14 3v5h5M9 13h6M9 17h6',
};
const Ic = ({ n, s = 22 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);

const VOCI = [
  { k: 'home', t: 'Home', i: 'home' },
  { k: 'notizie', t: 'Notizie', i: 'news' },
  { k: 'chi', t: 'Chi Siamo', i: 'shield' },
  { k: 'qual', t: 'Qualifiche', i: 'medal' },
  { k: 'prenota', t: 'Prenota', i: 'cal' },
  { k: 'concorso', t: 'Concorso', i: 'trophy' },
];

const Brand = () => (
  <NavbarBrand className="gap-3">
    <img src="/crest.png" alt="" className="h-9 w-auto" />
    <p className="font-extrabold uppercase tracking-wide">Polizia IPRP</p>
  </NavbarBrand>
);

// ---- F: dock flottante in basso (come una barra di app), logo in alto
function F() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3"><img src="/crest.png" alt="" className="h-9 w-auto" /><span className="font-extrabold uppercase tracking-wide">Polizia IPRP</span></div>
        <Button color="primary" radius="full" className="h-11 pl-5 pr-2 font-semibold" endContent={<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><Ic n="lock" s={18} /></span>}>Area Personale</Button>
      </header>
      <nav aria-label="Navigazione principale" className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-content1/80 p-2 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          {VOCI.map((v, i) => (
            <li key={v.k}>
              <Tooltip content={v.t} placement="top" offset={14} classNames={{ content: 'bg-content2 font-semibold' }}>
                <Button isIconOnly radius="full" variant={i === 0 ? 'solid' : 'light'} color={i === 0 ? 'primary' : 'default'} aria-label={v.t} aria-current={i === 0 ? 'page' : undefined} className="h-12 w-12 min-w-12">
                  <Ic n={v.i} />
                </Button>
              </Tooltip>
            </li>
          ))}
          <li aria-hidden="true"><Divider orientation="vertical" className="mx-1 h-7" /></li>
          <li><Avatar name="MR" size="sm" color="primary" isBordered className="mx-1" /></li>
        </ul>
      </nav>
    </>
  );
}

// ---- G: "isola" che si espande (stile Dynamic Island)
function G() {
  const [open, setOpen] = useState(true);
  return (
    <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <motion.nav aria-label="Navigazione principale" layout transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/80 shadow-2xl shadow-black/70 backdrop-blur-2xl">
        <div className="flex items-center gap-2 p-2">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu" className="flex h-12 items-center gap-3 rounded-full bg-content2/70 pl-3 pr-4 outline-none transition-colors hover:bg-content3 focus-visible:ring-2 focus-visible:ring-primary">
            <img src="/crest.png" alt="" className="h-8 w-auto" />
            <span className="font-extrabold uppercase tracking-wide">Polizia IPRP</span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-default-500"><Ic n="chev" s={18} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open ? (
              <motion.ul key="v" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="hidden items-center gap-1 overflow-hidden md:flex">
                {VOCI.map((v, i) => (
                  <li key={v.k}><Link href="#" color="foreground" className={`flex h-12 items-center rounded-full px-4 text-sm font-medium transition-colors hover:bg-white/10 ${i === 0 ? 'bg-white/10 text-primary' : ''}`}>{v.t}</Link></li>
                ))}
              </motion.ul>
            ) : null}
          </AnimatePresence>
          <Button isIconOnly radius="full" color="primary" aria-label="Area Personale" className="h-12 w-12 flex-none"><Ic n="user" /></Button>
        </div>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.ul key="m" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-2 gap-1 px-2 pb-2 md:hidden">
              {VOCI.map((v, i) => (
                <li key={v.k}><Link href="#" color="foreground" className={`flex h-12 items-center gap-2 rounded-full px-4 text-sm font-medium hover:bg-white/10 ${i === 0 ? 'bg-white/10 text-primary' : ''}`}><Ic n={v.i} s={18} />{v.t}</Link></li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

// ---- H: barra minimale con ricerca/comandi (⌘K) che apre una palette
const DEST = [
  { k: 'home', t: 'Home', d: 'Pagina iniziale', i: 'home' },
  { k: 'notizie', t: 'Notizie', d: 'Comunicati e novità', i: 'news' },
  { k: 'dir', t: 'La Dirigenza', d: 'Questore e dirigenti', i: 'user' },
  { k: 'qual', t: 'Qualifiche', d: 'Gradi e distintivi', i: 'medal' },
  { k: 'prenota', t: 'Prenota un colloquio', d: 'Appuntamento con i dirigenti', i: 'cal' },
  { k: 'den', t: 'Denuncia online', d: 'Presenta una denuncia', i: 'file' },
  { k: 'concorso', t: 'Concorso pubblico', d: 'Candidati alla Polizia', i: 'trophy' },
];
function H() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navbar maxWidth="2xl" height="4.5rem" isBordered className="bg-background/70 backdrop-blur-xl">
        <NavbarContent justify="start"><Brand /></NavbarContent>
        <NavbarContent justify="center" className="w-full max-w-md">
          <NavbarItem className="w-full">
            <Button onPress={() => setOpen(true)} variant="flat" radius="full" className="h-11 w-full justify-between px-4 text-default-500" startContent={<Ic n="search" s={18} />} endContent={<Kbd keys={['command']}>K</Kbd>}>
              <span className="mr-auto pl-1">Cerca o vai a…</span>
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" className="gap-3">
          <NavbarItem className="hidden sm:flex"><Button color="primary" radius="full" className="h-11 font-semibold">Area Personale</Button></NavbarItem>
          <NavbarItem><Avatar name="MR" size="sm" color="primary" isBordered /></NavbarItem>
        </NavbarContent>
      </Navbar>
      <Modal isOpen={open} onOpenChange={setOpen} placement="top" backdrop="blur" hideCloseButton size="lg" classNames={{ base: 'mt-24 border border-white/10 bg-content1' }}>
        <ModalContent>
          <div className="p-3">
            <Input autoFocus aria-label="Cerca" placeholder="Cerca una pagina o un servizio…" variant="flat" radius="lg" size="lg" startContent={<Ic n="search" s={18} />} endContent={<Kbd>esc</Kbd>} />
            <p className="px-2 pb-1 pt-4 text-xs font-semibold uppercase tracking-widest text-default-500">Vai a</p>
            <Listbox aria-label="Destinazioni" variant="flat" color="primary" onAction={() => setOpen(false)} itemClasses={{ base: 'gap-3 rounded-large py-2.5' }}>
              {DEST.map((d) => (
                <ListboxItem key={d.k} description={d.d} startContent={<span className="flex h-9 w-9 items-center justify-center rounded-medium bg-primary/15 text-primary"><Ic n={d.i} s={18} /></span>}>{d.t}</ListboxItem>
              ))}
            </Listbox>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}

// ---- I: barra laterale compatta a icone con tooltip + barra sottile in alto
function I() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside aria-label="Navigazione principale" className="fixed inset-y-0 left-0 z-50 hidden w-[84px] flex-col items-center gap-2 border-r border-white/10 bg-content1/80 py-5 backdrop-blur-xl md:flex">
        <img src="/crest.png" alt="Polizia IPRP" className="mb-4 h-10 w-auto" />
        {VOCI.map((v, i) => (
          <Tooltip key={v.k} content={v.t} placement="right" offset={14} classNames={{ content: 'bg-content2 font-semibold' }}>
            <Button isIconOnly radius="lg" variant={i === 0 ? 'flat' : 'light'} color={i === 0 ? 'primary' : 'default'} aria-label={v.t} aria-current={i === 0 ? 'page' : undefined} className="h-12 w-12">
              <Ic n={v.i} />
            </Button>
          </Tooltip>
        ))}
        <div className="mt-auto flex flex-col items-center gap-3">
          <Tooltip content="Area Personale" placement="right" offset={14}><Button isIconOnly radius="full" color="primary" aria-label="Area Personale" className="h-12 w-12"><Ic n="lock" /></Button></Tooltip>
          <Avatar name="MR" size="sm" />
        </div>
      </aside>
      <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="full" isBordered height="4rem" className="bg-background/70 backdrop-blur-xl md:pl-[84px]">
        <NavbarContent justify="start"><NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="md:hidden" /><NavbarBrand className="md:hidden"><img src="/crest.png" alt="" className="h-8 w-auto" /></NavbarBrand><p className="hidden text-sm text-default-500 md:block">Polizia IPRP / <span className="font-semibold text-foreground">Home</span></p></NavbarContent>
        <NavbarContent justify="end"><NavbarItem><Button variant="flat" radius="full" size="sm" startContent={<Ic n="search" s={16} />} endContent={<Kbd keys={['command']}>K</Kbd>} className="text-default-500">Cerca</Button></NavbarItem></NavbarContent>
        <NavbarMenu className="gap-1 bg-background/95 pt-6 backdrop-blur-xl">
          {VOCI.map((v, i) => <NavbarMenuItem key={v.k}><Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="flex min-h-12 w-full items-center gap-3 text-lg font-semibold"><Ic n={v.i} />{v.t}</Link></NavbarMenuItem>)}
        </NavbarMenu>
      </Navbar>
    </>
  );
}

// ---- J: simmetrica, logo grande al centro, voci in maiuscolo con sottolineatura a scorrimento
function J() {
  const [open, setOpen] = useState(false);
  const sx = ['Home', 'Notizie', 'Chi Siamo'];
  const dx = ['Qualifiche', 'Prenota', 'Concorso'];
  const L = (t, i, tot) => (
    <NavbarItem key={t}>
      <Link href="#" color="foreground" className={`group relative text-[13px] font-bold uppercase tracking-[0.18em] ${i === 0 && tot === 'sx' ? 'text-primary' : ''}`}>
        {t}<span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
      </Link>
    </NavbarItem>
  );
  return (
    <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="2xl" height="6rem" className="bg-background/60 backdrop-blur-xl">
      <NavbarContent className="hidden gap-9 lg:flex" justify="start">{sx.map((t, i) => L(t, i, 'sx'))}</NavbarContent>
      <NavbarContent className="lg:hidden" justify="start"><NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} /></NavbarContent>
      <NavbarContent justify="center" className="grow-0">
        <NavbarBrand className="flex-col gap-1">
          <img src="/crest.png" alt="" className="h-12 w-auto" />
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em]">Polizia IPRP</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden gap-9 lg:flex" justify="end">
        {dx.map((t, i) => L(t, i, 'dx'))}
        <NavbarItem><Button color="primary" radius="full" size="sm" className="h-10 px-5 font-semibold">Area Personale</Button></NavbarItem>
      </NavbarContent>
      <NavbarContent className="lg:hidden" justify="end"><NavbarItem><Button isIconOnly color="primary" radius="full" aria-label="Area Personale" className="h-11 w-11"><Ic n="user" /></Button></NavbarItem></NavbarContent>
      <NavbarMenu className="gap-1 bg-background/95 pt-6 backdrop-blur-xl">
        {[...sx, ...dx].map((t, i) => <NavbarMenuItem key={t}><Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="flex min-h-12 w-full items-center text-lg font-bold uppercase tracking-widest">{t}</Link></NavbarMenuItem>)}
      </NavbarMenu>
    </Navbar>
  );
}

export const VARIANTI2 = { f: F, g: G, h: H, i: I, j: J };
export const NOMI2 = {
  f: 'F · Dock flottante in basso',
  g: 'G · Isola che si espande',
  h: 'H · Barra minimale con ricerca ⌘K',
  i: 'I · Barra laterale a icone',
  j: 'J · Simmetrica con logo centrale',
};
