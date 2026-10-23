export const NAV = [
  { href: '/', label: 'Home' },
  {
    href: '/sportello',
    label: 'Sportello Cittadino',
    children: [
      { href: '/sportello/denuncia', label: 'Denuncia online', desc: 'Presenta una denuncia alla Questura', icon: 'file-text' },
      { href: '/sportello/porto-darmi', label: "Porto d'armi (PDA)", desc: 'Rilascio e rinnovo', icon: 'shield-check' },
      { href: '/sportello/colloquio', label: 'Colloquio con i Dirigenti', desc: 'Prenota un appuntamento', icon: 'calendar-check' },
      { href: '/sportello/pratica', label: 'Stato della pratica', desc: 'Verifica con il codice univoco', icon: 'search' },
    ],
  },
  { href: '/reclutamento', label: 'Bandi & Reclutamento' },
  { href: '/organigramma', label: 'Organigramma' },
  { href: '/notizie', label: 'Comunicati' },
];

export const AREA = { href: '/login', label: 'Area Riservata Agenti' };
