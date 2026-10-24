// "Don't leave it at the event": three photographs, three lines. At the event → take it home → keep it alive.
import { Photo } from './Media';
import Reveal from './Reveal';
import { Section } from './Section';
import { MEDIA } from '@/content/media';

export default function TakeItHome({ take, alts }) {
  return (
    <Section eyebrow={take.eyebrow} h2={take.h2} lead={take.p}>
      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {take.panels.map((p, i) => (
          <Reveal key={p.k} delay={i * 0.06} as="li" className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sheet sm:aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/5]">
              <Photo item={MEDIA[p.k]?.unsplash ? p.k : null} alt={alts?.[p.k] || ''} scrim="bottom" className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="on-dark absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="num text-sm text-accent">{i + 1} / {take.panels.length}</div>
                <h3 className="t-h2 mt-1 text-splash-ink">{p.title}</h3>
                <p className="mt-2 text-[.95rem] !text-splash-ink/85">{p.line}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
