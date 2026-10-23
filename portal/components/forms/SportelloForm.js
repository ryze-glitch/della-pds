'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '../icons';
import { Btn, Card, Notice } from '../ui';
import { FORMS, emptyValues, isVisible, validate, validateField } from '../../lib/forms';
import { inviaPratica, SubmitError } from '../../lib/sportello';

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
        <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-[15px] leading-snug transition ${error ? 'border-bad bg-bad/5' : 'border-line hover:bg-surface2'}`}>
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
  if (field.type === 'select') {
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
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {field.label}
        {field.required ? <span className="text-bad"> *</span> : null}
      </label>
      {control}
      <div className="mt-1.5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {field.hint ? (
            <p id={`${id}-hint`} className="text-[13px] leading-snug text-muted">
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
    <Card className="overflow-hidden">
      <div className="gold-rule" />
      <div className="p-6 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok/15 text-ok">
          <Icon name="check-circle" size={30} />
        </span>
        <h2 className="h2 mt-5">Richiesta inviata</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          La tua pratica ({form.title.toLowerCase()}) è stata trasmessa alla Questura. Conserva il codice: ti serve per
          verificarne lo stato.
        </p>
        <div className="mx-auto mt-7 max-w-md rounded-2xl border-2 border-dashed border-gold bg-gold-soft px-4 py-5">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">Codice pratica</div>
          <div className="mt-1 select-all break-all text-2xl font-semibold tracking-wider text-primary sm:text-3xl">#{code}</div>
        </div>
        <div className="no-print mt-7 flex flex-wrap justify-center gap-3">
          <Btn as="button" type="button" variant="outline" iconStart="copy" onClick={copy}>
            {copied ? 'Copiato' : 'Copia codice'}
          </Btn>
          <Btn as="button" type="button" variant="outline" iconStart="printer" onClick={() => window.print()}>
            Stampa ricevuta
          </Btn>
          <Btn as={Link} href={`/sportello/pratica?codice=${code}`} icon="arrow-right">
            Verifica lo stato
          </Btn>
        </div>
        <button type="button" onClick={onReset} className="no-print mt-6 text-sm font-medium text-link hover:underline">
          Invia un’altra richiesta
        </button>
      </div>
    </Card>
  );
}

export function SportelloForm({ formId }) {
  const form = FORMS[formId];
  const [values, setValues] = useState(() => emptyValues(formId));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');
  const [code, setCode] = useState(null);
  const formRef = useRef(null);

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
    for (const s of form.sections) for (const f of s.fields) if (f.showWhen && f.showWhen.field === field.name && !isVisible(f, next)) setError(f.name, null);
  }

  function onBlur(field) {
    setTouched((t) => ({ ...t, [field.name]: true }));
    setError(field.name, validateField(field, values[field.name], values));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');
    const { errors: errs } = validate(formId, values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      const el = formRef.current && formRef.current.querySelector(`[name="${first}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
      }
      return;
    }
    setSending(true);
    try {
      const data = await inviaPratica(formId, { ...values, website: formRef.current.elements.website.value });
      setCode(data.code);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err instanceof SubmitError && err.fields) setErrors(err.fields);
      setServerError(err.message || 'Invio non riuscito.');
    } finally {
      setSending(false);
    }
  }

  if (code) {
    return (
      <Receipt
        form={form}
        code={code}
        onReset={() => {
          setCode(null);
          setValues(emptyValues(formId));
          setTouched({});
          setErrors({});
        }}
      />
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      {form.sections.map((section, i) => (
        <Card key={section.title} className="p-5 sm:p-7">
          <h2 className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[13px] text-primary-fg">{i + 1}</span>
            {section.title}
          </h2>
          <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-2">
            {section.fields
              .filter((f) => isVisible(f, values))
              .map((f) => (
                <Field key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={onChange} onBlur={onBlur} />
              ))}
          </div>
        </Card>
      ))}

      {/* honeypot anti-bot: invisibile agli utenti */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Sito web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {serverError ? <Notice tone="bad" title="Non è stato possibile inviare la richiesta">{serverError}</Notice> : null}
      {Object.keys(errors).length > 0 && !serverError ? (
        <Notice tone="warn">Controlla i campi evidenziati prima di inviare.</Notice>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">I campi contrassegnati con * sono obbligatori.</p>
        <Btn as="button" type="submit" size="lg" disabled={sending} icon={sending ? undefined : 'arrow-right'}>
          {sending ? (
            <>
              <Icon name="loader" size={18} className="animate-spin" /> Invio in corso…
            </>
          ) : (
            form.submitLabel
          )}
        </Btn>
      </div>
    </form>
  );
}
