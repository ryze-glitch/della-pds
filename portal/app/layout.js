import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import './globals.css';

export const metadata = {
  title: 'Polizia di Stato — Questura IPRP · Italian Paradise XI',
  description:
    'Portale della Questura IPRP: sportello cittadino per denunce e porto d’armi, reclutamento, organigramma e comunicati. Servizio in-character del server roleplay Italian Paradise XI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#09111f" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-fg"
        >
          Vai al contenuto
        </a>
        {children}
      </body>
    </html>
  );
}
