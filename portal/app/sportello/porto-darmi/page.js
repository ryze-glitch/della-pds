import { Card, Notice, PageHeader } from '../../../components/ui';
import { Icon } from '../../../components/icons';
import { Checklist, FormPage } from '../../../components/forms/FormPage';
import { SportelloForm } from '../../../components/forms/SportelloForm';
import { TARIFFE_PDA } from '../../../lib/data';

export const metadata = { title: "Porto d'armi (PDA) — Questura IPRP" };

export default function PdaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sportello Cittadino"
        title="Porto d’armi: rilascio e rinnovo"
        text="Richiedi il porto d’armi (PDA) o rinnova quello in scadenza. Le tariffe sono in dollari in-character."
        crumbs={[{ label: 'Sportello Cittadino', href: '/sportello' }, { label: "Porto d'armi" }]}
      />
      <FormPage
        aside={
          <>
            <Card className="overflow-hidden">
              <div className="flex items-center gap-2.5 border-b border-line bg-surface px-5 py-3.5 font-bold">
                <Icon name="wallet" size={18} className="text-link" /> Tariffe (IC)
              </div>
              <ul className="divide-y divide-line">
                {TARIFFE_PDA.map(([t, p, n]) => (
                  <li key={t} className="px-5 py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold">{t}</span>
                      <span className="font-extrabold text-primary">{p}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted">{n}</div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line px-5 py-3 text-xs text-muted">Importi indicativi, fissati dall’amministrazione del server.</div>
            </Card>
            <Checklist
              title="Visita medica"
              icon="stethoscope"
              items={[
                'Prima del rilascio serve il certificato di idoneità psicofisica.',
                'La visita si svolge in-character presso la struttura sanitaria della città.',
                'Porta il certificato in Questura al momento del ritiro.',
              ]}
            />
            <Notice tone="info" title="Requisiti">
              Maggiore età in-character e assenza di precedenti penali.
            </Notice>
          </>
        }
      >
        <SportelloForm formId="pda" />
      </FormPage>
    </>
  );
}
