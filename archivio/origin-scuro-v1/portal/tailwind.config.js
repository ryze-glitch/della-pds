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
        iris: '#847dff',
        'pale-iris': '#d1c9ff',
        'deep-iris': '#4b49aa',
        orchid: '#dd90d8',
        periwinkle: '#90b8f0',
        cyan: '#00b3dd',
        silver: '#cacaca',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"DM Serif Display"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: { page: '1200px' },
      borderRadius: { tile: '30px' },
    },
  },
  plugins: [],
};
