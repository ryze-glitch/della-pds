import '@fontsource/lexend/400.css';
import '@fontsource/lexend/500.css';
import '@fontsource/lexend/600.css';
import '@fontsource/lexend/700.css';
import '@fontsource/lexend/800.css';
import './globals.css';
import { Providers } from './providers';

export const metadata = { title: 'Anteprima HeroUI · Polizia IPRP' };

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
