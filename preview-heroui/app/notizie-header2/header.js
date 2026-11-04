'use client';

import { AvatarGroup, Avatar, Card, Tab, Tabs } from '@heroui/react';
import { Barra } from '../notizie-header/header';

const FOTO = '/foto/giuramento.png';
const FOTO2 = '/foto/ufficidesk.jpg';

const Kicker = () => (
  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary"><span className="h-px w-10 bg-primary" />Sala stampa · Questura di Roma</div>
);
const Titolo = ({ cls = '', style }) => (
  <h1 style={style} className={`mt-4 font-extrabold uppercase leading-none tracking-tight text-[5.5rem] md:text-[8rem] ${cls}`}>Notizie</h1>
);
const Riga = () => (
  <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-5">
    <p className="max-w-md text-default-400">Comunicazioni ufficiali e aggiornamenti dalla Polizia di Stato.</p>
    <div className="flex items-center gap-4"><AvatarGroup size="sm" isBordered max={3}><Avatar src="/crest.png" /><Avatar name="U" /><Avatar name="Q" /></AvatarGroup><Tabs variant="underlined" color="primary" aria-label="Filtro"><Tab key="t" title="Tutte" /><Tab key="n" title="Notizie" /><Tab key="c" title="Comunicati" /></Tabs></div>
  </div>
);
const Testo = ({ gradient = true }) => (
  <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16"><Kicker /><Titolo cls={gradient ? 'bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent' : 'text-white'} /><Riga /></div>
);
const Base = ({ children }) => <div className="relative min-h-[560px] overflow-hidden bg-background">{children}</div>;

/* P1 · foto a tutto campo, scurita dal basso e dai lati */
const P1 = () => (
  <Base>
    <img src={FOTO} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_40%] opacity-60" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/30" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.35),transparent_60%)]" />
    <div className="relative"><Barra /><Testo /></div>
  </Base>
);

/* P2 · foto sul lato destro che sfuma verso il titolo */
const P2 = () => (
  <Base>
    <div className="absolute inset-y-0 right-0 w-[70%] [mask-image:linear-gradient(to_right,transparent,black_55%)]"><img src={FOTO} alt="" className="h-full w-full object-cover" /></div>
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(37,99,235,0.28),transparent_55%)]" />
    <div className="relative"><Barra /><Testo /></div>
  </Base>
);

/* P3 · foto dentro una scheda arrotondata, titolo sopra */
const P3 = () => (
  <Base>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.25),transparent_60%)]" />
    <div className="relative"><Barra />
      <div className="mx-auto mt-8 max-w-6xl px-6">
        <Card className="relative overflow-hidden border border-white/10" radius="lg">
          <img src={FOTO2} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
          <div className="relative px-8 pb-8 pt-10"><Kicker /><Titolo cls="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent" /><Riga /></div>
        </Card>
      </div>
    </div>
  </Base>
);

/* P4 · foto in tinta blu (duotone) con vetro sfocato dietro le schede-filtro */
const P4 = () => (
  <Base>
    <img src={FOTO2} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
    <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
    <div className="relative"><Barra /><Testo gradient={false} /></div>
  </Base>
);

/* P5 · la foto è dentro le lettere del titolo */
const P5 = () => (
  <Base>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.30),transparent_60%)]" />
    <div className="relative"><Barra />
      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16"><Kicker />
        <Titolo cls="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.25)]" style={{ backgroundImage: `url(${FOTO})`, backgroundSize: 'cover', backgroundPosition: 'center 70%', WebkitBackgroundClip: 'text', backgroundClip: 'text', filter: 'brightness(1.9) contrast(1.15) saturate(1.2)' }} />
        <Riga />
      </div>
    </div>
  </Base>
);

/* P6 · foto sovrapposte a ventaglio sulla destra */
const P6 = () => (
  <Base>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.28),transparent_60%)]" />
    <div className="absolute right-[6%] top-[95px] hidden h-[200px] w-[420px] md:block">
      {[['/foto/giuramento.png', 'rotate-[7deg] translate-x-40 translate-y-2'], ['/foto/ufficidesk.jpg', 'rotate-[-4deg] translate-x-20'], ['/foto/king.png', 'rotate-[2deg] translate-x-0 translate-y-4']].map(([src, c]) => (
        <img key={src} src={src} alt="" className={`absolute h-[170px] w-[260px] rounded-2xl border border-white/15 object-cover shadow-2xl ${c}`} />
      ))}
    </div>
    <div className="relative"><Barra /><Testo /></div>
  </Base>
);

export function HeaderFoto({ v }) {
  const V = { p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, p6: P6 }[v];
  return <V />;
}
