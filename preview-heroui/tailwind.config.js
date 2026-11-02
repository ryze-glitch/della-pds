const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './node_modules/@heroui/**/node_modules/@heroui/theme/dist/**/*.{js,mjs,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: { extend: { fontFamily: { sans: ['Lexend', 'system-ui', 'sans-serif'] } } },
  plugins: [
    heroui({
      layout: { radius: { small: '10px', medium: '14px', large: '22px' } },
      themes: {
        dark: {
          colors: {
            background: '#090a0f',
            foreground: '#f8fafc',
            content1: '#12141b',
            content2: '#1b1e24',
            content3: '#262932',
            divider: 'rgba(255,255,255,0.1)',
            primary: { DEFAULT: '#2563eb', foreground: '#ffffff' },
          },
        },
      },
    }),
  ],
};
