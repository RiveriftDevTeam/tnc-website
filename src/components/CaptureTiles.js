'use client';
import { useState } from 'react';
import { Nfc, ScanLine, QrCode, Camera, Mic, MessageCircle } from 'lucide-react';
import Thread from './Thread';

const ICONS = [Nfc, ScanLine, QrCode, Camera, Mic, MessageCircle];

/** Six ways to capture, strung on the thread; pick one and the same memory sticker shows what it saved (one result,
 *  whatever the gesture). Real buttons with aria-pressed; the sticker re-settles on each pick. `c` is `d.how.capture`. */
export default function CaptureTiles({ c }) {
  const [sel, setSel] = useState(0);
  const m = c.memory;
  return (
    <>
      <p className="mt-6 text-sm text-subtle">{c.hint}</p>
      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-16">
        <div className="relative">
          <Thread shape="vline" animate={false} className="absolute bottom-5 start-[17px] top-5 w-2" />
          <ul className="relative space-y-2.5">
            {c.items.map((label, i) => {
              const I = ICONS[i]; const on = sel === i;
              return (
                <li key={label}>
                  <button type="button" aria-pressed={on} onClick={() => setSel(i)}
                    className={`flex w-full items-center gap-4 rounded-full py-1 pe-5 ps-0 text-start transition-colors duration-quick ${on ? 'bg-surface shadow-2' : 'hover:bg-surface/60'}`}>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-2 transition-colors duration-quick ${on ? 'bg-thread-strong text-thread-ink ring-thread' : 'bg-sticker text-thread-text ring-thread/30'}`}><I size={17} strokeWidth={2} aria-hidden="true" /></span>
                    <span className="t-h3 text-[1.05rem]">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div key={sel} className="sticker sticker-tape sticker-in !p-5" data-tilt="2" aria-live="polite">
          <div className="text-[.8125rem] leading-snug text-subtle">{m.meta} · {m.via}: {c.items[sel]}</div>
          <p className="hand mt-2 !text-[1.5rem]">{m.name}</p>
          <p className="mt-2 text-[.95rem] text-muted">{m.where}</p>
          <p className="mt-1 text-[.95rem] text-muted">{m.said}</p>
          <p className="mt-2 text-[.95rem] font-medium text-thread-text">{m.promised}</p>
        </div>
      </div>
      <p className="lead mt-12 max-w-prose">{c.p}</p>
    </>
  );
}
