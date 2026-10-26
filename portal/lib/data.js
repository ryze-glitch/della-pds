export const DEPTS = [
  { icon: 'siren', tag: 'Pronto intervento', name: 'Reparto Volanti', text: 'Pattugliamento continuo del territorio e risposta rapida alle emergenze cittadine.' },
  { icon: 'fingerprint', tag: 'Polizia giudiziaria', name: 'Squadra Investigativa', text: "Indagini su reati complessi e raccolta prove in collaborazione con l'autorità giudiziaria." },
  { icon: 'shield', tag: 'Interventi ad alto rischio', name: 'Nucleo Operativo Speciale', text: "Formazione d'élite per le situazioni più critiche e gli scenari a massimo rischio." },
  { icon: 'car', tag: 'Viabilità e sicurezza', name: 'Polizia Stradale', text: 'Controllo della rete viaria e gestione degli incidenti sul territorio cittadino ed extraurbano.' },
  { icon: 'headset', tag: 'Rapporti con il cittadino', name: 'Ufficio Relazioni Pubbliche', text: 'Punto di riferimento tra Questura e cittadinanza per segnalazioni e informazioni.' },
  { icon: 'graduation', tag: 'Formazione', name: 'Accademia & Formazione', text: "Percorso strutturato di addestramento dalle basi teoriche all'affiancamento sul campo." },
];

export const GRADI = [
  ['Agente', "Primo grado dopo l'accademia: pattugliamento, controlli di routine e primo contatto con la cittadinanza."],
  ['Agente Scelto', 'Maggiore autonomia operativa dopo i primi mesi di servizio sul campo.'],
  ['Assistente', 'Coordina piccoli interventi e affianca le nuove reclute in servizio.'],
  ['Assistente Capo', 'Responsabilità aggiuntive nella gestione delle pattuglie e dei turni.'],
  ['Sovrintendente', 'Supervisiona un gruppo di agenti e riporta ai superiori di reparto.'],
  ['Ispettore', 'Guida operazioni più complesse e coordina più reparti in interventi congiunti.'],
  ['Vice Commissario', 'Gestisce un intero reparto e ne definisce le priorità operative.'],
  ['Questore', 'Al vertice della Questura: definisce le strategie, rappresenta il Corpo e supervisiona ogni reparto.'],
];

export const SERVIZI = [
  { href: '/sportello/denuncia', icon: 'file-text', title: 'Sportello Denunce Online', text: 'Presenta una denuncia in pochi minuti. Riceverai un codice per seguire la pratica.', cta: 'Presenta una denuncia' },
  { href: '/sportello/porto-darmi', icon: 'shield-check', title: "Porto d'armi (PDA)", text: 'Richiedi il rilascio o il rinnovo del porto d’armi: requisiti, tariffe e visita medica.', cta: "Richiedi il porto d'armi" },
  { href: '/sportello/colloquio', icon: 'calendar-check', title: 'Colloquio con i Dirigenti', text: 'Prenota un appuntamento con il Questore o con i dirigenti dei reparti.', cta: 'Prenota un colloquio' },
  { href: '/sportello/pratica', icon: 'search', title: 'Tracciamento pratica', text: 'Inserisci il codice univoco (es. POL-2026-K7M2QX) e verifica lo stato.', cta: 'Verifica lo stato' },
];

export const TARIFFE_PDA = [
  ['Difesa personale', '$ 2.500', 'Validità 12 mesi'],
  ['Uso sportivo', '$ 1.500', 'Validità 12 mesi'],
  ['Rinnovo', '$ 800', 'Con PDA ancora valido o scaduto da meno di 60 giorni'],
];

export const BANDI = [
  { stato: 'Aperto', tone: 'ok', titolo: 'Concorso Agente — selezione permanente', scadenza: 'Sempre aperto', testo: 'Candidatura tramite modulo online, quiz di ingresso e colloquio in-character. Percorso: accademia e assegnazione a un reparto.' },
  { stato: 'Aperto', tone: 'ok', titolo: 'Nucleo Operativo Speciale — selezione interna', scadenza: 'Fino a esaurimento posti', testo: 'Riservata ad Agenti con almeno due mesi di servizio. Prova fisica e colloquio tattico con i responsabili di reparto.' },
  { stato: 'In arrivo', tone: 'warn', titolo: 'Sezione Cinofila — prime assegnazioni', scadenza: 'Apertura prossimamente', testo: 'In costituzione un reparto dedicato alle unità cinofile per ricerche e controllo del territorio.' },
];

export const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf7Ck4wRotaSwyLMEK0IJjAJdEMai2AfloMtVeLnV6FQPGkTA/viewform?usp=sharing&ouid=115833658762827349976';

export const STATI = {
  ricevuta: { label: 'Ricevuta', tone: 'blue', text: 'La pratica è stata registrata e attende la presa in carico.' },
  in_lavorazione: { label: 'In lavorazione', tone: 'warn', text: 'Un agente sta esaminando la pratica.' },
  in_attesa: { label: 'In attesa di documenti', tone: 'warn', text: 'Servono ulteriori informazioni o documenti: controlla Discord.' },
  conclusa: { label: 'Conclusa', tone: 'ok', text: 'La pratica è stata definita.' },
  respinta: { label: 'Respinta', tone: 'bad', text: 'La pratica non ha potuto essere accolta.' },
};

export const TIPI_PRATICA = { denuncia: 'Denuncia', pda: "Porto d'armi", colloquio: 'Colloquio' };
