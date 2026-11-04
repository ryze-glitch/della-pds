'use client';

import { Card, CardBody, Chip } from '@heroui/react';
import { Barra, Ic, P } from '../notizie-header/header';
import { Base, Testo } from '../notizie-header2/header';

const G = '/foto/giuramento.png';
const U = '/foto/ufficidesk.jpg';
const K = '/foto/king.png';
const O = '/foto/onori.png';

const Alone = () => <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(37,99,235,0.28),transparent_55%)]" />;

/* Q1 · come la 2, ma più grande, con alone blu sul bordo della sfumatura */
const Q1 = () => (
  <Base>
    <div className="absolute inset-y-0 right-0 w-[78%] [mask-image:linear-gradient(to_right,transparent,black_60%)]"><img src={G} alt="" className="h-full w-full scale-110 object-cover object-[70%_40%]" /><div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/15 to-transparent" /></div>
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    <Alone /><div className="relative"><Barra /><Testo /></div>
  </Base>
);

/* Q2 · bordo diagonale */
const Q2 = () => (
  <Base>
    <div className="absolute inset-y-0 right-0 w-[62%] [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"><img src={G} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" /><div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" /></div>
    <div className="absolute inset-y-0 right-[60%] w-px rotate-[12deg] bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
    <Alone /><div className="relative"><Barra /><Testo /></div>
  </Base>
);

/* Q3 · sfumata a destra + scheda "ultima notizia" in vetro */
const Q3 = () => (
  <Base>
    <div className="absolute inset-y-0 right-0 w-[70%] [mask-image:linear-gradient(to_right,transparent,black_55%)]"><img src={G} alt="" className="h-full w-full object-cover" /></div>
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    <Alone />
    <div className="relative"><Barra /><Testo />
      <Card className="absolute right-[6%] top-[110px] hidden w-[300px] border border-white/15 bg-background/55 backdrop-blur-xl md:flex" radius="lg"><CardBody className="gap-2 p-4">
        <div className="flex items-center gap-2"><Chip size="sm" color="primary" variant="flat">Ultima notizia</Chip><span className="text-[11px] text-default-400">11 Maggio 2025</span></div>
        <p className="text-sm font-semibold leading-snug">La Polizia di Stato è in lutto per la scomparsa di Derek Morgan</p>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">Leggi <Ic d={P.arrow} s={14} /></span>
      </CardBody></Card>
    </div>
  </Base>
);

/* Q4 · quattro strisce verticali, ognuna con la sua foto, che sfumano a sinistra */
const Q4 = () => (
  <Base>
    <div className="absolute inset-y-0 right-0 flex w-[52%] items-start gap-3 pr-[5%]">
      {[G, U, K].map((s, i) => (<div key={s} className="relative flex-1 overflow-hidden rounded-3xl opacity-80" style={{ marginTop: `${100 + (i % 2) * 28}px`, height: 230 }}><img src={s} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" /></div>))}
    </div>
    <Alone /><div className="relative"><Barra /><Testo /></div>
  </Base>
);

/* Q5 · foto grande sfumata e riquadro "In evidenza" ancorato in basso a destra */
const Q5 = () => (
  <Base>
    <div className="absolute inset-y-0 right-0 w-[75%] [mask-image:linear-gradient(to_right,transparent,black_50%)]"><img src={U} alt="" className="h-full w-full object-cover opacity-80" /></div>
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" /><Alone />
    <div className="relative"><Barra /><Testo />
      <div className="absolute bottom-[-60px] right-[5%] hidden items-center gap-4 rounded-2xl border border-white/15 bg-background/60 p-3 pr-5 backdrop-blur-xl md:flex">
        <img src={K} alt="" className="h-16 w-24 rounded-xl object-cover" />
        <div><Chip size="sm" color="warning" variant="flat">In evidenza</Chip><p className="mt-1 text-sm font-semibold">Cambio Dirigenti a Roma</p></div>
      </div>
    </div>
  </Base>
);

/* Q6 · foto dentro una finestra arrotondata con anello luminoso */
const Q6 = () => (
  <Base>
    <Alone />
    <div className="absolute right-[7%] top-[88px] hidden h-[230px] w-[420px] md:block">
      <div className="absolute -inset-3 rounded-[48px] bg-primary/30 blur-2xl" />
      <div className="relative h-full w-full overflow-hidden rounded-[40px] border border-white/20"><img src={G} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-primary/10" /></div>
    </div>
    <div className="relative"><Barra /><Testo /></div>
  </Base>
);

export function HeaderFoto({ v }) {
  const V = { q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6 }[v];
  return <V />;
}
