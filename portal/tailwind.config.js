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
        // Token di shadcn/ui (attivi dentro un contenitore con la classe .shadcn, vedi globals.css)
        background: c('sh-background'),
        foreground: c('sh-foreground'),
        card: c('sh-card'),
        'card-foreground': c('sh-card-foreground'),
        'primary-foreground': c('sh-primary-foreground'),
        secondary: c('sh-secondary'),
        'secondary-foreground': c('sh-secondary-foreground'),
        'muted-foreground': c('sh-muted-foreground'),
        accent: c('sh-accent'),
        'accent-foreground': c('sh-accent-foreground'),
        destructive: c('sh-destructive'),
        'destructive-foreground': c('sh-destructive-foreground'),
        border: c('sh-border'),
        input: c('sh-input'),
        ring: c('sh-ring'),
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
