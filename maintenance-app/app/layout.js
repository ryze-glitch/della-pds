import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata = {
  title: 'Polizia di Stato — Italian Paradise RP',
  description:
    'Sito ufficiale della Polizia di Stato — Italian Paradise RP: notizie, reparti, carriera e candidature.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <a
          href="#main"
          className="mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:text-xs focus:text-white"
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
