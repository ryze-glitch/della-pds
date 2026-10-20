/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    borderRadius: { none: '0', DEFAULT: '0', full: '9999px' },
    extend: {
      colors: {
        paper: '#f5f4f0',
        ink: '#0a0a0a',
        accent: '#1a3cff',
        mute: '#6b6a64',
        ok: '#0a7a2f',
        bad: '#d00000',
      },
      fontFamily: {
        sans: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: { wide: '1600px' },
    },
  },
  plugins: [],
};
