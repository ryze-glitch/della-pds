'use client';

import { useState } from 'react';
import { Badge } from './ui';
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
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-sm">{value || '—'}</div>
    </div>
  );
}

function QuizField({ label, value, correct }) {
  const ok = normalizeAnswer(value) === normalizeAnswer(correct);
  return (
    <div className="border-b border-line py-3 last:border-0">
      <div className="flex items-start gap-3 text-xs font-semibold uppercase tracking-wide text-muted">
        <span className="flex-1">{label}</span>
        <Badge tone={ok ? 'ok' : 'bad'}>{ok ? '5/5' : '0/5'}</Badge>
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
  const border = review?.stato === 'approvato' ? 'border-ok/50' : review?.stato === 'rifiutato' ? 'border-bad/50' : 'border-line';

  return (
    <div className={`overflow-hidden rounded-[20px] border bg-surface  ${border}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left hover:bg-surface2">
        {review?.stato === 'approvato' ? <Icon name="check-circle" size={19} className="text-ok" /> : null}
        {review?.stato === 'rifiutato' ? <Icon name="cross" size={19} className="text-bad" /> : null}
        <span className="font-semibold">{c.nome || 'Sconosciuto'}</span>
        <span className="flex flex-wrap gap-x-3 text-xs text-muted">
          <span>{c.dataInvio}</span>
          {etaPulita ? <span>{etaPulita} anni</span> : null}
          <span>{c.titolo}</span>
          <span>ID: {c.discordId}</span>
        </span>
        <span className="ml-auto flex flex-wrap gap-2">
          {c.punteggio ? <Badge tone="blue">{c.punteggio}</Badge> : null}
          <Badge tone={isAffermativo(c.fedina) ? 'ok' : 'neutral'}>Fedina {c.fedina}</Badge>
          <Badge tone={isAffermativo(c.certificato) ? 'ok' : 'neutral'}>Cert. {c.certificato}</Badge>
          <Badge tone={isAffermativo(c.patente) ? 'ok' : 'neutral'}>Pat. B {c.patente}</Badge>
        </span>
        <Icon name="chevron" size={17} className={`text-muted transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open ? (
        <div className="border-t border-line px-5 py-4">
          <Field label="Email" value={c.email} />
          <Field label="Data di nascita" value={c.dataNascita} />
          {c.extra.map(([label, value]) => {
            const quiz = findQuizAnswer(label);
            return quiz ? <QuizField key={label} label={label} value={value} correct={quiz.correct} /> : <Field key={label} label={label} value={value} />;
          })}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={locked}
              onClick={() => onDecide(c, 'approvato')}
              className={`h-10 rounded-full border px-5 text-sm font-semibold transition disabled:opacity-40 ${review?.stato === 'approvato' ? 'border-ok bg-ok text-white' : 'border-line hover:border-ok hover:text-ok'}`}
            >
              Approva
            </button>
            <button
              type="button"
              disabled={locked}
              onClick={() => onDecide(c, 'rifiutato')}
              className={`h-10 rounded-full border px-5 text-sm font-semibold transition disabled:opacity-40 ${review?.stato === 'rifiutato' ? 'border-bad bg-bad text-white' : 'border-line hover:border-bad hover:text-bad'}`}
            >
              Rifiuta
            </button>
            <span className="text-sm text-muted">
              {!review
                ? 'Nessuna decisione registrata.'
                : `${review.stato === 'approvato' ? 'Approvata' : 'Rifiutata'} da ${review.decisoDa?.nome || ''} ${review.decisoDa?.cognome || ''}`.trim() +
                  (review.decisoDa?.grado ? ` (${review.decisoDa.grado})` : '') +
                  (review.decisoIl ? ` il ${new Date(review.decisoIl).toLocaleString('it-IT')}` : '')}
            </span>
            {locked ? (
              <span className="text-sm font-medium text-bad">
                Decisione bloccata: solo {review.decisoDa?.nome} {review.decisoDa?.cognome} può modificarla.
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
