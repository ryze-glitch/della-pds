const { heroui } = require('@heroui/react');
const c = (n) => `rgb(var(--${n}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './node_modules/@heroui/**/node_modules/@heroui/theme/dist/**/*.{js,mjs,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        surface: c('surface'),
        surface2: c('surface2'),
        fg: c('fg'),
        muted: c('muted'),
        fog: c('fog'),
        line: c('line'),
        primary: c('primary'),
        'primary-fg': c('primary-fg'),
        link: c('link'),
        gold: c('gold'),
        'gold-soft': c('gold-soft'),
        'gold-ink': c('gold-ink'),
        ok: c('ok'),
        bad: c('bad'),
        warn: c('warn'),
        dark: c('dark'),
      },
      fontFamily: {
        sans: ['Lexend', '"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['Lexend', '"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontWeight: { light: '300', normal: '400', medium: '500', semibold: '600', bold: '700' },
      maxWidth: { page: '1200px' },
      borderWidth: { DEFAULT: '0.5px' },
      borderRadius: { tile: '22px' },
    },
  },
  plugins: [
    heroui({
      layout: { radius: { small: '10px', medium: '14px', large: '22px' } },
      themes: {
        dark: {
          colors: {
            background: '#090a0f',
            foreground: '#f8fafc',
            content1: '#12141b',
            content2: '#1b1e26',
            content3: '#262a34',
            divider: 'rgba(255,255,255,0.1)',
            primary: { DEFAULT: '#2563eb', foreground: '#ffffff' },
          },
        },
      },
    }),
  ],
};
