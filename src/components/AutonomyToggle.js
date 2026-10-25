'use client';
import { useState } from 'react';
import Sticker from './Sticker';

/** A working demo of the consent rule, local state only: sending is off until the member allows it, every send still
 *  needs a yes, and after three identical yeses the assistant offers (once) to make that one thing automatic.
 *  Copy comes from `d.how.assistant`. Nothing here talks to a server. */
export default function AutonomyToggle({ c }) {
  const [on, setOn] = useState(false);
  const [yeses, setYeses] = useState(0);
  const [phase, setPhase] = useState('draft'); // draft | sent | offer | auto
  const turn = (next) => { setOn(next); setYeses(0); setPhase('draft'); };
  const approve = () => { const n = yeses + 1; setYeses(n); setPhase(n >= 3 ? 'offer' : 'sent'); };
  const dm = c.demo;
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div>
        <button type="button" role="switch" aria-checked={on} onClick={() => turn(!on)}
          className="group flex w-full items-center gap-4 rounded-card bg-surface p-4 text-start shadow-glass transition-shadow duration-quick hover:shadow-float sm:w-auto">
          <span className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors duration-quick ease-out ${on ? 'bg-accent' : 'bg-sunken ring-1 ring-inset ring-line'}`}>
            <span className={`absolute top-1 h-6 w-6 rounded-full shadow-1 transition-all duration-quick ease-pop ${on ? 'start-7 bg-accent-ink' : 'start-1 bg-subtle'}`} />
          </span>
          <span className="text-[1.0625rem] font-medium">{c.consent}</span>
        </button>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="t-h3">{c.alone.h}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">{c.alone.items.map((x) => <li key={x} className="chip">{x}</li>)}</ul>
          </div>
          <div>
            <h3 className="t-h3">{c.ask.h}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">{c.ask.items.map((x) => <li key={x} className="chip chip-quiet">{x}</li>)}</ul>
          </div>
        </div>
      </div>

      <div aria-live="polite" className="min-h-[15rem] lg:pt-2">
        <Sticker key={`${on}-${phase}`} tilt={2} tape meta={dm.to} note={dm.note} className="sticker-in max-w-md">
          {!on && <p className="mt-3 text-sm text-muted">{dm.off}</p>}
          {on && phase === 'draft' && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="w-full text-sm text-muted">{dm.wait}</p>
              <button type="button" className="btn btn-tonal btn-sm" onClick={approve}>{dm.approve}</button>
            </div>
          )}
          {on && phase === 'sent' && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="w-full text-sm text-muted">{dm.sent} <span className="num text-subtle">({yeses} / 3)</span></p>
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => setPhase('draft')}>{dm.next}</button>
            </div>
          )}
          {on && phase === 'offer' && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="w-full text-sm text-muted">{dm.offer}</p>
              <button type="button" className="btn btn-tonal btn-sm" onClick={() => setPhase('auto')}>{dm.offerYes}</button>
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => { setYeses(0); setPhase('draft'); }}>{dm.offerNo}</button>
            </div>
          )}
          {on && phase === 'auto' && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="w-full text-sm text-muted">{dm.auto}</p>
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => { setYeses(0); setPhase('draft'); }}>{dm.stop}</button>
            </div>
          )}
        </Sticker>
      </div>
    </div>
  );
}
