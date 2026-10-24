import { PAGES, urlFor } from '@/content/site';
export const dynamic = 'force-static';
export default function sitemap() {
  const now = new Date();
  return PAGES.flatMap((p) => ['en', 'ar'].map((lang) => ({
    url: urlFor(p.key, lang), lastModified: now, changeFrequency: p.key === 'pricing' ? 'weekly' : 'monthly', priority: p.key === 'home' ? 1 : p.key === 'pricing' || p.key === 'order' ? 0.9 : 0.7,
    alternates: { languages: { en: urlFor(p.key, 'en'), ar: urlFor(p.key, 'ar') } },
  })));
}
