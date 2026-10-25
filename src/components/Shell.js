import '@/styles/globals.css';
import Header from './Header';
import Footer from './Footer';
import AnalyticsBoot from './AnalyticsBoot';
import JsonLd from './JsonLd';
import Shore from './Shore';
import { ORG, ldWebSite, graph } from '@/lib/seo';
import { t } from '@/content';

/** The one document shell for both languages: html lang/dir, fonts, the shore behind every page, header, footer.
 *  `fonts` is the className of font variables from src/fonts/<lang>.js (imported by each layout, so each language preloads only its faces). */
export default function Shell({ lang, fonts, children }) {
  const d = t(lang); const ar = lang === 'ar';
  const chrome = { brand: d.brand, nav: d.nav, footer: d.footer, cta: d.cta };
  return (
    <html lang={lang} dir={ar ? 'rtl' : 'ltr'} className={fonts} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <Shore />
        <Header lang={lang} d={chrome} />
        <main id="main">{children}</main>
        <Footer lang={lang} d={chrome} />
        <AnalyticsBoot lang={lang} />
        <JsonLd data={graph(ORG, ldWebSite(lang))} />
      </body>
    </html>
  );
}
