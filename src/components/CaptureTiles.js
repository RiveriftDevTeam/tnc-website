'use client';
import { useState } from 'react';
import { Nfc, ScanLine, QrCode, Camera, Mic, MessageCircle } from 'lucide-react';

const ICONS = [Nfc, ScanLine, QrCode, Camera, Mic, MessageCircle];

/** Six capture methods as tactile tiles. Each flips (CSS 3D, a real button with aria-pressed) to the same memory sticker.
 *  With reduced motion the global rule makes the flip instant. `c` is `d.how.capture`. */
export default function CaptureTiles({ c }) {
  const [open, setOpen] = useState({});
  const m = c.memory;
  return (
    <>
      <p className="mt-6 text-sm text-subtle">{c.hint}</p>
      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
        {c.items.map((label, i) => {
          const I = ICONS[i]; const flipped = !!open[i];
          return (
            <li key={label} className="[perspective:900px]">
              <button type="button" aria-pressed={flipped} onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
                className="relative block h-56 w-full rounded-sticker text-start transition-transform duration-slow ease-out [transform-style:preserve-3d] sm:h-52"
                style={{ transform: flipped ? 'rotateY(180deg)' : undefined }}>
                <span aria-hidden={flipped} className="absolute inset-0 flex flex-col justify-between rounded-sticker bg-surface p-4 shadow-sticker [-webkit-backface-visibility:hidden] [backface-visibility:hidden]">
                  <I size={28} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
                  <span className="t-h3">{label}</span>
                </span>
                <span aria-hidden={!flipped} className="absolute inset-0 flex flex-col justify-between rounded-sticker bg-sticker p-4 shadow-sticker [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-[.8125rem] leading-snug text-subtle">{m.meta}<br />{m.via}: {label}</span>
                  <span>
                    <span className="hand block">{m.name}</span>
                    <span className="mt-1 block text-[.8125rem] leading-snug text-muted">{m.where}</span>
                    <span className="mt-1 block text-[.8125rem] leading-snug text-muted">{m.said}</span>
                    <span className="mt-1 block text-[.8125rem] font-medium leading-snug text-thread-text">{m.promised}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="lead mt-10 max-w-prose">{c.p}</p>
    </>
  );
}
