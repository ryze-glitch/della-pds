'use client';

import { Alert, Avatar, AvatarGroup, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Chip, Divider, Input, Tab, Tabs } from '@heroui/react';

export const Ic = ({ d, s = 16 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const P = {
  mega: 'M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1ZM17 8a5 5 0 0 1 0 8',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  alert: 'M12 3 2 20h20zM12 10v4M12 17v.5',
  bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM10 20a2 2 0 0 0 4 0',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  rss: 'M5 19a1 1 0 1 0 0 .01M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16',
};

/* barra finta, solo per dare il contesto della pagina */
export const Barra = () => (
  <div className="relative z-10 flex justify-center gap-3 px-6 pt-5 text-sm">
    <div className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-content1/90 px-5 font-extrabold uppercase tracking-wide"><img src="/crest.png" alt="" className="h-8" />Polizia di Stato</div>
    <div className="hidden h-12 items-center gap-6 rounded-full border border-white/10 bg-content1/90 px-6 text-default-500 md:flex"><span>Home</span><span className="rounded-full bg-primary/20 px-3 py-1 text-primary">Notizie</span><span>Chi Siamo</span><span>Qualifiche</span><span>Prenota</span><span>Concorso</span></div>
    <div className="hidden h-12 items-center rounded-full border border-white/10 bg-content1/90 px-5 font-semibold md:flex">Area Personale</div>
  </div>
);
const Sfondo = ({ foto }) => (
  <>
    {foto && <img src={foto} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.30),transparent_60%)]" />
    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
  </>
);
const Wrap = ({ foto, children }) => (
  <div className="relative min-h-[560px] overflow-hidden bg-background"><Sfondo foto={foto} /><Barra /><div className="relative">{children}</div></div>
);

/* H1 · Centrata con briciole di pane, etichetta e filtri a pillola */
function H1() {
  return (
    <section className="flex flex-col items-center gap-5 px-6 pb-16 pt-16 text-center">
      <Breadcrumbs size="sm" variant="light" itemClasses={{ item: 'text-default-500' }}><BreadcrumbItem>Home</BreadcrumbItem><BreadcrumbItem isCurrent>Notizie</BreadcrumbItem></Breadcrumbs>
      <Chip color="primary" variant="flat" startContent={<Ic d={P.mega} s={14} />} classNames={{ content: 'font-semibold' }}>Sala stampa</Chip>
      <h1 className="text-5xl font-extrabold uppercase tracking-wide md:text-6xl">Notizie e <span className="text-primary">Comunicati</span></h1>
      <p className="max-w-xl text-default-500">Comunicazioni ufficiali, nomine, cerimonie e avvisi alla cittadinanza della Questura di Roma.</p>
      <Tabs radius="full" color="primary" aria-label="Filtro" className="mt-2"><Tab key="t" title="Tutte" /><Tab key="n" title="Notizie" /><Tab key="c" title="Comunicati" /><Tab key="a" title="Avvisi" /></Tabs>
    </section>
  );
}

/* H2 · A due colonne: titolo a sinistra, scheda di riepilogo e ricerca a destra */
function H2() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-20 md:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-4">
        <Chip color="primary" variant="dot" classNames={{ content: 'font-semibold' }}>Questura di Roma</Chip>
        <h1 className="text-5xl font-extrabold uppercase leading-[1.05] tracking-wide md:text-6xl">Notizie<br /><span className="text-primary">e Comunicati</span></h1>
        <p className="max-w-md text-default-500">Tutte le comunicazioni ufficiali e gli aggiornamenti del Corpo, in un unico posto.</p>
      </div>
      <Card className="border border-white/10 bg-content1/70 backdrop-blur-xl" radius="lg"><CardBody className="gap-5 p-6">
        <Input placeholder="Cerca una notizia o un comunicato…" radius="lg" variant="bordered" size="lg" startContent={<Ic d={P.search} />} />
        <div className="grid grid-cols-3 gap-3 text-center">
          {[['5', 'Notizie'], ['3', 'Comunicati'], ['2 Giu', 'Ultimo agg.']].map(([n, l]) => (<div key={l} className="rounded-xl bg-white/5 p-3"><div className="text-xl font-extrabold">{n}</div><div className="text-[11px] uppercase tracking-wider text-default-500">{l}</div></div>))}
        </div>
      </CardBody></Card>
    </section>
  );
}

/* H3 · Banner con foto sullo sfondo e barra di ricerca grande */
function H3() {
  return (
    <section className="flex flex-col items-center gap-5 px-6 pb-20 pt-20 text-center">
      <h1 className="text-5xl font-extrabold uppercase tracking-wide drop-shadow-[0_6px_24px_rgba(0,0,0,0.7)] md:text-7xl">Notizie</h1>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Comunicazioni ufficiali e aggiornamenti</p>
      <Input className="mt-3 max-w-2xl" classNames={{ inputWrapper: 'h-16 bg-content1/80 border border-white/10 backdrop-blur-xl' }} radius="full" size="lg" placeholder="Cerca tra notizie e comunicati…" startContent={<Ic d={P.search} s={20} />} endContent={<Button color="primary" radius="full" size="sm">Cerca</Button>} />
      <div className="flex flex-wrap justify-center gap-2">{['Tutte', 'Nomine', 'Cerimonie', 'Avvisi', 'Lutto'].map((c, i) => (<Chip key={c} variant={i ? 'bordered' : 'solid'} color={i ? 'default' : 'primary'}>{c}</Chip>))}</div>
    </section>
  );
}

/* H4 · Con avviso urgente in primo piano sotto il titolo */
function H4() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 pb-16 pt-16 text-center">
      <h1 className="text-5xl font-extrabold uppercase tracking-wide md:text-6xl">Notizie</h1>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Comunicazioni ufficiali e aggiornamenti</p>
      <Alert className="mt-3 text-left" color="danger" variant="faded" title="Avviso · Richiesta feste" description="Ai promotori di riunioni in luogo pubblico è obbligatorio avvisare il Questore con almeno 3 giorni di preavviso (art. 18 TULPS)." endContent={<Button size="sm" color="danger" variant="flat" radius="full">Leggi</Button>} />
      <div className="flex items-center gap-3 text-xs text-default-500"><Ic d={P.rss} s={14} /> Aggiornato il 2 Giugno 2025</div>
    </section>
  );
}

/* H5 · Scheda di vetro con icona, titolo e tre riquadri di riepilogo */
function H5() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-16">
      <Card className="border border-white/10 bg-content1/60 backdrop-blur-xl" radius="lg"><CardBody className="gap-8 p-8 md:p-10">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
          <div className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-primary/15 text-primary"><Ic d={P.mega} s={36} /></div>
          <div><h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Notizie</h1><p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-primary">Comunicazioni ufficiali e aggiornamenti</p></div>
          <div className="md:ml-auto"><Button color="primary" radius="full" size="lg" startContent={<Ic d={P.bell} />}>Ricevi gli avvisi</Button></div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[[P.doc, '5', 'Notizie'], [P.mega, '3', 'Comunicati'], [P.alert, '1', 'Avviso attivo'], [P.cal, '2 Giu 2025', 'Ultimo aggiornamento']].map(([d, n, l]) => (<div key={l} className="flex items-center gap-3"><span className="text-primary"><Ic d={d} s={22} /></span><div><div className="font-extrabold">{n}</div><div className="text-[11px] uppercase tracking-wider text-default-500">{l}</div></div></div>))}
        </div>
      </CardBody></Card>
    </section>
  );
}

/* H6 · Editoriale: titolo enorme a sinistra con scheda sotto la linea */
function H6() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-10 pt-16">
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary"><span className="h-px w-10 bg-primary" />Sala stampa · Questura di Roma</div>
      <h1 className="mt-4 text-[5.5rem] font-extrabold uppercase leading-none tracking-tight md:text-[8rem]"><span className="bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent">Notizie</span></h1>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
        <p className="max-w-md text-default-500">Comunicazioni ufficiali e aggiornamenti dalla Polizia di Stato.</p>
        <div className="flex items-center gap-4"><AvatarGroup size="sm" isBordered max={3}><Avatar src="/crest.png" /><Avatar name="UC" /><Avatar name="QR" /></AvatarGroup><Tabs variant="underlined" color="primary" aria-label="Filtro"><Tab key="t" title="Tutte" /><Tab key="n" title="Notizie" /><Tab key="c" title="Comunicati" /></Tabs></div>
      </div>
    </section>
  );
}

export function Header({ v }) {
  const V = { h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6 }[v];
  return <Wrap foto={v === 'h3' ? '/foto/ufficidesk.jpg' : null}><V /></Wrap>;
}
