// personas page copy (English). Merged into the dictionary by src/content/index.js.
const page_personas_en = {
  // ---------- Persona pages ----------
  personas: {
    organisers: {
      title: 'TapNConnect for event organisers — prove the relationships your event created',
      description: 'Sell the day after. A relationship report for every edition, exhibitor value you can show at renewal, sponsor reach with honest numbers, and a next-event engine. Counts and aggregates, never visitor data.',
      hero: { h1: 'Prove the relationships your event created, and sell the next edition with it.', sub: 'Registrations, footfall and scans say who came. TapNConnect says what happened between them, and what to do for the next edition.', photoAlt: 'An exhibition hall seen from above, crowded around a small stage under a steel arch' },
      outcomes: [
        { title: 'The relationship report', p: 'One print-ready story, sponsor-brandable: reach, relationships, quality, exhibitors, next edition.' },
        { title: 'Exhibitor renewal proof', p: 'Which exhibitors became hubs, how many accounts progressed in the 30 days after. Shown at renewal, not argued.' },
        { title: 'Sponsor reach, honestly', p: 'Banner views counted only when the banner was on screen; clicks through a short redirect. No cookies, no identities.' },
        { title: 'The next-event engine', p: '“We want 20 % more CIOs.” See who they engaged with, which sessions and channels worked, and target the campaign.' },
      ],
      journey: {
        h2: 'Your edition with TapNConnect',
        fade: ['A footfall number and a list of scans.', 'Renewal talks that start with “trust us”.', 'Sponsors ask for reach and get a guess.'],
        steps: [
          { title: 'Usually, the show ends here.', line: 'You know who came. You cannot say what happened between them.' },
          { title: 'Show days', line: 'Watch the hall meet: which industries mix and which stands are busy. Counts only.' },
          { title: 'The report', line: 'After the last day: the relationships your event created, ready to print and show at renewal.' },
          { title: 'The next edition', line: 'Aim it at the people you want more of, and sell it with the proof.' },
        ],
        scene: { crowd: { meta: 'Sample · live', note: 'Industries mixing. Counts only.' }, next: { meta: 'Sample target', note: 'More CIOs next time' } },
      },
      packages: { h2: 'Packages', p: 'Pilot, Standard and Portfolio. Each is priced per event by a person, usually within a working day.' },
      faq: [
        { q: 'Do organisers receive visitor data?', a: 'No. You see counts and aggregates with a privacy floor on every attendee-attribute cell. A visitor’s circle belongs to the visitor.' },
        { q: 'Do my exhibitors need an app?', a: 'No. Booth staff work from a phone browser; visitors tap or scan without installing anything.' },
        { q: 'Does it replace Cvent or Swapcard?', a: 'No. They run the event; we run what happens between people and after. Write-back to Cvent and Swapcard is on the roadmap.' },
        { q: 'How is it priced?', a: 'Per event, by package. Tell us the show and the number of exhibitors on the Order page and a person confirms within a working day.' },
      ],
    },
    exhibitors: {
      title: 'TapNConnect for exhibitors — accounts, not scan lists',
      description: 'Every visitor your booth meets becomes an account with an owner, an intent and a drafted follow-up. Who on your team knows the company best, one click to your CRM. Priced per seat.',
      hero: { h1: 'Accounts, not scan lists. The Monday hand-over, done by Friday.', sub: 'ABC Technologies: five conversations, three decision-makers, two existing relationships, one owner, one next step. Not “Lead 1 to 5”.', photoAlt: 'An exhibitor in a lanyard glancing across at a visitor during a conversation at a stand' },
      outcomesPhotoAlt: 'A smiling man in a lanyard talking with two visitors, one of them holding a business card',
      outcomes: [
        { title: 'Capture in seconds, one hand', p: 'Tap, badge, QR or a paper card. Two-tap notes for a loud hall, voice when it is quieter.' },
        { title: 'One account, one owner', p: 'Five people on your team meet one company; you see one page. The strongest relationship owns it.' },
        { title: 'The Monday hand-over, by Friday', p: 'Follow-ups drafted for each account, in your voice, with the promise in them. One yes per message.' },
        { title: 'Results you can show the board', p: 'Customers, meetings held, deals opened, repeat business. By salesperson, across events. Real meetings, not scans.' },
      ],
      journey: {
        h2: 'Your show with TapNConnect',
        fade: ['A scan list: Lead 1, Lead 2, Lead 3.', 'Follow-ups written on Monday, from memory.', 'Nobody knows who on the team knows the buyer.'],
        steps: [
          { title: 'Usually, a scan list.', line: 'Five conversations end up as “Lead 1” to “Lead 5”.' },
          { title: 'A tap at the stand', line: 'A tap, a scan or a paper card. One yes from the visitor and it is saved.' },
          { title: 'The account page fills', line: 'Everyone on your team who met them lands on one page, with one owner.' },
          { title: 'Monday, drafted', line: 'A follow-up for each account, in your voice, with the promise in it.' },
          { title: 'Then your CRM', line: 'One click sends the account across, with the context your CRM never had.' },
        ],
        scene: { drafts: [{ note: 'Thank you for Tuesday. The proposal is attached.', why: 'Draft for Al Noor Trading' }, { note: 'Pricing, as promised.', why: 'Draft for Oasis Energy' }], route: { note: 'Account page' } },
      },
      packages: { h2: 'Seats', p: 'Basic and Pro seats, with or without an event, plus stand cards. Priced per seat by a person within a working day.' },
      faq: [
        { q: 'Do visitors need the app?', a: 'No. They tap or scan and give one yes on their phone. They can claim their circle later, free.' },
        { q: 'Does it work offline in a hall with weak signal?', a: 'Captures are saved on the phone and sent when the signal returns.' },
        { q: 'Which CRMs?', a: 'Salesforce, HubSpot and Dynamics hand-over, with Marketo on the roadmap. The account page is CRM-ready even without an integration.' },
        { q: 'Who owns the data?', a: 'The company owns what its seats captured for it. A staff member’s personal circle is separate and stays theirs.' },
      ],
    },
    sponsors: {
      title: 'TapNConnect for sponsors — what your sponsorship delivered',
      description: 'Your banner on the event’s attendee cards and event page, rotated by tier. Views counted only on screen, no cookies, no identities. Keep the people who tapped with starter cards.',
      hero: { h1: 'What your sponsorship delivered, counted honestly. And the people who tapped, kept.', sub: 'Your banner where people actually look: on the attendee cards they tap and the event page they open. Counted when it was on screen, never guessed.', photoAlt: 'A darkened hall with a lit screen and rows of seated attendees' },
      outcomes: [
        { title: 'Placement by tier', p: 'Platinum, Gold, Silver, Bronze decide where the logo shows, how large, and your share of banner views.' },
        { title: 'Figures you can trust', p: 'A view counts only when the banner was on screen. A click goes through a short redirect. No cookie, no stored address.' },
        { title: 'Starter cards', p: 'Two tap cards for your team for 90 days after the show: Ask, reminders, the advisor and follow-up, so the people who tapped stay in your circle.' },
        { title: 'Your own page', p: 'Reach, the tier’s promise against what was delivered, and your relationships, in the same portal as the exhibitors.' },
      ],
      journey: {
        h2: 'Your sponsorship with TapNConnect',
        fade: ['A logo on a wall and no way to say who saw it.', 'Reach is an estimate.', 'The people who tapped drift away after the show.'],
        steps: [
          { title: 'Usually, a logo on a wall.', line: 'Nobody can say who saw it.' },
          { title: 'Your banner goes live', line: 'On the attendee cards people tap and the event page they open, placed by your tier.' },
          { title: 'Views, counted honestly', line: 'A view counts only while the banner is on screen. No cookies, no identities.' },
          { title: 'The people who tapped, kept', line: 'Two starter cards for your team for 90 days, so those people stay in your circle.' },
        ],
        scene: { banner: { note: 'Your banner' } },
      },
      packages: { h2: 'Tiers', p: 'Platinum, Gold, Silver and Bronze. A person confirms the price within a working day.' },
      faq: [
        { q: 'Is my banner on every member’s card?', a: 'No. Only on attendee cards issued for the event you sponsor and on that event’s page in the app. A member’s own professional card is never ad space.' },
        { q: 'Can I see who viewed it?', a: 'No, and neither can we. We count views, not people.' },
        { q: 'Is it ROI?', a: 'We call it “what your sponsorship delivered” and compare it with the tier’s promise. Return needs the price you paid, which the organiser holds.' },
      ],
    },
    companies: {
      title: 'TapNConnect for companies — relationship memory that survives staff churn',
      description: 'Who in our company knows this person, and how well? Seats and cards for your team with or without events, a shared pool of AI credits, and every relationship kept by the company.',
      hero: { h1: 'Relationship memory that stays when people move on.', sub: 'Every relationship your team captures stays with the company when the salesperson leaves. Work accounts, separate from personal ones, by design.', photoAlt: 'People mingling and talking at an evening networking event, glasses in hand', sticker: { meta: 'Sample figures', note: 'Who here knows Qamar Bank?', lines: ['Mohammed · met in person', 'Layla · two calls'] } },
      outcomesPhotoAlt: '',
      outcomes: [
        { title: 'Relationship memory', p: 'One page per company you deal with: who met whom, what was discussed, what was promised, who owns it.' },
        { title: 'Work and personal, apart', p: 'A seat is a work account with the work e-mail. A person’s own circle is theirs; what they capture for you is yours.' },
        { title: 'Your documents in the answers', p: 'Price lists, case studies, playbooks: the sales specialist drafts with them, with the source on every line.' },
        { title: 'CRM hygiene without the nagging', p: 'The hand-over to Salesforce, HubSpot or Dynamics is one click, with the context the CRM never had.' },
      ],
      journey: {
        h2: 'Your year with TapNConnect',
        fade: ['The relationship leaves with the salesperson.', 'Nobody is sure who knows whom.', 'Work contacts mixed in with personal ones.'],
        steps: [
          { title: 'Usually, it walks out the door.', line: 'When a salesperson leaves, the relationships leave with them.' },
          { title: 'Capture everywhere', line: 'Meetings, calls, trade shows, the shop counter. Tap, voice or WhatsApp, on a work seat.' },
          { title: 'One page per company', line: 'Who met whom, what was promised, who owns it. It stays when people move on.' },
          { title: 'Monday, drafted', line: 'Each seat’s brief, each account’s owner, and drafts waiting for a yes.' },
          { title: 'Results, by quarter', line: 'Customers, repeat business, introductions. By person.' },
        ],
        scene: { channels: ['Meetings', 'Calls', 'Trade shows', 'Shop counter'], drafts: [{ note: 'Follow up with Qamar Bank', why: 'Owner: Mohammed. Promise due Thursday.' }, { note: 'Introduce Layla to Al Noor', why: 'Drafted for Layla’s yes.' }], results: ['Customers', 'Repeat business', 'Introductions'] },
      },
      packages: { h2: 'The everyday plan', p: 'Seats, cards and a monthly AI pool on a 12-month term. Priced by seats and cards by a person within a working day.' },
      faq: [
        { q: 'Does it read our inboxes?', a: 'No. We never mine mail. Relationships enter through what your team captures, imports from their own contacts, or hands over.' },
        { q: 'Can we start without an event?', a: 'Yes. The everyday plan has no event in it; add events when you exhibit.' },
        { q: 'Where is the data kept?', a: 'In the UAE (Azure UAE North). Names are kept in a vault and the AI works on pseudonyms.' },
      ],
    },
    individuals: {
      title: 'TapNConnect for individuals — never lose a person again',
      description: 'Founders, consultants, investors, recruiters, brokers. Free to start: your card, everyone you meet, 30 voice notes a month. Plus adds your assistant.',
      hero: { h1: 'A circle that lasts, and an assistant that remembers for you.', sub: 'For the people whose work is relationships: founders, consultants, investors, recruiters, brokers. The one right person instead of a broadcast.', photoAlt: 'A smiling man holding up a blank badge on a lanyard' },
      outcomesPhotoAlt: 'Two friends walking arm in arm through a festival crowd, seen from behind',
      outcomes: [
        { title: 'Remember', p: 'Where did I meet Sarah, what did we discuss, what did I promise? Answered, with the evidence.' },
        { title: 'Prepare', p: 'A brief before tomorrow’s meeting: last time, open promises, what changed at their company.' },
        { title: 'Act', p: 'Three messages drafted every morning for the relationships that need a word today. You say yes.' },
        { title: 'Strengthen', p: 'Quiet relationships surfaced before they go cold. Who can introduce you, from your own circle.' },
      ],
      journey: {
        h2: 'Your first week',
        fade: ['“Where did I meet Sarah?” Lost in a camera roll.', 'Walking into tomorrow’s meeting cold.', 'Good people go quiet, unnoticed.'],
        steps: [
          { title: 'Usually, it is lost.', line: 'The name is in a camera roll. The promise is in your head.' },
          { title: 'Day 1: your card', line: 'Create it in two minutes. Import your contacts if you like; they stay yours.' },
          { title: 'Day 2: meet someone', line: 'Tap, or hold to record. “Save this memory?” Yes.' },
          { title: 'Day 3: Today', line: 'Today shows its first card. You send the first note.' },
          { title: 'Week 2: just ask', line: 'You ask the assistant something you had forgotten. It knew.' },
        ],
        scene: { card: { name: 'Layla Nasser', line: 'Sample card', note: 'Two minutes' }, ask: { q: 'Where did I meet Sara?' } },
      },
      packages: { h2: 'Plans', p: 'Free keeps your card and your people. Plus adds your assistant. The card comes with a year of Plus.' },
      faq: [
        { q: 'Is Free really free?', a: 'Yes. Your card, everyone you meet, 30 voice notes a month and 30 AI credits a day, with no card required.' },
        { q: 'Can I use my own AI assistant?', a: 'Yes, on Plus and above. Your circle answers inside ChatGPT, Claude or Siri through a connection you approve and can revoke.' },
        { q: 'What happens to my data if I leave?', a: 'Delete means delete: your circle, your memories and every copy derived from them, within the legal retention periods we publish.' },
      ],
    },
    common: {
      scene: { visitor: 'Visitor', stand: 'Your stand', you: 'You', someone: 'Someone new', team: 'Your team', company: 'Your company', crm: 'Your CRM', met: { meta: 'Sample · Hall 3, 11:20', note: 'Met in person' } },
      sample: 'Sample figures', pricedPerOrder: 'Priced per order',
      outcomesH2: 'What you get', faqH2: 'Questions people ask', ctaH2: 'Ready when you are.', ctaP: 'Order on this page, or talk to a person first.',
      seePricing: 'See the price list',
    },
  },
};

// The personas story copy. Merged over the block above.
export const story = {
  personas: {
    hero: { seeInside: 'What you will see' },
  },
};
export default page_personas_en;
