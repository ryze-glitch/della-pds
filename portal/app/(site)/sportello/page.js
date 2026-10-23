import Link from 'next/link';
import { Container, IconTile, Notice, PageHeader, Section } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { SERVIZI } from '../../../lib/data';

export const metadata = { title: 'Sportello Cittadino — Questura IPRP' };

export default function SportelloPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sportello Cittadino"
        title="Sportello Telematico"
        text="Denunce, porto d’armi e colloqui con la dirigenza, senza code. Ogni richiesta riceve un codice univoco per il tracciamento."
        crumbs={[{ label: 'Sportello Cittadino' }]}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {SERVIZI.map((s) => (
            <Link key={s.href} href={s.href} className="group flex gap-5 rounded-2xl border border-line bg-surface p-6  transition duration-200 hover:-translate-y-0.5 hover:border-primary hover:">
              <IconTile name={s.icon} className="!h-14 !w-14" />
              <div>
                <h2 className="text-xl font-semibold">{s.title}</h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
                  {s.cta} <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Notice tone="gold" title="Servizio in-character" className="mt-8">
          Lo Sportello fa parte del gioco di ruolo del server Italian Paradise XI. Non usarlo per segnalazioni reali: in
          caso di emergenza reale chiama il <strong>112</strong>.
        </Notice>
      </Section>
    </>
  );
}
