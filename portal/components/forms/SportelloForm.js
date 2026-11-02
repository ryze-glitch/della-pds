'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '../icons';
import { Btn, Notice } from '../ui';
import { FORMS, emptyValues, isVisible, validate, validateField } from '../../lib/forms';
import { inviaPratica, SubmitError } from '../../lib/sportello';
import { savePratica } from '../../lib/miePratiche';
import { TurnstileWidget } from './Turnstile';
import { useSportelloConfig } from './useSportelloConfig';
import { GoogleGate } from './GoogleGate';
import { clearGoogleUser, getGoogleUser } from '../../lib/googleAuth';

function pad(n) {
  return String(n).padStart(2, '0');
}
function localNowValue() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function todayValue() {
  return localNowValue().slice(0, 10);
}

function Field({ field, value, error, onChange, onBlur }) {
  const id = `f-${field.name}`;
  const describedBy = [field.hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(' ') || undefined;
  const common = {
    id,
    name: field.name,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    onBlur: () => onBlur(field),
  };

  if (field.type === 'checkbox') {
    return (
      <div className="sm:col-span-2">
        <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-[13.5px] leading-snug transition ${error ? 'border-bad bg-bad/5' : 'border-line hover:bg-surface2'}`}>
          <input
            {...common}
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(field, e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-none cursor-pointer accent-[rgb(var(--primary))]"
          />
          <span>
            {field.label}
            {field.required ? <span className="text-bad"> *</span> : null}
          </span>
        </label>
        {error ? (
          <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-bad">
            <Icon name="alert" size={15} /> {error}
          </p>
        ) : null}
      </div>
    );
  }

  let control;
  if (field.type === 'select' && field.options.length <= 5) {
    control = (
      <div role="radiogroup" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2.5">
        {field.options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={on}
              name={field.name}
              onClick={() => {
                onChange(field, o);
                onBlur(field, o);
              }}
              className={`rounded-full border px-5 py-2.5 text-[13.1px] font-medium transition ${on ? 'border-primary bg-primary/5 text-link' : 'border-line text-fg hover:border-white/40'}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    );
  } else if (field.type === 'select') {
    control = (
      <select {...common} value={value} onChange={(e) => onChange(field, e.target.value)} className="input">
        <option value="">Seleziona…</option>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'textarea') {
    control = (
      <textarea
        {...common}
        rows={field.rows || 4}
        value={value}
        maxLength={(field.max || 1000) + 200}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field, e.target.value)}
        className="input resize-y"
      />
    );
  } else {
    const htmlType = field.type === 'datetime' ? 'datetime-local' : field.type;
    control = (
      <input
        {...common}
        type={htmlType}
        value={value}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        max={field.noFuture ? (field.type === 'datetime' ? localNowValue() : todayValue()) : undefined}
        min={field.minToday ? todayValue() : undefined}
        onChange={(e) => onChange(field, e.target.value)}
        className="input"
      />
    );
  }

  return (
    <div className={field.width === 'half' ? '' : 'sm:col-span-2'}>
      <label htmlFor={id} id={`${id}-label`} className="mb-2 block text-sm font-medium text-fg/90">
        {field.label}
        {field.required ? <span className="text-bad"> *</span> : null}
      </label>
      {control}
      <div className="mt-1.5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {field.hint ? (
            <p id={`${id}-hint`} className="text-[11.7px] leading-snug text-muted">
              {field.hint}
            </p>
          ) : null}
          {error ? (
            <p id={`${id}-err`} role="alert" className="mt-1 flex items-center gap-1.5 text-sm font-medium text-bad">
              <Icon name="alert" size={15} /> {error}
            </p>
          ) : null}
        </div>
        {field.type === 'textarea' && field.max ? (
          <span className={`flex-none text-xs tabular-nums ${String(value).length > field.max ? 'text-bad' : 'text-muted'}`}>
            {String(value).length}/{field.max}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Receipt({ form, code, onReset }) {
  const [copied, setCopied] = useState(false);
  const when = new Date().toLocaleString('it-IT', { dateStyle: 'long', timeStyle: 'short' });
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      /* clipboard non disponibile */
    }
  }
  return (
    <div className="mx-auto max-w-xl">
      <div className="hero-in rounded-[24px] border border-line bg-surface p-7 sm:p-9">
        <div className="flex items-center gap-4 border-b border-line pb-5">
          <img src="/assets/crest-md.png" alt="" className="h-14 w-auto" />
          <div className="leading-tight">
            <div className="text-[11.7px] font-semibold uppercase tracking-[0.14em]">Questura IPRP</div>
            <div className="text-xs text-muted">Ricevuta di presentazione</div>
          </div>
          <span className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-ok/15 text-ok">
            <Icon name="check" size={20} />
          </span>
        </div>
        <div className="pt-6 text-sm text-muted">Codice pratica</div>
        <div className="mt-1 select-all break-all font-mono text-3xl font-semibold tracking-wider text-fg sm:text-4xl">#{code}</div>
        <dl className="mt-6 divide-y divide-line border-y border-line text-[13.5px]">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-muted">Pratica</dt>
            <dd className="font-medium">{form.title}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-muted">Presentata il</dt>
            <dd className="font-medium">{when}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-muted">Stato</dt>
            <dd className="font-medium text-link">Ricevuta</dd>
          </div>
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-muted">Conserva questo codice: ti serve per verificare lo stato della pratica in qualsiasi momento.</p>
        <div className="no-print mt-6 flex flex-wrap gap-3">
          <Btn as="button" type="button" variant="outline" iconStart="copy" onClick={copy}>
            {copied ? 'Copiato' : 'Copia codice'}
          </Btn>
          <Btn as="button" type="button" variant="outline" iconStart="printer" onClick={() => window.print()}>
            Stampa
          </Btn>
          <Btn as={Link} href={`/sportello/pratica?codice=${code}`} icon="arrow-right">
            Verifica lo stato
          </Btn>
        </div>
      </div>
      <button type="button" onClick={onReset} className="no-print mt-5 block w-full text-center text-sm font-medium text-link hover:underline">
        Invia un’altra richiesta
      </button>
    </div>
  );
}

// Passi del modulo: ogni passo raggruppa una o più sezioni della definizione.
const STEP_DEFS = {
  denuncia: [
    { title: 'Il personaggio', sections: ['Dati del querelante'] },
    { title: 'I fatti', sections: ['I fatti', 'Testimoni e prove'] },
    { title: 'Conferma', sections: ['Dichiarazioni'], summary: true },
  ],
  pda: [
    { title: 'Richiesta e dati', sections: ['Tipo di richiesta', 'Dati anagrafici'] },
    { title: 'Motivazione', sections: ['Motivazione'] },
    { title: 'Conferma', sections: ['Dichiarazioni'], summary: true },
  ],
  colloquio: [
    { title: 'I tuoi dati', sections: ['Dati del richiedente'] },
    { title: 'Appuntamento', sections: ["L'appuntamento"] },
    { title: 'Conferma', sections: [], summary: true },
  ],
};

function fmtValue(field, v) {
  if (field.type === 'checkbox') return v ? 'Sì' : 'No';
  if (field.type === 'datetime' && v) return new Date(v).toLocaleString('it-IT', { dateStyle: 'medium', timeStyle: 'short' });
  if (field.type === 'date' && v) return new Date(v + 'T12:00:00').toLocaleDateString('it-IT', { dateStyle: 'medium' });
  return String(v || '').trim() || '—';
}

export function SportelloForm({ formId }) {
  const form = FORMS[formId];
  const steps = STEP_DEFS[formId];
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(() => emptyValues(formId));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');
  const [code, setCode] = useState(null);
  const formRef = useRef(null);
  const topRef = useRef(null);
  const cfg = useSportelloConfig();
  const siteKey = cfg && cfg.turnstileSiteKey;
  const googleId = cfg && cfg.googleClientId;
  const [gUser, setGUser] = useState(null);
  useEffect(() => setGUser(getGoogleUser()), []);
  const [tsToken, setTsToken] = useState('');

  const sectionsOf = (i) => form.sections.filter((sec) => steps[i].sections.includes(sec.title));
  const fieldsOf = (i) => sectionsOf(i).flatMap((sec) => sec.fields);
  const cur = steps[step];
  const last = step === steps.length - 1;

  function setError(name, msg) {
    setErrors((e) => {
      const next = { ...e };
      if (msg) next[name] = msg;
      else delete next[name];
      return next;
    });
  }

  function onChange(field, v) {
    const next = { ...values, [field.name]: v };
    setValues(next);
    if (touched[field.name] || errors[field.name]) setError(field.name, validateField(field, v, next));
    // un campo che ne mostra un altro (es. "Altro") può invalidare i dipendenti
    for (const sec of form.sections) for (const f of sec.fields) if (f.showWhen && f.showWhen.field === field.name && !isVisible(f, next)) setError(f.name, null);
  }

  function onBlur(field, v) {
    setTouched((t) => ({ ...t, [field.name]: true }));
    setError(field.name, validateField(field, v !== undefined ? v : values[field.name], v !== undefined ? { ...values, [field.name]: v } : values));
  }

  function focusTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function focusField(name) {
    const el = formRef.current && formRef.current.querySelector(`[name="${name}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus({ preventScroll: true });
    }
  }

  // Controlla i campi di un passo; ritorna il primo errore (se c'è).
  function checkStep(i) {
    const errs = {};
    for (const f of fieldsOf(i)) {
      if (!isVisible(f, values)) continue;
      const e = validateField(f, values[f.name], values);
      if (e) errs[f.name] = e;
    }
    setErrors((prev) => {
      const next = { ...prev };
      for (const f of fieldsOf(i)) delete next[f.name];
      return { ...next, ...errs };
    });
    return Object.keys(errs)[0] || null;
  }

  function next() {
    const bad = checkStep(step);
    if (bad) {
      setTimeout(() => focusField(bad), 30);
      return;
    }
    setStep((x) => x + 1);
    setTimeout(focusTop, 30);
  }

  function back() {
    setStep((x) => Math.max(0, x - 1));
    setTimeout(focusTop, 30);
  }

  async function submit() {
    setServerError('');
    const { errors: errs } = validate(formId, values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      // torna al passo che contiene il primo errore
      const idx = steps.findIndex((_, i) => fieldsOf(i).some((f) => f.name === first));
      if (idx !== step) setStep(idx);
      setTimeout(() => focusField(first), 120);
      return;
    }
    if (siteKey && !tsToken) {
      setServerError('Completa la verifica anti-bot qui sopra prima di inviare.');
      return;
    }
    setSending(true);
    try {
      const data = await inviaPratica(formId, { ...values, website: formRef.current.elements.website.value, turnstile: tsToken, googleToken: gUser ? gUser.token : undefined });
      savePratica(data.code, formId);
      setCode(data.code);
      setTimeout(focusTop, 30);
    } catch (err) {
      if (err instanceof SubmitError && err.needLogin) {
        clearGoogleUser();
        setGUser(null);
      }
      if (err instanceof SubmitError && err.fields) setErrors(err.fields);
      setServerError(err.message || 'Invio non riuscito.');
    } finally {
      setSending(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (last) submit();
    else next();
  }

  if (code) {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <Receipt
          form={form}
          code={code}
          onReset={() => {
            setCode(null);
            setStep(0);
            setValues(emptyValues(formId));
            setTouched({});
            setErrors({});
          }}
        />
      </div>
    );
  }

  if (cfg === null) return <p className="py-10 text-sm text-muted">Caricamento…</p>;
  if (googleId && !gUser) return <GoogleGate clientId={googleId} onLogin={setGUser} />;

  const recap = form.sections
    .flatMap((sec) => sec.fields)
    .filter((f) => f.type !== 'checkbox' && f.embed !== false && isVisible(f, values));

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      <div ref={topRef} className="scroll-mt-28" />
      {googleId && gUser ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-full border border-line py-2 pl-3 pr-4 text-sm">
          <span className="flex min-w-0 items-center gap-2.5">
            {gUser.picture ? <img src={gUser.picture} alt="" referrerPolicy="no-referrer" className="h-7 w-7 rounded-full" /> : <Icon name="user" size={18} />}
            <span className="truncate">
              Accesso come <strong className="font-medium">{gUser.name || gUser.email}</strong> <span className="text-muted">· {gUser.email}</span>
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              clearGoogleUser();
              setGUser(null);
            }}
            className="text-muted transition hover:text-fg"
          >
            Esci
          </button>
        </div>
      ) : null}
      <div className="mb-7">
        <div className="mb-3 flex items-baseline justify-between text-sm">
          <span className="font-medium">
            Passo {step + 1} di {steps.length} <span className="text-muted">· {cur.title}</span>
          </span>
          <span className="text-muted">{form.title}</span>
        </div>
        <div className="flex gap-2" aria-hidden="true">
          {steps.map((st, i) => (
            <span key={st.title} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-fg' : 'bg-line'}`} />
          ))}
        </div>
      </div>

      <div key={step} className="hero-in rounded-2xl border border-line bg-surface p-6 sm:p-8" style={{ '--d': '0ms' }}>
        {cur.summary ? (
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Riepilogo</h2>
            <p className="mt-1 text-sm text-muted">Controlla i dati prima di inviare. Puoi tornare indietro per correggerli.</p>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {recap.map((f) => (
                <div key={f.name} className="grid gap-1 py-3 sm:grid-cols-[220px_1fr] sm:gap-5">
                  <dt className="text-sm text-muted">{f.label.replace(/ — facoltativo| \(facoltativo\)/, '')}</dt>
                  <dd className="whitespace-pre-line break-words text-[13.5px]">{fmtValue(f, values[f.name])}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {sectionsOf(step).map((section, i) => (
          <div key={section.title} className={i > 0 || cur.summary ? 'mt-9 border-t border-line pt-8' : ''}>
            <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
            <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-2">
              {section.fields
                .filter((f) => f.type !== 'checkbox' || cur.summary)
                .filter((f) => isVisible(f, values))
                .map((f) => (
                  <Field key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={onChange} onBlur={onBlur} />
                ))}
            </div>
          </div>
        ))}

        {/* honeypot anti-bot: invisibile agli utenti */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Sito web
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        {last && siteKey ? <TurnstileWidget siteKey={siteKey} onToken={setTsToken} /> : null}

        {serverError ? (
          <Notice tone="bad" title="Non è stato possibile inviare la richiesta" className="mt-6">
            {serverError}
          </Notice>
        ) : null}
        {Object.keys(errors).length > 0 && !serverError ? (
          <Notice tone="warn" className="mt-6">
            Controlla i campi evidenziati.
          </Notice>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {step > 0 ? (
            <Btn as="button" type="button" variant="outline" iconStart="arrow-left" onClick={back}>
              Indietro
            </Btn>
          ) : (
            <p className="text-sm text-muted">I campi con * sono obbligatori.</p>
          )}
          <Btn as="button" type="submit" size="lg" disabled={sending} icon={sending ? undefined : 'arrow-right'}>
            {sending ? (
              <>
                <Icon name="loader" size={18} className="animate-spin" /> Invio in corso…
              </>
            ) : last ? (
              form.submitLabel
            ) : (
              'Continua'
            )}
          </Btn>
        </div>
      </div>
    </form>
  );
}
