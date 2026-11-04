'use client';

import { useState } from 'react';
import { CalendarDate } from '@internationalized/date';
import { Accordion, AccordionItem, Avatar, Badge, BreadcrumbItem, Breadcrumbs, Button, Calendar, Card, CardBody, CardHeader, Chip, CircularProgress, Divider, Input, Kbd, Listbox, ListboxItem, ListboxSection, Modal, ModalContent, Navbar, NavbarBrand, NavbarContent, NavbarItem, Progress, Snippet, Switch, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Tooltip, User } from '@heroui/react';
import { CORSI, Ic, P, UTENTE } from '../sisfor/comune';

const X = {
  bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM10 20a2 2 0 0 0 4 0',
  folder: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12l2-1-1-3-2 .5-1.5-1.500.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6 8.500 4 8l-1 3 2 1v2l-2 1 1 3 2-.5 1.500 1.500-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.500-1.500 2 .5 1-3-2-1z',
};
const G = 'border border-white/10 bg-content1/70';
const ICONA = { primary: 'bg-primary/15 text-primary', success: 'bg-success/15 text-success', warning: 'bg-warning/15 text-warning', danger: 'bg-danger/15 text-danger', secondary: 'bg-secondary/15 text-secondary', default: 'bg-white/10 text-default-600' };
const Ico = ({ c = 'primary', d, s = 18 }) => <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl ${ICONA[c]}`}><Ic d={d} s={s} /></span>;
const Foto = ({ s = 'sm' }) => <Avatar src="/crest.png" size={s} isBordered color="primary" className="flex-none bg-black/40 p-1.5" />;
const IN = CORSI[0];
const MENU = [
  ['Studio', [['dash', 'Dashboard', P.grid], ['corsi', 'I miei corsi', P.book], ['perc', 'Il mio percorso', P.route], ['abil', 'Abilitazioni', P.award]]],
  ['Lavoro', [['prat', 'Gestione pratiche', X.folder], ['istr', 'Area istruttori', P.check]]],
  ['Sistema', [['adm', 'Amministrazione', X.sliders]]],
];
const ESAMI = [['Posto di blocco · modulo 1', '12 Mag 2025', '80%', 'success', 'Superato'], ['Primo soccorso · finale', '28 Apr 2025', '92%', 'success', 'Superato'], ['Posto di blocco · modulo 2', '—', '—', 'primary', 'In corso'], ['Radio e codici · modulo 1', '—', '—', 'default', 'Da fare']];
const Esami = ({ compatta }) => (
  <Table aria-label="Quiz e esami" removeWrapper={false} classNames={{ wrapper: 'border border-white/10 bg-content1/70 p-2', th: 'bg-transparent text-default-500' }}>
    <TableHeader><TableColumn>Quiz</TableColumn><TableColumn>Data</TableColumn><TableColumn>Voto</TableColumn><TableColumn>Esito</TableColumn></TableHeader>
    <TableBody>{ESAMI.slice(0, compatta ? 3 : 4).map(([t, d, v, c, e]) => (<TableRow key={t}><TableCell className="font-semibold">{t}</TableCell><TableCell className="text-default-500">{d}</TableCell><TableCell>{v}</TableCell><TableCell><Chip size="sm" variant="flat" color={c}>{e}</Chip></TableCell></TableRow>))}</TableBody>
  </Table>
);
const Utente = () => <User name={`${UTENTE.nome} ${UTENTE.cognome}`} description={UTENTE.qualifica} avatarProps={{ src: '/crest.png', isBordered: true, color: 'primary', size: 'sm', className: 'bg-black/40 p-1' }} />;

/* K1 · Navbar HeroUI in alto con le sezioni, sotto la panoramica a schede */
function K1() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar maxWidth="xl" isBordered classNames={{ base: 'bg-background/95' }}>
        <NavbarBrand className="gap-3"><img src="/logo-iprp.png" alt="" className="h-9" /><span className="font-extrabold">SISFOR<span className="text-primary">+</span></span></NavbarBrand>
        <NavbarContent className="hidden gap-1 md:flex" justify="center">
          {['Dashboard', 'Corsi', 'Percorso', 'Abilitazioni', 'Pratiche', 'Istruttori', 'Amministrazione'].map((t, k) => (<NavbarItem key={t} isActive={k === 0}><Button size="sm" radius="full" variant={k === 0 ? 'flat' : 'light'} color={k === 0 ? 'primary' : 'default'}>{t}</Button></NavbarItem>))}
        </NavbarContent>
        <NavbarContent justify="end"><NavbarItem><Badge content="2" color="danger" size="sm"><Button isIconOnly variant="light" radius="full"><Ic d={X.bell} /></Button></Badge></NavbarItem><NavbarItem><Button size="sm" variant="flat" radius="full">Torna al sito</Button></NavbarItem><NavbarItem><Foto /></NavbarItem></NavbarContent>
      </Navbar>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Breadcrumbs size="sm" className="mb-3"><BreadcrumbItem>SISFOR+</BreadcrumbItem><BreadcrumbItem isCurrent>Dashboard</BreadcrumbItem></Breadcrumbs>
        <h1 className="text-3xl font-extrabold tracking-tight">Buon pomeriggio, {UTENTE.nome}</h1>
        <Tabs aria-label="Panoramica" variant="underlined" color="primary" className="mt-4" classNames={{ panel: 'px-0 pt-6' }}>
          <Tab key="p" title="Panoramica">
            <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <div className="flex flex-col gap-5">
                <Card className={G} radius="lg"><CardBody className="gap-3 p-7"><Chip size="sm" color="primary" variant="flat">Continua</Chip><h2 className="text-2xl font-extrabold">{IN.titolo}</h2><p className="text-default-500">Modulo 2 · Fermare un veicolo e primo contatto</p><Progress aria-label="pc" value={IN.pc} size="sm" label="Avanzamento" showValueLabel className="max-w-md" /><div><Button color="primary" radius="full" className="font-semibold" endContent={<Ic d={P.arrow} s={16} />}>Riprendi</Button></div></CardBody></Card>
                <Esami compatta />
              </div>
              <div className="flex flex-col gap-5">
                <Card className={G} radius="lg"><CardBody className="flex-row items-center gap-5 p-6"><CircularProgress aria-label="Percorso" value={42} size="lg" color="primary" showValueLabel /><div><div className="font-bold">Livello 2</div><div className="text-sm text-default-500">Agente Scelto · 42% del percorso</div></div></CardBody></Card>
                <Card className="border border-warning/30 bg-warning/5" radius="lg"><CardBody className="gap-2 p-6"><div className="flex items-center gap-2 font-bold text-warning"><Ic d={P.shield} s={17} /> Dalla Questura</div><p className="font-semibold">Richiesta Feste</p><p className="text-sm text-default-500">Avvisare il Questore con almeno 3 giorni di preavviso.</p></CardBody></Card>
              </div>
            </div>
          </Tab>
          <Tab key="c" title="Corsi" />
          <Tab key="a" title="Abilitazioni" />
          <Tab key="r" title="Pratiche" />
        </Tabs>
      </main>
    </div>
  );
}

/* K2 · Barra laterale con Listbox a sezioni + tavolozza dei comandi (Ctrl K) aperta */
function K2() {
  const [aperto, setAperto] = useState(true);
  const [sel, setSel] = useState('dash');
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 flex-none flex-col border-r border-white/10 p-4 md:flex">
        <div className="mb-5 flex items-center gap-3 px-2"><img src="/logo-iprp.png" alt="" className="h-9" /><div className="leading-tight"><div className="font-extrabold">SISFOR<span className="text-primary">+</span></div><div className="text-[11px] text-default-500">Formazione</div></div></div>
        <Listbox aria-label="Menu" selectionMode="single" disallowEmptySelection selectedKeys={[sel]} onSelectionChange={(s) => setSel([...s][0])} itemClasses={{ base: 'gap-3 rounded-xl px-3 py-2.5 data-[selected=true]:bg-primary/15 data-[selected=true]:text-primary' }}>
          {MENU.map(([sez, voci]) => (<ListboxSection key={sez} title={sez} classNames={{ heading: 'px-3 text-[11px] uppercase tracking-widest text-default-500' }}>{voci.map(([k, t, d]) => (<ListboxItem key={k} startContent={<Ic d={d} s={18} />}>{t}</ListboxItem>))}</ListboxSection>))}
        </Listbox>
        <div className="mt-auto flex flex-col gap-3"><Divider /><Utente /></div>
      </aside>
      <main className="flex-1 px-6 py-8 lg:px-10">
        <div className="mb-6 flex items-center gap-3"><Button variant="bordered" radius="lg" className="h-11 w-full max-w-md justify-start text-default-500" startContent={<Ic d={X.search} s={16} />} endContent={<span className="ml-auto flex gap-1"><Kbd keys={['command']}>K</Kbd></span>} onPress={() => setAperto(true)}>Cerca o vai a…</Button><div className="ml-auto"><Badge content="2" color="danger" size="sm"><Button isIconOnly variant="flat" radius="full"><Ic d={X.bell} /></Button></Badge></div></div>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">{[['Corsi in corso', '1', P.book, 'primary'], ['Abilitazioni', '1', P.award, 'warning'], ['Media quiz', '84%', P.check, 'success']].map(([l, v, d, c]) => (<Card key={l} className={G} radius="lg"><CardBody className="flex-row items-center gap-4 p-5"><Ico c={c} d={d} s={20} /><div><div className="text-2xl font-extrabold leading-none">{v}</div><div className="mt-1 text-xs text-default-500">{l}</div></div></CardBody></Card>))}</div>
        <div className="mt-6 grid gap-5 xl:grid-cols-2"><Esami /><Card className={G} radius="lg"><CardHeader className="px-6 pt-5 font-bold">Corsi</CardHeader><CardBody className="gap-4 px-6 pb-6">{CORSI.map((c) => (<div key={c.id} className="flex items-center gap-4"><span className={`h-10 w-10 flex-none rounded-xl bg-gradient-to-br ${c.grad}`} /><div className="flex-1"><div className="text-sm font-semibold leading-snug">{c.titolo}</div><Progress aria-label="pc" value={c.pc} size="sm" className="mt-1.5" /></div><span className="w-9 text-right text-xs text-default-500">{c.pc}%</span></div>))}</CardBody></Card></div>
      </main>
      <Modal isOpen={aperto} onOpenChange={setAperto} placement="top" backdrop="blur" size="xl" hideCloseButton classNames={{ base: 'mt-24 border border-white/10' }}>
        <ModalContent><div className="p-2"><Input autoFocus variant="flat" radius="lg" placeholder="Cerca corsi, moduli, pratiche, agenti…" startContent={<Ic d={X.search} s={18} />} endContent={<Kbd>esc</Kbd>} classNames={{ inputWrapper: 'h-14' }} />
          <Listbox aria-label="Risultati" itemClasses={{ base: 'gap-3 rounded-xl px-3 py-3' }}>
            <ListboxSection title="Riprendi"><ListboxItem key="r1" description="Modulo 2 · 43%" startContent={<Ico c="primary" d={P.play} />}>Posto di blocco e fermo veicolo</ListboxItem></ListboxSection>
            <ListboxSection title="Vai a">{[['Il mio percorso', P.route, 'secondary'], ['Abilitazioni', P.award, 'warning'], ['Gestione pratiche', X.folder, 'success']].map(([t, d, c]) => (<ListboxItem key={t} startContent={<Ico c={c} d={d} />}>{t}</ListboxItem>))}</ListboxSection>
          </Listbox></div></ModalContent>
      </Modal>
    </div>
  );
}

/* K3 · Calendario degli esami + corsi a fisarmonica con i moduli */
function K3() {
  const [d, setD] = useState(new CalendarDate(2025, 5, 14));
  return (
    <div className="min-h-screen bg-background">
      <Navbar maxWidth="xl" isBordered classNames={{ base: 'bg-background/95' }}><NavbarBrand className="gap-3"><img src="/logo-iprp.png" alt="" className="h-9" /><span className="font-extrabold">SISFOR<span className="text-primary">+</span></span></NavbarBrand><NavbarContent justify="end"><NavbarItem><Button size="sm" variant="flat" radius="full">Torna al sito</Button></NavbarItem><NavbarItem><Foto /></NavbarItem></NavbarContent></Navbar>
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        <section className="flex flex-col gap-6">
          <div><h1 className="text-3xl font-extrabold tracking-tight">Ciao, {UTENTE.nome}</h1><p className="text-default-500">{UTENTE.qualifica} · <Snippet size="sm" hideSymbol variant="flat" className="align-middle">{UTENTE.matricola}</Snippet></p></div>
          <div className="grid gap-4 sm:grid-cols-3">{[['Completamento', '42%'], ['Quiz superati', '2 / 3'], ['Abilitazioni', '1']].map(([l, v]) => (<Card key={l} className={G} radius="lg"><CardBody className="p-5"><div className="text-xs text-default-500">{l}</div><div className="text-3xl font-extrabold">{v}</div></CardBody></Card>))}</div>
          <Accordion variant="splitted" disableIndicatorAnimation defaultExpandedKeys={['pdb']} itemClasses={{ base: 'border border-white/10 bg-content1/70 shadow-none', title: 'font-bold', trigger: 'py-4' }}>
            {CORSI.map((c) => (<AccordionItem key={c.id === 'pdb' ? 'pdb' : c.id} aria-label={c.titolo} title={c.titolo} subtitle={`${c.moduli} moduli · ${c.durata}`} startContent={<span className={`h-10 w-10 rounded-xl bg-gradient-to-br ${c.grad}`} />} indicator={<Chip size="sm" variant="flat" color={c.pc === 100 ? 'success' : c.pc ? 'primary' : 'default'}>{c.pc}%</Chip>}>
              <div className="flex flex-col gap-2 pb-3">{['Preparare il posto di blocco', 'Fermare un veicolo e primo contatto', 'Controllo, alcoltest ed esito'].slice(0, c.moduli).map((m, k) => (<div key={m} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${c.pc && k === 0 ? 'bg-success text-black' : 'bg-white/10'}`}>{k + 1}</span><span className="flex-1 font-semibold">{m}</span><Chip size="sm" variant="flat" color={c.pc && k === 0 ? 'success' : 'default'}>{c.pc && k === 0 ? 'Fatto' : 'Da fare'}</Chip></div>))}<Button color="primary" radius="full" size="sm" className="mt-1 self-start font-semibold">{c.pc ? 'Riprendi' : 'Inizia'}</Button></div>
            </AccordionItem>))}
          </Accordion>
        </section>
        <aside className="flex flex-col gap-5">
          <Calendar aria-label="Calendario esami" value={d} onChange={setD} calendarWidth={318} classNames={{ base: 'border border-white/10 bg-content1/70 shadow-none' }} />
          <Card className={G} radius="lg"><CardBody className="gap-3 p-5"><div className="font-bold">Il 14 maggio</div><div className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm"><Ic d={P.clock} s={16} /><span className="flex-1 font-semibold">Quiz · modulo 2</span><span className="text-default-500">21:00</span></div><div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm"><Ic d={P.award} s={16} /><span className="flex-1 font-semibold">Esame posto di blocco</span><span className="text-default-500">21:30</span></div></CardBody></Card>
        </aside>
      </main>
    </div>
  );
}

/* K4 · Pagina a schede grandi: Studio / Abilitazioni / Pratiche / Impostazioni */
function K4() {
  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden border-b border-white/10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(37,99,235,0.25),transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-8"><Foto s="lg" /><div><h1 className="text-3xl font-extrabold tracking-tight">{UTENTE.nome} {UTENTE.cognome}</h1><p className="text-default-400">{UTENTE.qualifica}</p><div className="mt-2 flex gap-2"><Chip size="sm" variant="flat">{UTENTE.matricola}</Chip><Chip size="sm" variant="flat" color="success">1 abilitazione</Chip></div></div>
          <div className="ml-auto flex items-center gap-8"><CircularProgress aria-label="Percorso" value={42} size="lg" color="primary" showValueLabel label="Percorso" /><Button variant="flat" radius="full">Torna al sito</Button></div></div></header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Tabs aria-label="Sezioni" color="primary" radius="full" size="lg" classNames={{ panel: 'pt-6' }}>
          <Tab key="s" title={<span className="flex items-center gap-2"><Ic d={P.book} s={16} />Studio</span>}>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{CORSI.map((c) => (<Card key={c.id} isPressable className={G} radius="lg"><div className={`h-24 bg-gradient-to-br ${c.grad}`} /><CardBody className="gap-3 p-5 text-left"><div className="font-bold leading-snug">{c.titolo}</div><Progress aria-label="pc" value={c.pc} size="sm" color={c.pc === 100 ? 'success' : 'primary'} /><div className="text-xs text-default-500">{c.moduli} moduli · {c.durata}</div></CardBody></Card>))}</div>
            <div className="mt-6"><Esami /></div>
          </Tab>
          <Tab key="a" title={<span className="flex items-center gap-2"><Ic d={P.award} s={16} />Abilitazioni</span>} />
          <Tab key="p" title={<span className="flex items-center gap-2"><Ic d={X.folder} s={16} />Pratiche</span>} />
          <Tab key="i" title={<span className="flex items-center gap-2"><Ic d={P.check} s={16} />Istruttori</span>} />
          <Tab key="m" title={<span className="flex items-center gap-2"><Ic d={X.gear} s={16} />Impostazioni</span>}><Card className={G} radius="lg"><CardBody className="gap-4 p-6"><Switch defaultSelected>Notifiche dei nuovi corsi</Switch><Switch>Promemoria per i quiz</Switch><Switch defaultSelected>Mostra la mia foto nella barra del sito</Switch></CardBody></Card></Tab>
        </Tabs>
      </main>
    </div>
  );
}

export function Dash2({ v }) {
  const V = { k1: K1, k2: K2, k3: K3, k4: K4 }[v];
  return <V />;
}
