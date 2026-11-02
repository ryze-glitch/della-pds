const c = (n) => `rgb(var(--${n}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
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
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontWeight: { light: '350', normal: '350', medium: '400', semibold: '400', bold: '400' },
      maxWidth: { page: '1200px' },
      borderWidth: { DEFAULT: '0.5px' },
      borderRadius: { tile: '54px' },
    },
  },
  plugins: [],
};
