// The site's photographs and video, by slot. Files live in public/media/<key>-1920.jpg, <key>-960.jpg, <key>.mp4
// after `node scripts/media.mjs` (run by the Fetch media workflow). Ids are Unsplash photo ids and Pexels video ids,
// chosen from the media-scout contact sheet; credits are written to public/media/CREDITS.md.
// A slot with no id renders a quiet gradient until a picture is chosen.
export const MEDIA = {
  // the landing hero: a busy exhibition hall, people walking the aisles (video loop + poster)
  heroVideo: { pexels: null, credit: '' },
  hall: { unsplash: null, credit: '' },
  // the moment: two people at a stand, talking or exchanging details
  meet: { unsplash: null, credit: '' },
  // after the event: the hall from above / empty aisles, or a person back at work with their phone
  after: { unsplash: null, credit: '' },
  // buyer pages
  organisers: { unsplash: null, credit: '' },
  exhibitors: { unsplash: null, credit: '' },
  sponsors: { unsplash: null, credit: '' },
  companies: { unsplash: null, credit: '' },
  individuals: { unsplash: null, credit: '' },
};
export const hasMedia = (key) => Boolean(MEDIA[key] && (MEDIA[key].unsplash || MEDIA[key].pexels));
