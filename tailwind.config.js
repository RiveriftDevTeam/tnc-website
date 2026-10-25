/** Tokens come from src/styles/tokens.css (petrol accent from Gulf Water, decision 57/59; Kept Thread site tokens). Tailwind only names them. */
const rgbVar = (name, rgb = name) => ({ opacityValue }) => (opacityValue === undefined ? `var(--tnc-${name})` : `rgb(var(--tnc-${rgb}-rgb) / ${opacityValue})`);
module.exports = {
  content: ['./src/**/*.{js,jsx,mjs}'],
  theme: {
    extend: {
      colors: {
        // colours that take an opacity modifier (bg-surface/70) resolve through their rgb triplet
        ...Object.fromEntries(['accent', 'accent-soft', 'ground', 'surface', 'sunken', 'ink', 'splash', 'splash-ink'].map((n) => [n, rgbVar(n)])),
        'accent-hover': 'var(--tnc-accent-hover)',
        'accent-ink': 'var(--tnc-accent-ink)',
        muted: 'var(--tnc-ink-muted)',
        subtle: 'var(--tnc-ink-subtle)',
        line: 'var(--tnc-line)',
        good: 'var(--tnc-good)',
        warn: 'var(--tnc-warn)',
        critical: 'var(--tnc-critical)',
        delight: 'var(--tnc-delight)',
        field: rgbVar('site-field'),
        'field-ink': rgbVar('site-field-ink'),
        thread: rgbVar('site-thread'),
        'thread-strong': 'var(--tnc-site-thread-strong)',
        'thread-ink': 'var(--tnc-site-thread-ink)',
        'thread-text': 'var(--tnc-site-thread-text)',
        sun: rgbVar('site-sun'),
        'sun-ink': 'var(--tnc-site-sun-ink)',
        faded: 'var(--tnc-site-faded)',
        sticker: 'var(--tnc-site-sticker)',
        clay: Object.fromEntries([1, 2, 3, 4, 5, 6].map((i) => [i, `var(--tnc-site-clay-${i})`])),
      },
      fontFamily: {
        // --sans / --display / --hand switch their order per language in globals.css (Arabic face first on /ar)
        sans: 'var(--sans)',
        display: 'var(--display)',
        hand: 'var(--hand)',
      },
      borderRadius: { card: '20px', sheet: '28px', control: '12px', sticker: '14px', photo: '28px' },
      boxShadow: {
        1: 'var(--tnc-shadow-1)',
        2: 'var(--tnc-shadow-2)',
        float: 'var(--tnc-shadow-float)',
        glass: 'var(--tnc-shadow-1), var(--tnc-shadow-2)',
        sticker: 'var(--tnc-site-sticker-shadow)',
      },
      maxWidth: { wrap: '1180px', prose: '68ch' },
      transitionDuration: { instant: '120ms', quick: '200ms', base: '320ms', slow: '560ms', story: '800ms' },
      transitionTimingFunction: {
        standard: 'cubic-bezier(.2,.0,.0,1)',
        out: 'var(--tnc-ease-out)',
        'in-out': 'var(--tnc-ease-in-out)',
        exit: 'var(--tnc-ease-exit)',
        pop: 'var(--tnc-ease-pop)',
      },
    },
  },
  plugins: [],
};
