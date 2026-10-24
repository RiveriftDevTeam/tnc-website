/** Tokens come from src/styles/tokens.css (Gulf Water, decision 57/59). Tailwind only names them. */
module.exports = {
  content: ['./src/**/*.{js,jsx,mjs}'],
  theme: {
    extend: {
      colors: {
        // colours that take an opacity modifier (bg-surface/70) resolve through their rgb triplet
        ...Object.fromEntries(['accent', 'accent-soft', 'ground', 'surface', 'sunken', 'ink', 'splash', 'splash-ink'].map((n) => [n, ({ opacityValue }) => (opacityValue === undefined ? `var(--tnc-${n})` : `rgb(var(--tnc-${n}-rgb) / ${opacityValue})`)])),
        'accent-hover': 'var(--tnc-accent-hover)',
        'accent-ink': 'var(--tnc-accent-ink)',
        muted: 'var(--tnc-ink-muted)',
        subtle: 'var(--tnc-ink-subtle)',
        line: 'var(--tnc-line)',
        good: 'var(--tnc-good)',
        warn: 'var(--tnc-warn)',
        critical: 'var(--tnc-critical)',
        delight: 'var(--tnc-delight)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'var(--font-arabic)', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '16px', sheet: '24px', control: '12px' },
      boxShadow: {
        1: 'var(--tnc-shadow-1)',
        2: 'var(--tnc-shadow-2)',
        glass: 'var(--tnc-shadow-1), var(--tnc-shadow-2)',
      },
      maxWidth: { wrap: '1180px', prose: '68ch' },
      transitionTimingFunction: { standard: 'cubic-bezier(.2,.0,.0,1)' },
    },
  },
  plugins: [],
};
