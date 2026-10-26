import Link from 'next/link';
import { Icon } from './icons';

// Riquadro di una pagina "a widget" (stile registro): titolo con icona, freccia, contenuto.
export function Widget({ icon, title, href, children, className = '' }) {
  return (
    <section className={`sh-card rounded-[20px] border border-[color:var(--sh-line)] p-6 ${className}`}>
      <div className="flex items-center justify-between border-b border-[color:var(--sh-line)] pb-4">
        <h2 className="flex items-center gap-3.5 text-[18.9px] font-medium">
          <Icon name={icon} size={28} strokeWidth={1.3} className="text-[color:var(--sh-acc)]" /> {title}
        </h2>
        {href ? (
          <Link href={href} aria-label={`Apri ${title}`} className="text-fg transition hover:text-[color:var(--sh-acc)]">
            <Icon name="chevron" size={22} />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
