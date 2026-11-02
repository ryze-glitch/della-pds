import Link from 'next/link';
import { Icon } from './icons';
import { Reveal } from './Reveal';

export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Section({ children, className = '', tone = 'plain', id }) {
  const tones = { plain: '', surface: 'bg-accent-soft', primary: 'bg-primary text-primary-fg' };
  return (
    <section id={id} className={`${tones[tone]} ${className}`}>
      <Container className="py-14 md:py-20">{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, className = '' }) {
  return <span className={`label ${className}`}>{children}</span>;
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
  'inline-flex items-center justify-center gap-3 rounded-full border-2 font-extrabold transition-colors duration-200 select-none whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60';
const sizes = { sm: 'min-h-[44px] px-5 text-[15px]', md: 'min-h-[48px] px-7 text-[16px]', lg: 'min-h-[52px] px-8 text-[17px]' };
const variants = {
  primary: 'border-primary bg-primary text-primary-fg hover:border-fg hover:bg-fg',
  gold: 'border-primary bg-primary text-primary-fg hover:border-fg hover:bg-fg',
  outline: 'border-fg bg-transparent text-fg hover:bg-fg hover:text-white',
  light: 'border-white bg-white text-primary hover:border-fg hover:bg-fg hover:text-white',
  'outline-light': 'border-white bg-transparent text-white hover:bg-white hover:text-primary',
  ghost: 'border-transparent text-primary hover:underline',
};

export function Btn({ as: As = 'a', variant = 'primary', size = 'md', icon, iconStart, className = '', children, ...props }) {
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {iconStart ? <Icon name={iconStart} size={19} strokeWidth={2.4} /> : null}
      {children}
      {icon ? <Icon name={icon} size={19} strokeWidth={2.4} /> : null}
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
    bad: 'bg-[#fde6ea] text-[#8a1226]',
  };
  return <span className={`stato ${tones[tone]} ${className}`}>{children}</span>;
}

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function IconTile({ name, tone = 'primary', className = '' }) {
  const tones = { primary: 'bg-accent-soft text-primary', gold: 'bg-accent-soft text-primary', soft: 'bg-[#eceef2] text-muted' };
  return (
    <span className={`inline-flex h-12 w-12 flex-none items-center justify-center rounded-full ${tones[tone]} ${className}`}>
      <Icon name={name} size={22} strokeWidth={2} />
    </span>
  );
}

// Banda blu piena in cima alla pagina: titolo grande in bianco, testo azzurro tenue.
export function PageHeader({ eyebrow, title, text, crumbs = [], children }) {
  return (
    <section className="bg-primary text-white">
      <Container className="pb-12 pt-12 md:pb-16 md:pt-16">
        {crumbs.length ? (
          <nav aria-label="Percorso" className="hero-in mb-5 flex flex-wrap items-center gap-1.5 text-[15px] font-semibold text-on-accent">
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-white hover:underline">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <Icon name="chevron" size={15} />
                {c.href ? (
                  <Link href={c.href} className="inline-flex min-h-[44px] items-center hover:text-white hover:underline">{c.label}</Link>
                ) : (
                  <span className="text-white" aria-current="page">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? <div className="hero-in mb-3 text-[14px] font-bold uppercase tracking-[0.08em] text-on-accent">{eyebrow}</div> : null}
        <h1 className="hero-in h1 max-w-[1000px]" style={{ '--d': '80ms' }}>{title}</h1>
        {text ? <p className="hero-in mt-5 max-w-2xl text-[19px] leading-snug text-on-accent" style={{ '--d': '180ms' }}>{text}</p> : null}
        {children}
      </Container>
    </section>
  );
}

// Avviso: filo blu a sinistra, testo sempre presente.
export function Notice({ tone = 'info', title, children, className = '' }) {
  const tones = { info: 'border-l-primary', warn: 'border-l-warn', gold: 'border-l-primary', bad: 'border-l-bad bg-[#fde6ea]/50' };
  const icons = { info: 'info', warn: 'alert', gold: 'info', bad: 'alert' };
  const iconTone = { info: 'text-primary', warn: 'text-warn', gold: 'text-primary', bad: 'text-bad' };
  return (
    <div role="note" className={`flex gap-3 border-l-4 bg-accent-soft py-4 pl-4 pr-4 text-[15px] leading-relaxed text-muted ${tones[tone]} ${className}`}>
      <Icon name={icons[tone]} size={20} className={`mt-0.5 flex-none ${iconTone[tone]}`} />
      <div>
        {title ? <div className="font-bold text-fg">{title}</div> : null}
        <div className={title ? 'mt-0.5' : ''}>{children}</div>
      </div>
    </div>
  );
}
