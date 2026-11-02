import Link from 'next/link';
import { Icon } from './icons';
import { Reveal } from './Reveal';

export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full px-5 ${className}`}>{children}</div>;
}

export function Section({ children, className = '', id }) {
  return (
    <section id={id} className={className}>
      <Container className="py-8">{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, className = '' }) {
  return <span className={`label ${className}`}>{children}</span>;
}

export function SectionHead({ eyebrow, title, text, action, className = '' }) {
  return (
    <Reveal className={`mb-6 flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="h2 mt-2">{title}</h2>
        {text ? <p className="mt-3 text-[17px] leading-relaxed text-muted">{text}</p> : null}
      </div>
      {action}
    </Reveal>
  );
}

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-full text-[16px] font-medium transition-colors duration-200 select-none whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60';
const sizes = { sm: 'min-h-[44px] px-5 text-[15px]', md: 'min-h-[52px] px-7', lg: 'min-h-[58px] px-8 text-[17px]' };
const variants = {
  primary: 'bg-white text-black hover:bg-white/85',
  gold: 'bg-white text-black hover:bg-white/85',
  outline: 'bg-surface2 text-white hover:bg-white/15',
  light: 'bg-white text-black hover:bg-white/85',
  'outline-light': 'bg-surface2 text-white hover:bg-white/15',
  ghost: 'text-link hover:underline',
};

export function Btn({ as: As = 'a', variant = 'primary', size = 'md', icon, iconStart, className = '', children, ...props }) {
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {iconStart ? <Icon name={iconStart} size={19} strokeWidth={2} /> : null}
      {children}
      {icon ? <Icon name={icon} size={19} strokeWidth={2} /> : null}
    </As>
  );
}

// Pillola di stato: il testo dice sempre lo stato (il colore non è mai l'unico segnale).
export function Badge({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'stato-grigio',
    gold: 'stato-corso',
    blue: 'stato-corso',
    ok: 'stato-ok',
    warn: 'stato-ambra',
    bad: 'bg-[#ff6b7d]/15 text-[#ff9aa8]',
  };
  return <span className={`stato ${tones[tone]} ${className}`}>{children}</span>;
}

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function IconTile({ name, tone = 'primary', className = '' }) {
  return (
    <span className={`inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-surface2 text-white ${className}`}>
      <Icon name={name} size={22} strokeWidth={1.7} />
    </span>
  );
}

// Testata di pagina: titolo grande in bianco e testo secondario, sopra la dissolvenza blu.
export function PageHeader({ eyebrow, title, text, crumbs = [], children }) {
  return (
    <section className="px-5 pb-6 pt-4">
      {crumbs.length ? (
        <nav aria-label="Percorso" className="hero-in mb-3 flex flex-wrap items-center gap-1 text-[14px] text-white/75">
          <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-white hover:underline">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <Icon name="chevron" size={14} />
              {c.href ? (
                <Link href={c.href} className="inline-flex min-h-[44px] items-center hover:text-white hover:underline">{c.label}</Link>
              ) : (
                <span className="text-white" aria-current="page">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}
      {eyebrow ? <div className="hero-in mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-white/75">{eyebrow}</div> : null}
      <h1 className="hero-in h1" style={{ '--d': '80ms' }}>{title}</h1>
      {text ? <p className="hero-in mt-3 text-[17px] leading-snug text-white/80" style={{ '--d': '160ms' }}>{text}</p> : null}
      {children}
    </section>
  );
}

// Avviso: scheda scura con icona; il testo c'è sempre.
export function Notice({ tone = 'info', title, children, className = '' }) {
  const icons = { info: 'info', warn: 'alert', gold: 'info', bad: 'alert' };
  const iconTone = { info: 'text-link', warn: 'text-warn', gold: 'text-link', bad: 'text-bad' };
  return (
    <div role="note" className={`flex gap-3 rounded-[20px] bg-surface p-4 text-[15px] leading-relaxed text-muted ${className}`}>
      <Icon name={icons[tone]} size={20} className={`mt-0.5 flex-none ${iconTone[tone]}`} />
      <div>
        {title ? <div className="font-semibold text-white">{title}</div> : null}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  );
}
