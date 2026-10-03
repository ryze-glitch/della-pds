'use client';

import { useState } from 'react';
import { Chip } from './ui';
import { Icon } from './icons';

const QUIZ_ANSWERS = [
  { match: 'che tipo di servizio', correct: 'Competenza Generale e in Servizio Permanente di Pubblica Sicurezza' },
  { match: 'la volante e che ruolo', correct: "La Volante è l'auto della Polizia che svolge servizio di Pattuglia sul territorio ed è composta Obbligatoriamente da un Capo pattuglia e il Guidatore" },
  { match: 'motto della polizia', correct: 'Sub Lege Libertas' },
  { match: 'animale che rappresenta', correct: 'Pantera' },
  { match: 'arrestato per un totale di 80 mesi', correct: '45 Mesi' },
  { match: 'grado è inserito sotto il vice ispettore', correct: 'Sovrintendente Capo Coordinatore' },
  { match: 'insubordinazione', correct: "Mancanza Grave nei Confronti del Rispetto e Dei Doveri cui sono Tenuti gli Inferiori nell'ambito di una Gerarchia." },
];

function findQuizAnswer(label) {
  const l = (label || '').toLowerCase();
  return QUIZ_ANSWERS.find((q) => l.includes(q.match));
}
function normalizeAnswer(s) {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}
function isAffermativo(v) {
  return /^s(i|ì)/i.test((v || '').trim());
}

function Field({ label, value }) {
  return (
    <div className="border-b border-line py-3 last:border-0">
      <div className="font-mono text-[11px] uppercase tracking-wide text-ink-dim">{label}</div>
      <div className="mt-1 text-sm">{value || '—'}</div>
    </div>
  );
}

function QuizField({ label, value, correct }) {
  const ok = normalizeAnswer(value) === normalizeAnswer(correct);
  return (
    <div className="border-b border-line py-3 last:border-0">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-ink-dim">
        <span>{label}</span>
        <span className={`border px-1.5 py-0.5 text-[10px] ${ok ? 'border-success/50 text-success' : 'border-danger/50 text-danger'}`}>
          {ok ? '5/5' : '0/5'}
        </span>
      </div>
      <div className="mt-1 text-sm">{value || '—'}</div>
    </div>
  );
}

export function CandidateItem({ c, currentAgent, onDecide }) {
  const [open, setOpen] = useState(false);
  const review = c.review;
  const locked = !!(review && currentAgent && review.decisoDa?.discordId !== currentAgent.discordId);
  const etaPulita = (c.eta || '').replace(/\s*anni?\s*$/i, '');

  const sideColor = review?.stato === 'approvato' ? 'border-l-success' : review?.stato === 'rifiutato' ? 'border-l-danger' : 'border-l-transparent';

  return (
    <div className={`border border-line border-l-[3px] ${sideColor}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full flex-wrap items-center gap-3 p-5 text-left">
        {review?.stato === 'approvato' ? <Icon name="check_circle" className="text-success" /> : null}
        {review?.stato === 'rifiutato' ? <Icon name="close" className="text-danger" /> : null}
        <span className="font-semibold">{c.nome || 'Sconosciuto'}</span>
        <span className="flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-wide text-ink-dim">
          <span>{c.dataInvio}</span>
          {etaPulita ? <span>{etaPulita} anni</span> : null}
          <span>{c.titolo}</span>
          <span>ID: {c.discordId}</span>
        </span>
        <span className="ml-auto flex flex-wrap gap-2">
          {c.punteggio ? <Chip>{c.punteggio}</Chip> : null}
          <Chip tone={isAffermativo(c.fedina) ? 'success' : 'default'}>Fedina {c.fedina}</Chip>
          <Chip tone={isAffermativo(c.certificato) ? 'success' : 'default'}>Cert. {c.certificato}</Chip>
          <Chip tone={isAffermativo(c.patente) ? 'success' : 'default'}>Pat. B {c.patente}</Chip>
        </span>
        <Icon name="chevron_right" className={`transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open ? (
        <div className="border-t border-line p-5">
          <Field label="Email" value={c.email} />
          <Field label="Data di nascita" value={c.dataNascita} />
          {c.extra.map(([label, value]) => {
            const quiz = findQuizAnswer(label);
            return quiz ? (
              <QuizField key={label} label={label} value={value} correct={quiz.correct} />
            ) : (
              <Field key={label} label={label} value={value} />
            );
          })}

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={locked}
              onClick={() => onDecide(c, 'approvato')}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] disabled:opacity-40 ${
                review?.stato === 'approvato' ? 'border-success text-success' : 'border-line-strong hover:border-success hover:text-success'
              }`}
            >
              Approva
            </button>
            <button
              type="button"
              disabled={locked}
              onClick={() => onDecide(c, 'rifiutato')}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] disabled:opacity-40 ${
                review?.stato === 'rifiutato' ? 'border-danger text-danger' : 'border-line-strong hover:border-danger hover:text-danger'
              }`}
            >
              Rifiuta
            </button>
            <span className="text-sm text-ink-dim">
              {!review
                ? 'Nessuna decisione registrata.'
                : `${review.stato === 'approvato' ? 'Approvata' : 'Rifiutata'} da ${review.decisoDa?.nome || ''} ${review.decisoDa?.cognome || ''}`.trim() +
                  (review.decisoDa?.grado ? ` (${review.decisoDa.grado})` : '') +
                  (review.decisoIl ? ` il ${new Date(review.decisoIl).toLocaleString('it-IT')}` : '')}
            </span>
            {locked ? (
              <span className="text-sm text-danger">
                Decisione bloccata: solo {review.decisoDa?.nome} {review.decisoDa?.cognome} può modificarla.
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
