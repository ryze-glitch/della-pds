export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/gestione', '/login'] }],
    sitemap: 'https://polizia-iprp.web.app/sitemap.xml',
  };
}
