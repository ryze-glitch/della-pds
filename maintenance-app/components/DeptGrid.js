'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Btn, Card, Overline } from './ui';

const DEPTS = [
  ['Centro Città', 'Reparto Volanti', 'Pattugliamento continuo del territorio e risposta rapida alle emergenze cittadine.', '/assets/hero-slide-2.jpg'],
  ['Uffici Investigativi', 'Squadra Investigativa', "Indagini su reati complessi e raccolta prove in collaborazione con l'autorità giudiziaria.", '/assets/hero-slide-1.jpg'],
  ['Interventi ad Alto Rischio', 'Nucleo Operativo Speciale', 'Formazione d\'élite per le situazioni più critiche e gli scenari a massimo rischio.', '/assets/hero-slide-2.jpg'],
  ['Viabilità & Sicurezza', 'Polizia Stradale', 'Controllo della rete viaria e gestione degli incidenti sul territorio cittadino ed extraurbano.', '/assets/hero-slide-1.jpg'],
];

const EXTRA = [
  ['Contatto Cittadino', 'Ufficio Relazioni Pubbliche', 'Punto di riferimento diretto tra Questura e cittadinanza per segnalazioni e informazioni.', '/assets/hero-slide-2.jpg'],
  ['Nuove Reclute', 'Accademia & Formazione', "Percorso strutturato di addestramento dalle basi teoriche all'affiancamento sul campo.", '/assets/hero-slide-1.jpg'],
];

function DeptCard([overline, title, text, img]) {
  return (
    <Card key={title}>
      <img src={img} alt={title} className="h-44 w-full object-cover" />
      <div className="p-5">
        <Overline>{overline}</Overline>
        <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-ink-dim">{text}</p>
        <Btn as={Link} href="/reparti" variant="text" iconEnd="arrow_forward" className="mt-3 !px-0">
          Scopri il reparto
        </Btn>
      </div>
    </Card>
  );
}

export function DeptGrid() {
  const [showAll, setShowAll] = useState(false);
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DEPTS.map(DeptCard)}
        {showAll ? EXTRA.map(DeptCard) : null}
      </div>
      {!showAll ? (
        <div className="mt-8 flex justify-center">
          <Btn variant="tonal" onClick={() => setShowAll(true)}>
            Carica altri reparti
          </Btn>
        </div>
      ) : null}
    </>
  );
}
