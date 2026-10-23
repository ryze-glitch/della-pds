import Link from 'next/link';
import { Icon } from './icons';
import { Reveal } from './Reveal';

export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Section({ children, className = '', tone = 'plain', id }) {
  const tones = { plain: '', surface: 'bg-surface2', primary: 'bg-primary text-primary-fg' };
  return (
    <section id={id} className={`${tones[tone]} ${className}`}>
      <Container className="py-14 md:py-20">{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold ${className}`}>
      <span className="h-px w-6 bg-gold" /> {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title, text, action, className = '' }) {
  return (
    <Reveal className={`mb-9 flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="h2 mt-2">{title}</h2>
        {text ? <p className="mt-3 text-[17px] leading-relaxed text-muted">{text}</p> : null}
      </div>
      {action}
    </Reveal>
  );
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold transition duration-200 select-none hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link disabled:cursor-not-allowed disabled:opacity-60';
const sizes = { sm: 'h-9 px-3.5', md: 'h-11 px-5', lg: 'h-12 px-6 text-[15px]' };
const variants = {
  primary: 'border-primary bg-primary text-primary-fg hover:bg-primary/90',
  gold: 'border-gold bg-gold text-[#1a1405] hover:brightness-105',
  outline: 'border-white/25 bg-transparent text-fg hover:border-white/60 hover:bg-white/5',
  light: 'border-white bg-white text-[#0a1426] hover:bg-white/90',
  'outline-light': 'border-white/40 bg-bg/40 text-white backdrop-blur-sm hover:bg-white/10',
  ghost: 'border-transparent text-link hover:bg-surface2',
};

export function Btn({ as: As = 'a', variant = 'primary', size = 'md', icon, iconStart, className = '', children, ...props }) {
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {iconStart ? <Icon name={iconStart} size={17} /> : null}
      {children}
      {icon ? <Icon name={icon} size={17} /> : null}
    </As>
  );
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'border-line bg-surface2 text-muted',
    gold: 'border-gold/40 bg-gold-soft text-gold-ink',
    ok: 'border-ok/30 bg-ok/10 text-ok',
    bad: 'border-bad/30 bg-bad/10 text-bad',
    warn: 'border-warn/30 bg-warn/10 text-warn',
    blue: 'border-link/30 bg-link/10 text-link',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-[20px] border border-line bg-surface  ${className}`}>{children}</div>;
}

export function IconTile({ name, tone = 'primary', className = '' }) {
  const tones = {
    primary: 'bg-surface2 text-link',
    gold: 'bg-surface2 text-link',
    soft: 'bg-surface2 text-muted',
  };
  return (
    <span className={`inline-flex h-11 w-11 flex-none items-center justify-center rounded-2xl ${tones[tone]} ${className}`}>
      <Icon name={name} size={21} />
    </span>
  );
}

export function PageHeader({ eyebrow, title, text, crumbs = [], children }) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-surface to-bg">
      <Container className="pb-9 pt-36 md:pb-11 md:pt-40">
        <nav aria-label="Percorso" className="hero-in mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link href="/" className="hover:text-fg">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <Icon name="chevron" size={14} />
              {c.href ? (
                <Link href={c.href} className="hover:text-fg">
                  {c.label}
                </Link>
              ) : (
                <span className="text-fg">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="hero-in text-3xl font-semibold leading-tight tracking-tight sm:text-4xl" style={{ '--d': '100ms' }}>
          {title}
        </h1>
        {text ? (
          <p className="hero-in mt-3 max-w-2xl text-[17px] leading-relaxed text-muted" style={{ '--d': '220ms' }}>
            {text}
          </p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}

// Avviso discreto: filo colorato a sinistra, niente blocchi pieni.
export function Notice({ tone = 'info', title, children, className = '' }) {
  const tones = {
    info: 'border-l-link',
    warn: 'border-l-warn',
    gold: 'border-l-gold',
    bad: 'border-l-bad bg-bad/5',
  };
  const icons = { info: 'info', warn: 'alert', gold: 'info', bad: 'alert' };
  const iconTone = { info: 'text-link', warn: 'text-warn', gold: 'text-gold-ink', bad: 'text-bad' };
  return (
    <div role="note" className={`flex gap-3 rounded-r-2xl border-l-[3px] bg-surface/60 py-3.5 pl-4 pr-4 text-sm leading-relaxed text-muted ${tones[tone]} ${className}`}>
      <Icon name={icons[tone]} size={18} className={`mt-0.5 flex-none ${iconTone[tone]}`} />
      <div>
        {title ? <div className="font-medium text-fg">{title}</div> : null}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  );
}
