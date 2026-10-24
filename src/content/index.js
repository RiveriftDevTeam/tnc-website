import en from './en.js';
import ar from './ar.js';
export const dict = { en, ar };
export function t(lang) { return dict[lang] || en; }
export { fill } from './fill.js';
