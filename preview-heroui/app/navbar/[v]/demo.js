'use client';

import { NOMI, VARIANTI } from '../variants';
import { NOMI2, VARIANTI2 } from '../variants2';
import { NOMI3, VARIANTI3 } from '../variants3';
import { NOMI4, VARIANTI4 } from '../variants4';

export function Demo({ v }) {
  const Nav = VARIANTI[v] || VARIANTI2[v] || VARIANTI3[v] || VARIANTI4[v];
  const nome = NOMI[v] || NOMI2[v] || NOMI3[v] || NOMI4[v];
  return (
    <div className={`relative overflow-hidden ${v === 'k' || v === 'o' ? 'min-h-[200vh]' : 'min-h-screen'}`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(37,99,235,0.35),transparent_55%),radial-gradient(ellipse_at_10%_60%,rgba(37,99,235,0.15),transparent_50%)]" />
      <Nav />
      <main className={`relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-48 text-center ${v === 'i' ? 'md:pl-24' : v === 'n' ? 'md:pl-72' : ''}`}>
        <img src="/crest.png" alt="" className="h-28 w-auto drop-shadow-2xl" />
        <h1 className="mt-6 text-5xl font-extrabold uppercase tracking-wide sm:text-7xl">Polizia di Stato</h1>
        <p className="mt-4 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
        <p className="mt-12 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-default-500">{nome}</p>
      </main>
    </div>
  );
}
