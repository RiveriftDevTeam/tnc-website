// Photo slots: one line per picture on the site. `scripts/media.mjs` (npm run media) reads this file, fetches the
// renditions into public/media/ and writes media.json. To swap a photo, change its `id`, keep the slot name, and run
// `npm run media` again (delete the slot's old files first).
//   source   'unsplash' (default) or 'pexels'
//   id       Unsplash: the photo id from the photo page URL. Pexels: the numeric id from the photo page URL
//   focal    [x, y] 0..1, the point of the photo kept in frame when it is cropped
//   ratio    width / height of the crop
//   widths   rendition widths in px
//   zoom     optional, crops tighter around the focal point
//   Pexels slots also carry who made the photo (Pexels has no public page API we may script against):
//   photographer, profile (the photographer's Pexels page), page (the photo's Pexels page)
// Formats: Unsplash slots get AVIF + WebP at each width (imgix encodes them). Pexels slots have no imgix, so the
// script crops and encodes WebP at each width locally (ffmpeg + cwebp; there is no AVIF encoder on the build
// machine) and media.json records `formats: ['webp']` so Photo.js leaves the AVIF <source> out. Both get one JPG at
// 1200 for the <img> fallback.
// Licences: Unsplash License and Pexels License (both free for commercial use, no attribution needed; the Credits
// page is a courtesy).
const W = [480, 800, 1200, 1600];
const PORTRAIT = [480, 800, 1200]; // 4:5 crops: 1600 wide would be a 3.2 MP photo, more than a portrait ever shows
const WIDE = [480, 800, 1200, 1600, 2400];

// photo page slugs (the part of the Pexels URL before the id)
const SLUGS = {
  34623598: 'diverse-group-of-people-socializing-indoors',
  7648057: 'women-standing-by-the-registration-booth-at-a-business-conference',
  20796084: 'happy-woman-standing-by-stall-in-museum',
  7964477: 'smiling-people-handshaking-on-street',
  7648263: 'a-man-in-long-sleeve-holding-a-piece-of-paper',
  8761679: 'a-woman-standing-between-two-men',
  29284300: 'smiling-man-with-glasses-at-indoor-event',
  8761648: 'people-having-a-conversation',
  8554436: 'man-and-woman-wearing-id-badges-talking-and-smiling',
  7648043: 'hands-people-party-connection',
  4963440: 'business-people-meeting-outdoors-shaking-hands',
  38136648: 'smiling-woman-at-indoor-event-with-blurred-background',
  15761519: 'a-group-of-women-talking-and-smiling',
  8555242: 'a-couple-walking-on-the-hallway',
  30809489: 'vibrant-day-at-tokyo-international-forum',
};
const pexels = (id, photographer, handle, rest) => ({
  source: 'pexels', id: String(id), photographer, profile: `https://www.pexels.com/@${handle}/`, page: `https://www.pexels.com/photo/${SLUGS[id]}-${id}/`, ...rest,
});

const sources = {
  // Home scroll story
  'story-hall': pexels(30809489, 'Yusei Takeuchi', 'yusei-takeuchi-2149827096', { focal: [0.68, 0.72], ratio: 16 / 9, widths: [480, 800, 1200, 1600, 2000], zoom: 2 }), // a bright exhibition forum, crowd and stands; the crop leaves out the one legible logo (left)
  'story-touch': { id: '36g19a7ivrs', focal: [0.5, 0.5], ratio: 16 / 9, widths: WIDE }, // Act 3: two hands reaching (kept)
  'story-circle': pexels(34623598, 'Caleb Oquendo', 'caleboquendo', { focal: [0.62, 0.45], ratio: 16 / 9, widths: W, zoom: 1.3 }), // Act 6: a circle of people talking and smiling
  // Home doors and their page heroes
  'door-organisers': pexels(7648057, 'RDNE Stock project', 'rdne', { focal: [0.5, 0.5], ratio: 3 / 2, widths: W }), // the registration table
  'door-exhibitors': pexels(20796084, 'Sadettin Dogan', 'huysuzkadraj', { focal: [0.5, 0.62], ratio: 4 / 5, widths: PORTRAIT }), // a smiling stallholder at her booth
  'door-sponsors': pexels(7964477, 'Felicity Tai', 'felicity-tai', { focal: [0.5, 0.5], ratio: 3 / 2, widths: W }), // an introduction, mid-handshake
  'door-individuals': pexels(7648263, 'RDNE Stock project', 'rdne', { focal: [0.5, 0.4], ratio: 4 / 5, widths: PORTRAIT }), // a guest with the programme in hand
  'door-companies': pexels(8761679, 'Pavel Danilyuk', 'pavel-danilyuk', { focal: [0.78, 0.36], ratio: 3 / 2, widths: W, zoom: 1.45 }), // a team at an event
  // Home extras
  'year-coffee': { id: 'k7moOgpIkU8', focal: [0.45, 0.4], ratio: 3 / 2, widths: W }, // kept
  final: pexels(29284300, 'Matheus Bertelli', 'bertellifotografia', { focal: [0.52, 0.5], ratio: 4 / 5, widths: PORTRAIT }),
  // How it works
  'how-hero': pexels(8761648, 'Pavel Danilyuk', 'pavel-danilyuk', { focal: [0.18, 0.4], ratio: 4 / 5, widths: PORTRAIT }),
  'how-event': pexels(8554436, 'Liliana Drew', 'liliana-drew', { focal: [0.5, 0.5], ratio: 3 / 2, widths: W }),
  'how-organiser': pexels(7648043, 'RDNE Stock project', 'rdne', { focal: [0.75, 0.5], ratio: 3 / 2, widths: W, zoom: 1.5 }),
  // Buyer pages
  'persona-sponsor-2': pexels(4963440, 'Ketut Subiyanto', 'ketut-subiyanto', { focal: [0.6, 0.52], ratio: 16 / 9, widths: W, zoom: 1.15 }),
  'persona-exhibitor-2': pexels(38136648, 'Wolf Art', 'wolfart', { focal: [0.5, 0.4], ratio: 4 / 5, widths: PORTRAIT }),
  'persona-individual-2': pexels(15761519, 'Elias Jara', 'eliasjaara', { focal: [0.55, 0.42], ratio: 4 / 5, widths: PORTRAIT, zoom: 1.9 }),
  // Trust, pricing, 404
  'trust-uae': { id: 'oF7dZYCgO3k', focal: [0.55, 0.5], ratio: 3 / 2, widths: W }, // kept: Museum of the Future, Dubai
  'pricing-hands': { id: 'JNwba6cv4e0', focal: [0.5, 0.55], ratio: 3 / 2, widths: W }, // kept
  notfound: pexels(8555242, 'Liliana Drew', 'liliana-drew', { focal: [0.5, 0.5], ratio: 3 / 2, widths: W }),
};

export default sources;

// Muted loops (plan Amendment A2.2): public/media/video/<name>.{mp4,webm} + <name>.jpg poster, made by media.mjs from the
// public download link of each clip. `start`/`duration` pick the clean segment; `fade` is an end-to-start crossfade in
// seconds that makes the loop seamless; `speed` < 1 slows the clip. Pexels, Mixkit and Coverr clips are free for
// commercial use; the page, creator and licence are recorded here and in media.json.
export const videos = {
  // colleagues meeting and talking at a conference, daylight from a tall window: smiling, unhurried, no logo in frame
  hero: {
    source: 'Pexels', page: 'https://www.pexels.com/video/colleagues-talking-at-a-business-conference-8716795/', creator: 'Pavel Danilyuk', creatorUrl: 'https://www.pexels.com/@pavel-danilyuk/',
    licence: 'Pexels License', download: 'https://videos.pexels.com/video-files/8716795/8716795-hd_1920_1080_25fps.mp4', start: 0.3, duration: 11.5, fade: 1, fps: 25,
  },
  // a smiling introduction at a meeting table: hands reach across, a handshake, a second greeting (cut before a laptop logo comes into frame)
  how: {
    source: 'Pexels', page: 'https://www.pexels.com/video/a-group-of-people-introduces-oneself-to-each-other-by-shaking-hands-3252919/', creator: 'fauxels', creatorUrl: 'https://www.pexels.com/@fauxels/',
    licence: 'Pexels License', download: 'https://videos.pexels.com/video-files/3252919/3252919-hd_1920_1080_25fps.mp4', start: 0.3, duration: 9.3, fade: 0.8, fps: 25,
  },
};
