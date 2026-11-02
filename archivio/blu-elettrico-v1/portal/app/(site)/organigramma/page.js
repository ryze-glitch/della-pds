import { Badge, Container, IconTile, PageHeader } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { Reveal } from '../../../components/Reveal';
import { DEPTS, GRADI } from '../../../lib/data';

export const metadata = { title: 'Organigramma — Questura IPRP' };

export default function OrganigrammaPage() {
  const gradi = [...GRADI].reverse();
  return (
    <>
      <PageHeader
        title="Organigramma"
        text="La struttura della Questura IPRP: la dirigenza, i sei reparti operativi e la scala dei gradi."
        crumbs={[{ label: 'Organigramma' }]}
      />
      <Container className="py-10 md:py-14">
        <Reveal>
          <div className="flex items-center gap-5 border-l-[3px] border-gold pl-6">
            <Icon name="crown" size={30} className="flex-none text-gold-ink" />
            <div>
              <div className="text-xl font-semibold">Questore</div>
              <p className="text-[13.5px] text-muted">Al vertice della Questura: definisce le strategie e coordina i sei reparti operativi.</p>
            </div>
          </div>
        </Reveal>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight">Reparti</h2>
        <div className="mt-5 grid gap-x-14 border-t border-line md:grid-cols-2">
          {DEPTS.map((d, i) => (
            <Reveal key={d.name} delay={(i % 2) * 70}>
              <div className="flex gap-4 border-b border-line py-6">
                <IconTile name={d.icon} />
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-gold-ink">{d.tag}</div>
                  <h3 className="mt-0.5 text-lg font-semibold leading-snug">{d.name}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{d.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-semibold tracking-tight">Scala dei gradi</h2>
        <p className="mt-1.5 text-muted">Otto gradi, dalla prima divisa al vertice della Questura.</p>
        <ol className="mt-5 grid gap-x-14 border-t border-line md:grid-cols-2" aria-label="Gradi in ordine di carriera">
          {gradi.map(([name, text], i) => {
            const n = GRADI.length - i;
            return (
              <li key={name} className="flex gap-4 border-b border-line py-5">
                <span className="w-7 flex-none pt-0.5 font-mono text-sm text-gold-ink">{String(n).padStart(2, '0')}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{name}</h3>
                    {n === GRADI.length ? <Badge tone="gold">Vertice</Badge> : null}
                  </div>
                  <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </>
  );
}
