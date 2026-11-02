export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/candidature', '/pratiche', '/login'] }],
    sitemap: 'https://polizia-iprp.web.app/sitemap.xml',
  };
}
