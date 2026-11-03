'use client';

import { useMemo, useState } from 'react';
import {
  Avatar, Badge, Button, Card, CardBody, CardHeader, Chip, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
  Input, Listbox, ListboxItem, Pagination, Progress, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tab, Tabs, Textarea, Tooltip, User, useDisclosure,
} from '@heroui/react';

const Ic = ({ d, s = 18 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const P = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  file: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 3.2a4 4 0 0 1 0 7.6M22 21a7 7 0 0 0-5-6.7',
  mega: 'M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1ZM15 9a4 4 0 0 1 0 6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  org: 'M12 4v4M5 14v-2h14v2M12 8v4M5 14v4M19 14v4M9 4h6v4H9zM2 18h6v3H2zM16 18h6v3h-6z',
  home: 'M4 21V9l8-5 8 5v12M9 21v-6h6v6',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4',
  dots: 'M12 6h.01M12 12h.01M12 18h.01',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  check: 'm5 12 5 5 9-10',
};

export const STATI = [
  { k: 'ricevuta', t: 'Ricevuta', c: 'primary' },
  { k: 'lavorazione', t: 'In lavorazione', c: 'warning' },
  { k: 'documenti', t: 'In attesa di documenti', c: 'secondary' },
  { k: 'conclusa', t: 'Conclusa', c: 'success' },
  { k: 'respinta', t: 'Respinta', c: 'danger' },
];
const stato = (k) => STATI.find((s) => s.k === k);
const PRATICHE = [
  { id: 'POL-2026-UMFY29', tipo: 'Colloquio', stato: 'ricevuta', data: '01/11/26, 20:16', ferma: 0, ass: null },
  { id: 'POL-2026-X2HY4D', tipo: 'Colloquio', stato: 'ricevuta', data: '01/11/26, 13:43', ferma: 0, ass: null },
  { id: 'POL-2026-3U68RH', tipo: 'Colloquio', stato: 'lavorazione', data: '01/11/26, 13:31', ferma: 0, ass: 'Marco Ferrari' },
  { id: 'POL-2026-UDZJYA', tipo: 'Colloquio', stato: 'ricevuta', data: '31/10/26, 20:57', ferma: 2, ass: null },
  { id: 'POL-2026-DCWYNV', tipo: 'Denuncia', stato: 'documenti', data: '31/10/26, 19:08', ferma: 2, ass: 'Luca Bianchi' },
  { id: 'POL-2026-7JCHNG', tipo: "Porto d'armi", stato: 'lavorazione', data: '30/10/26, 21:30', ferma: 3, ass: 'Marco Ferrari' },
  { id: 'POL-2026-K7M2QX', tipo: 'Denuncia', stato: 'conclusa', data: '28/10/26, 17:02', ferma: 0, ass: 'Luca Bianchi' },
  { id: 'POL-2026-QW81LP', tipo: "Porto d'armi", stato: 'respinta', data: '27/10/26, 11:15', ferma: 0, ass: 'Marco Ferrari' },
];

const NAV = [
  ['Panoramica', P.grid], ['Pratiche', P.file, true], ['Candidature', P.users], ['Comunicati', P.mega], ['Impostazioni', P.shield], ['Organigramma', P.org], ['Torna al sito', P.home],
];
const StatoChip = ({ k, size = 'sm' }) => <Chip size={size} variant="flat" color={stato(k).c}>{stato(k).t}</Chip>;

// ---- struttura comune: barra laterale + intestazione
function Guscio({ v, children, sidebar = true, titolo = 'Gestione pratiche', sotto = 'Aggiorna lo stato delle pratiche dello Sportello.' }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {sidebar ? (
        <aside className="hidden w-64 flex-none flex-col border-r border-white/10 bg-content1/50 p-4 lg:flex">
          <a href="#" className="flex items-center gap-3 px-2 py-3"><img src="/crest.png" alt="" className="h-10 w-auto" /><div className="leading-tight"><p className="text-sm font-extrabold uppercase tracking-[0.14em]">Questura</p><p className="text-[10px] uppercase tracking-[0.2em] text-default-500">Gestione</p></div></a>
          <User name="Gabriel Martinelli" description="Vice Questore Aggiunto" avatarProps={{ name: 'GM', color: 'primary', size: 'sm' }} className="my-3 justify-start px-2" />
          <Divider className="mb-3" />
          <Listbox aria-label="Menu" itemClasses={{ base: 'h-11 gap-3 rounded-xl data-[hover=true]:bg-white/10', title: 'text-sm' }}>
            {NAV.map(([t, d, on]) => <ListboxItem key={t} startContent={<Ic d={d} />} className={on ? 'bg-primary/15 text-primary' : ''}>{t}</ListboxItem>)}
          </Listbox>
          <Button variant="bordered" radius="full" className="mt-auto border-white/20">Esci</Button>
        </aside>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 flex-none items-center gap-4 border-b border-white/10 px-6">
          <p className="font-semibold">{sidebar ? 'Gestione' : 'Questura IPRP · Gestione'}</p>
          <div className="flex-1" />
          <Badge content="3" color="danger" size="sm" shape="circle"><Button isIconOnly variant="light" radius="full" aria-label="Notifiche"><Ic d={P.bell} /></Button></Badge>
          <Avatar name="GM" color="primary" size="sm" isBordered />
        </header>
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-[1200px]">
            {titolo ? <div className="mb-6"><h1 className="text-3xl font-bold">{titolo}</h1><p className="mt-1 text-default-500">{sotto}</p></div> : null}
            {children}
          </div>
        </main>
      </div>
      <p className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-background/90 px-4 py-1.5 text-[11px] uppercase tracking-widest text-default-500">{v}</p>
    </div>
  );
}

// ---- G1: tabella (barra laterale + filtri a schede + tabella con azioni)
function G1() {
  const [tab, setTab] = useState('tutte');
  const righe = PRATICHE.filter((p) => tab === 'tutte' || p.stato === tab);
  const cont = (k) => PRATICHE.filter((p) => p.stato === k).length;
  return (
    <Guscio v="G1 · Tabella">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input aria-label="Cerca" placeholder="Cerca per codice (es. K7M2QX)" startContent={<Ic d={P.search} s={16} />} className="max-w-sm" radius="full" variant="bordered" />
        <Select aria-label="Tipo" defaultSelectedKeys={['tutti']} className="max-w-[180px]" radius="full" variant="bordered">
          {['tutti', 'Colloquio', 'Denuncia', "Porto d'armi"].map((t) => <SelectItem key={t}>{t === 'tutti' ? 'Tutti i tipi' : t}</SelectItem>)}
        </Select>
      </div>
      <Tabs aria-label="Stato" selectedKey={tab} onSelectionChange={setTab} variant="underlined" classNames={{ tabList: 'gap-6 border-b border-white/10 w-full', cursor: 'bg-primary' }}>
        <Tab key="tutte" title={<div className="flex items-center gap-2">Tutte <Chip size="sm" variant="flat">{PRATICHE.length}</Chip></div>} />
        {STATI.map((s) => <Tab key={s.k} title={<div className="flex items-center gap-2">{s.t} <Chip size="sm" variant="flat" color={s.c}>{cont(s.k)}</Chip></div>} />)}
      </Tabs>
      <Table aria-label="Pratiche" removeWrapper className="mt-4 rounded-2xl border border-white/10 bg-content1/40 p-2" bottomContent={<div className="flex justify-center py-2"><Pagination total={3} initialPage={1} size="sm" radius="full" /></div>}>
        <TableHeader><TableColumn>CODICE</TableColumn><TableColumn>TIPO</TableColumn><TableColumn>STATO</TableColumn><TableColumn>ASSEGNATA A</TableColumn><TableColumn>RICEVUTA</TableColumn><TableColumn align="end">AZIONI</TableColumn></TableHeader>
        <TableBody emptyContent="Nessuna pratica">
          {righe.map((p) => (
            <TableRow key={p.id}>
              <TableCell><span className="font-mono text-sm text-primary">#{p.id}</span></TableCell>
              <TableCell>{p.tipo}</TableCell>
              <TableCell><div className="flex items-center gap-2"><StatoChip k={p.stato} />{p.ferma ? <Chip size="sm" variant="dot" color="warning">Ferma da {p.ferma} gg</Chip> : null}</div></TableCell>
              <TableCell>{p.ass ? <User name={p.ass} avatarProps={{ name: p.ass.split(' ').map((x) => x[0]).join(''), size: 'sm' }} classNames={{ name: 'text-sm' }} /> : <span className="text-default-400">—</span>}</TableCell>
              <TableCell className="text-sm text-default-500">{p.data}</TableCell>
              <TableCell><div className="flex justify-end gap-2">{!p.ass ? <Button size="sm" color="primary" variant="flat" radius="full">Prendi in carico</Button> : null}
                <Dropdown><DropdownTrigger><Button isIconOnly size="sm" variant="light" radius="full" aria-label="Azioni"><Ic d={P.dots} /></Button></DropdownTrigger>
                  <DropdownMenu aria-label="Azioni">{[...STATI.map((s) => <DropdownItem key={s.k}>Segna come «{s.t}»</DropdownItem>), <DropdownItem key="n" showDivider>Aggiungi nota</DropdownItem>]}</DropdownMenu></Dropdown></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Guscio>
  );
}

// ---- G2: bacheca a colonne per stato
function G2() {
  return (
    <Guscio v="G2 · Bacheca a colonne" sidebar={false} titolo="Pratiche dello Sportello" sotto="Trascina o cambia stato con il menu di ogni scheda.">
      <div className="mb-5 flex flex-wrap gap-3"><Input aria-label="Cerca" placeholder="Cerca per codice" startContent={<Ic d={P.search} s={16} />} className="max-w-xs" radius="full" variant="bordered" /><Tabs aria-label="Vista" radius="full" size="sm"><Tab key="b" title="Bacheca" /><Tab key="t" title="Tabella" /><Tab key="m" title="Mie pratiche" /></Tabs></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATI.slice(0, 4).map((s) => {
          const lista = PRATICHE.filter((p) => p.stato === s.k);
          return (
            <div key={s.k} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-content1/40 p-3">
              <div className="flex items-center justify-between px-2 pt-1"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full bg-${s.c}`} /><p className="font-semibold">{s.t}</p></div><Chip size="sm" variant="flat">{lista.length}</Chip></div>
              {lista.map((p) => (
                <Card key={p.id} isPressable shadow="none" className="border border-white/10 bg-content2/60">
                  <CardBody className="gap-2 p-4 text-left">
                    <div className="flex items-center justify-between"><span className="font-mono text-xs text-primary">#{p.id}</span>{p.ferma ? <Tooltip content={`Ferma da ${p.ferma} giorni`}><span className="text-warning"><Ic d={P.clock} s={15} /></span></Tooltip> : null}</div>
                    <p className="font-semibold">{p.tipo}</p><p className="text-xs text-default-500">{p.data}</p>
                    <div className="mt-1 flex items-center justify-between">{p.ass ? <Avatar name={p.ass.split(' ').map((x) => x[0]).join('')} size="sm" /> : <Chip size="sm" variant="flat" color="warning">Da assegnare</Chip>}<Button size="sm" variant="light" radius="full">Apri</Button></div>
                  </CardBody>
                </Card>
              ))}
              {!lista.length ? <p className="py-6 text-center text-sm text-default-400">Nessuna pratica</p> : null}
            </div>
          );
        })}
      </div>
    </Guscio>
  );
}

// ---- G3: elenco a sinistra e dettaglio a destra
function G3() {
  const [sel, setSel] = useState('POL-2026-3U68RH');
  const p = PRATICHE.find((x) => x.id === sel) || PRATICHE[0];
  const passi = ['ricevuta', 'lavorazione', 'documenti', 'conclusa'];
  const idx = Math.max(0, passi.indexOf(p.stato));
  return (
    <Guscio v="G3 · Elenco + dettaglio" titolo="Gestione pratiche" sotto="Seleziona una pratica per vederne il dettaglio e aggiornarla.">
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card className="border border-white/10 bg-content1/40" shadow="none"><CardBody className="gap-3 p-3">
          <Input aria-label="Cerca" placeholder="Cerca per codice" startContent={<Ic d={P.search} s={16} />} radius="full" variant="bordered" size="sm" />
          <Listbox aria-label="Pratiche" selectionMode="single" selectedKeys={new Set([sel])} onSelectionChange={(k) => { const v = [...k][0]; if (v) setSel(v); }} itemClasses={{ base: 'rounded-2xl p-3 data-[selected=true]:bg-primary/15' }}>
            {PRATICHE.map((x) => (
              <ListboxItem key={x.id} textValue={x.id} description={`${x.tipo} · ${x.data}`} endContent={<StatoChip k={x.stato} />}>
                <span className="font-mono text-sm">#{x.id}</span>
              </ListboxItem>
            ))}
          </Listbox>
        </CardBody></Card>
        <Card className="border border-white/10 bg-content1/40" shadow="none">
          <CardHeader className="flex-col items-start gap-1 p-6 pb-2"><div className="flex w-full items-center justify-between"><p className="font-mono text-lg text-primary">#{p.id}</p><StatoChip k={p.stato} size="md" /></div><p className="text-default-500">{p.tipo} · ricevuta il {p.data}</p></CardHeader>
          <CardBody className="gap-6 p-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-default-500">Avanzamento</p>
              <div className="grid grid-cols-4 gap-2">{passi.map((k, i) => (<div key={k} className="flex flex-col gap-2"><Progress aria-label={k} size="sm" value={i <= idx ? 100 : 0} color={i <= idx ? 'primary' : 'default'} /><p className={`text-xs ${i <= idx ? 'text-foreground' : 'text-default-400'}`}>{stato(k).t}</p></div>))}</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Stato" defaultSelectedKeys={[p.stato]} variant="bordered" radius="lg">{STATI.map((s) => <SelectItem key={s.k}>{s.t}</SelectItem>)}</Select>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 p-3"><Avatar name={(p.ass || 'NA').split(' ').map((x) => x[0]).join('')} size="sm" /><div className="flex-1"><p className="text-xs text-default-500">Assegnata a</p><p className="text-sm font-semibold">{p.ass || 'Nessuno'}</p></div>{!p.ass ? <Button size="sm" color="primary" radius="full">Prendi in carico</Button> : null}</div>
            </div>
            <Textarea label="Nota visibile al cittadino" placeholder="Scrivi un aggiornamento (facoltativo)" variant="bordered" radius="lg" minRows={3} />
            <div className="flex justify-end gap-3"><Button variant="light" radius="full">Annulla</Button><Button color="primary" radius="full" className="font-semibold">Aggiorna pratica</Button></div>
          </CardBody>
        </Card>
      </div>
    </Guscio>
  );
}

// ---- G4: panoramica con numeri + elenco e cassetto laterale
function G4() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [p, setP] = useState(PRATICHE[0]);
  const tot = PRATICHE.length;
  return (
    <Guscio v="G4 · Panoramica + cassetto" titolo="Buongiorno, Gabriel" sotto="Ecco cosa c'è da fare oggi allo Sportello.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Da prendere in carico', PRATICHE.filter((x) => !x.ass).length, 'primary'], ['In lavorazione', PRATICHE.filter((x) => x.stato === 'lavorazione').length, 'warning'], ['Ferme da giorni', PRATICHE.filter((x) => x.ferma).length, 'danger'], ['Concluse', PRATICHE.filter((x) => x.stato === 'conclusa').length, 'success']].map(([t, n, c]) => (
          <Card key={t} shadow="none" className="border border-white/10 bg-content1/40"><CardBody className="gap-3 p-5"><p className="text-sm text-default-500">{t}</p><p className="text-4xl font-bold">{n}</p><Progress aria-label={t} size="sm" color={c} value={(n / tot) * 100} /></CardBody></Card>
        ))}
      </div>
      <Card shadow="none" className="mt-6 border border-white/10 bg-content1/40"><CardHeader className="justify-between px-6 pt-5"><p className="text-lg font-semibold">Pratiche recenti</p><Button size="sm" variant="flat" radius="full">Vedi tutte</Button></CardHeader>
        <CardBody className="p-2">
          <Listbox aria-label="Recenti" onAction={(k) => { setP(PRATICHE.find((x) => x.id === k)); onOpen(); }} itemClasses={{ base: 'rounded-2xl p-3' }}>
            {PRATICHE.slice(0, 6).map((x) => (
              <ListboxItem key={x.id} textValue={x.id} description={`${x.tipo} · ${x.data}`} startContent={<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><Ic d={P.file} /></span>} endContent={<div className="flex items-center gap-2">{x.ferma ? <Chip size="sm" variant="dot" color="warning">{x.ferma} gg</Chip> : null}<StatoChip k={x.stato} /></div>}><span className="font-mono text-sm">#{x.id}</span></ListboxItem>
            ))}
          </Listbox>
        </CardBody></Card>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="right" size="md" backdrop="blur" classNames={{ base: 'border-l border-white/10 bg-content1' }}>
        <DrawerContent>{(close) => (<>
          <DrawerHeader className="flex-col gap-1"><span className="font-mono text-primary">#{p.id}</span><span className="text-sm font-normal text-default-500">{p.tipo} · {p.data}</span></DrawerHeader>
          <DrawerBody className="gap-4"><StatoChip k={p.stato} size="md" />
            <Select label="Cambia stato" defaultSelectedKeys={[p.stato]} variant="bordered">{STATI.map((s) => <SelectItem key={s.k}>{s.t}</SelectItem>)}</Select>
            <Textarea label="Nota visibile al cittadino" variant="bordered" minRows={4} />
          </DrawerBody>
          <DrawerFooter><Button variant="light" onPress={close}>Chiudi</Button><Button color="primary" onPress={close} className="font-semibold">Aggiorna</Button></DrawerFooter></>)}</DrawerContent>
      </Drawer>
    </Guscio>
  );
}

export const GESTIONI = { g1: G1, g2: G2, g3: G3, g4: G4 };
