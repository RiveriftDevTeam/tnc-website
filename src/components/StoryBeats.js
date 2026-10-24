'use client';
// The welcome story (docs/design/welcome-story-v2-2026-10-05.md), told by scroll: the stage stays, the beats pass.
import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import BrandMark from './BrandMark';
import { track, EVENTS } from '@/lib/analytics';

const FACE = { layla: ['#0B5F6B', '#66D4E0'], omar: ['#C8791A', '#F3C9A8'], hana: ['#D1487A', '#F7D2B5'], noor: ['#6E56CF', '#C4CDF2'], yusuf: ['#0A9083', '#9ED9CF'] };

function Face({ id, name, word, ring, small }) {
  const [a, b] = FACE[id];
  return (
    <div className={`flex flex-col items-center text-center ${small ? 'w-7' : 'w-[58px] sm:w-[72px]'}`}>
      <div className={`flex items-center justify-center rounded-full text-base font-medium text-white ${small ? 'h-7 w-7 text-xs' : 'h-12 w-12 sm:h-14 sm:w-14'} ${ring ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : ''}`} style={{ background: `radial-gradient(circle at 35% 30%, ${b}, ${a} 70%)`, boxShadow: 'var(--tnc-shadow-1)' }} aria-hidden="true">{name.slice(0, 1)}</div>
      {!small && <div className="mt-1.5 text-sm leading-tight">{name}</div>}
      {!small && word && <div className="text-xs text-subtle">{word}</div>}
    </div>
  );
}

export default function StoryBeats({ story }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { const i = Number(e.target.dataset.beat); setActive(i); track(EVENTS.story_beat, { beat: story.beats[i].k }); }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [story.beats]);
  const beat = story.beats[active]; const c = story.cast;
  const faces = active < 2
    ? [{ id: 'layla', name: c.layla, ring: true }, { id: 'omar', name: c.omar, word: active >= 3 ? c.client : c.company }]
    : [{ id: 'noor', name: c.noor, word: c.mentor }, { id: 'hana', name: c.hana, word: c.friend }, { id: 'layla', name: c.layla, ring: true }, { id: 'omar', name: c.omar, word: active >= 3 ? c.client : c.company }, ...(active >= 2 ? [{ id: 'yusuf', name: c.yusuf, word: c.via }] : [])];

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      {/* the stage */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="glass overflow-hidden p-4 sm:p-6" data-beat-stage={beat.k}>
          <div className="flex min-h-[100px] items-start justify-center gap-0 sm:gap-2">
            {faces.map((f) => <div key={f.id} className="arrive face-move"><Face {...f} /></div>)}
          </div>
          <div className="relative mt-4 min-h-[190px]">
              <div key={beat.k} className="arrive rounded-card border border-line bg-surface/70 p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-subtle">
                  <span className="flex shrink-0 items-center gap-2"><BrandMark size={20} /> {story.assistantName}</span>
                  <span className="chip chip-quiet num min-w-0 truncate"><span className="truncate">{beat.chip}</span></span>
                </div>
                <p className="mt-3 text-[1.2rem] font-medium leading-snug">{beat.line}</p>
                {beat.preview && <p className="mt-2 text-sm italic text-muted">{beat.preview}</p>}
                {beat.assistant && <p className="mt-3 flex items-center gap-2 text-sm text-muted"><Check size={16} className="text-good" aria-hidden="true" /> {beat.assistant}</p>}
                {beat.action && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className={`btn btn-sm ${beat.k === 'draft' ? 'btn-primary' : 'btn-tonal'}`}>{beat.action}</span>
                    <span className="btn btn-sm btn-quiet">{beat.quiet}</span>
                  </div>
                )}
                {beat.reply && <div className="mt-4 flex items-start gap-3 rounded-card bg-accent-soft/60 p-3 text-sm"><Face id="omar" name={c.omar} small /><div><div>{beat.reply}</div><div className="text-xs text-subtle">{beat.replyBy}</div></div></div>}
                {beat.outcome && <p className="mt-3 flex items-center gap-2 text-sm text-muted"><Check size={16} className="text-good" aria-hidden="true" /> {beat.outcome}</p>}
              </div>
          </div>
        </div>
      </div>
      {/* the beats */}
      <ol className="min-w-0 space-y-[46vh] py-[10vh] lg:space-y-[60vh]">
        {story.beats.map((b, i) => (
          <li key={b.k} ref={(el) => (refs.current[i] = el)} data-beat={i} className={`transition-opacity duration-200 ${i === active ? 'opacity-100' : 'opacity-40'}`}>
            <div className="eyebrow num">{i + 1} / {story.beats.length}</div>
            <h3 className="t-h1 mt-2">{b.title}</h3>
            {i === story.beats.length - 1 && <p className="lead mt-3">{b.line}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
