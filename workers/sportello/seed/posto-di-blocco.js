// Corso di esempio: contenuti provvisori, da rivedere. Le domande giuste sono nel campo `corretta`.
const o = (...t) => t.map((testo, i) => ({ id: 'abcd'[i], testo }));

export const CORSO = {
  id: 'posto-di-blocco',
  titolo: 'Posto di blocco e fermo veicolo',
  descrizione: 'Come si imposta un posto di blocco, come si ferma un veicolo in sicurezza e come si gestisce il controllo con il conducente.',
  gradoMinimo: 'Agente',
  richiede: [],
  pubblicato: true,
  abilitazione: { nome: 'Abilitazione posto di blocco', scadenzaMesi: 12 },
  griglia: [
    { id: 'presentazione', titolo: 'Si presenta', descrizione: 'Si identifica con grado e nome e saluta il conducente.' },
    { id: 'motivo', titolo: 'Comunica il motivo del fermo', descrizione: 'Spiega chiaramente perché il veicolo è stato fermato.' },
    { id: 'sicurezza', titolo: 'Gestisce la sicurezza della scena', descrizione: 'Posiziona la volante, usa i dispositivi di segnalazione, tiene la distanza.' },
    { id: 'radio', titolo: 'Usa correttamente la radio', descrizione: 'Comunica targa, posizione e stato del controllo con la Centrale.' },
    { id: 'diritti', titolo: 'Rispetta i diritti del conducente', descrizione: 'Mantiene un tono corretto, spiega le procedure, non eccede.' },
    { id: 'verbale', titolo: 'Chiude il controllo', descrizione: 'Conclude con l’esito (sanzione, avviso o rilascio) e informa il conducente.' },
  ],
};

export const MODULI = [
  {
    id: 'preparazione', ordine: 1, titolo: 'Preparare il posto di blocco',
    blocchi: [
      { tipo: 'testo', testo: 'Un posto di blocco si imposta in un punto con buona visibilità, lontano da curve cieche e dossi, in modo che i conducenti vedano la segnalazione con largo anticipo.' },
      { tipo: 'testo', testo: 'Le volanti vanno posizionate a "V" o in diagonale per proteggere gli agenti. Luci di emergenza accese, coni o strisce chiodate prima del punto di controllo, e almeno due agenti: uno controlla, l’altro copre.' },
      { tipo: 'testo', testo: 'Prima di iniziare comunica alla Centrale il luogo e l’orario di inizio del controllo.' },
    ],
    quiz: { soglia: 70, domande: 5, maxTentativi: 3, attesaMinuti: 30 },
  },
  {
    id: 'fermo-veicolo', ordine: 2, titolo: 'Fermare un veicolo e primo contatto',
    blocchi: [
      { tipo: 'testo', testo: 'Il fermo si segnala con paletta e sirena. Una volta fermo il veicolo, comunica alla Centrale targa, modello e posizione prima di scendere.' },
      { tipo: 'testo', testo: 'Avvicinati dal lato posteriore sinistro, tieni la mano libera e osserva l’interno dell’abitacolo. Presentati con grado e nome, spiega il motivo del fermo e chiedi i documenti.' },
      { tipo: 'testo', testo: 'Resta sempre cortese: il tono corretto riduce i rischi e rispetta i diritti della persona.' },
    ],
    quiz: { soglia: 70, domande: 5, maxTentativi: 3, attesaMinuti: 30 },
  },
  {
    id: 'controllo-esito', ordine: 3, titolo: 'Controllo, alcoltest ed esito',
    blocchi: [
      { tipo: 'testo', testo: 'Se hai motivo di sospettare che il conducente abbia bevuto, puoi richiedere l’alcoltest. Spiega la procedura e chiedi il consenso.' },
      { tipo: 'testo', testo: 'Il rifiuto dell’alcoltest costituisce una violazione: verbalizzalo, informa il conducente delle conseguenze e comunica l’esito alla Centrale.' },
      { tipo: 'testo', testo: 'A fine controllo comunica l’esito (sanzione, avviso, rilascio), restituisci i documenti e libera la scena.' },
    ],
    quiz: { soglia: 70, domande: 5, maxTentativi: 3, attesaMinuti: 30 },
  },
];

// [modulo, id, tipo, testo, opzioni, corretta, spiegazione]
const D = [
  ['preparazione', 'd1', 'standard', 'Dove conviene impostare un posto di blocco?', o('Subito dopo una curva cieca', 'In un tratto con buona visibilità', 'Su un dosso', 'Dentro un tunnel stretto'), 'b', 'Serve ampia visibilità, così i conducenti vedono la segnalazione con anticipo.'],
  ['preparazione', 'd2', 'standard', 'Come si posizionano le volanti?', o('Parallele e distanti', 'A "V" o in diagonale, a protezione degli agenti', 'Una sola, a caso', 'Fuori dalla carreggiata'), 'b', 'La disposizione a V o diagonale protegge gli agenti dal traffico.'],
  ['preparazione', 'd3', 'standard', 'Cosa si comunica alla Centrale prima di iniziare?', o('Niente', 'Luogo e orario di inizio del controllo', 'Solo il numero di agenti', 'Il nome del conducente'), 'b', 'La Centrale deve sapere dove siete e da quando.'],
  ['preparazione', 'd4', 'standard', 'Quanti agenti servono almeno?', o('Uno', 'Due: uno controlla e l’altro copre', 'Tre', 'Nessuno'), 'b', 'Un agente controlla e uno copre.'],
  ['preparazione', 'd5', 'situazionale', 'Sei di notte su una strada buia. Cosa fai per rendere visibile il posto di blocco?', o('Spengo le luci', 'Accendo i lampeggianti e posiziono coni prima del punto di controllo', 'Resto fermo in mezzo alla strada', 'Chiedo ai conducenti di rallentare a voce'), 'b', 'Luci e coni segnalano il blocco con anticipo.'],
  ['fermo-veicolo', 'd6', 'standard', 'Prima di scendere dalla volante cosa comunichi?', o('Niente', 'Targa, modello e posizione del veicolo', 'Il motivo personale del fermo', 'La tua password'), 'b', 'La Centrale deve avere i dati del veicolo prima del contatto.'],
  ['fermo-veicolo', 'd7', 'standard', 'Da che lato ti avvicini al veicolo fermato?', o('Dal lato anteriore', 'Dal lato posteriore sinistro', 'Dal lato destro, di corsa', 'Non mi avvicino'), 'b', 'Il lato posteriore sinistro riduce l’esposizione e ti permette di osservare l’abitacolo.'],
  ['fermo-veicolo', 'd8', 'standard', 'Qual è la prima cosa da dire al conducente?', o('"Documenti, subito"', 'Presentarsi con grado e nome e spiegare il motivo del fermo', 'Una minaccia', 'Niente'), 'b', 'Presentazione e motivo del fermo sono il primo passo.'],
  ['fermo-veicolo', 'd9', 'situazionale', 'Il conducente è nervoso e alza la voce. Cosa fai?', o('Rispondo alzando la voce', 'Mantengo un tono calmo e ripeto il motivo del fermo', 'Lo ammanetto subito', 'Me ne vado'), 'b', 'Il tono calmo abbassa la tensione e rispetta i diritti della persona.'],
  ['fermo-veicolo', 'd10', 'situazionale', 'Il conducente fugge dopo il fermo. Qual è il primo passo?', o('Lo inseguo senza avvisare nessuno', 'Comunico alla Centrale targa, direzione e dinamica', 'Torno a casa', 'Chiudo il posto di blocco'), 'b', 'Prima di tutto si informa la Centrale con i dati utili.'],
  ['controllo-esito', 'd11', 'standard', 'Quando puoi richiedere l’alcoltest?', o('Sempre, senza motivo', 'Se hai motivo di sospettare che il conducente abbia bevuto', 'Mai', 'Solo di giorno'), 'b', 'Serve un sospetto concreto.'],
  ['controllo-esito', 'd12', 'situazionale', 'Il conducente rifiuta l’alcoltest. Cosa fai?', o('Lo lascio andare senza dire niente', 'Verbalizzo il rifiuto, spiego le conseguenze e lo comunico alla Centrale', 'Lo insulto', 'Gli tolgo le chiavi e me ne vado'), 'b', 'Il rifiuto è una violazione: va verbalizzato e comunicato.'],
  ['controllo-esito', 'd13', 'standard', 'A fine controllo cosa fai?', o('Tengo i documenti', 'Comunico l’esito, restituisco i documenti e libero la scena', 'Lascio le volanti dove sono', 'Spengo la radio'), 'b', 'L’esito va comunicato e la scena liberata.'],
  ['controllo-esito', 'd14', 'standard', 'Prima dell’alcoltest cosa devi fare?', o('Niente', 'Spiegare la procedura e chiedere il consenso', 'Costringere il conducente', 'Chiamare un giornalista'), 'b', 'Spiegare la procedura e raccogliere il consenso fa parte del rispetto dei diritti.'],
  ['controllo-esito', 'd15', 'situazionale', 'Il conducente è in regola. Cosa fai?', o('Lo trattengo comunque', 'Lo ringrazio, restituisco i documenti e lo lascio proseguire', 'Gli faccio una multa a caso', 'Lo seguo a lungo'), 'b', 'Se è tutto in regola, il controllo si chiude in modo cortese.'],
];

// Le opzioni sono ruotate in modo che la lettera corretta cambi da una domanda all'altra
// (gli id delle opzioni arrivano al browser: non devono rivelare la risposta).
export const DOMANDE = D.map(([moduloId, id, tipo, testo, opzioni, corretta, spiegazione], i) => {
  const testoGiusto = opzioni.find((x) => x.id === corretta).testo;
  const k = i % opzioni.length;
  const ruotate = opzioni.map((_, j) => opzioni[(j + k) % opzioni.length].testo).map((t, j) => ({ id: 'abcd'[j], testo: t }));
  return { moduloId, id, tipo, testo, opzioni: ruotate, corretta: ruotate.find((x) => x.testo === testoGiusto).id, spiegazione };
});
