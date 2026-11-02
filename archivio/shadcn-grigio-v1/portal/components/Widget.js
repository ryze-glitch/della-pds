import Link from 'next/link';
import { Icon } from './icons';

// Scheda: carta bianca, bordo sottile, ombra appena percettibile.
export function Widget({ icon, title, href, children, className = '' }) {
  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between pb-4">
        <h2 className="flex items-center gap-2.5 text-[18px] font-medium tracking-[-0.025em]">
          <Icon name={icon} size={20} strokeWidth={1.6} className="text-muted" /> {title}
        </h2>
        {href ? (
          <Link href={href} aria-label={`Apri ${title}`} className="rounded-full p-1 text-muted transition-colors hover:bg-black/5 hover:text-fg">
            <Icon name="chevron" size={18} />
          </Link>
        ) : null}
      </div>
      <div className="border-t border-line">{children}</div>
    </section>
  );
}
