/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        'surface-strong': 'var(--surface-strong)',
        ink: 'var(--ink)',
        'ink-dim': 'var(--ink-dim)',
        line: 'var(--line)',
        primary: 'var(--primary)',
        'on-primary': 'var(--on-primary)',
        'primary-soft': 'var(--primary-soft)',
        'on-primary-soft': 'var(--on-primary-soft)',
        success: 'var(--success)',
        'on-success': 'var(--on-success)',
        danger: 'var(--danger)',
        'on-danger': 'var(--on-danger)',
      },
      fontFamily: {
        sans: ['Roboto Flex', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Roboto Flex', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: '1180px',
      },
    },
  },
  plugins: [],
};
