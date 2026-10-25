'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandMark from './BrandMark';
import Thread from './Thread';
import { fill } from '@/content/fill';
import { pathFor, LEGAL_URL, SIGN_IN_URL, PORTAL_URL, SALES_EMAIL } from '@/content/site';
import { getConsent, setConsent } from '@/lib/analytics';

export default function Footer({ lang, d }) {
  const [consent, setC] = useState(null);
  useEffect(() => { setC(getConsent()); }, []);
  const year = new Date().getFullYear();
  const col = (title, items) => (
    <div>
      <div className="mb-3 font-display text-[.95rem] font-semibold text-ink">{title}</div>
      <ul className="space-y-2 text-[.95rem]">{items.map((it) => <li key={it.href}>{/^https?:|^mailto:/.test(it.href) ? <a href={it.href} className="text-muted transition-colors duration-quick hover:text-thread-text">{it.label}</a> : <Link prefetch={false} href={it.href} className="text-muted transition-colors duration-quick hover:text-thread-text">{it.label}</Link>}</li>)}</ul>
    </div>
  );
  return (
    <footer className="mt-16">
      <Thread shape="h" knots={[50]} className="h-10 w-full" />
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight"><BrandMark size={26} /> {d.brand}</div>
          <p className="mt-3 max-w-xs text-[.95rem] text-muted">{d.footer.line}</p>
          <div className="mt-6 rounded-control bg-sunken p-3 text-sm text-muted">
            {consent === 'granted' ? <span>{d.footer.thanks} <button className="ms-1 underline" onClick={() => { setConsent('denied'); setC('denied'); }}>{d.footer.notNow}</button></span>
              : consent === 'denied' ? <span>{d.footer.off} <button className="ms-1 underline" onClick={() => { setConsent('granted'); setC('granted'); }}>{d.footer.allow}</button></span>
              : <span>{d.footer.analytics} <button className="ms-2 chip" onClick={() => { setConsent('granted'); setC('granted'); }}>{d.footer.allow}</button> <button className="ms-1 chip chip-quiet" onClick={() => { setConsent('denied'); setC('denied'); }}>{d.footer.notNow}</button></span>}
          </div>
        </div>
        {col(d.footer.product, [
          { href: pathFor('how', lang), label: d.nav.how }, { href: pathFor('pricing', lang), label: d.nav.pricing }, { href: pathFor('order', lang), label: d.nav.order }, { href: pathFor('trust', lang), label: d.nav.trust },
        ])}
        {col(d.footer.buyers, Object.entries(d.nav.personas).map(([k, label]) => ({ href: pathFor(k, lang), label })))}
        {col(d.footer.company, [
          { href: SIGN_IN_URL, label: d.footer.signIn }, { href: PORTAL_URL, label: d.footer.portal }, { href: `${LEGAL_URL}/${lang}`, label: d.footer.legal }, { href: `mailto:${SALES_EMAIL}`, label: d.footer.contact },
        ])}
      </div>
      <div className="hairline"><div className="wrap flex flex-wrap items-center justify-between gap-2 py-5 text-sm text-subtle"><span>{fill(d.footer.copyright, { year })}</span><Link prefetch={false} href={pathFor('home', lang === 'ar' ? 'en' : 'ar')} hrefLang={lang === 'ar' ? 'en' : 'ar'} className="transition-colors duration-quick hover:text-thread-text">{d.nav.language}</Link></div></div>
    </footer>
  );
}
