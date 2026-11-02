import '@fontsource-variable/inter/wght.css';
import 'lenis/dist/lenis.css';
import './globals.css';
import { SmoothScroll } from '../components/SmoothScroll';

const TITLE = 'Polizia di Stato — Questura IPRP · Italian Paradise XI';
const DESC =
  'Portale della Questura IPRP: sportello cittadino per denunce e porto d’armi, reclutamento, organigramma e comunicati. Servizio in-character del server roleplay Italian Paradise XI.';

export const metadata = {
  metadataBase: new URL('https://polizia-iprp.web.app'),
  title: TITLE,
  description: DESC,
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Questura IPRP',
    title: TITLE,
    description: DESC,
    images: [{ url: '/assets/hero-slide-1.jpg', width: 2000, height: 920, alt: 'La Questura IPRP con le volanti' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/assets/hero-slide-1.jpg'] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta name="color-scheme" content="light" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <meta name="theme-color" content="#f2f2f4" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-2xl focus:bg-white focus:text-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold "
        >
          Vai al contenuto
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
