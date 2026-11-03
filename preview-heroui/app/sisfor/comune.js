'use client';

import { useState } from 'react';
import { Button, Chip, Progress, Radio, RadioGroup } from '@heroui/react';

export const Ic = ({ d, s = 18 }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const P = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6',
  book: 'M4 5c5-2 8-1 8 1v15c0-2-3-3-8-1ZM20 5c-5-2-8-1-8 1v15c0-2 3-3 8-1Z',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  check: 'm5 12 5 5 9-10',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8.5 14 7 22l5-3 5 3-1.5-8',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  home: 'M4 21V9l8-5 8 5v12M9 21v-6h6v6',
  play: 'M8 5v14l11-7z',
};

export const UTENTE = { nome: 'Gabriel', cognome: 'Martinelli', qualifica: 'Vice Questore Aggiunto', matricola: 'PDS - 0006' };

export const CORSI = [
  { id: 'pdb', titolo: 'Posto di blocco e fermo veicolo', desc: 'Come si imposta un posto di blocco, come si ferma un veicolo in sicurezza e come si gestisce il controllo con il conducente.', stato: 'in_corso', pc: 43, moduli: 3, durata: '45 min', grad: 'from-blue-600 to-indigo-900' },
  { id: 'rad', titolo: 'Comunicazioni radio e codici', desc: 'Procedure di comunicazione con la Centrale, codici e fraseologia corretta.', stato: 'nuovo', pc: 0, moduli: 4, durata: '1 h', grad: 'from-cyan-600 to-blue-900' },
  { id: 'arr', titolo: 'Procedure di arresto e fermo', desc: 'Diritti, modalità e verbalizzazione dell’arresto in flagranza.', stato: 'nuovo', pc: 0, moduli: 5, durata: '1 h 20', grad: 'from-violet-600 to-purple-900' },
  { id: 'pri', titolo: 'Primo soccorso sul campo', desc: 'Gestione dell’emergenza sanitaria prima dell’arrivo dei soccorsi.', stato: 'completato', pc: 100, moduli: 3, durata: '40 min', grad: 'from-emerald-600 to-teal-900' },
];

export const MODULI = [
  { id: 1, titolo: 'Preparare il posto di blocco', stato: 'fatto', quiz: 'Superato con 80%' },
  { id: 2, titolo: 'Fermare un veicolo e primo contatto', stato: 'corso', quiz: '5 domande · soglia 70% · max 3 tentativi' },
  { id: 3, titolo: 'Controllo, alcoltest ed esito', stato: 'bloccato', quiz: 'Si sblocca dopo il modulo 2' },
];

export const STATO = {
  in_corso: ['primary', 'In corso'],
  nuovo: ['default', 'Da iniziare'],
  completato: ['success', 'Completato'],
  fatto: ['success', 'Fatto'],
  corso: ['primary', 'In corso'],
  bloccato: ['default', 'Bloccato'],
};
export const StatoChip = ({ k, size = 'sm' }) => <Chip size={size} variant="flat" color={STATO[k][0]}>{STATO[k][1]}</Chip>;

const DOMANDE = [
  ['Come si posizionano le volanti?', ['Una sola, a caso', 'Fuori dalla carreggiata', 'Parallele e distanti', 'A “V” o in diagonale, a protezione degli agenti']],
  ['Cosa si comunica alla Centrale prima di iniziare?', ['Nulla', 'Luogo e orario di inizio del controllo', 'Solo la targa', 'Il nome del conducente']],
  ['Quanti agenti servono almeno?', ['Uno', 'Due: uno controlla e l’altro copre', 'Tre', 'Nessuno']],
  ['Dove si imposta un posto di blocco?', ['Dentro un tunnel', 'Dopo una curva cieca', 'In un punto con buona visibilità', 'Su un dosso']],
  ['Come si ferma un veicolo?', ['Con segnale chiaro e distanza di sicurezza', 'Tagliando la strada', 'Con il clacson', 'Inseguendolo']],
];

// Quiz condiviso da tutte le versioni: domanda, risposte, navigazione e tempo.
export function Quiz({ onFine }) {
  const [i, setI] = useState(0);
  const [r, setR] = useState({});
  const [d, opz] = DOMANDE[i];
  const ultima = i === DOMANDE.length - 1;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
      <div className="rounded-3xl border border-white/10 bg-content1/60 p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-default-500">Domanda {i + 1} di {DOMANDE.length}</p><Chip size="sm" variant="flat" startContent={<Ic d={P.clock} s={13} />}>29:41</Chip></div>
        <Progress aria-label="Avanzamento" value={((i + 1) / DOMANDE.length) * 100} size="sm" color="primary" className="mb-6" />
        <RadioGroup label={<span className="text-xl font-semibold text-foreground">{d}</span>} value={r[i] || ''} onValueChange={(v) => setR({ ...r, [i]: v })} classNames={{ wrapper: 'mt-4 gap-3' }}>
          {opz.map((o) => (<Radio key={o} value={o} classNames={{ base: 'm-0 max-w-full rounded-2xl border border-white/10 p-4 data-[selected=true]:border-primary data-[selected=true]:bg-primary/10', label: 'text-base' }}>{o}</Radio>))}
        </RadioGroup>
        <div className="mt-8 flex justify-between"><Button variant="bordered" radius="full" isDisabled={i === 0} onPress={() => setI(i - 1)} className="border-white/20">Precedente</Button>
          <Button color="primary" radius="full" className="font-semibold" isDisabled={!r[i]} onPress={() => (ultima ? onFine && onFine() : setI(i + 1))} endContent={<Ic d={P.arrow} s={16} />}>{ultima ? 'Termina il tentativo' : 'Continua'}</Button></div>
      </div>
      <aside className="h-fit rounded-3xl border border-white/10 bg-content1/60 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-default-500">Navigazione</p>
        <div className="grid grid-cols-5 gap-2">{DOMANDE.map((_, k) => (<button key={k} type="button" onClick={() => setI(k)} className={`h-10 rounded-xl border text-sm font-semibold ${k === i ? 'border-white bg-white text-black' : r[k] ? 'border-primary bg-primary/25' : 'border-white/15'}`}>{k + 1}</button>))}</div>
        <p className="mt-4 text-xs text-default-500">Tentativo 1 di 3 · soglia 70%</p>
      </aside>
    </div>
  );
}

export const Etichetta = ({ v }) => <p className="fixed bottom-3 left-3 z-50 rounded-full border border-white/10 bg-background/90 px-4 py-1.5 text-[11px] uppercase tracking-widest text-default-500 backdrop-blur">{v}</p>;
