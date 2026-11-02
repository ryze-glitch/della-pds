import Link from 'next/link';
import { Icon } from './icons';

// Scheda scura: titolo con icona e freccia, contenuto sotto. Piatta, senza ombre.
export function Widget({ icon, title, href, children, className = '' }) {
  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between pb-3">
        <h2 className="flex items-center gap-3 text-[20px] font-semibold tracking-[-0.01em]">
          {icon ? <Icon name={icon} size={22} strokeWidth={1.7} className="text-muted" /> : null} {title}
        </h2>
        {href ? (
          <Link href={href} aria-label={`Apri ${title}`} className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10">
            <Icon name="chevron" size={22} strokeWidth={2} />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
