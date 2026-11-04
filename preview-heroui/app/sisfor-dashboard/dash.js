'use client';

import { Avatar, Badge, Button, Card, CardBody, Chip, CircularProgress, Divider, Input, Progress, ScrollShadow } from '@heroui/react';
import { CORSI, Ic, P, UTENTE } from '../sisfor/comune';

const X = {
  bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM10 20a2 2 0 0 0 4 0',
  folder: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 3a4 4 0 0 1 0 8M22 21a7 7 0 0 0-5-6.700',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  flame: 'M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-4 3 0-3-1-6-4-8 0 4-3 6-3 11 0 4 3 8 7 8Z',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
};
const G = 'border border-white/10 bg-content1/70';
const ORA = 'Buon pomeriggio';
const OPZ = [
  { k: 'corsi', t: 'I miei corsi', d: '4 corsi · 1 in corso', ic: P.book, c: 'primary' },
  { k: 'percorso', t: 'Il mio percorso', d: 'Tappe e abilitazioni', ic: P.route, c: 'secondary' },
  { k: 'abil', t: 'Abilitazioni', d: '1 ottenuta · 2 in arrivo', ic: P.award, c: 'success' },
  { k: 'pratiche', t: 'Gestione pratiche', d: '3 da lavorare', ic: X.folder, c: 'warning' },
  { k: 'istr', t: 'Area istruttori', d: '2 esami da correggere', ic: P.check, c: 'danger' },
  { k: 'admin', t: 'Amministrazione', d: 'Agenti, corsi, ruoli', ic: X.sliders, c: 'default' },
];
const COLORE = { primary: 'bg-primary/15 text-primary', secondary: 'bg-secondary/15 text-secondary', success: 'bg-success/15 text-success', warning: 'bg-warning/15 text-warning', danger: 'bg-danger/15 text-danger', default: 'bg-white/10 text-default-600' };
const Icona = ({ c, d, s = 22, box = 'h-11 w-11' }) => <span className={`flex ${box} flex-none items-center justify-center rounded-2xl ${COLORE[c]}`}><Ic d={d} s={s} /></span>;
const Foto = ({ s = 'md' }) => <Avatar src="/crest.png" size={s} isBordered color="primary" className="bg-black/40 p-1.5" />;
const IN_CORSO = CORSI[0];

/* barra superiore comune: logo, cerca, campanella, profilo, torna al sito */
const Testa = ({ cerca = true }) => (
  <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-background/95 px-6 py-3">
    <img src="/logo-iprp.png" alt="IPRP" className="h-9 w-auto" />
    <div className="leading-tight"><div className="text-sm font-extrabold tracking-wide">SISFOR<span className="text-primary">+</span></div><div className="text-[11px] text-default-500">Formazione Polizia di Stato</div></div>
    {cerca && <Input className="mx-auto hidden max-w-sm md:flex" size="sm" radius="full" variant="bordered" placeholder="Cerca corsi, moduli, pratiche…" startContent={<Ic d={X.search} s={16} />} />}
    <div className="ml-auto flex items-center gap-3">
      <Badge content="2" color="danger" size="sm"><Button isIconOnly variant="light" radius="full" aria-label="Notifiche"><Ic d={X.bell} /></Button></Badge>
      <Button as="a" href="#" size="sm" variant="flat" radius="full" className="hidden sm:flex">Torna al sito</Button>
      <Foto s="sm" />
    </div>
  </header>
);

/* J1 · Plancia: saluto, numeri, "continua da dove eri" e riquadri per tutte le opzioni */
function J1() {
  return (
    <div className="min-h-screen bg-background">
      <Testa />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-default-500">{ORA}</p><h1 className="text-4xl font-extrabold tracking-tight">{UTENTE.nome} {UTENTE.cognome}</h1><p className="mt-1 text-default-500">{UTENTE.qualifica} · {UTENTE.matricola}</p></div>
          <div className="flex gap-2"><Chip variant="flat" startContent={<Ic d={X.flame} s={14} />} color="warning">5 giorni di fila</Chip></div></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Corsi in corso', '1', P.book, 'primary'], ['Completati', '1 / 4', P.check, 'success'], ['Abilitazioni', '1', P.award, 'warning'], ['Media quiz', '84%', X.target, 'secondary']].map(([l, v, d, c]) => (
            <Card key={l} className={G} radius="lg"><CardBody className="flex-row items-center gap-4 p-5"><Icona c={c} d={d} /><div><div className="text-2xl font-extrabold leading-none">{v}</div><div className="mt-1 text-xs text-default-500">{l}</div></div></CardBody></Card>))}
        </div>
        <Card className={`${G} mt-6 overflow-hidden`} radius="lg"><div className="grid md:grid-cols-[1fr_auto]">
          <CardBody className="gap-3 p-8"><Chip size="sm" color="primary" variant="flat">Continua da dove eri rimasto</Chip><h2 className="text-2xl font-extrabold leading-tight">{IN_CORSO.titolo}</h2><p className="max-w-xl text-default-500">Modulo 2 · Fermare un veicolo e primo contatto</p><Progress aria-label="Avanzamento" value={IN_CORSO.pc} size="sm" className="mt-2 max-w-md" label="Avanzamento" showValueLabel /></CardBody>
          <div className="flex items-center p-8"><Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} s={18} />}>Riprendi</Button></div></div></Card>
        <h2 className="mb-4 mt-10 text-sm font-bold uppercase tracking-widest text-default-500">Cosa vuoi fare?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OPZ.map((o) => (<Card key={o.k} isPressable className={`${G} text-left transition-colors hover:border-white/25`} radius="lg"><CardBody className="flex-row items-center gap-4 p-5"><Icona c={o.c} d={o.ic} /><div className="flex-1"><div className="font-bold">{o.t}</div><div className="text-sm text-default-500">{o.d}</div></div><span className="text-default-500"><Ic d={P.arrow} s={18} /></span></CardBody></Card>))}
        </div>
      </main>
    </div>
  );
}

/* J2 · Barra laterale a icone + dashboard a widget (progresso, scadenze, attività, comunicazioni) */
function J2() {
  const lat = [[P.grid, 'Dashboard', true], [P.book, 'Corsi'], [P.route, 'Percorso'], [P.award, 'Abilitazioni'], [X.folder, 'Pratiche'], [P.check, 'Istruttori'], [X.sliders, 'Amministrazione']];
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-[84px] flex-none flex-col items-center gap-2 border-r border-white/10 py-5 sm:flex">
        <img src="/logo-iprp.png" alt="IPRP" className="mb-4 h-10 w-auto" />
        {lat.map(([d, t, on]) => (<button key={t} type="button" title={t} className={`group flex w-16 flex-col items-center gap-1 rounded-2xl py-3 text-[10px] transition-colors ${on ? 'bg-primary/15 text-primary' : 'text-default-500 hover:bg-white/5 hover:text-white'}`}><Ic d={d} s={21} />{t.slice(0, 9)}</button>))}
        <div className="mt-auto flex flex-col items-center gap-3"><Button isIconOnly variant="light" radius="full" aria-label="Esci"><Ic d={P.out} /></Button><Foto s="sm" /></div>
      </aside>
      <main className="flex-1 px-6 py-8 lg:px-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-extrabold tracking-tight">Ciao, {UTENTE.nome}</h1><p className="text-default-500">Ecco a che punto sei con la formazione.</p></div><Badge content="2" color="danger" size="sm"><Button isIconOnly variant="flat" radius="full"><Ic d={X.bell} /></Button></Badge></div>
        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5">
            <Card className={G} radius="lg"><CardBody className="flex-row items-center gap-8 p-7">
              <CircularProgress aria-label="Completamento" value={42} size="lg" color="primary" showValueLabel classNames={{ svg: 'h-32 w-32', value: 'text-2xl font-extrabold' }} />
              <div className="flex-1"><div className="text-sm text-default-500">Il tuo percorso</div><div className="text-xl font-extrabold">Agente Scelto · Livello 2</div><p className="mt-1 text-sm text-default-500">Ti mancano 2 corsi e 1 esame per la prossima abilitazione.</p><div className="mt-3 flex gap-2"><Chip size="sm" variant="flat" color="success">1 completato</Chip><Chip size="sm" variant="flat" color="primary">1 in corso</Chip><Chip size="sm" variant="flat">2 da iniziare</Chip></div></div>
            </CardBody></Card>
            <div className="grid gap-5 sm:grid-cols-2">
              {CORSI.slice(0, 2).map((c) => (<Card key={c.id} className={G} radius="lg"><CardBody className="gap-3 p-5"><div className={`h-20 rounded-2xl bg-gradient-to-br ${c.grad}`} /><div className="font-bold leading-snug">{c.titolo}</div><Progress aria-label="pc" value={c.pc} size="sm" /><div className="flex items-center justify-between text-xs text-default-500"><span>{c.moduli} moduli · {c.durata}</span><Button size="sm" radius="full" color="primary" variant="flat">{c.pc ? 'Riprendi' : 'Inizia'}</Button></div></CardBody></Card>))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <Card className={G} radius="lg"><CardBody className="gap-4 p-6"><div className="font-bold">Prossimi passi</div>
              {[['Quiz modulo 2', 'Entro oggi', 'danger'], ['Esame finale · Posto di blocco', 'Da sbloccare', 'default'], ['Radio e codici', 'Nuovo corso', 'primary']].map(([t, s, c]) => (<div key={t} className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${c === 'danger' ? 'bg-danger' : c === 'primary' ? 'bg-primary' : 'bg-white/25'}`} /><span className="flex-1 text-sm font-semibold">{t}</span><span className="text-xs text-default-500">{s}</span></div>))}</CardBody></Card>
            <Card className="border border-warning/30 bg-warning/5" radius="lg"><CardBody className="gap-3 p-6"><div className="flex items-center gap-2 font-bold text-warning"><Ic d={P.shield} s={17} /> Dalla Questura</div><p className="text-sm font-semibold">Richiesta Feste</p><p className="text-sm text-default-500">Si ricorda l’obbligo di avvisare il Questore con almeno 3 giorni di preavviso.</p></CardBody></Card>
            <Card className={G} radius="lg"><CardBody className="gap-3 p-6"><div className="font-bold">Attività recente</div>{['Hai superato il quiz del modulo 1 (80%)', 'Hai iniziato “Posto di blocco”', 'Hai completato “Primo soccorso”'].map((t, k) => (<div key={t} className="flex gap-3 text-sm"><span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-primary/60" /><span className="flex-1 text-default-400">{t}</span><span className="text-xs text-default-600">{['ora', '2 g', '1 sett'][k]}</span></div>))}</CardBody></Card>
          </div>
        </div>
      </main>
    </div>
  );
}

/* J3 · Hub a grandi riquadri (lanciatore): ogni opzione mostra già un dato vivo */
function J3() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_50%_-20%,rgba(37,99,235,0.28),transparent_60%)]" />
      <Testa cerca={false} />
      <main className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 text-center">
        <div className="flex justify-center"><Foto s="lg" /></div><h1 className="mt-5 text-5xl font-extrabold tracking-tight">Benvenuto, {UTENTE.nome}</h1><p className="mt-2 text-default-500">{UTENTE.qualifica} · {UTENTE.matricola}</p>
        <div className="mx-auto mt-6 flex max-w-xl items-center gap-4 rounded-full border border-white/10 bg-content1/60 p-2 pl-5"><span className="text-sm text-default-400">In corso: <b className="text-foreground">{IN_CORSO.titolo}</b></span><Button color="primary" radius="full" size="sm" className="ml-auto font-semibold">Riprendi</Button></div>
        <div className="mt-12 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {OPZ.map((o, k) => (
            <Card key={o.k} isPressable className={`${G} group relative overflow-hidden ${k === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`} radius="lg"><CardBody className="min-h-[190px] justify-between gap-6 p-6">
              <div className="flex items-start justify-between"><Icona c={o.c} d={o.ic} box="h-14 w-14" s={26} /><span className="text-default-600 transition group-hover:translate-x-1 group-hover:text-white"><Ic d={P.arrow} s={22} /></span></div>
              <div><div className="text-xl font-extrabold">{o.t}</div><div className="mt-1 text-sm text-default-500">{o.d}</div>{k < 3 && <Progress aria-label="p" value={[30, 55, 33][k]} size="sm" className="mt-4" />}</div>
            </CardBody></Card>))}
        </div>
      </main>
    </div>
  );
}

/* J4 · Centro operativo: profilo e abilitazioni a sinistra, lavoro al centro, avvisi a destra */
function J4() {
  return (
    <div className="min-h-screen bg-background">
      <Testa />
      <main className="mx-auto grid max-w-[1400px] gap-5 px-6 py-8 lg:grid-cols-[300px_1fr_320px]">
        <aside className="flex flex-col gap-5">
          <Card className={G} radius="lg"><CardBody className="items-center gap-3 p-7 text-center"><Foto s="lg" /><div><div className="text-xl font-extrabold">{UTENTE.nome} {UTENTE.cognome}</div><div className="text-sm text-default-500">{UTENTE.qualifica}</div><div className="mt-1 font-mono text-xs text-default-500">{UTENTE.matricola}</div></div><Divider /><div className="grid w-full grid-cols-3 gap-2 text-center">{[['1', 'Corsi'], ['84%', 'Quiz'], ['1', 'Abilit.']].map(([v, l]) => (<div key={l}><div className="text-lg font-extrabold">{v}</div><div className="text-[10px] uppercase tracking-wider text-default-500">{l}</div></div>))}</div></CardBody></Card>
          <Card className={G} radius="lg"><CardBody className="gap-1 p-3">{OPZ.map((o, k) => (<button key={o.k} type="button" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${k === 0 ? 'bg-primary/15 text-primary' : 'text-default-400 hover:bg-white/5 hover:text-white'}`}><Ic d={o.ic} s={18} />{o.t}</button>))}</CardBody></Card>
        </aside>
        <section className="flex flex-col gap-5">
          <Card className="relative overflow-hidden border border-white/10" radius="lg"><div className={`absolute inset-0 bg-gradient-to-br ${IN_CORSO.grad} opacity-60`} /><div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" /><CardBody className="relative gap-3 p-8"><Chip size="sm" color="primary">In corso</Chip><h2 className="max-w-lg text-3xl font-extrabold leading-tight">{IN_CORSO.titolo}</h2><p className="max-w-md text-default-400">Prossimo: modulo 2 · Fermare un veicolo e primo contatto</p><Progress aria-label="pc" value={IN_CORSO.pc} size="sm" className="max-w-sm" /><div><Button color="primary" radius="full" className="font-semibold" endContent={<Ic d={P.arrow} s={16} />}>Riprendi il corso</Button></div></CardBody></Card>
          <div className="grid gap-5 sm:grid-cols-3">{CORSI.slice(1).map((c) => (<Card key={c.id} className={G} radius="lg"><CardBody className="gap-3 p-5"><div className={`h-16 rounded-xl bg-gradient-to-br ${c.grad}`} /><div className="font-bold leading-snug">{c.titolo}</div><div className="text-xs text-default-500">{c.moduli} moduli · {c.durata}</div>{c.stato === 'completato' ? <Chip size="sm" color="success" variant="flat">Completato</Chip> : <Button size="sm" radius="full" variant="flat" color="primary">Inizia</Button>}</CardBody></Card>))}</div>
          <Card className={G} radius="lg"><CardBody className="gap-4 p-6"><div className="flex items-center justify-between"><div className="font-bold">Il mio percorso</div><span className="text-xs text-default-500">3 di 6 tappe</span></div><div className="flex items-center">{['Recluta', 'Agente', 'Agente Scelto', 'Assistente', 'Sovrintendente', 'Ispettore'].map((t, k) => (<div key={t} className="flex flex-1 items-center"><div className="flex flex-col items-center gap-1.5"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${k < 3 ? 'bg-primary text-white' : 'border border-white/20 text-default-500'}`}>{k < 3 ? '✓' : k + 1}</span><span className="hidden text-[10px] text-default-500 md:block">{t}</span></div>{k < 5 && <span className={`mx-1 h-px flex-1 ${k < 2 ? 'bg-primary' : 'bg-white/15'}`} />}</div>))}</div></CardBody></Card>
        </section>
        <aside className="flex flex-col gap-5">
          <Card className="border border-warning/30 bg-warning/5" radius="lg"><CardBody className="gap-3 p-6"><div className="flex items-center gap-2 font-bold text-warning"><Ic d={P.shield} s={17} /> Dalla Questura</div><p className="font-semibold">Richiesta Feste</p><p className="text-sm text-default-500">Si ricorda l’obbligo di avvisare il Questore con almeno 3 giorni di preavviso.</p></CardBody></Card>
          <Card className={G} radius="lg"><CardBody className="gap-3 p-6"><div className="font-bold">Da fare</div>{[['Quiz modulo 2', 'oggi'], ['Esame posto di blocco', 'bloccato'], ['Pratica n. 31', 'in attesa']].map(([t, s]) => (<div key={t} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm"><span className="font-semibold">{t}</span><Chip size="sm" variant="flat">{s}</Chip></div>))}</CardBody></Card>
          <Card className={G} radius="lg"><CardBody className="gap-3 p-6"><div className="font-bold">Attività</div>{['Quiz modulo 1: 80%', 'Corso iniziato', 'Primo soccorso completato'].map((t) => (<div key={t} className="flex gap-3 text-sm text-default-400"><span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-primary/60" />{t}</div>))}</CardBody></Card>
        </aside>
      </main>
    </div>
  );
}

export function Dash({ v }) {
  const V = { j1: J1, j2: J2, j3: J3, j4: J4 }[v];
  return <V />;
}
