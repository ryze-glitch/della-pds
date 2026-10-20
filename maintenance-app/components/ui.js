import Link from 'next/link';
import { Icon } from './icons';

export function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-wide px-5 md:px-10 ${className}`}>{children}</div>;
}

export function Label({ children, n, className = '' }) {
  return (
    <span className={`mono inline-flex items-center gap-3 text-xs font-medium ${className}`}>
      {n ? <span className="text-accent">({n})</span> : null}
      {children}
    </span>
  );
}

const base =
  'group inline-flex items-center justify-center gap-3 border-2 font-extrabold uppercase tracking-wide transition-colors select-none whitespace-nowrap';
const sizes = { md: 'px-6 py-3.5 text-sm', lg: 'px-8 py-5 text-base' };
const variants = {
  ink: 'border-ink bg-ink text-paper hover:border-accent hover:bg-accent',
  accent: 'border-accent bg-accent text-white hover:border-ink hover:bg-ink',
  outline: 'border-ink text-ink hover:bg-ink hover:text-paper',
  paper: 'border-paper bg-paper text-ink hover:border-ink hover:bg-ink hover:text-paper',
  'outline-paper': 'border-paper text-paper hover:bg-paper hover:text-ink',
};

export function Btn({ as: As = 'a', variant = 'ink', size = 'md', icon, className = '', children, ...props }) {
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon ? <Icon name={icon} size={size === 'lg' ? 22 : 18} strokeWidth={2.5} /> : null}
    </As>
  );
}

export function SectionTitle({ n, label, title, children, className = '' }) {
  return (
    <div className={`border-t-2 border-ink pt-5 ${className}`}>
      <div className="flex items-center justify-between">
        <Label n={n}>{label}</Label>
      </div>
      {title ? <h2 className="display mt-8 text-[clamp(2.4rem,7vw,7rem)]">{title}</h2> : null}
      {children}
    </div>
  );
}

export function PageHero({ label, title, text, img, pos = 'center', children }) {
  return (
    <section className="border-b-2 border-ink">
      <Container className="pb-12 pt-12 md:pb-16 md:pt-20">
        <Label>{label}</Label>
        <h1 className="display mt-6 text-[clamp(3rem,10.5vw,10.5rem)]">{title}</h1>
        {text ? <p className="mt-8 max-w-3xl text-xl font-medium leading-snug md:text-2xl">{text}</p> : null}
        {children}
      </Container>
      {img ? (
        <div className="border-t-2 border-ink">
          <img src={img} alt="" className="h-[34vh] w-full object-cover md:h-[46vh]" style={{ objectPosition: pos }} />
        </div>
      ) : null}
    </section>
  );
}

export function Marquee({ items, className = '' }) {
  const row = items.map((t) => (
    <span key={t} className="mono flex items-center gap-8 px-4 text-sm font-bold md:text-base">
      {t} <span aria-hidden="true">✱</span>
    </span>
  ));
  return (
    <div className={`overflow-hidden border-y-2 border-ink py-4 ${className}`} aria-hidden="true">
      <div className="marquee-track">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
}

export function DeptRows({ depts, href = '/reparti', cta }) {
  return (
    <ul className="border-t-2 border-ink">
      {depts.map((d, i) => (
        <li key={d.name} className="border-b-2 border-ink">
          <Link
            href={href}
            className="group grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-3 px-1 py-7 transition-colors hover:bg-ink hover:text-paper md:grid-cols-[5rem_1.3fr_1fr_9rem] md:items-center md:px-5 md:py-9"
          >
            <span className="mono text-sm font-bold text-accent group-hover:text-paper">0{i + 1}</span>
            <span>
              <span className="display block text-[clamp(2rem,5vw,4.5rem)]">{d.name}</span>
              <span className="mono mt-3 block text-xs text-mute group-hover:text-paper/70">{d.tag}</span>
            </span>
            <span className="col-span-2 max-w-md text-base leading-snug text-mute group-hover:text-paper/80 md:col-span-1">{d.text}</span>
            <span className="hidden items-center justify-end gap-4 md:flex">
              <img src={d.img} alt="" className="h-16 w-28 object-cover opacity-0 transition-opacity group-hover:opacity-100" style={{ objectPosition: d.pos }} />
              <Icon name="arrow-up-right" size={28} strokeWidth={2.5} />
            </span>
          </Link>
        </li>
      ))}
      {cta}
    </ul>
  );
}

export function CtaBand({ label, title, text, action }) {
  return (
    <section className="border-y-2 border-ink bg-accent text-white">
      <Container className="py-16 md:py-24">
        <Label className="text-white/80">{label}</Label>
        <h2 className="display mt-6 text-[clamp(3rem,10vw,10rem)]">{title}</h2>
        <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          {text ? <p className="max-w-xl text-xl font-medium leading-snug">{text}</p> : <span />}
          {action}
        </div>
      </Container>
    </section>
  );
}
