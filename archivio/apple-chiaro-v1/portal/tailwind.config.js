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
        ink: '#1d1d1f',
        mist: '#f5f5f7',
        pricing: '#0071e3',
        orange: '#b64400',
      },
      fontFamily: {
        sans: ['Inter', '"Helvetica Neue"', 'Arial', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['Inter', '"Helvetica Neue"', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { page: '1200px' },
      borderRadius: { tile: '28px' },
    },
  },
  plugins: [],
};
