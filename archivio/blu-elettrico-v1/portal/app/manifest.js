export const dynamic = 'force-static';

export default function manifest() {
  return {
    name: 'Questura IPRP — Sportello Telematico',
    short_name: 'Questura IPRP',
    description: 'Denunce, porto d’armi e colloqui con i dirigenti della Questura di Italian Paradise XI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#141a24',
    theme_color: '#121821',
    lang: 'it',
    icons: [
      { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
