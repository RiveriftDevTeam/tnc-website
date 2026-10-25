import { GeistSans } from 'geist/font/sans';
import { IBM_Plex_Sans_Arabic, Bricolage_Grotesque, Alexandria, Caveat, Aref_Ruqaa } from 'next/font/google';

// English pages: next/font preloads what a route's modules declare with preload: true, so each layout gets its own font module.
// Display Bricolage Grotesque + reading Geist are preloaded; the Arabic and hand faces are declared (variables exist) but not preloaded.
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap', adjustFontFallback: false, fallback: ['system-ui', 'sans-serif'], preload: true });
const arabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic', 'latin'], weight: ['400'], variable: '--font-arabic', display: 'swap', preload: false });
const displayAr = Alexandria({ subsets: ['arabic'], variable: '--font-display-ar', display: 'swap', preload: false });
const hand = Caveat({ subsets: ['latin'], weight: ['600'], variable: '--font-hand', display: 'swap', preload: false });
const handAr = Aref_Ruqaa({ subsets: ['arabic'], weight: ['400'], variable: '--font-hand-ar', display: 'swap', preload: false });

export const fontVars = [GeistSans.variable, display.variable, arabic.variable, displayAr.variable, hand.variable, handAr.variable].join(' ');
