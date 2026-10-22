import { Container, Notice } from '../ui';
import { Icon } from '../icons';

// Layout comune ai moduli: form a sinistra, box informativo a destra.
export function FormPage({ children, aside }) {
  return (
    <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_340px] lg:gap-10 lg:py-14">
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
    <div className="rounded-lg border border-line bg-surface p-5">
      <h2 className="font-bold">{title}</h2>
      <ul className="mt-3 space-y-2.5 text-[15px]">
        {items.map((t) => (
          <li key={t} className="flex gap-2.5">
            <Icon name={icon} size={18} className="mt-0.5 flex-none text-link" />
            <span className="leading-snug">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
