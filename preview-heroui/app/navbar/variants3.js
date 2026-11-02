'use client';

import { useEffect, useState } from 'react';
import { LayoutGroup, motion, useScroll, useSpring } from 'framer-motion';
import {
  Avatar, Badge, Button, Chip, Divider, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem,
  NavbarMenuToggle, Popover, PopoverContent, PopoverTrigger, Tooltip,
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
  chev: 'm6 9 6 6 6-6',
  file: 'M7 3h7l4 4v14H7zM14 3v5h5M9 13h6M9 17h6',
  book: 'M4 5c5-2 8-1 8 1v15c0-2-3-3-8-1ZM20 5c-5-2-8-1-8 1v15c0-2 3-3 8-1Z',
  car: 'M5 17h14M6 17l1.5-6h9L18 17M7 17v2M17 17v2',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  grad: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
  clip: 'M9 4h6v3H9zM6 6h12v15H6zM9 12h6M9 16h6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12l2-1-1-3-2 .5-1.5-1.5.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6 8.5 4 8l-1 3 2 1v2l-2 1 1 3 2-.5 1.5 1.5-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3-2-1z',
};
const Ic = ({ n, s = 20 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);
const LINK = ['Home', 'Notizie', 'Chi Siamo', 'Qualifiche', 'Prenota', 'Concorso'];

// ---- K: grande e trasparente in cima, si compatta a pillola quando scorri
function K() {
  const [giu, setGiu] = useState(false);
  useEffect(() => {
    const f = () => setGiu(window.scrollY > 40);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-500" style={{ paddingTop: giu ? 16 : 0 }}>
      <nav aria-label="Navigazione principale" className={`flex w-full items-center justify-between transition-all duration-500 ${giu ? 'max-w-3xl rounded-full border border-white/10 bg-content1/80 px-3 py-2 shadow-2xl shadow-black/60 backdrop-blur-2xl' : 'max-w-[1300px] bg-transparent px-2 py-6'}`}>
        <a href="#" className="flex items-center gap-3"><img src="/crest.png" alt="" className={`w-auto transition-all duration-500 ${giu ? 'h-8' : 'h-12'}`} />
          <span className={`whitespace-nowrap font-extrabold uppercase tracking-wide transition-all duration-500 ${giu ? 'hidden text-sm sm:block' : 'text-lg'}`}>Polizia IPRP</span></a>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINK.map((l, i) => <li key={l}><Link href="#" color="foreground" className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${i === 0 ? 'text-primary' : ''}`}>{l}</Link></li>)}
        </ul>
        <Button color="primary" radius="full" className={`font-semibold transition-all ${giu ? 'h-10' : 'h-12 px-7'}`} endContent={giu ? <Ic n="lock" s={16} /> : null}>{giu ? '' : 'Area Personale'}{giu ? <span className="sr-only">Area Personale</span> : null}</Button>
      </nav>
    </header>
  );
}

// ---- L: mega-menu a tutta larghezza con scheda in evidenza
function L() {
  const [open, setOpen] = useState(false);
  const [m, setM] = useState(true);
  return (
    <>
      <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="2xl" isBordered height="4.5rem" className="bg-background/80 backdrop-blur-xl">
        <NavbarContent justify="start"><NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="lg:hidden" /><NavbarBrand className="gap-3"><img src="/crest.png" alt="" className="h-9 w-auto" /><p className="font-extrabold uppercase tracking-wide">Polizia IPRP</p></NavbarBrand></NavbarContent>
        <NavbarContent className="hidden gap-7 lg:flex" justify="center">
          <NavbarItem isActive><Link href="#" color="primary" className="text-sm font-medium">Home</Link></NavbarItem>
          <NavbarItem><Link href="#" color="foreground" className="text-sm font-medium">Notizie</Link></NavbarItem>
          <NavbarItem><button type="button" onClick={() => setM((x) => !x)} aria-expanded={m} className="flex items-center gap-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">Chi Siamo <motion.span animate={{ rotate: m ? 180 : 0 }}><Ic n="chev" s={16} /></motion.span></button></NavbarItem>
          {LINK.slice(3).map((l) => <NavbarItem key={l}><Link href="#" color="foreground" className="text-sm font-medium">{l}</Link></NavbarItem>)}
        </NavbarContent>
        <NavbarContent justify="end"><NavbarItem><Button color="primary" radius="full" className="h-11 font-semibold">Area Personale</Button></NavbarItem></NavbarContent>
        <NavbarMenu className="gap-1 bg-background/95 pt-6">{LINK.map((l, i) => <NavbarMenuItem key={l}><Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="flex min-h-12 w-full items-center text-lg font-semibold">{l}</Link></NavbarMenuItem>)}</NavbarMenu>
      </Navbar>
      <motion.div initial={false} animate={{ height: m ? 'auto' : 0, opacity: m ? 1 : 0 }} className="fixed inset-x-0 top-[4.5rem] z-40 hidden overflow-hidden border-b border-white/10 bg-content1/95 backdrop-blur-2xl lg:block">
        <div className="mx-auto grid max-w-[1300px] grid-cols-[1fr_1fr_1.1fr] gap-8 px-8 py-8">
          {[
            ['Il Corpo', [['user', 'La Dirigenza', 'Questore e dirigenti'], ['book', 'Storia della Polizia', 'Dalle origini a oggi']]],
            ['Operativo', [['car', 'I nostri mezzi', 'Volanti e veicoli speciali'], ['shield', 'I nostri reparti', 'Volanti, Investigativa, NOS']]],
          ].map(([t, voci]) => (
            <div key={t}>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-default-500">{t}</p>
              {voci.map(([i, a, d]) => (
                <Link key={a} href="#" color="foreground" className="flex items-start gap-3 rounded-large p-3 transition-colors hover:bg-content2">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-medium bg-primary/15 text-primary"><Ic n={i} /></span>
                  <span><span className="block font-semibold">{a}</span><span className="block text-sm text-default-500">{d}</span></span>
                </Link>
              ))}
            </div>
          ))}
          <div className="relative overflow-hidden rounded-large bg-gradient-to-br from-primary/80 to-[#0b1a55] p-6">
            <Chip size="sm" color="default" variant="flat" className="bg-white/20">Candidature aperte</Chip>
            <p className="mt-3 text-2xl font-extrabold leading-tight">Entra nella Polizia di Stato</p>
            <p className="mt-1 text-sm text-white/80">Concorso pubblico sempre aperto, formazione in Accademia.</p>
            <Button radius="full" className="mt-4 bg-white font-semibold text-black">Scopri il concorso →</Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ---- M: tre isole separate (logo, voci, azioni)
function M() {
  const [open, setOpen] = useState(false);
  const [t, setT] = useState('');
  useEffect(() => { try { setT(new URLSearchParams(window.location.search).get('t') || ''); } catch (e) { /* ignora */ } }, []);
  const marchio = t === 'ps' ? <span className="hidden whitespace-nowrap font-extrabold uppercase tracking-wide sm:block">Polizia di Stato</span>
    : t === 'p' ? <span className="hidden font-extrabold uppercase tracking-wide sm:block">Polizia</span>
    : t === 'p2' ? <span className="hidden leading-tight sm:block"><span className="block font-extrabold uppercase tracking-wide">Polizia</span><span className="block text-[10px] uppercase tracking-[0.2em] text-default-500">Questura IPRP</span></span>
    : <span className="hidden font-extrabold uppercase tracking-wide sm:block">Polizia IPRP</span>;
  const glass = 'rounded-full border border-white/10 bg-content1/75 shadow-xl shadow-black/50 backdrop-blur-2xl';
  return (
    <div className="fixed inset-x-0 top-5 z-50 px-4">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-3">
        <a href="#" className={`${glass} flex h-14 items-center gap-3 pl-3 pr-5`}><img src="/crest.png" alt="" className="h-9 w-auto" />{marchio}</a>
        <nav aria-label="Navigazione principale" className={`${glass} hidden h-14 items-center gap-1 px-2 lg:flex`}>
          {LINK.map((l, i) => <Link key={l} href="#" color="foreground" className={`flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors ${i === 0 ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>{l}</Link>)}
        </nav>
        <div className={`${glass} flex h-14 items-center gap-2 px-2`}>
          <Badge content="3" color="danger" size="sm" shape="circle"><Button isIconOnly variant="light" radius="full" aria-label="Notifiche" className="h-10 w-10"><Ic n="bell" /></Button></Badge>
          <Button color="primary" radius="full" className="hidden h-10 font-semibold sm:flex">Area Personale</Button>
          <Button isIconOnly variant="light" radius="full" aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} onPress={() => setOpen((o) => !o)} className="h-10 w-10 lg:hidden"><Ic n={open ? 'chev' : 'file'} /></Button>
        </div>
      </div>
      {open ? (
        <nav aria-label="Menu" className="mx-auto mt-3 max-w-md rounded-[2rem] border border-white/10 bg-content1/95 p-3 backdrop-blur-2xl lg:hidden">
          {LINK.map((l) => <Link key={l} href="#" color="foreground" className="flex min-h-12 items-center rounded-full px-4 text-lg font-semibold hover:bg-white/10">{l}</Link>)}
        </nav>
      ) : null}
    </div>
  );
}

// ---- N: barra laterale estesa a sezioni (stile Notion), pensata per il portale
function N() {
  const sezioni = [
    ['Sito', [['home', 'Home', true], ['news', 'Notizie'], ['shield', 'Chi siamo'], ['medal', 'Qualifiche']]],
    ['Servizi', [['cal', 'Prenota un colloquio'], ['file', 'Denuncia online'], ['trophy', 'Concorso']]],
    ['Area personale', [['grad', 'I miei corsi'], ['clip', 'Il mio percorso'], ['gear', 'Gestione']]],
  ];
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside aria-label="Navigazione principale" className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-white/10 bg-content1/90 backdrop-blur-xl md:flex">
        <div className="flex items-center gap-3 px-5 py-5"><img src="/crest.png" alt="" className="h-10 w-auto" /><div><p className="font-extrabold uppercase leading-tight tracking-wide">Polizia IPRP</p><p className="text-xs text-default-500">Italian Paradise XI</p></div></div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {sezioni.map(([t, voci]) => (
            <div key={t} className="mt-4">
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-default-500">{t}</p>
              {voci.map(([i, l, on]) => (
                <Link key={l} href="#" color="foreground" aria-current={on ? 'page' : undefined} className={`flex h-11 w-full items-center gap-3 rounded-large px-3 text-sm font-medium transition-colors ${on ? 'bg-primary/15 text-primary' : 'hover:bg-white/5'}`}><Ic n={i} />{l}</Link>
              ))}
            </div>
          ))}
        </nav>
        <Divider />
        <div className="flex items-center gap-3 p-4"><Avatar name="MR" color="primary" /><div className="min-w-0 flex-1 leading-tight"><p className="truncate text-sm font-semibold">Mario Rossi</p><p className="text-xs text-default-500">Agente · Allievo</p></div><Button isIconOnly variant="light" radius="full" aria-label="Notifiche" size="sm"><Ic n="bell" s={18} /></Button></div>
      </aside>
      <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="full" isBordered height="4rem" className="bg-background/70 backdrop-blur-xl md:hidden">
        <NavbarContent justify="start"><NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} /><NavbarBrand className="gap-2"><img src="/crest.png" alt="" className="h-8 w-auto" /><p className="font-extrabold uppercase">Polizia IPRP</p></NavbarBrand></NavbarContent>
        <NavbarMenu className="gap-1 bg-background/95 pt-6">{sezioni.flatMap(([, v]) => v).map(([i, l], k) => <NavbarMenuItem key={l}><Link href="#" color={k === 0 ? 'primary' : 'foreground'} className="flex min-h-12 w-full items-center gap-3 text-lg font-semibold"><Ic n={i} />{l}</Link></NavbarMenuItem>)}</NavbarMenu>
      </Navbar>
    </>
  );
}

// ---- O: capsula che segue il mouse tra le voci + barra di avanzamento della pagina
function O() {
  const [hover, setHover] = useState('Home');
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return (
    <>
      <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="2xl" height="5rem" className="bg-background/50 backdrop-blur-2xl">
        <NavbarContent justify="start"><NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="lg:hidden" /><NavbarBrand className="gap-3"><img src="/crest.png" alt="" className="h-10 w-auto" /><p className="font-extrabold uppercase tracking-wide">Polizia IPRP</p></NavbarBrand></NavbarContent>
        <NavbarContent justify="center" className="hidden lg:flex">
          <LayoutGroup>
            <ul className="flex items-center rounded-full bg-white/5 p-1.5" onMouseLeave={() => setHover('Home')}>
              {LINK.map((l) => (
                <li key={l} className="relative" onMouseEnter={() => setHover(l)}>
                  {hover === l ? <motion.span layoutId="capsula" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 420, damping: 34 }} /> : null}
                  <Link href="#" color="foreground" className="relative z-10 block px-5 py-2.5 text-sm font-semibold">{l}</Link>
                </li>
              ))}
            </ul>
          </LayoutGroup>
        </NavbarContent>
        <NavbarContent justify="end"><NavbarItem><Button variant="bordered" radius="full" className="h-11 border-white/30 font-semibold" endContent={<Ic n="lock" s={16} />}>Area Personale</Button></NavbarItem></NavbarContent>
        <NavbarMenu className="gap-1 bg-background/95 pt-6">{LINK.map((l, i) => <NavbarMenuItem key={l}><Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="flex min-h-12 w-full items-center text-lg font-semibold">{l}</Link></NavbarMenuItem>)}</NavbarMenu>
      </Navbar>
      <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-primary" />
    </>
  );
}

export const VARIANTI3 = { k: K, l: L, m: M, n: N, o: O };
export const NOMI3 = {
  k: 'K · Si compatta quando scorri',
  l: 'L · Mega-menu a tutta larghezza con scheda in evidenza',
  m: 'M · Tre isole separate',
  n: 'N · Barra laterale estesa a sezioni',
  o: 'O · Capsula che segue il mouse',
};
