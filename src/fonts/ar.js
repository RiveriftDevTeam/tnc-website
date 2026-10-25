import localFont from 'next/font/local';
import { IBM_Plex_Sans_Arabic, Bricolage_Grotesque, Alexandria, Caveat, Aref_Ruqaa } from 'next/font/google';

// Arabic pages: display Alexandria + reading IBM Plex Sans Arabic (400 only, with its Latin subset so punctuation never falls back
// to Geist) are preloaded. Weightier Arabic UI (buttons, chips, labels) speaks in Alexandria, which is variable and already loaded.; the Latin and hand faces are declared but not preloaded.
const arabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic', 'latin'], weight: ['400'], variable: '--font-arabic', display: 'swap', preload: true });
const displayAr = Alexandria({ subsets: ['arabic'], variable: '--font-display-ar', display: 'swap', preload: true });
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap', adjustFontFallback: false, fallback: ['system-ui', 'sans-serif'], preload: false });
// Geist from the geist package, declared here so it is NOT preloaded (the package's own export always preloads)
const geist = localFont({ src: '../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2', variable: '--font-geist-sans', weight: '100 900', display: 'swap', preload: false });
const hand = Caveat({ subsets: ['latin'], weight: ['600'], variable: '--font-hand', display: 'swap', preload: false });
const handAr = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400'], variable: '--font-hand-ar', display: 'swap', preload: false });

export const fontVars = [geist.variable, arabic.variable, displayAr.variable, display.variable, hand.variable, handAr.variable].join(' ');
