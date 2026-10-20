const c = (n) => `rgb(var(--${n}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        bg2: c('bg2'),
        fg: c('fg'),
        muted: c('muted'),
        line: c('line'),
        line2: c('line2'),
        accent: c('accent'),
        ok: c('ok'),
        bad: c('bad'),
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
