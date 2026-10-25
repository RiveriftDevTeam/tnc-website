// Photo slots: one line per picture on the site. `scripts/media.mjs` (npm run media) reads this file, fetches the
// renditions into public/media/ and writes media.json. To swap a photo, change its `id` (the Unsplash photo id from
// the photo page URL), keep the slot name, and run `npm run media` again (delete the slot's old files first).
//   focal  [x, y] 0..1, the point of the photo kept in frame when it is cropped
//   ratio  width / height of the crop
//   widths rendition widths in px (AVIF + WebP at each, one JPG at 1200 for the <img> fallback)
//   zoom   optional, crops tighter around the focal point (imgix fp-z)
// Licence: Unsplash License (free to use, no attribution needed; the Photo credits page is a courtesy).
const W = [480, 800, 1200, 1600];
const PORTRAIT = [480, 800, 1200]; // 4:5 crops: 1600 wide would be a 3.2 MP photo, more than a portrait ever shows
const WIDE = [480, 800, 1200, 1600, 2400];

const sources = {
  // Home scroll story
  'story-hall': { id: 'KVvEpFVq_-U', focal: [0.3, 0.3], ratio: 16 / 9, widths: WIDE, zoom: 1.25 }, // Act 1-2 backdrop (LCP); the crop drops the right-hand "Simon & Schuster" and "France" signs
  'story-touch': { id: '36g19a7ivrs', focal: [0.5, 0.5], ratio: 16 / 9, widths: WIDE }, // Act 3
  'story-circle': { id: 'ZDN-G1xBWHY', focal: [0.55, 0.28], ratio: 16 / 9, widths: W, zoom: 1.5 }, // Act 6, crop keeps the faces and drops the table with the bottles
  // Home doors and their page heroes
  'door-organisers': { id: 'g7iSoF8NwYA', focal: [0.5, 0.55], ratio: 3 / 2, widths: W },
  'door-exhibitors': { id: 'BKpOVik79lA', focal: [1, 0.35], ratio: 4 / 5, widths: PORTRAIT, zoom: 1.85 }, // tight right/bottom: the Cyrillic booth sign is cropped out
  // Brands are legible across the whole of NXhweP5ShCg (Ateuco, POINT Mobile, BIXOLON, GODEX, TOOLSiD, Cyrillic signs),
  // so the plan's fallback is used.
  'door-sponsors': { id: 'EVgsAbL51Rk', focal: [0.6, 0.5], ratio: 3 / 2, widths: W },
  'door-individuals': { id: 'w5GxcIxT1gE', focal: [0.5, 0.42], ratio: 4 / 5, widths: PORTRAIT }, // the blank badge is where the card sticker lands
  'door-companies': { id: 'OsuDfn4vtLA', focal: [0.55, 0.5], ratio: 3 / 2, widths: W },
  // Home extras
  'year-coffee': { id: 'k7moOgpIkU8', focal: [0.45, 0.4], ratio: 3 / 2, widths: W },
  final: { id: 'l_ExpFwwOEg', focal: [0.55, 0.5], ratio: 4 / 5, widths: PORTRAIT },
  // How it works
  'how-hero': { id: 'rBDAAw3OoMY', focal: [0.45, 0.3], ratio: 4 / 5, widths: PORTRAIT },
  'how-event': { id: 'yTsy3PYFPtc', focal: [0.5, 0.5], ratio: 3 / 2, widths: W },
  'how-organiser': { id: '3BwoM8zNYwo', focal: [0.5, 0.3], ratio: 3 / 2, widths: W },
  // Buyer pages
  'persona-sponsor-2': { id: 'EVgsAbL51Rk', focal: [0.25, 0.55], ratio: 16 / 9, widths: W, zoom: 1.4 }, // same photo as door-sponsors, other crop (the lit stage)
  'persona-exhibitor-2': { id: 'bCMpeLcfWPw', focal: [0.5, 0.35], ratio: 4 / 5, widths: PORTRAIT },
  'persona-individual-2': { id: 'vFF-cypxQwY', focal: [0.45, 0.55], ratio: 4 / 5, widths: PORTRAIT },
  // Trust, pricing, 404
  'trust-uae': { id: 'oF7dZYCgO3k', focal: [0.55, 0.5], ratio: 3 / 2, widths: W },
  'pricing-hands': { id: 'JNwba6cv4e0', focal: [0.5, 0.55], ratio: 3 / 2, widths: W },
  notfound: { id: 'nF8xhLMmg0c', focal: [0.6, 0.4], ratio: 3 / 2, widths: W },
};

export default sources;
