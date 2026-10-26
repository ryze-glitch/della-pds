import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
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
    images: [{ url: '/assets/og.png', width: 1200, height: 630, alt: 'Sportello Telematico della Questura IPRP, tema scuro e chiaro' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/assets/og.png'] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{var t=localStorage.getItem('pds-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;else document.documentElement.dataset.theme='dark'}catch(e){document.documentElement.dataset.theme='dark'}",
          }}
        />
        <meta name="theme-color" content="#09111f" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-2xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-fg"
        >
          Vai al contenuto
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
