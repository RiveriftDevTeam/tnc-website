'use client';
import Link from 'next/link';
import { track, EVENTS } from '@/lib/analytics';

/** Every call to action goes through here so the click is counted with its placement. */
export default function Cta({ href, children, variant = 'primary', size = '', placement = '', className = '', external, ...rest }) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`;
  const onClick = () => track(EVENTS.cta_click, { label: typeof children === 'string' ? children : rest['aria-label'] || '', to: href, placement });
  const isExternal = external || /^https?:/.test(href);
  if (isExternal) return <a href={href} className={cls} onClick={onClick} {...rest}>{children}</a>;
  return <Link href={href} className={cls} onClick={onClick} {...rest}>{children}</Link>;
}
