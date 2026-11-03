'use client';

import { useEffect, useMemo, useState } from 'react';
import { arrayUnion, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { Avatar, Button, Card, CardBody, CardHeader, Chip, Divider, Input, Listbox, ListboxItem, Progress, Select, SelectItem, Tab, Tabs, Textarea } from '@heroui/react';
import { Icon } from './icons';
import { db } from '../lib/firebase';
import { logAggiornamento } from '../lib/logAgente';
import { STATI, TIPI_PRATICA } from '../lib/data';

const COLORE = { ricevuta: 'primary', in_lavorazione: 'warning', in_attesa: 'secondary', conclusa: 'success', respinta: 'danger' };
const PASSI = ['ricevuta', 'in_lavorazione', 'in_attesa', 'conclusa'];

function fmt(ts) {
  try {
    return ts && ts.toDate ? ts.toDate().toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  } catch (e) {
    return '—';
  }
}

function giorniFermaDi(p) {
  const last = (p.aggiornamenti && p.aggiornamenti.length ? p.aggiornamenti[p.aggiornamenti.length - 1].data : null) || p.aggiornatoIl || p.creatoIl;
  const lastMs = last && last.toDate ? last.toDate().getTime() : last && last.seconds ? last.seconds * 1000 : null;
  const aperta = ['ricevuta', 'in_lavorazione', 'in_attesa'].includes(p.stato);
  return aperta && lastMs ? Math.floor((Date.now() - lastMs) / 86400000) : 0;
}

const StatoChip = ({ k, size = 'sm' }) => (
  <Chip size={size} variant="flat" color={COLORE[k] || 'default'}>
    {(STATI[k] || STATI.ricevuta).label}
  </Chip>
);

function Dettaglio({ p, agent, onSaved }) {
  const [stato, setStato] = useState(p.stato);
  const [nota, setNota] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const dirty = stato !== p.stato || nota.trim() !== '';
  const ferma = giorniFermaDi(p);
  const idx = PASSI.indexOf(p.stato);
  const storico = (p.aggiornamenti || []).slice().reverse();

  async function save(opts = {}) {
    setSaving(true);
    setErr('');
    const nome = `${agent.nome} ${agent.cognome}`.trim();
    const nuovoStato = opts.stato || stato;
    try {
      const update = {
        stato: nuovoStato,
        aggiornatoIl: serverTimestamp(),
        aggiornamenti: arrayUnion({ stato: nuovoStato, nota: nota.trim().slice(0, 300), data: Timestamp.now(), agente: nome }),
      };
      if (opts.assegna) update.assegnataA = nome;
      await updateDoc(doc(db, 'pratiche', p.id), update);
      logAggiornamento({ code: p.id, stato: nuovoStato, nota: nota.trim(), assegnataA: opts.assegna ? nome : p.assegnataA });
      setStato(nuovoStato);
      onSaved(p.id, nuovoStato, nota.trim(), opts.assegna ? nome : undefined, nome);
      setNota('');
    } catch (e) {
      console.error(e);
      setErr('Salvataggio non riuscito.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card shadow="none" className="border border-white/10 bg-content1/40">
      <CardHeader className="flex-col items-start gap-1 p-6 pb-2">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-lg font-semibold tracking-wide text-primary">#{p.id}</p>
          <div className="flex flex-wrap items-center gap-2">
            {ferma >= 2 ? <Chip size="sm" variant="dot" color="warning">Ferma da {ferma} giorni</Chip> : null}
            <StatoChip k={p.stato} size="md" />
          </div>
        </div>
        <p className="text-sm text-default-500">
          {TIPI_PRATICA[p.tipo] || p.tipo} · ricevuta il {fmt(p.creatoIl)}
        </p>
      </CardHeader>
      <CardBody className="gap-6 p-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-default-500">Avanzamento</p>
          {p.stato === 'respinta' ? (
            <p className="text-sm text-danger">La pratica è stata respinta.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {PASSI.map((k, i) => (
                <div key={k} className="flex flex-col gap-2">
                  <Progress aria-label={STATI[k].label} size="sm" value={i <= idx ? 100 : 0} color={i <= idx ? 'primary' : 'default'} />
                  <p className={`text-xs ${i <= idx ? 'text-foreground' : 'text-default-400'}`}>{STATI[k].label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Stato" selectedKeys={[stato]} onSelectionChange={(k) => setStato([...k][0] || stato)} disallowEmptySelection variant="bordered" radius="lg">
            {Object.entries(STATI).map(([k, v]) => (
              <SelectItem key={k}>{v.label}</SelectItem>
            ))}
          </Select>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 p-3">
            <Avatar name={(p.assegnataA || 'NA').split(' ').map((x) => x[0]).join('').slice(0, 2)} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-default-500">In carico a</p>
              <p className="truncate text-sm font-semibold">{p.assegnataA || 'Nessuno'}</p>
            </div>
            {p.stato === 'ricevuta' && !p.assegnataA ? (
              <Button size="sm" color="primary" radius="full" isDisabled={saving} onPress={() => save({ stato: 'in_lavorazione', assegna: true })}>
                Prendi in carico
              </Button>
            ) : null}
          </div>
        </div>

        <Textarea label="Nota visibile al cittadino" placeholder="Scrivi un aggiornamento (facoltativo)" value={nota} onValueChange={setNota} maxLength={300} variant="bordered" radius="lg" minRows={3} />
        {err ? <p className="text-sm text-danger">{err}</p> : null}
        <div className="flex justify-end gap-3">
          <Button variant="light" radius="full" isDisabled={!dirty || saving} onPress={() => { setStato(p.stato); setNota(''); }}>
            Annulla
          </Button>
          <Button color="primary" radius="full" className="font-semibold" isDisabled={!dirty || saving} isLoading={saving} onPress={() => save()}>
            Aggiorna pratica
          </Button>
        </div>

        {storico.length ? (
          <>
            <Divider />
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-default-500">Storico</p>
              <ol className="flex flex-col gap-3">
                {storico.map((a, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-primary" />
                    <div className="min-w-0">
                      <p className="text-sm">
                        <StatoChip k={a.stato} /> {a.agente ? <span className="text-default-500">· {a.agente}</span> : null} <span className="text-xs text-default-400">· {fmt(a.data)}</span>
                      </p>
                      {a.nota ? <p className="mt-1 break-words text-sm text-default-500">{a.nota}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : null}
      </CardBody>
    </Card>
  );
}

export function PraticheView({ authLoading, profile, discordId, demoItems }) {
  const [items, setItems] = useState(demoItems || []);
  const [state, setState] = useState({ loaded: !!demoItems, error: '' });
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('tutte');
  const [filtroStato, setFiltroStato] = useState('tutti');
  const [sel, setSel] = useState('');

  useEffect(() => {
    if (demoItems || authLoading || !profile) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'pratiche'), orderBy('creatoIl', 'desc'), limit(150)));
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setState({ loaded: true, error: '' });
      } catch (e) {
        console.error(e);
        setState({ loaded: false, error: 'Impossibile caricare le pratiche.' });
      }
    })();
  }, [authLoading, profile]);

  const agent = profile ? { discordId, nome: profile.nome || '', cognome: profile.cognome || '' } : null;
  const filtered = useMemo(() => {
    const t = q.trim().toUpperCase().replace('#', '');
    return items.filter((p) => (tipo === 'tutte' || p.tipo === tipo) && (filtroStato === 'tutti' || p.stato === filtroStato) && (!t || p.id.includes(t)));
  }, [items, q, tipo, filtroStato]);
  const corrente = filtered.find((p) => p.id === sel) || filtered[0] || null;

  function onSaved(id, stato, nota, assegnataA, agente) {
    setItems((list) => list.map((p) => (p.id === id ? { ...p, stato, assegnataA: assegnataA || p.assegnataA, aggiornamenti: [...(p.aggiornamenti || []), { stato, nota, agente, data: Timestamp.now() }] } : p)));
  }

  function scegli(id) {
    setSel(id);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setTimeout(() => document.getElementById('dettaglio-pratica')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 md:py-10">
      <h1 className="text-3xl font-bold">Gestione pratiche</h1>
      <p className="mt-1 max-w-2xl text-sm text-default-500">Seleziona una pratica per vederne il dettaglio e aggiornarla. I dettagli di ogni richiesta sono nei canali Discord della fazione.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input aria-label="Cerca per codice" placeholder="Cerca per codice (es. K7M2QX)" value={q} onValueChange={setQ} variant="bordered" radius="full" startContent={<Icon name="search" size={17} />} classNames={{ input: 'font-mono uppercase placeholder:normal-case placeholder:font-sans' }} className="flex-1" />
        <Select aria-label="Tipo" selectedKeys={[tipo]} onSelectionChange={(k) => setTipo([...k][0] || 'tutte')} disallowEmptySelection variant="bordered" radius="full" className="sm:w-56">
          {[['tutte', 'Tutti i tipi'], ...Object.entries(TIPI_PRATICA)].map(([k, v]) => (
            <SelectItem key={k}>{v}</SelectItem>
          ))}
        </Select>
      </div>

      <Tabs aria-label="Filtra per stato" selectedKey={filtroStato} onSelectionChange={setFiltroStato} variant="underlined" className="mt-3" classNames={{ tabList: 'w-full gap-5 overflow-x-auto border-b border-white/10', cursor: 'bg-primary' }}>
        {[['tutti', 'Tutte'], ...Object.entries(STATI).map(([k, v]) => [k, v.label])].map(([k, label]) => (
          <Tab
            key={k}
            title={
              <div className="flex items-center gap-2 whitespace-nowrap">
                {label}
                {items.length ? <Chip size="sm" variant="flat" color={COLORE[k] || 'default'}>{k === 'tutti' ? items.length : items.filter((p) => p.stato === k).length}</Chip> : null}
              </div>
            }
          />
        ))}
      </Tabs>

      <div className="mt-5">
        {!state.loaded ? (
          <p className={`rounded-2xl border border-white/10 p-6 text-sm ${state.error ? 'text-danger' : 'text-default-500'}`} role="status">
            {state.error || 'Caricamento pratiche…'}
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-white/10 p-6 text-sm text-default-500">Nessuna pratica trovata.</p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
            <Card shadow="none" className="border border-white/10 bg-content1/40 lg:max-h-[calc(100vh-14rem)]">
              <CardBody className="p-2">
                <Listbox
                  aria-label="Pratiche"
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={new Set([corrente ? corrente.id : ''])}
                  onSelectionChange={(k) => { const v = [...k][0]; if (v) scegli(String(v)); }}
                  itemClasses={{ base: 'rounded-2xl p-3 data-[selected=true]:bg-primary/15', description: 'text-default-500' }}
                >
                  {filtered.map((p) => {
                    const ferma = giorniFermaDi(p);
                    return (
                      <ListboxItem
                        key={p.id}
                        textValue={p.id}
                        description={`${TIPI_PRATICA[p.tipo] || p.tipo} · ${fmt(p.creatoIl)}${ferma >= 2 ? ` · ferma da ${ferma} gg` : ''}`}
                        endContent={<StatoChip k={p.stato} />}
                        hideSelectedIcon
                      >
                        <span className="font-mono text-sm">#{p.id}</span>
                      </ListboxItem>
                    );
                  })}
                </Listbox>
              </CardBody>
            </Card>
            <div id="dettaglio-pratica" className="scroll-mt-20">
              {corrente && agent ? <Dettaglio key={corrente.id} p={corrente} agent={agent} onSaved={onSaved} /> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
