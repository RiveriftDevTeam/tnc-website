// One place for addresses and routes. Values come from docs/environments.md and REQ-002.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tapnconnect.ae').replace(/\/$/, '');
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://profile.tapnconnect.ae').replace(/\/$/, '');
export const PORTAL_URL = (process.env.NEXT_PUBLIC_PORTAL_URL || 'https://admin.tapnconnect.ae').replace(/\/$/, '');
export const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://service.tapnconnect.ae').replace(/\/$/, '');

export const JOIN_URL = `${APP_URL}/join`;
export const SIGN_IN_URL = `${APP_URL}/app/sign-in`;
export const LEGAL_URL = `${APP_URL}/legal`;
export const SALES_EMAIL = 'hello@tapnconnect.ae';

export const LANGS = ['en', 'ar'];
export const PERSONAS = ['organisers', 'exhibitors', 'sponsors', 'companies', 'individuals'];

// Every page of the site. `path` is the English path; Arabic is `/ar` + path.
export const PAGES = [
  { key: 'home', path: '/' },
  { key: 'how', path: '/how-it-works/' },
  { key: 'organisers', path: '/for/organisers/' },
  { key: 'exhibitors', path: '/for/exhibitors/' },
  { key: 'sponsors', path: '/for/sponsors/' },
  { key: 'companies', path: '/for/companies/' },
  { key: 'individuals', path: '/for/individuals/' },
  { key: 'pricing', path: '/pricing/' },
  { key: 'order', path: '/order/' },
  { key: 'trust', path: '/trust/' },
  { key: 'credits', path: '/credits/' },
];

export function pathFor(key, lang = 'en') {
  const p = PAGES.find((x) => x.key === key);
  if (!p) throw new Error(`unknown page ${key}`);
  return lang === 'ar' ? `/ar${p.path}` : p.path;
}
export function urlFor(key, lang = 'en') {
  return `${SITE_URL}${pathFor(key, lang)}`;
}
export function altLangPath(pathname) {
  // '/pricing/' <-> '/ar/pricing/'
  if (pathname === '/ar' || pathname.startsWith('/ar/')) return pathname.replace(/^\/ar/, '') || '/';
  return `/ar${pathname === '/' ? '/' : pathname}`;
}
