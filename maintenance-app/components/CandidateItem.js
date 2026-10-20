'use client';

import { useState } from 'react';

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

function Tag({ children, tone = 'default' }) {
  const tones = { default: 'border-ink/40 text-mute', ok: 'border-ok text-ok', bad: 'border-bad text-bad', accent: 'border-accent text-accent' };
  return <span className={`mono border px-2 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}

function Field({ label, value }) {
  return (
    <div className="border-b border-ink/20 py-3 last:border-0">
      <div className="mono text-[11px] font-bold text-mute">{label}</div>
      <div className="mt-1">{value || '—'}</div>
    </div>
  );
}

function QuizField({ label, value, correct }) {
  const ok = normalizeAnswer(value) === normalizeAnswer(correct);
  return (
    <div className="border-b border-ink/20 py-3 last:border-0">
      <div className="mono flex items-start gap-3 text-[11px] font-bold text-mute">
        <span className="flex-1">{label}</span>
        <Tag tone={ok ? 'ok' : 'bad'}>{ok ? '5/5' : '0/5'}</Tag>
      </div>
      <div className="mt-1">{value || '—'}</div>
    </div>
  );
}

export function CandidateItem({ c, currentAgent, onDecide }) {
  const [open, setOpen] = useState(false);
  const review = c.review;
  const locked = !!(review && currentAgent && review.decisoDa?.discordId !== currentAgent.discordId);
  const etaPulita = (c.eta || '').replace(/\s*anni?\s*$/i, '');
  const border = review?.stato === 'approvato' ? 'border-ok' : review?.stato === 'rifiutato' ? 'border-bad' : 'border-ink';

  return (
    <div className={`border-2 ${border}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-ink hover:text-paper">
        {review?.stato === 'approvato' ? <Tag tone="ok">Approvata</Tag> : null}
        {review?.stato === 'rifiutato' ? <Tag tone="bad">Rifiutata</Tag> : null}
        <span className="text-xl font-extrabold">{c.nome || 'Sconosciuto'}</span>
        <span className="mono flex flex-wrap gap-x-3 text-[11px] opacity-70">
          <span>{c.dataInvio}</span>
          {etaPulita ? <span>{etaPulita} anni</span> : null}
          <span>{c.titolo}</span>
          <span>ID: {c.discordId}</span>
        </span>
        <span className="ml-auto flex flex-wrap gap-2">
          {c.punteggio ? <Tag tone="accent">{c.punteggio}</Tag> : null}
          <Tag tone={isAffermativo(c.fedina) ? 'ok' : 'default'}>Fedina {c.fedina}</Tag>
          <Tag tone={isAffermativo(c.certificato) ? 'ok' : 'default'}>Cert. {c.certificato}</Tag>
          <Tag tone={isAffermativo(c.patente) ? 'ok' : 'default'}>Pat. B {c.patente}</Tag>
        </span>
        <span className="text-xl font-extrabold">{open ? '−' : '+'}</span>
      </button>

      {open ? (
        <div className="border-t-2 border-ink p-5">
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
              className={`border-2 px-5 py-2.5 text-sm font-extrabold uppercase disabled:opacity-40 ${
                review?.stato === 'approvato' ? 'border-ok bg-ok text-white' : 'border-ink hover:border-ok hover:bg-ok hover:text-white'
              }`}
            >
              Approva
            </button>
            <button
              type="button"
              disabled={locked}
              onClick={() => onDecide(c, 'rifiutato')}
              className={`border-2 px-5 py-2.5 text-sm font-extrabold uppercase disabled:opacity-40 ${
                review?.stato === 'rifiutato' ? 'border-bad bg-bad text-white' : 'border-ink hover:border-bad hover:bg-bad hover:text-white'
              }`}
            >
              Rifiuta
            </button>
            <span className="text-sm text-mute">
              {!review
                ? 'Nessuna decisione registrata.'
                : `${review.stato === 'approvato' ? 'Approvata' : 'Rifiutata'} da ${review.decisoDa?.nome || ''} ${review.decisoDa?.cognome || ''}`.trim() +
                  (review.decisoDa?.grado ? ` (${review.decisoDa.grado})` : '') +
                  (review.decisoIl ? ` il ${new Date(review.decisoIl).toLocaleString('it-IT')}` : '')}
            </span>
            {locked ? (
              <span className="text-sm font-bold text-bad">
                Decisione bloccata: solo {review.decisoDa?.nome} {review.decisoDa?.cognome} può modificarla.
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
