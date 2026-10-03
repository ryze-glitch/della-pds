import { Icon } from './icons';

const base =
  'inline-flex items-center justify-center gap-2.5 font-mono text-[13px] font-medium uppercase tracking-[0.08em] transition-colors select-none whitespace-nowrap';

const variants = {
  filled: `${base} bg-primary text-on-primary px-6 py-3.5 hover:opacity-90`,
  outlined: `${base} border border-line-strong text-ink px-6 py-3.5 hover:border-primary hover:text-primary`,
  text: `${base} text-ink px-0 py-2 border-b border-transparent hover:border-ink hover:text-primary`,
  tonal: `${base} border border-primary/40 text-primary px-6 py-3.5 hover:bg-primary-soft`,
};

export function Btn({ as: As = 'a', variant = 'filled', lg = false, iconEnd, iconStart, className = '', children, ...props }) {
  return (
    <As className={`${variants[variant]} ${lg ? 'px-7 py-4 text-sm' : ''} ${className}`} {...props}>
      {iconStart ? <Icon name={iconStart} className="text-base" /> : null}
      {children}
      {iconEnd ? <Icon name={iconEnd} className="text-base" /> : null}
    </As>
  );
}

export function Eyebrow({ n, children }) {
  return (
    <span className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary">
      {n ? <span className="text-ink-dim">{n}</span> : null}
      {children}
    </span>
  );
}

export function Overline({ children }) {
  return <span className="block font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary">{children}</span>;
}

export function Chip({ children, tone = 'default', className = '' }) {
  const tones = {
    default: 'border-line-strong text-ink-dim',
    success: 'border-success/50 text-success',
    pending: 'border-primary/50 text-primary',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`border border-line bg-surface-alt ${className}`}>{children}</div>;
}

export function Section({ children, className = '', tight = false }) {
  return <section className={`py-16 md:py-24 ${tight ? 'pt-0 md:pt-0' : ''} ${className}`}>{children}</section>;
}

export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-container px-6 ${className}`}>{children}</div>;
}

export function Rule({ className = '' }) {
  return <div className={`h-px w-full bg-line ${className}`} />;
}

export function BackHome() {
  return (
    <Container className="pb-8">
      <Btn as="a" href="/" variant="text" iconStart="arrow_back">
        Torna alla Home
      </Btn>
    </Container>
  );
}
