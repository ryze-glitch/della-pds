'use client';

import { useState } from 'react';
import {
  Avatar, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Kbd, Link, Navbar, NavbarBrand, NavbarContent,
  NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Popover, PopoverContent, PopoverTrigger, Tab, Tabs,
} from '@heroui/react';

const Chev = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);
const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ICONE = {
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  book: 'M4 5c5-2 8-1 8 1v15c0-2-3-3-8-1ZM20 5c-5-2-8-1-8 1v15c0-2 3-3 8-1Z',
  car: 'M5 17h14M6 17l1.5-6h9L18 17M7 17v2M17 17v2',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4',
};

const CHI_SIAMO = [
  { k: 'dir', t: 'La Dirigenza', s: 'Questore e dirigenti', i: 'user' },
  { k: 'storia', t: 'Storia della Polizia', s: 'Dalle origini a oggi', i: 'book' },
  { k: 'mezzi', t: 'I nostri mezzi', s: 'Volanti e veicoli speciali', i: 'car' },
  { k: 'reparti', t: 'I nostri reparti', s: 'Volanti, Investigativa, NOS…', i: 'shield' },
];
const LINKS = ['Home', 'Notizie', 'Qualifiche', 'Prenota', 'Concorso Pubblico'];

const Brand = ({ small }) => (
  <NavbarBrand className="gap-3">
    <img src="/crest.png" alt="" className={small ? 'h-7 w-auto' : 'h-9 w-auto'} />
    <p className="font-extrabold uppercase tracking-wide">Polizia IPRP</p>
  </NavbarBrand>
);

function ChiSiamoMenu({ trigger }) {
  return (
    <Dropdown placement="bottom" classNames={{ content: 'border border-white/10 bg-content1/95 backdrop-blur-xl' }}>
      <NavbarItem>
        <DropdownTrigger>{trigger}</DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="Chi siamo" itemClasses={{ base: 'gap-3 py-2.5', title: 'font-semibold' }}>
        {CHI_SIAMO.map((c) => (
          <DropdownItem key={c.k} description={c.s} startContent={<span className="text-primary"><Icon d={ICONE[c.i]} /></span>}>{c.t}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

const MobileMenu = ({ cta }) => (
  <NavbarMenu className="gap-1 bg-background/95 pt-6 backdrop-blur-xl">
    {[...LINKS.slice(0, 2), 'Chi Siamo', ...LINKS.slice(2)].map((l, i) => (
      <NavbarMenuItem key={l} isActive={i === 0}>
        <Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="flex min-h-12 w-full items-center text-lg font-semibold" size="lg">{l}</Link>
      </NavbarMenuItem>
    ))}
    <NavbarMenuItem className="pt-4">{cta}</NavbarMenuItem>
  </NavbarMenu>
);

const Area = ({ className = '' }) => (
  <Button as={Link} href="#" color="primary" radius="full" className={`h-11 pl-5 pr-2 font-semibold ${className}`} endContent={<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><Icon d={ICONE.lock} /></span>}>
    Area Personale
  </Button>
);

// ---- A: pillola flottante in vetro (la più vicina a quella attuale)
function A() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed inset-x-0 top-5 z-50 px-4">
      <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="2xl" position="static" height="4rem"
        className="mx-auto max-w-[1300px] rounded-full border border-white/10 bg-content1/70 shadow-2xl shadow-black/50 backdrop-blur-xl" classNames={{ wrapper: 'px-3' }}>
        <NavbarContent justify="start">
          <NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="lg:hidden" />
          <NavbarBrand className="grow-0 gap-3 rounded-full bg-content2 py-1.5 pl-3 pr-3 sm:pr-5">
            <img src="/crest.png" alt="" className="h-8 w-auto" /><p className="hidden font-extrabold uppercase tracking-wide sm:block">Polizia IPRP</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden gap-7 lg:flex" justify="center">
          {LINKS.slice(0, 2).map((l, i) => <NavbarItem key={l} isActive={i === 0}><Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="text-sm font-medium">{l}</Link></NavbarItem>)}
          <ChiSiamoMenu trigger={<Button disableRipple variant="light" className="h-auto min-w-0 bg-transparent p-0 text-sm font-medium data-[hover=true]:bg-transparent" endContent={<Chev />}>Chi Siamo</Button>} />
          {LINKS.slice(2).map((l) => <NavbarItem key={l}><Link href="#" color="foreground" className="text-sm font-medium">{l}</Link></NavbarItem>)}
        </NavbarContent>
        <NavbarContent justify="end"><NavbarItem className="hidden sm:flex"><Area /></NavbarItem></NavbarContent>
        <MobileMenu cta={<Area className="w-full justify-between" />} />
      </Navbar>
    </div>
  );
}

// ---- B: barra a tutta larghezza con sottolineatura sulla voce attiva e utente
function B() {
  const [open, setOpen] = useState(false);
  return (
    <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="2xl" isBordered height="4.5rem" className="bg-background/70 backdrop-blur-xl" classNames={{ item: 'data-[active=true]:after:absolute data-[active=true]:after:bottom-0 data-[active=true]:after:left-0 data-[active=true]:after:h-0.5 data-[active=true]:after:w-full data-[active=true]:after:bg-primary relative flex h-full items-center' }}>
      <NavbarContent justify="start">
        <NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="lg:hidden" />
        <Brand />
      </NavbarContent>
      <NavbarContent className="hidden gap-8 lg:flex" justify="center">
        {LINKS.slice(0, 2).map((l, i) => <NavbarItem key={l} isActive={i === 0}><Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="text-sm font-semibold">{l}</Link></NavbarItem>)}
        <ChiSiamoMenu trigger={<Button disableRipple variant="light" className="h-auto min-w-0 bg-transparent p-0 text-sm font-semibold data-[hover=true]:bg-transparent" endContent={<Chev />}>Chi Siamo</Button>} />
        {LINKS.slice(2).map((l) => <NavbarItem key={l}><Link href="#" color="foreground" className="text-sm font-semibold">{l}</Link></NavbarItem>)}
      </NavbarContent>
      <NavbarContent justify="end" className="gap-3">
        <NavbarItem className="hidden sm:flex"><Button variant="flat" radius="full" size="sm" startContent={<Icon d={ICONE.search} />} endContent={<Kbd keys={['command']}>K</Kbd>} className="text-default-500">Cerca</Button></NavbarItem>
        <NavbarItem className="flex items-center gap-3">
          <div className="hidden text-right text-xs leading-tight sm:block"><p className="font-semibold">Mario Rossi</p><p className="text-default-500">Agente</p></div>
          <Avatar name="MR" size="sm" color="primary" isBordered />
        </NavbarItem>
      </NavbarContent>
      <MobileMenu cta={<Button color="primary" radius="full" className="h-12 w-full font-semibold">Area Personale</Button>} />
    </Navbar>
  );
}

// ---- C: due livelli — striscia di servizio + barra principale con pulsante d'azione
function C() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="hidden border-b border-white/10 bg-content1 text-xs text-default-500 sm:block">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 py-2">
          <div className="flex items-center gap-5">
            <span>Emergenze: <strong className="text-foreground">112</strong> · Questura: <strong className="text-foreground">113</strong></span>
            <Chip size="sm" variant="dot" color="success">Centrale operativa attiva</Chip>
          </div>
          <div className="flex items-center gap-5"><Link href="#" size="sm" color="foreground">Italiano</Link><Link href="#" size="sm" color="foreground">Accessibilità</Link></div>
        </div>
      </div>
      <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="2xl" height="5rem" className="bg-background/80 backdrop-blur-xl">
        <NavbarContent justify="start"><NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="lg:hidden" /><Brand /></NavbarContent>
        <NavbarContent className="hidden gap-6 lg:flex" justify="center">
          {LINKS.slice(0, 2).map((l, i) => <NavbarItem key={l} isActive={i === 0}><Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="text-sm font-medium">{l}</Link></NavbarItem>)}
          <ChiSiamoMenu trigger={<Button disableRipple variant="light" className="h-auto min-w-0 bg-transparent p-0 text-sm font-medium data-[hover=true]:bg-transparent" endContent={<Chev />}>Chi Siamo</Button>} />
          {LINKS.slice(2).map((l) => <NavbarItem key={l}><Link href="#" color="foreground" className="text-sm font-medium">{l}</Link></NavbarItem>)}
        </NavbarContent>
        <NavbarContent justify="end" className="gap-2">
          <NavbarItem className="hidden md:flex"><Button as={Link} href="#" variant="bordered" radius="full" className="h-11 font-semibold">Denuncia online</Button></NavbarItem>
          <NavbarItem><Button as={Link} href="#" color="primary" radius="full" className="h-11 font-semibold">Area Personale</Button></NavbarItem>
        </NavbarContent>
        <MobileMenu cta={<Button color="primary" radius="full" className="h-12 w-full font-semibold">Area Personale</Button>} />
      </Navbar>
    </header>
  );
}

// ---- D: voci come interruttore a pillole (Tabs) al centro
function D() {
  const [open, setOpen] = useState(false);
  return (
    <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="2xl" height="5rem" className="bg-transparent backdrop-blur-md" isBlurred>
      <NavbarContent justify="start"><NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="lg:hidden" /><Brand /></NavbarContent>
      <NavbarContent className="hidden lg:flex" justify="center">
        <Tabs aria-label="Navigazione" radius="full" variant="solid" size="lg" selectedKey="home" classNames={{ tabList: 'bg-content2/80 p-1.5 backdrop-blur-xl', tab: 'px-5', cursor: 'bg-primary', tabContent: 'font-medium group-data-[selected=true]:text-white' }}>
          <Tab key="home" title="Home" />
          <Tab key="notizie" title="Notizie" />
          <Tab key="chi" title="Chi siamo" />
          <Tab key="qual" title="Qualifiche" />
          <Tab key="prenota" title="Prenota" />
          <Tab key="concorso" title="Concorso" />
        </Tabs>
      </NavbarContent>
      <NavbarContent justify="end"><NavbarItem><Button isIconOnly variant="flat" radius="full" aria-label="Area Personale" className="h-11 w-11"><Icon d={ICONE.user} /></Button></NavbarItem></NavbarContent>
      <MobileMenu cta={<Button color="primary" radius="full" className="h-12 w-full font-semibold">Area Personale</Button>} />
    </Navbar>
  );
}

// ---- E: mega-menu con pannello di schede
function E() {
  const [open, setOpen] = useState(false);
  return (
    <Navbar isMenuOpen={open} onMenuOpenChange={setOpen} maxWidth="2xl" isBordered height="4.5rem" className="bg-background/70 backdrop-blur-xl">
      <NavbarContent justify="start"><NavbarMenuToggle aria-label={open ? 'Chiudi il menu' : 'Apri il menu'} className="lg:hidden" /><Brand /></NavbarContent>
      <NavbarContent className="hidden gap-7 lg:flex" justify="center">
        {LINKS.slice(0, 2).map((l, i) => <NavbarItem key={l} isActive={i === 0}><Link href="#" color={i === 0 ? 'primary' : 'foreground'} className="text-sm font-medium">{l}</Link></NavbarItem>)}
        <NavbarItem>
          <Popover placement="bottom" offset={20} defaultOpen>
            <PopoverTrigger>
              <Button disableRipple variant="light" className="h-auto min-w-0 bg-transparent p-0 text-sm font-medium data-[hover=true]:bg-transparent" endContent={<Chev />}>Chi Siamo</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[560px] border border-white/10 bg-content1 p-3">
              <div className="grid w-full grid-cols-2 gap-2">
                {CHI_SIAMO.map((c) => (
                  <Link key={c.k} href="#" color="foreground" className="flex w-full items-start gap-3 rounded-large p-3 transition-colors hover:bg-content2">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-medium bg-primary/15 text-primary"><Icon d={ICONE[c.i]} /></span>
                    <span><span className="block font-semibold">{c.t}</span><span className="block text-xs text-default-500">{c.s}</span></span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex w-full items-center justify-between rounded-large bg-primary/10 px-4 py-3 text-sm">
                <span>Vuoi entrare in Polizia?</span><Link href="#" size="sm">Scopri il concorso →</Link>
              </div>
            </PopoverContent>
          </Popover>
        </NavbarItem>
        {LINKS.slice(2).map((l) => <NavbarItem key={l}><Link href="#" color="foreground" className="text-sm font-medium">{l}</Link></NavbarItem>)}
      </NavbarContent>
      <NavbarContent justify="end"><NavbarItem><Area /></NavbarItem></NavbarContent>
      <MobileMenu cta={<Button color="primary" radius="full" className="h-12 w-full font-semibold">Area Personale</Button>} />
    </Navbar>
  );
}

export const VARIANTI = { a: A, b: B, c: C, d: D, e: E };
export const NOMI = {
  a: 'A · Pillola flottante in vetro',
  b: 'B · Barra intera con sottolineatura e utente',
  c: 'C · Doppia riga con numeri utili e pulsante d’azione',
  d: 'D · Voci a interruttore (pillole)',
  e: 'E · Mega-menu con pannello di schede',
};
