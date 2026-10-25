import media from '../content/media.json';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const src = (slot, w, ext) => `${BASE}/media/${slot}-${w}.${ext}`;

/** One photo slot (src/content/media.sources.js → public/media/ via `npm run media`) as AVIF/WebP `<picture>` with a JPG
 *  fallback. Intrinsic width/height come from media.json so nothing shifts; the dominant colour shows while it loads.
 *  Lazy unless `priority` (above the fold: eager + fetchpriority high). `alt` is required: pass '' only for a purely
 *  decorative photo (it is then hidden from assistive tech). Every path carries the NEXT_PUBLIC_BASE_PATH prefix. */
export default function Photo({ slot, alt, sizes = '100vw', priority = false, className = '', imgClassName = '' }) {
  const m = media[slot];
  if (!m) throw new Error(`Photo: unknown slot "${slot}" (see src/content/media.sources.js)`);
  if (typeof alt !== 'string') throw new Error(`Photo "${slot}": alt is required ('' only for decorative photos)`);
  const set = (ext) => m.widths.map((w) => `${src(slot, w, ext)} ${w}w`).join(', ');
  const [w, h] = m.dims[m.fallback];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={src(slot, m.fallback, 'jpg')}
        width={w}
        height={h}
        alt={alt}
        {...(alt === '' ? { 'aria-hidden': true } : {})}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        decoding="async"
        className={imgClassName}
        style={{ backgroundColor: m.color }}
      />
    </picture>
  );
}
