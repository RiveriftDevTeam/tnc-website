'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import BrandMark from './BrandMark';
import Cta from './Cta';
import { pathFor, altLangPath, JOIN_URL, SIGN_IN_URL } from '@/content/site';
import { track, EVENTS } from '@/lib/analytics';

export default function Header({ lang, d }) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.documentElement.style.overflow = open ? 'hidden' : ''; return () => { document.documentElement.style.overflow = ''; }; }, [open]);

  const links = [
    { href: pathFor('how', lang), label: d.nav.how },
    { href: pathFor('organisers', lang), label: d.nav.who, group: true },
    { href: pathFor('pricing', lang), label: d.nav.pricing },
    { href: pathFor('trust', lang), label: d.nav.trust },
  ];
  const personas = Object.entries(d.nav.personas).map(([k, label]) => ({ href: pathFor(k, lang), label }));
  const alt = altLangPath(pathname);
  const isActive = (href) => pathname === href || (href !== '/' && href !== '/ar/' && pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-40 transition-[background,box-shadow] duration-200 ${scrolled ? 'glass glass-strong rounded-none border-x-0 border-t-0' : ''}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 btn btn-tonal btn-sm">{d.nav.skip}</a>
      <div className="wrap flex h-16 items-center gap-4">
        <Link prefetch={false} href={pathFor('home', lang)} className="flex items-center gap-2.5 font-medium text-[1.05rem]" aria-label={d.brand}>
          <BrandMark size={28} /> <span>{d.brand}</span>
        </Link>
        <nav className="ms-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => l.group ? (
            <div key={l.href} className="group relative">
              <Link prefetch={false} href={l.href} className={`btn btn-quiet btn-sm ${isActive('/for/') || pathname.includes('/for/') ? 'text-accent' : ''}`} aria-haspopup="true">{l.label}</Link>
              <div className="invisible absolute start-0 top-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="glass glass-strong min-w-[220px] p-2">
                  {personas.map((p) => <Link prefetch={false} key={p.href} href={p.href} className="block rounded-control px-3 py-2 text-[.95rem] text-muted hover:bg-accent-soft hover:text-accent">{p.label}</Link>)}
                </div>
              </div>
            </div>
          ) : (
            <Link prefetch={false} key={l.href} href={l.href} className={`btn btn-quiet btn-sm ${isActive(l.href) ? 'text-accent' : ''}`}>{l.label}</Link>
          ))}
        </nav>
        <div className="ms-auto hidden items-center gap-1 lg:flex">
          <Link prefetch={false} href={alt} hrefLang={lang === 'ar' ? 'en' : 'ar'} lang={lang === 'ar' ? 'en' : 'ar'} className="btn btn-quiet btn-sm" aria-label={d.nav.langLabel} onClick={() => track(EVENTS.lang_switch, { to: lang === 'ar' ? 'en' : 'ar' })}><Globe size={16} aria-hidden="true" /> {d.nav.language}</Link>
          <a href={SIGN_IN_URL} className="btn btn-quiet btn-sm">{d.nav.signIn}</a>
          <Cta href={pathFor('order', lang)} variant="tonal" size="sm" placement="header">{d.nav.order}</Cta>
          <Cta href={JOIN_URL} variant="primary" size="sm" placement="header">{d.nav.startFree}</Cta>
        </div>
        <button type="button" className="btn btn-quiet btn-sm ms-auto lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />} <span>{open ? d.nav.close : d.nav.menu}</span>
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ground/95 backdrop-blur-xl">
          <div className="wrap flex flex-col gap-1 py-4">
            {links.filter((l) => !l.group).map((l) => <Link prefetch={false} key={l.href} href={l.href} className="rounded-control px-3 py-3 text-lg">{l.label}</Link>)}
            <div className="mt-2 px-3 text-sm text-subtle">{d.nav.who}</div>
            {personas.map((p) => <Link prefetch={false} key={p.href} href={p.href} className="rounded-control px-3 py-2.5 text-lg">{p.label}</Link>)}
            <div className="mt-4 flex flex-col gap-2 px-3">
              <Cta href={JOIN_URL} variant="primary" placement="mobile-menu">{d.nav.startFree}</Cta>
              <Cta href={pathFor('order', lang)} variant="tonal" placement="mobile-menu">{d.nav.order}</Cta>
              <a href={SIGN_IN_URL} className="btn btn-quiet">{d.nav.signIn}</a>
              <Link prefetch={false} href={alt} hrefLang={lang === 'ar' ? 'en' : 'ar'} className="btn btn-quiet" onClick={() => track(EVENTS.lang_switch, { to: lang === 'ar' ? 'en' : 'ar' })}><Globe size={16} aria-hidden="true" /> {d.nav.language}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
