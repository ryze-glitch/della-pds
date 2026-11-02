export const dynamic = 'force-static';

const BASE = 'https://polizia-iprp.web.app';
const PAGES = ['', '/sportello', '/sportello/denuncia', '/sportello/porto-darmi', '/sportello/colloquio', '/sportello/pratica', '/reclutamento', '/organigramma', '/notizie'];

export default function sitemap() {
  return PAGES.map((p) => ({ url: BASE + p, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 }));
}
