'use client';

import { Avatar, Button, Divider, Drawer, DrawerBody, DrawerContent, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Listbox, ListboxItem, User, useDisclosure } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';
import { useAgentProfile } from './useAgentProfile';

const ITEMS = [
  { href: '/dashboard', label: 'Panoramica', icon: 'dashboard' },
  { href: '/gestione/pratiche', label: 'Pratiche', icon: 'file-text' },
  { href: '/gestione/candidature', label: 'Candidature', icon: 'clipboard' },
  { href: '/gestione/comunicati', label: 'Comunicati', icon: 'megaphone' },
  { href: '/gestione/impostazioni', label: 'Impostazioni', icon: 'shield' },
];

const SITE = [
  { href: '/organigramma', label: 'Organigramma', icon: 'users' },
  { href: '/', label: 'Torna al sito', icon: 'landmark' },
];

function Menu({ pathname, onNavigate }) {
  const attiva = (href) => pathname === href || pathname.startsWith(href + '/');
  const voce = (it) => (
    <ListboxItem key={it.href} href={it.href} textValue={it.label} startContent={<Icon name={it.icon} size={19} strokeWidth={1.6} />} onPress={onNavigate} className={attiva(it.href) ? 'bg-primary/15 text-primary' : ''}>
      {it.label}
    </ListboxItem>
  );
  return (
    <Listbox aria-label="Menu gestione" itemClasses={{ base: 'h-11 gap-3 rounded-xl px-3 data-[hover=true]:bg-white/10', title: 'text-sm' }}>
      {[...ITEMS.map(voce), <ListboxItem key="sep" isReadOnly textValue="separatore" className="h-3 p-0 opacity-100" hideSelectedIcon><Divider className="my-1" /></ListboxItem>, ...SITE.map(voce)]}
    </Listbox>
  );
}

function Marchio() {
  return (
    <a href="/" aria-label="Questura IPRP, torna al sito" className="flex items-center gap-3 px-2 py-3">
      <img src="/assets/crest-md.png" alt="" className="h-10 w-auto" />
      <span className="leading-tight">
        <span className="block text-sm font-extrabold uppercase tracking-[0.14em]">Questura</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-default-500">Gestione</span>
      </span>
    </a>
  );
}

// Guscio dell'area riservata: barra laterale a sinistra e intestazione (HeroUI).
export function AgentShell({ children, preview = false }) {
  const pathname = usePathname() || '';
  const { profile: realProfile, logout } = useAgentProfile(preview);
  const profile = preview ? { nome: 'Marco', cognome: 'Ferrari', grado: 'Ispettore' } : realProfile;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const nome = profile ? `${profile.nome || ''} ${profile.cognome || ''}`.trim() || 'Agente' : '…';
  const iniziali = profile ? (((profile.nome || '')[0] || '') + ((profile.cognome || '')[0] || '')).toUpperCase() || '?' : '';
  const sezione = [...ITEMS, ...SITE].find((i) => pathname === i.href || pathname.startsWith(i.href + '/'));

  const utente = (
    <User name={nome} description={profile?.grado || 'Agente'} avatarProps={{ name: iniziali, color: 'primary', size: 'sm' }} classNames={{ name: 'text-sm font-semibold uppercase', description: 'text-xs' }} className="justify-start px-2" />
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside aria-label="Menu gestione" className="hidden w-64 flex-none flex-col gap-2 border-r border-white/10 bg-content1/50 p-4 lg:flex">
        <Marchio />
        <div className="py-2">{utente}</div>
        <Divider />
        <div className="mt-1 flex-1"><Menu pathname={pathname} /></div>
        <Button variant="bordered" radius="full" onPress={logout} startContent={<Icon name="logout" size={17} />} className="border-white/20">
          Esci
        </Button>
      </aside>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left" size="xs" classNames={{ base: 'border-r border-white/10 bg-content1' }}>
        <DrawerContent>
          {(close) => (
            <DrawerBody className="gap-2 p-4">
              <Marchio />
              <div className="py-2">{utente}</div>
              <Divider />
              <Menu pathname={pathname} onNavigate={close} />
              <Button variant="bordered" radius="full" onPress={logout} className="mt-auto border-white/20">
                Esci
              </Button>
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 flex-none items-center gap-3 border-b border-white/10 px-4 sm:px-6">
          <Button isIconOnly variant="light" radius="full" aria-label="Apri il menu" onPress={onOpen} className="lg:hidden">
            <Icon name="menu" size={22} />
          </Button>
          <p className="font-semibold">{sezione ? sezione.label : 'Gestione'}</p>
          <div className="flex-1" />
          <span className="hidden text-right text-xs leading-snug text-default-500 sm:block">
            Questura IPRP
            <br />
            Italian Paradise XI
          </span>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button type="button" aria-label="Menu utente" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar name={iniziali} color="primary" size="sm" isBordered />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Utente">
              <DropdownItem key="p" isReadOnly textValue={nome} description={profile?.grado || 'Agente'} className="opacity-100">{nome}</DropdownItem>
              <DropdownItem key="s" href="/">Torna al sito</DropdownItem>
              <DropdownItem key="e" color="danger" className="text-danger" onPress={logout}>Esci</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
