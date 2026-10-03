import { Icon } from './icons';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm tracking-wide transition-colors select-none whitespace-nowrap';

const variants = {
  filled: `${base} bg-primary text-on-primary px-6 py-3 hover:brightness-110`,
  tonal: `${base} bg-primary-soft text-on-primary-soft px-6 py-3 hover:brightness-105`,
  outlined: `${base} border border-line text-ink px-6 py-3 hover:bg-surface-alt`,
  text: `${base} text-primary px-3 py-2 hover:bg-surface-alt`,
};

export function Btn({ as: As = 'a', variant = 'filled', lg = false, iconEnd, iconStart, className = '', children, ...props }) {
  return (
    <As className={`${variants[variant]} ${lg ? 'px-7 py-4 text-base' : ''} ${className}`} {...props}>
      {iconStart ? <Icon name={iconStart} /> : null}
      {children}
      {iconEnd ? <Icon name={iconEnd} /> : null}
    </As>
  );
}

export function Overline({ children }) {
  return <span className="block font-mono text-xs uppercase tracking-[0.1em] text-primary">{children}</span>;
}

export function Chip({ children, tone = 'default', className = '' }) {
  const tones = {
    default: 'bg-surface-alt text-ink-dim',
    success: 'bg-success text-on-success',
    pending: 'bg-primary-soft text-on-primary-soft',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-3xl bg-surface-alt overflow-hidden ${className}`}>{children}</div>;
}

export function Section({ children, className = '', tight = false }) {
  return <section className={`py-16 md:py-24 ${tight ? 'pt-0 md:pt-0' : ''} ${className}`}>{children}</section>;
}

export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-container px-6 ${className}`}>{children}</div>;
}

export function BackHome() {
  return (
    <Container className="pb-8">
      <Btn as="a" href="/" variant="text" iconStart="arrow_back" className="!px-0">
        Torna alla Home
      </Btn>
    </Container>
  );
}
