import './globals.css';
import { ThemeScript } from '../components/ThemeScript';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ICON_NAMES } from '../components/icons';

export const metadata = {
  title: 'Polizia di Stato — Italian Paradise RP',
  description:
    'Sito ufficiale della Polizia di Stato — Italian Paradise RP: notizie, reparti, carriera e candidature.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta name="color-scheme" content="light dark" />
        <ThemeScript />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Roboto+Flex:opsz,wght@8..144,100..1000&family=IBM+Plex+Mono:wght@500&display=swap"
        />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=${ICON_NAMES}&display=block`}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
        >
          Vai al contenuto
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
