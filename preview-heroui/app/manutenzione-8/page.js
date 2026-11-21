'use client';
import { Card, CardBody, Chip, Accordion, AccordionItem } from '@heroui/react';
import '../manutenzione.css';

const FASI = [['Backup dei dati', 'Completato', 'success'], ['Nuova versione del sito', 'In corso', 'warning'], ['Verifica degli accessi', 'In attesa', 'default'], ['Riapertura', 'In attesa', 'default']];

export default function Page() {
  return (
    <div className="mz">
      <div className="mz-glow absolute inset-0" />
      <div className="mz-hz-s absolute inset-x-0 top-0 h-3" />
      <main className="relative z-10 mx-auto grid min-h-screen max-w-[1100px] items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_1fr]">
        <div>
          <img src="/crest.png" alt="" className="mb-6 h-16" />
          <Chip color="warning" variant="flat" size="sm" className="font-bold uppercase tracking-widest" startContent={<span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-warning" />}>Lavori in corso</Chip>
          <h1 className="mt-4 text-5xl font-extrabold uppercase leading-[1.02] tracking-tight md:text-6xl">Stiamo <span className="text-warning">aggiornando</span> il sito</h1>
          <p className="mt-5 max-w-md text-lg text-default-400">Il ritorno online è previsto a breve: grazie per la pazienza.</p>
          <Accordion variant="splitted" className="mt-8 px-0" itemClasses={{ base: 'bg-content1 border border-white/10', title: 'font-semibold' }}>
            <AccordionItem key="1" aria-label="Cosa sta cambiando" title="Cosa sta cambiando?"><span className="text-default-400">Nuova grafica, area personale e dashboard collegate con un solo accesso.</span></AccordionItem>
            <AccordionItem key="2" aria-label="Quando torna" title="Quando torna online?"><span className="text-default-400">A breve: ti avvisiamo sul Discord appena riapriamo.</span></AccordionItem>
          </Accordion>
        </div>
        <Card className="border border-white/10 bg-content1" radius="lg" shadow="lg"><CardBody className="gap-6 p-8">
          <div className="text-xs font-bold uppercase tracking-[.3em] text-default-400">Stato dei lavori</div>
          {FASI.map(([t, s, c], i) => (
            <div key={t} className="mz-step flex items-center gap-4">
              <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 font-bold ${c === 'success' ? 'border-success bg-success/15 text-success' : c === 'warning' ? 'border-warning bg-warning/15 text-warning' : 'border-white/15 text-default-500'}`}>{c === 'success' ? '✓' : i + 1}</div>
              <div className="flex-1 font-semibold">{t}</div><Chip size="sm" variant="flat" color={c}>{s}</Chip>
            </div>
          ))}
        </CardBody></Card>
      </main>
    </div>
  );
}
