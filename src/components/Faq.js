import { Plus } from 'lucide-react';
import JsonLd from './JsonLd';
import { ldFaq } from '@/lib/seo';

/** Native details/summary: no JS, keyboard-complete, and the same text goes out as FAQPage structured data.
 *  Ruled rows on the page ground; the plus turns into a cross, in thread coral, when a row is open. */
export default function Faq({ h2, items }) {
  return (
    <div className="max-w-3xl">
      {h2 && <h2 className="t-h1 mb-8">{h2}</h2>}
      <div className="border-b border-line">
        {items.map((it) => (
          <details key={it.q} className="group border-t border-line">
            <summary className="flex min-h-[3.5rem] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.1rem] font-medium transition-colors duration-quick hover:text-thread-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-thread-strong [&::-webkit-details-marker]:hidden">
              {it.q}
              <Plus size={20} className="shrink-0 text-thread-text transition-transform duration-base ease-out group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="max-w-prose pb-6 text-muted">{it.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={{ '@context': 'https://schema.org', ...ldFaq(items) }} />
    </div>
  );
}
