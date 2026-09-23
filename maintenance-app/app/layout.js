import "./globals.css";

export const metadata = {
  title: "IPRP XI — Sito in manutenzione",
  description:
    "Il sito è in manutenzione per il rilascio della nuova versione, IPRP XI. Torneremo online a breve.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
