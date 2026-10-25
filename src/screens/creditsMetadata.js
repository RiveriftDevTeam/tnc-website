import { t } from '@/content';
import { SITE_URL, urlFor } from '@/content/site';

/** Metadata for /credits/ and /ar/credits/ (lib/seo.js pageMetadata has no entry for it): canonical, hreflang, OpenGraph. */
export function creditsMetadata(lang) {
  const d = t(lang); const page = d.credits; const url = urlFor('credits', lang);
  const image = `${SITE_URL}/og.png`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url, languages: { en: urlFor('credits', 'en'), ar: urlFor('credits', 'ar'), 'x-default': urlFor('credits', 'en') } },
    openGraph: {
      type: 'website', url, siteName: d.meta.siteName, title: page.title, description: page.description,
      locale: lang === 'ar' ? 'ar_AE' : 'en_AE', alternateLocale: lang === 'ar' ? ['en_AE'] : ['ar_AE'],
      images: [{ url: image, width: 1200, height: 630, alt: d.meta.tagline }],
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [image] },
    robots: { index: true, follow: true },
  };
}
