'use client';

import { NOMI, VARIANTI } from '../variants';

export function Demo({ v }) {
  const Nav = VARIANTI[v];
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(37,99,235,0.35),transparent_55%),radial-gradient(ellipse_at_10%_60%,rgba(37,99,235,0.15),transparent_50%)]" />
      <Nav />
      <main className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-44 text-center">
        <img src="/crest.png" alt="" className="h-28 w-auto drop-shadow-2xl" />
        <h1 className="mt-6 text-5xl font-extrabold uppercase tracking-wide sm:text-7xl">Polizia di Stato</h1>
        <p className="mt-4 text-default-500">Via dei Peccatori N°761 · Tel. 113</p>
        <p className="mt-12 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-default-500">{NOMI[v]}</p>
      </main>
    </div>
  );
}
