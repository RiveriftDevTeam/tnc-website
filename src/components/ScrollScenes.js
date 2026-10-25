// A scroll story (docs/plans/site-revamp.md Amendment A2.3): one short line per step on one side, a picture on the other
// that changes with the step. Wide screens with motion: the picture is a sticky stage and the active step lights up.
// Phones and reduced motion: every step is a block, its picture above its line (nothing sticky, nothing hidden).
// The scenes are server-rendered nodes (HTML, SVG, stickers, photos). Each scene wrapper carries data-on (1 while it is
// the active step) and a --sp variable (0..1, how far through the step), so a scene animates with CSS alone:
//   group-data-[on=0]/scene:...   the state before it arrives      var(--sp, 1)   a value scrubbed by scroll
// This file is markup only (all text server-rendered, every class here stays out of the bundle); ScrollDriver is the one
// client script. Without script every scene is shown in its final state.
import { Knot } from './Thread';
import ScrollDriver from './scenes/ScrollDriver';

const PIC = 'relative aspect-[6/5] overflow-hidden rounded-photo bg-field text-field-ink shadow-2 [container-type:inline-size]';

export default function ScrollScenes({ steps, scenes, label, dir, className = '' }) {
  return (
    <div role="group" aria-label={label} dir={dir} className={`md:motion-safe:grid md:motion-safe:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] md:motion-safe:gap-x-12 lg:motion-safe:gap-x-16 ${className}`}>
      <ScrollDriver />
      {/* wide screens with motion: one sticky stage, every scene stacked in it */}
      <div className="hidden md:motion-safe:block" aria-hidden="true">
        <div className={`${PIC} sticky top-[5.5rem] mx-auto w-[min(100%,calc((100svh-7.5rem)*1.2))]`}>
          {scenes.map((s, i) => (
            <div key={i} data-stage="" data-on={i ? '0' : '1'} className="group/scene absolute inset-0 transition-[opacity,transform] duration-slow ease-out data-[on=0]:pointer-events-none data-[on=0]:scale-[.97] data-[on=0]:opacity-0">{s}</div>
          ))}
        </div>
      </div>
      <div className="relative">
        <span data-track="" className="absolute inset-y-0 start-[13px] w-[2px] rounded-full bg-ink/15" aria-hidden="true" />
        <span data-fill="" className="absolute inset-y-0 start-[13px] w-[2px] origin-top rounded-full bg-thread" aria-hidden="true" />
        <ol className="relative">
          {steps.map((s, i) => (
            <li key={s.key} data-step="" data-a="1" data-r="1" className="group/li relative ps-9 pb-14 transition-opacity duration-base ease-out data-[a=0]:opacity-40 md:motion-reduce:grid md:motion-reduce:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:motion-reduce:items-center md:motion-reduce:gap-10 md:motion-safe:flex md:motion-safe:min-h-[78vh] md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:pb-0">
              <div data-pic="" data-on="1" aria-hidden="true" className={`group/scene ${PIC} mb-6 md:motion-reduce:mb-0 md:motion-safe:hidden`}>{scenes[i]}</div>
              <div className="relative md:motion-reduce:static md:motion-safe:max-w-md">
                <span data-knot="" className="absolute -start-[30px] top-2 text-faded md:motion-reduce:start-[6px] transition-[color,transform] duration-quick ease-pop group-data-[r=1]/li:scale-110 group-data-[r=1]/li:text-thread"><Knot size={16} /></span>
                <h3 className="t-h2">{s.title}</h3>
                {s.line && <p className="lead mt-3">{s.line}</p>}
                {s.strands && (
                  <ul className="mt-5 space-y-4">
                    {s.strands.map((x, k) => (
                      <li key={x.who}>
                        <span className={`chip ${k ? 'chip-quiet' : ''}`}><span className={`h-2 w-2 rounded-full ${k ? 'bg-accent' : 'bg-thread'}`} aria-hidden="true" />{x.who}</span>
                        <p className="mt-1.5 text-[1.0625rem] leading-snug text-muted">{x.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
