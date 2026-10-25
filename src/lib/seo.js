import { SITE_URL, pathFor, urlFor, PAGES } from '@/content/site';
import { PLANS } from '@/content/plans';
import { t } from '@/content';

const OG_IMAGE = `${SITE_URL}/og.png`;
// Home and the buyer pages carry their own social image (scripts/og.mjs); every other page uses og.png
const OG_PAGES = ['home', 'organisers', 'exhibitors', 'sponsors', 'companies', 'individuals'];
const ogFor = (key, lang) => (OG_PAGES.includes(key) ? `${SITE_URL}/og/${key}-${lang}.png` : OG_IMAGE);

/** Next metadata for one page in one language: canonical, hreflang, OpenGraph, Twitter. */
export function pageMetadata(key, lang) {
  const d = t(lang);
  const page = key === 'home' ? d.home : key === 'how' ? d.how : key === 'pricing' ? d.pricing : key === 'order' ? d.order : key === 'trust' ? d.trust : d.personas[key];
  const url = urlFor(key, lang);
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: url,
      languages: { en: urlFor(key, 'en'), ar: urlFor(key, 'ar'), 'x-default': urlFor(key, 'en') },
    },
    openGraph: {
      type: 'website', url, siteName: d.meta.siteName, title: page.title, description: page.description,
      locale: lang === 'ar' ? 'ar_AE' : 'en_AE', alternateLocale: lang === 'ar' ? ['en_AE'] : ['ar_AE'],
      images: [{ url: ogFor(key, lang), width: 1200, height: 630, alt: d.meta.tagline }],
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [ogFor(key, lang)] },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

export const ORG = {
  '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: 'TapNConnect', url: SITE_URL, logo: `${SITE_URL}/icon.svg`,
  email: 'hello@tapnconnect.ae', foundingLocation: 'Dubai, United Arab Emirates', areaServed: ['AE', 'SA', 'GCC'],
  address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
  sameAs: [],
};

export function ldWebSite(lang) {
  const d = t(lang);
  return { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: d.meta.siteName, description: d.meta.description, inLanguage: lang === 'ar' ? 'ar-AE' : 'en-AE', publisher: { '@id': `${SITE_URL}/#org` } };
}
export function ldWebPage(key, lang) {
  const md = pageMetadata(key, lang);
  return { '@type': 'WebPage', '@id': `${urlFor(key, lang)}#page`, url: urlFor(key, lang), name: md.title, description: md.description, inLanguage: lang === 'ar' ? 'ar-AE' : 'en-AE', isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': `${SITE_URL}/#app` } };
}
export function ldSoftwareApp(lang) {
  const d = t(lang);
  const offers = PLANS.member.map((p) => ({ '@type': 'Offer', name: p.name[lang], price: String(p.prices.monthly), priceCurrency: 'AED', url: urlFor('pricing', lang), category: 'subscription', availability: 'https://schema.org/InStock' }));
  return {
    '@type': 'SoftwareApplication', '@id': `${SITE_URL}/#app`, name: 'TapNConnect', applicationCategory: 'BusinessApplication', operatingSystem: 'Web, iOS, Android',
    description: d.meta.description, url: SITE_URL, publisher: { '@id': `${SITE_URL}/#org` }, inLanguage: ['en', 'ar'],
    featureList: d.home.loop.steps.map((s) => s.title), offers,
  };
}
export function ldProductCard(lang) {
  const c = PLANS.card;
  return { '@type': 'Product', '@id': `${SITE_URL}/#card`, name: `TapNConnect ${c.name[lang]}`, description: c.tagline[lang], brand: { '@type': 'Brand', name: 'TapNConnect' }, image: OG_IMAGE,
    offers: { '@type': 'Offer', price: String(c.prices.once), priceCurrency: 'AED', availability: 'https://schema.org/InStock', url: urlFor('pricing', lang), areaServed: 'AE' } };
}
export function ldFaq(items) {
  return { '@type': 'FAQPage', mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
}
export function ldBreadcrumb(trail, lang) {
  // trail: [{ key, name }]
  return { '@type': 'BreadcrumbList', itemListElement: trail.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: urlFor(x.key, lang) })) };
}
export function ldHowTo(lang) {
  const d = t(lang);
  return { '@type': 'HowTo', name: d.home.loop.h2, step: d.home.loop.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.p })) };
}
export function graph(...nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
export const ALL_PATHS = PAGES.flatMap((p) => [pathFor(p.key, 'en'), pathFor(p.key, 'ar')]);
