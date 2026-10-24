import { ChevronDown } from 'lucide-react';
import JsonLd from './JsonLd';
import { ldFaq } from '@/lib/seo';

/** Native details/summary: no JS, keyboard-complete, and the same text goes out as FAQPage structured data. */
export default function Faq({ h2, items }) {
  return (
    <div className="mx-auto max-w-3xl">
      {h2 && <h2 className="t-h2 mb-6">{h2}</h2>}
      <div className="glass divide-y divide-line p-2">
        {items.map((it) => (
          <details key={it.q} className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-[1.05rem] font-medium [&::-webkit-details-marker]:hidden">
              {it.q} <ChevronDown size={18} className="shrink-0 text-subtle transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="pb-2 pt-2 text-muted">{it.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={{ '@context': 'https://schema.org', ...ldFaq(items) }} />
    </div>
  );
}
