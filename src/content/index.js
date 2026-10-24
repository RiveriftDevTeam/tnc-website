import en from './en.js';
import ar from './ar.js';
import enStory from './en.story.js';
import arStory from './ar.story.js';
export { fill } from './fill.js';

function merge(base, extra) {
  const out = { ...base };
  for (const [k, v] of Object.entries(extra)) out[k] = v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' ? merge(base[k], v) : v;
  return out;
}
export const dict = { en: merge(en, enStory), ar: merge(ar, arStory) };
export function t(lang) { return dict[lang] || dict.en; }
