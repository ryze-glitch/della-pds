import Link from 'next/link';
import { Icon } from './icons';

// Riquadro di contenuto: titolo con icona e freccia, filo sottile, contenuto. Piatto, senza ombre.
export function Widget({ icon, title, href, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-7 ${className}`}>
      <div className="flex items-center justify-between border-b border-line pb-5">
        <h2 className="flex items-center gap-3.5 font-display text-[26px] font-normal leading-none">
          <Icon name={icon} size={24} strokeWidth={1.3} className="text-muted" /> {title}
        </h2>
        {href ? (
          <Link href={href} aria-label={`Apri ${title}`} className="text-muted transition-colors hover:text-white">
            <Icon name="chevron" size={22} />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
