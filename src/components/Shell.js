import { GeistSans } from 'geist/font/sans';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import '@/styles/globals.css';
import Header from './Header';
import Footer from './Footer';
import AnalyticsBoot from './AnalyticsBoot';
import JsonLd from './JsonLd';
import { ORG, ldWebSite, graph } from '@/lib/seo';
import { t } from '@/content';

// The Arabic face is preloaded only on Arabic pages; English pages reference it without the download.
const arabicPreload = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600'], variable: '--font-arabic', display: 'swap', preload: true });
const arabicLazy = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600'], variable: '--font-arabic', display: 'swap', preload: false });

/** The one document shell for both languages: html lang/dir, fonts, backdrop, header, footer. */
export default function Shell({ lang, children }) {
  const d = t(lang); const arabic = lang === 'ar' ? arabicPreload : arabicLazy;
  const chrome = { brand: d.brand, nav: d.nav, footer: d.footer, cta: d.cta };
  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`${GeistSans.variable} ${arabic.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <div className="backdrop" aria-hidden="true" />
        <Header lang={lang} d={chrome} />
        <main id="main">{children}</main>
        <Footer lang={lang} d={chrome} />
        <AnalyticsBoot lang={lang} />
        <JsonLd data={graph(ORG, ldWebSite(lang))} />
      </body>
    </html>
  );
}
