import Link from 'next/link';
import { Icon } from './icons';

// Sezione a righe: filo nero in alto, titolo in maiuscolo piccolo, contenuto senza scheda.
export function Widget({ icon, title, href, children, className = '' }) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between border-t-2 border-fg pb-2 pt-5">
        <h2 className="label flex items-center gap-2.5">
          {icon ? <Icon name={icon} size={18} strokeWidth={2.2} /> : null} {title}
        </h2>
        {href ? (
          <Link href={href} aria-label={`Apri ${title}`} className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent-soft">
            <Icon name="arrow-right" size={22} strokeWidth={2.4} />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
