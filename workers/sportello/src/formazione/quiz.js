// Logica dei quiz: estrazione, limiti di tentativi, correzione. Funzioni pure (testabili).
import { QUIZ_DEFAULT } from '../../../../portal/lib/formazione.js';

export function configQuiz(modulo) {
  const q = (modulo && modulo.quiz) || {};
  const num = (v, d, min, max) => (Number.isFinite(Number(v)) && Number(v) >= min && Number(v) <= max ? Math.floor(Number(v)) : d);
  return {
    soglia: num(q.soglia, QUIZ_DEFAULT.soglia, 1, 100),
    domande: num(q.domande, QUIZ_DEFAULT.domande, 1, 100),
    maxTentativi: num(q.maxTentativi, QUIZ_DEFAULT.maxTentativi, 1, 50),
    attesaMinuti: num(q.attesaMinuti, QUIZ_DEFAULT.attesaMinuti, 0, 10080),
    durataMinuti: num(q.durataMinuti, QUIZ_DEFAULT.durataMinuti, 1, 240),
  };
}

// Mescolamento Fisher-Yates con generatore iniettabile (rng() in [0,1)).
export function mescola(lista, rng = Math.random) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function estrai(pool, n, rng = Math.random) {
  return mescola(pool, rng).slice(0, Math.min(n, pool.length));
}

// Il browser riceve solo id, testo e opzioni (mescolate): MAI la risposta corretta né la spiegazione.
export function perIlBrowser(domanda, rng = Math.random) {
  return {
    id: domanda.id,
    tipo: domanda.tipo || 'standard',
    testo: domanda.testo,
    opzioni: mescola(domanda.opzioni, rng).map((o) => ({ id: o.id, testo: o.testo })),
  };
}

// Può iniziare un nuovo tentativo? `tentativi` = tentativi consegnati/avviati dell'allievo per quel modulo.
export function puoTentare(tentativi, cfg, ora) {
  const conclusi = tentativi.filter((t) => t.consegnatoIl || t.scaduto);
  const usati = tentativi.length;
  if (tentativi.some((t) => t.esito === 'superato')) return { ok: false, motivo: 'gia_superato' };
  if (usati >= cfg.maxTentativi) return { ok: false, motivo: 'tentativi_esauriti' };
  const aperto = tentativi.find((t) => !t.consegnatoIl && !t.scaduto && ora < t.scadeIl);
  if (aperto) return { ok: true, riprendi: aperto };
  const ultimo = conclusi.sort((a, b) => b.consegnatoIl - a.consegnatoIl)[0];
  if (ultimo && cfg.attesaMinuti > 0) {
    const fine = ultimo.consegnatoIl + cfg.attesaMinuti * 60000;
    if (ora < fine) return { ok: false, motivo: 'attesa', riprovaTra: Math.ceil((fine - ora) / 1000) };
  }
  return { ok: true };
}

// Correzione: `risposte` = { domandaId: opzioneId }. Una domanda senza risposta è sbagliata.
export function correggi(domande, risposte, soglia) {
  let giuste = 0;
  const errori = [];
  for (const d of domande) {
    const scelta = risposte && Object.prototype.hasOwnProperty.call(risposte, d.id) ? risposte[d.id] : null;
    if (scelta === d.corretta) {
      giuste++;
    } else {
      const giusta = d.opzioni.find((o) => o.id === d.corretta);
      const data = d.opzioni.find((o) => o.id === scelta);
      errori.push({
        domandaId: d.id,
        testo: d.testo,
        scelta: data ? data.testo : null,
        corretta: giusta ? giusta.testo : null,
        spiegazione: d.spiegazione || '',
      });
    }
  }
  const totale = domande.length;
  const punteggio = totale ? Math.round((giuste / totale) * 100) : 0;
  return { giuste, totale, punteggio, esito: punteggio >= soglia ? 'superato' : 'non_superato', errori };
}
