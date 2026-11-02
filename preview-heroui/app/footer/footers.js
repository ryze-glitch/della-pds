'use client';

import { useState } from 'react';
import { Accordion, AccordionItem, Button, Card, CardBody, Chip, Divider, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';

const Ic = ({ d, s = 18 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const P = {
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 11v6M12 7.5v.5',
  pin: 'M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12ZM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  alert: 'M12 3 2 20h20zM12 10v4M12 17v.5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  up: 'M12 19V5M6 11l6-6 6 6',
};

const NAV = [['Home', 'Home.html'], ['Notizie', 'notizie.html'], ['Chi siamo', 'chi-siamo.html'], ['Qualifiche', 'qualifiche.html'], ['Prenota', 'prenotazioni.html'], ['Concorso', 'concorso.html']];
const SERV = [['Denuncia, querela, esposto', 'denuncia.html'], ["Porto d'armi", 'porto-armi.html'], ['Ufficio Relazioni col Pubblico', 'urp.html'], ['Stato della pratica', '#'], ['Area Personale', 'sisfor']];
const AVVISO = 'Si informa che il presente sito non ha alcun valore reale o legale ed è stato creato esclusivamente per scopi di intrattenimento legati al videogioco chiamato IPRP. Tutti i contenuti, le informazioni e i riferimenti presenti su questo sito sono puramente fittizi e non devono essere interpretati come dati reali o utilizzabili al di fuori del contesto videoludico. Il sito è progettato per arricchire l’esperienza di gioco e fornire un ambiente immersivo per i giocatori, ma non riflette alcuna realtà esistente. Nessun contenuto può essere utilizzato per scopi legali, commerciali o di qualsiasi altra natura al di fuori dell’ambito del gioco IPRP. Si invita a non fare affidamento sulle informazioni presenti per decisioni o azioni nel mondo reale. L’utilizzo del sito deve essere considerato unicamente come parte dell’esperienza videoludica.';
const glass = 'border border-white/10 bg-content1/60 backdrop-blur-2xl';

const Pagina = ({ v, children }) => (
  <div className="relative flex min-h-screen flex-col overflow-hidden">
    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.14),transparent_55%)]" />
    <div className="relative flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center text-default-500">
      <p className="text-sm uppercase tracking-widest">…contenuto della pagina…</p>
      <p className="rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-widest">{v}</p>
    </div>
    <div className="relative">{children}</div>
  </div>
);
const Marchio = ({ big }) => (
  <a href="#" className="flex items-center gap-3"><img src="/crest.png" alt="" className={big ? 'h-12 w-auto' : 'h-9 w-auto'} /><span className="font-extrabold uppercase tracking-wide">Polizia di Stato</span></a>
);
const Avviso = ({ className = '' }) => (
  <div className={`flex gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-xs leading-relaxed text-default-500 ${className}`}>
    <span className="mt-0.5 flex-none text-primary"><Ic d={P.info} s={16} /></span>
    <p>{AVVISO} <Link href="https://www.iprp.it" size="sm" className="text-xs">www.iprp.it</Link></p>
  </div>
);

// ---- F1: una riga compatta + avviso in fascia
function F1() {
  return (
    <Pagina v="F1 · Compatto su una riga">
      <footer className="mx-auto w-full max-w-[1250px] px-6 pb-8">
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-7 lg:flex-row">
          <Marchio />
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">{NAV.map(([t, h]) => <Link key={t} href={h} color="foreground" size="sm" className="text-default-500 hover:text-foreground">{t}</Link>)}</nav>
          <p className="text-xs text-default-500">Creato da Ryze e DragonFire · IPRP</p>
        </div>
        <Avviso />
      </footer>
    </Pagina>
  );
}

// ---- F2: classico a colonne
function F2() {
  const col = (titolo, voci) => (
    <div><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">{titolo}</p><ul className="flex flex-col gap-2.5">{voci.map(([t, h]) => <li key={t}><Link href={h} size="sm" className="text-default-500 hover:text-foreground">{t}</Link></li>)}</ul></div>
  );
  return (
    <Pagina v="F2 · Colonne classiche">
      <footer className="border-t border-white/10 bg-content1/40">
        <div className="mx-auto grid max-w-[1250px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
          <div className="flex flex-col gap-4"><Marchio big /><p className="max-w-xs text-sm text-default-500">Sito ufficiale della Polizia di Stato del server IPRP. Solo a scopo roleplay.</p></div>
          {col('Navigazione', NAV)}
          {col('Servizi', SERV)}
          <div><p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">Contatti</p>
            <ul className="flex flex-col gap-3 text-sm text-default-500">
              <li className="flex gap-3"><span className="text-primary"><Ic d={P.pin} /></span>Via dei Peccatori N°761</li>
              <li className="flex gap-3"><span className="text-primary"><Ic d={P.phone} /></span>Tel. 113</li>
              <li className="flex gap-3"><span className="text-danger"><Ic d={P.alert} /></span>Emergenza reale: 112</li>
            </ul></div>
        </div>
        <div className="mx-auto max-w-[1250px] px-6 pb-6"><Avviso /></div>
        <Divider />
        <div className="mx-auto flex max-w-[1250px] flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-default-500 sm:flex-row"><span>© Polizia di Stato · Server IPRP</span><span>Creato da Ryze e DragonFire · IPRP</span></div>
      </footer>
    </Pagina>
  );
}

// ---- F3: scritta gigante + avviso a scomparsa
function F3() {
  return (
    <Pagina v="F3 · Scritta gigante">
      <footer className="relative overflow-hidden border-t border-white/10 pt-14">
        <div className="mx-auto flex max-w-[1250px] flex-col gap-8 px-6">
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">{NAV.map(([t, h]) => <Link key={t} href={h} color="foreground" className="text-lg font-semibold">{t}</Link>)}</nav>
            <div className="text-sm text-default-500 md:text-right"><p>Via dei Peccatori N°761 · Tel. 113</p><p className="mt-1">Emergenza reale: 112</p></div>
          </div>
          <Accordion variant="splitted" itemClasses={{ base: `${glass} shadow-none`, title: 'text-sm font-semibold', content: 'pb-4 text-xs leading-relaxed text-default-500' }}>
            <AccordionItem key="a" aria-label="Avviso legale" title="Avviso legale · sito a scopo di intrattenimento" startContent={<span className="text-primary"><Ic d={P.info} s={16} /></span>}>{AVVISO}</AccordionItem>
          </Accordion>
          <p className="text-xs text-default-500">Creato da Ryze e DragonFire · IPRP</p>
        </div>
        <p aria-hidden="true" className="pointer-events-none mt-6 select-none whitespace-nowrap text-center text-[clamp(2rem,9.6vw,11rem)] font-black uppercase leading-[0.8] tracking-tight text-white/[0.06] [mask-image:linear-gradient(180deg,#000,transparent_95%)]">Polizia di Stato</p>
      </footer>
    </Pagina>
  );
}

// ---- F4: tre isole, come la navbar
function F4() {
  return (
    <Pagina v="F4 · Tre isole (come la navbar)">
      <footer className="mx-auto w-full max-w-[1250px] px-6 pb-8">
        <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto]">
          <div className={`${glass} flex h-14 items-center rounded-full px-5 shadow-xl shadow-black/40`}><Marchio /></div>
          <nav aria-label="Footer" className={`${glass} flex min-h-14 flex-wrap items-center justify-center gap-1 rounded-full px-3 shadow-xl shadow-black/40`}>
            {[...NAV.slice(0, 3), ['Denuncia', 'denuncia.html'], ["Porto d'armi", 'porto-armi.html'], ['URP', 'urp.html']].map(([t, h]) => <Link key={t} href={h} color="foreground" size="sm" className="rounded-full px-3 py-2 hover:bg-white/10">{t}</Link>)}
          </nav>
          <div className={`${glass} flex h-14 items-center gap-2 rounded-full px-3 shadow-xl shadow-black/40`}>
            <Chip color="danger" variant="flat" startContent={<Ic d={P.alert} s={14} />}>112</Chip>
            <Button as={Link} href="sisfor" color="primary" radius="full" size="sm" className="font-semibold">Area Personale</Button>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center justify-between gap-1 px-4 text-xs text-default-500 sm:flex-row"><span>Sito Ufficiale della Polizia di Stato · Server IPRP · Solo a scopo roleplay</span><span>Creato da Ryze e DragonFire · IPRP</span></div>
        <Avviso className="mt-4" />
      </footer>
    </Pagina>
  );
}

// ---- F5: invito all'azione + colonne ridotte
function F5() {
  return (
    <Pagina v="F5 · Invito all'azione">
      <footer className="mx-auto w-full max-w-[1250px] px-6 pb-8">
        <Card className="overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/25 via-content1 to-content1">
          <CardBody className="flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
            <div><p className="text-2xl font-extrabold sm:text-3xl">Hai bisogno di aiuto?</p><p className="mt-1 text-default-500">Prenota un colloquio o fai una denuncia online, senza code.</p></div>
            <div className="flex flex-wrap gap-3"><Button color="primary" radius="full" size="lg" className="font-semibold" endContent={<Ic d={P.arrow} />}>Prenota un colloquio</Button><Button variant="bordered" radius="full" size="lg" className="border-white/20 font-semibold">Denuncia online</Button></div>
          </CardBody>
        </Card>
        <div className="mt-8 flex flex-col items-center justify-between gap-5 lg:flex-row">
          <Marchio />
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">{NAV.map(([t, h]) => <Link key={t} href={h} size="sm" className="text-default-500 hover:text-foreground">{t}</Link>)}</nav>
          <p className="text-xs text-default-500">Via dei Peccatori N°761 · Tel. 113 · Emergenza 112</p>
        </div>
        <Divider className="my-6" />
        <Avviso />
        <p className="mt-4 text-center text-xs text-default-500">Creato da Ryze e DragonFire · IPRP</p>
      </footer>
    </Pagina>
  );
}

// ---- F6: centrato e molto corto, avviso in una finestra
function F6() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <Pagina v="F6 · Centrato corto + avviso in finestra">
      <footer className="border-t border-white/10 px-6 py-10 text-center">
        <img src="/crest.png" alt="" className="mx-auto h-14 w-auto" />
        <p className="mt-3 font-extrabold uppercase tracking-wide">Polizia di Stato</p>
        <p className="text-xs uppercase tracking-[0.3em] text-default-500">Sub lege libertas</p>
        <nav aria-label="Footer" className="mt-6 flex flex-wrap justify-center gap-2">{NAV.map(([t, h]) => <Chip key={t} as="a" href={h} variant="bordered" className="cursor-pointer border-white/15 hover:bg-white/10">{t}</Chip>)}</nav>
        <p className="mt-6 text-sm text-default-500">Sito ufficiale della Polizia di Stato · Server IPRP · Solo a scopo roleplay</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 text-xs text-default-500">
          <span>Creato da Ryze e DragonFire · IPRP</span><span aria-hidden="true">·</span>
          <Link as="button" size="sm" className="text-xs" onPress={onOpen} underline="always">Avviso legale</Link>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" backdrop="blur" scrollBehavior="inside" classNames={{ base: 'border border-white/10 bg-content1' }}>
          <ModalContent>{(close) => (<><ModalHeader className="gap-2"><span className="text-primary"><Ic d={P.info} /></span>Avviso legale</ModalHeader><ModalBody><p className="text-sm leading-relaxed text-default-500">{AVVISO}</p></ModalBody><ModalFooter><Button color="primary" radius="full" onPress={close}>Ho capito</Button></ModalFooter></>)}</ModalContent>
        </Modal>
      </footer>
    </Pagina>
  );
}

export const FOOTERS = { f1: F1, f2: F2, f3: F3, f4: F4, f5: F5, f6: F6 };
