import Link from 'next/link';
import { Icon } from './icons';

export function Cross({ className = '' }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute z-10 h-3 w-3 ${className}`}>
      <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-muted" />
      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-muted" />
    </span>
  );
}

export function Section({ children, className = '', id, first = false }) {
  return (
    <section id={id} className={`relative ${first ? '' : 'border-t border-line'} ${className}`}>
      {first ? null : (
        <>
          <Cross className="-left-1.5 -top-1.5" />
          <Cross className="-right-1.5 -top-1.5" />
        </>
      )}
      {children}
    </section>
  );
}

export function Inner({ children, className = '' }) {
  return <div className={`px-5 py-16 md:px-12 md:py-24 ${className}`}>{children}</div>;
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-line2 bg-bg px-3 py-1 text-xs font-medium text-muted ${className}`}>
      {children}
    </span>
  );
}

export function Mono({ children, className = '' }) {
  return <span className={`font-mono text-xs uppercase tracking-wide text-muted ${className}`}>{children}</span>;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors select-none whitespace-nowrap';
const sizes = { md: 'h-10 px-4', lg: 'h-12 px-6 text-base', sm: 'h-8 px-3' };
const variants = {
  primary: 'border-fg bg-fg text-bg hover:opacity-85',
  secondary: 'border-line2 bg-bg text-fg hover:bg-bg2',
  ghost: 'border-transparent text-muted hover:text-fg',
};

export function Btn({ as: As = 'a', variant = 'primary', size = 'md', icon, className = '', children, ...props }) {
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon ? <Icon name={icon} size={16} /> : null}
    </As>
  );
}

export function SectionHead({ badge, title, text, center = false, children }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {badge ? <Badge>{badge}</Badge> : null}
      <h2 className="h-section mt-4 text-3xl md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-lg leading-relaxed text-muted">{text}</p> : null}
      {children}
    </div>
  );
}

export function Cells({ children, cols = 'md:grid-cols-3', className = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`-mb-px -mr-px grid ${cols}`}>{children}</div>
    </div>
  );
}

export function Cell({ children, className = '' }) {
  return <div className={`border-b border-r border-line ${className}`}>{children}</div>;
}

export function PageHero({ badge, title, text, children }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div className="relative px-5 pb-16 pt-16 text-center md:px-12 md:pb-24 md:pt-28">
        {badge ? <Badge>{badge}</Badge> : null}
        <h1 className="h-display mx-auto mt-6 max-w-4xl text-4xl sm:text-5xl md:text-7xl">{title}</h1>
        {text ? <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{text}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function DeptCards({ depts, href = '/reparti', cols = 'md:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <Cells cols={cols}>
      {depts.map((d, i) => (
        <Cell key={d.name}>
          <Link href={href} className="group block h-full transition-colors hover:bg-bg2">
            <div className="overflow-hidden">
              <img
                src={d.img}
                alt={d.name}
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ objectPosition: d.pos }}
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <Mono>{d.tag}</Mono>
                <Mono>{String(i + 1).padStart(2, '0')}</Mono>
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{d.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{d.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                Scopri <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Cell>
      ))}
    </Cells>
  );
}

export function CtaBox({ title, text, action }) {
  return (
    <Section>
      <div className="relative overflow-hidden px-5 py-20 text-center md:px-12 md:py-28">
        <div
          aria-hidden="true"
          className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />
        <div className="relative">
          <h2 className="h-section mx-auto max-w-3xl text-3xl md:text-5xl">{title}</h2>
          {text ? <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{text}</p> : null}
          <div className="mt-8 flex justify-center">{action}</div>
        </div>
      </div>
    </Section>
  );
}
