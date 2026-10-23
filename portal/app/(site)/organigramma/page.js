import { Badge, Container, IconTile, PageHeader, Section, SectionHead } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { Reveal } from '../../../components/Reveal';
import { DEPTS, GRADI } from '../../../lib/data';

export const metadata = { title: 'Organigramma — Questura IPRP' };

export default function OrganigrammaPage() {
  return (
    <>
      <PageHeader
        eyebrow="La Questura"
        title="Organigramma"
        text="La struttura della Questura IPRP: la dirigenza, i sei reparti operativi e la scala dei gradi."
        crumbs={[{ label: 'Organigramma' }]}
      />

      <Section>
        <SectionHead eyebrow="Struttura" title="Dirigenza e reparti" />
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mx-auto max-w-sm rounded-2xl border-2 border-gold bg-gold-soft p-5 text-center ">
              <Icon name="crown" size={26} className="mx-auto text-gold-ink" />
              <div className="mt-2 text-lg font-semibold text-primary">Questore</div>
              <div className="text-sm text-muted">Vertice della Questura</div>
            </div>
          </Reveal>
          <div className="mx-auto h-8 w-px bg-line" />
          <div className="relative">
            <div className="absolute left-[8%] right-[8%] top-0 hidden h-px bg-line md:block" />
            <div className="grid gap-4 pt-0 sm:grid-cols-2 md:grid-cols-3 md:pt-6">
              {DEPTS.map((d, i) => (
                <Reveal key={d.name} delay={(i % 3) * 70}>
                  <div className="relative h-full rounded-2xl border border-line bg-surface p-5 ">
                    <span className="absolute -top-6 left-1/2 hidden h-6 w-px bg-line md:block" />
                    <IconTile name={d.icon} />
                    <h3 className="mt-3 font-semibold leading-snug">{d.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHead eyebrow="Carriera" title="La scala dei gradi" text="Otto gradi, dalla prima divisa al vertice della Questura." />
        <ol className="mx-auto max-w-4xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface" aria-label="Gradi in ordine di carriera">
          {[...GRADI].reverse().map(([name, text], i) => {
            const n = GRADI.length - i;
            const top = n === GRADI.length;
            return (
              <li key={name} className={`flex items-start gap-4 p-5 ${top ? 'bg-gold-soft' : ''}`}>
                <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-full border-2 text-sm font-semibold ${top ? 'border-gold bg-gold text-[#1a1405]' : 'border-gold/60 text-gold-ink'}`}>
                  {n}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{name}</h3>
                    {top ? <Badge tone="gold">Vertice</Badge> : null}
                  </div>
                  <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>
    </>
  );
}
