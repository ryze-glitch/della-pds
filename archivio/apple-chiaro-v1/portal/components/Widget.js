import Link from 'next/link';
import { Icon } from './icons';

// Riquadro di contenuto: titolo con icona e freccia, filo sottile, contenuto. Piatto, senza ombre.
export function Widget({ icon, title, href, children, className = '', tone = 'mist' }) {
  return (
    <section className={`rounded-tile p-7 ${tone === 'white' ? 'bg-white' : 'bg-surface'} ${className}`}>
      <div className="flex items-center justify-between border-b border-line pb-5">
        <h2 className="flex items-center gap-3 text-[24px] font-semibold leading-none tracking-[0.009em]">
          <Icon name={icon} size={24} strokeWidth={1.5} className="text-fg" /> {title}
        </h2>
        {href ? (
          <Link href={href} aria-label={`Apri ${title}`} className="text-link transition-colors hover:text-fg">
            <Icon name="chevron" size={22} />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
