import Link from 'next/link';
import { Icon } from './icons';
import { Reveal, SplitText, Spotlight, SpotCard } from './motion';

export function Section({ children, className = '', id, first = false, variant = 'up' }) {
  return (
    <section id={id} className={`${first ? '' : 'border-t border-line'} ${className}`}>
      <Reveal variant={variant}>
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </Reveal>
    </section>
  );
}

export function Inner({ children, className = '' }) {
  return <div className={`px-5 py-16 md:px-12 md:py-24 ${className}`}>{children}</div>;
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-line2 bg-bg/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur ${className}`}>
      {children}
    </span>
  );
}

export function Mono({ children, className = '' }) {
  return <span className={`font-mono text-xs uppercase tracking-wide text-muted ${className}`}>{children}</span>;
}

const base =
  'group inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-all duration-300 select-none whitespace-nowrap';
const sizes = { md: 'h-10 px-4', lg: 'h-12 px-6 text-base', sm: 'h-8 px-3' };
const variants = {
  primary: 'border-fg bg-fg text-bg hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgb(var(--fg)/0.5)]',
  secondary: 'border-line2 bg-bg text-fg hover:-translate-y-0.5 hover:border-fg',
  ghost: 'border-transparent text-muted hover:text-fg',
};

export function Btn({ as: As = 'a', variant = 'primary', size = 'md', icon, className = '', children, ...props }) {
  return (
    <As className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon ? <Icon name={icon} size={16} className="transition-transform duration-300 group-hover:translate-x-1" /> : null}
    </As>
  );
}

export function SectionHead({ badge, title, text, center = false, children }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {badge ? <Badge>{badge}</Badge> : null}
      <h2 className="h-section mt-4 text-3xl md:text-5xl">
        <SplitText text={title} />
      </h2>
      {text ? <p className="mt-4 text-lg leading-relaxed text-muted">{text}</p> : null}
      {children}
    </div>
  );
}

export function Cells({ children, cols = 'md:grid-cols-3', className = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`stagger -mb-px -mr-px grid ${cols}`}>{children}</div>
    </div>
  );
}

export function Cell({ children, className = '' }) {
  return <div className={`border-b border-r border-line ${className}`}>{children}</div>;
}

export function Marquee({ items, className = '', itemClass = '', speed = 40, sepClass = 'text-accent' }) {
  const row = items.map((t, i) => (
    <span key={i} className={`flex items-center gap-10 px-5 ${itemClass}`}>
      {t}
      <span aria-hidden="true" className={`text-[0.3em] ${sepClass}`}>
        ✱
      </span>
    </span>
  ));
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="marquee-track" style={{ '--mq': `${speed}s` }}>
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
}

export function PageHero({ badge, title, text, children }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />
      <Spotlight />
      <div className="relative mx-auto max-w-[1200px] px-5 pb-20 pt-24 text-center md:px-12 md:pb-32 md:pt-36">
        {badge ? (
          <Reveal afterIntro variant="blur">
            <Badge>{badge}</Badge>
          </Reveal>
        ) : null}
        <h1 className="h-display mx-auto mt-6 max-w-5xl text-5xl sm:text-6xl md:text-[5.5rem]">
          <SplitText text={title} afterIntro baseDelay={100} accentFrom={Math.max(0, title.split(' ').length - 1)} />
        </h1>
        {text ? (
          <Reveal afterIntro variant="blur" delay={500}>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{text}</p>
          </Reveal>
        ) : null}
        {children ? (
          <Reveal afterIntro variant="blur" delay={700}>
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

export function DeptCards({ depts, href = '/reparti', cols = 'md:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <Cells cols={cols}>
      {depts.map((d, i) => (
        <Cell key={d.name}>
          <SpotCard className="h-full">
            <Link href={href} className="group block h-full">
              <div className="relative overflow-hidden">
                <img
                  src={d.img}
                  alt={d.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ objectPosition: d.pos }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
                <span className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-md border border-line2 bg-bg/70 backdrop-blur">
                  <Icon name={d.icon} size={18} />
                </span>
                <span className="absolute right-5 top-5 font-mono text-xs text-fg/70">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="relative p-6">
                <Mono>{d.tag}</Mono>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{d.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{d.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Scopri <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </SpotCard>
        </Cell>
      ))}
    </Cells>
  );
}

export function CtaBox({ title, text, action }) {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <Marquee
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none"
        itemClass="outline-text font-semibold tracking-tighter text-[clamp(6rem,18vw,16rem)] leading-none"
        speed={60}
        sepClass="opacity-0"
        items={['CANDIDATI', 'POLIZIA DI STATO', 'CANDIDATI', 'IPRP']}
      />
      <Reveal variant="scale">
        <div className="relative mx-auto max-w-[1200px] px-5 py-24 text-center md:px-12 md:py-36">
          <h2 className="h-section mx-auto max-w-3xl text-3xl md:text-6xl">{title}</h2>
          {text ? <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{text}</p> : null}
          <div className="mt-9 flex justify-center">{action}</div>
        </div>
      </Reveal>
    </section>
  );
}
