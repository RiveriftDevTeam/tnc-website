'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { boot, track, EVENTS } from '@/lib/analytics';

export default function AnalyticsBoot({ lang }) {
  const pathname = usePathname();
  useEffect(() => { boot(); }, []);
  useEffect(() => { track(EVENTS.page_view, { lang, title: typeof document !== 'undefined' ? document.title : '' }); }, [pathname, lang]);
  return null;
}
