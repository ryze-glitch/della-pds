import { Container, Notice } from '../ui';
import { Icon } from '../icons';

// Layout comune ai moduli: form a sinistra, box informativo a destra.
export function FormPage({ children, aside }) {
  return (
    <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_320px] lg:gap-14 lg:py-14">
      <div>{children}</div>
      <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        {aside}
        <Notice tone="gold" title="Servizio in-character">
          Questo modulo è parte del gioco di ruolo. Per emergenze reali chiama il <strong>112</strong>.
        </Notice>
      </aside>
    </Container>
  );
}

export function Checklist({ title, items, icon = 'check-circle' }) {
  return (
    <div className="px-1">
      <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">{title}</h2>
      <ul className="mt-3 space-y-2.5 text-[15px] text-fg/90">
        {items.map((t) => (
          <li key={t} className="flex gap-2.5">
            <Icon name={icon} size={17} className="mt-1 flex-none text-link" />
            <span className="leading-snug">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
