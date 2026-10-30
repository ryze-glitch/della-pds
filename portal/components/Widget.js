import Link from 'next/link';
import { Icon } from './icons';

// Scheda grande: pannello bianco con angoli molto arrotondati e filo sottile, senza ombre.
export function Widget({ icon, title, href, children, className = '' }) {
  return (
    <section className={`card p-7 sm:p-10 ${className}`}>
      <div className="flex items-center justify-between pb-5">
        <h2 className="flex items-center gap-3 text-[27px] font-normal leading-none tracking-[-0.02em]">
          <Icon name={icon} size={22} strokeWidth={1.3} className="text-fog" /> {title}
        </h2>
        {href ? (
          <Link href={href} aria-label={`Apri ${title}`} className="text-primary transition-opacity hover:opacity-70">
            <Icon name="arrow-right" size={20} strokeWidth={1.4} />
          </Link>
        ) : null}
      </div>
      <div className="border-t border-line">{children}</div>
    </section>
  );
}
