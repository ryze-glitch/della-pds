'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Btn, Eyebrow } from './ui';

const DEPTS = [
  ['01', 'Centro Città', 'Reparto Volanti', 'Pattugliamento continuo del territorio e risposta rapida alle emergenze cittadine.', '/assets/hero-slide-2.jpg'],
  ['02', 'Uffici Investigativi', 'Squadra Investigativa', "Indagini su reati complessi e raccolta prove in collaborazione con l'autorità giudiziaria.", '/assets/hero-slide-1.jpg'],
  ['03', 'Interventi ad Alto Rischio', 'Nucleo Operativo Speciale', "Formazione d'élite per le situazioni più critiche e gli scenari a massimo rischio.", '/assets/hero-slide-2.jpg'],
  ['04', 'Viabilità & Sicurezza', 'Polizia Stradale', 'Controllo della rete viaria e gestione degli incidenti sul territorio cittadino ed extraurbano.', '/assets/hero-slide-1.jpg'],
];

const EXTRA = [
  ['05', 'Contatto Cittadino', 'Ufficio Relazioni Pubbliche', 'Punto di riferimento diretto tra Questura e cittadinanza per segnalazioni e informazioni.', '/assets/hero-slide-2.jpg'],
  ['06', 'Nuove Reclute', 'Accademia & Formazione', "Percorso strutturato di addestramento dalle basi teoriche all'affiancamento sul campo.", '/assets/hero-slide-1.jpg'],
];

function DeptCard([n, overline, title, text, img]) {
  return (
    <div key={title} className="bg-bg">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={img} alt={title} className="h-full w-full object-cover opacity-60 grayscale" />
      </div>
      <div className="p-7">
        <div className="flex items-center justify-between">
          <Eyebrow>{overline}</Eyebrow>
          <span className="font-mono text-xs text-ink-dim">{n}</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-dim">{text}</p>
        <Btn as={Link} href="/reparti" variant="text" iconEnd="arrow_forward" className="mt-5">
          Scopri il reparto
        </Btn>
      </div>
    </div>
  );
}

export function DeptGrid() {
  const [showAll, setShowAll] = useState(false);
  return (
    <>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {DEPTS.map(DeptCard)}
        {showAll ? EXTRA.map(DeptCard) : null}
      </div>
      {!showAll ? (
        <div className="mt-10 flex justify-center">
          <Btn as="button" type="button" variant="outlined" onClick={() => setShowAll(true)}>
            Carica altri reparti
          </Btn>
        </div>
      ) : null}
    </>
  );
}
