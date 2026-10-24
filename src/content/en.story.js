// The landing story and the buyer vignettes (English). Merged over en.js by src/content/index.js.
const story = {
  home: {
    acts: [
      { eyebrow: 'The relationship assistant for events · Dubai', h: 'Stay close to the people you meet.', p: 'One tap at the stand, and the person stays with you long after the hall empties. For visitors, exhibitors, sponsors and the organisers who bring them together.' },
      { eyebrow: 'The moment', h: 'One tap. The moment is kept.', p: 'Who, where, when, and what you promised each other. No form, no typing, no app for the visitor.', chip: 'Met in person · Gulf Tech Expo · 14 Oct · Hall 4' },
      { eyebrow: 'The next week', h: 'Then the hall empties.', p: 'A hundred handshakes become a pile of cards. Names fade. By day 47 the lead is cold and nobody knows why.' },
      { eyebrow: 'TapNConnect', h: 'TapNConnect keeps the thread alive.', p: 'It remembers each person, tells you when a word would count, and writes the first draft. Nothing is sent without your yes.' },
      { eyebrow: 'One hall, four winners', h: 'Everyone in the hall leaves with more than a badge scan.', p: 'The visitor keeps a circle. The exhibitor gets accounts. The sponsor sees what it delivered. The organiser can prove it all.' },
    ],
    take: {
      eyebrow: 'Don’t leave it at the event', h2: 'Take it home. Keep it alive.',
      p: 'The hall is the most human place in business: aisles full of people walking, talking, sharing. The energy ends when the doors close. The relationships don’t have to.',
      panels: [
        { k: 'hall', title: 'At the event', line: 'Three days, a hundred conversations, the best energy in business.' },
        { k: 'meet', title: 'Take it home', line: 'One tap keeps who, where, when, and what you promised each other.' },
        { k: 'after', title: 'Keep it alive', line: 'The assistant enriches each person, tells you when a word would count, and writes it.' },
      ],
    },
    alts: { hero: 'A busy exhibition hall: people walking the aisles between stands, talking and sharing.', hall: 'A crowded exhibition hall with visitors walking between booths.', meet: 'Two people talking at an exhibition stand.', after: 'Back at work after the event, the conversations kept.', organisers: 'A wide view of an exhibition hall full of visitors.', exhibitors: 'Visitors at a busy trade-show stand.', sponsors: 'Banners and crowds at an exhibition.', companies: 'Colleagues meeting at an event.', individuals: 'Two professionals in conversation at a networking event.' },
    chips: { organisers: 'For organisers', exhibitors: 'For exhibitors', sponsors: 'For sponsors', individuals: 'For visitors' },
    who: {
      eyebrow: 'Who it is for', h2: 'Built for the whole hall.', sample: 'Sample figures',
      pitch: {
        organisers: { title: 'Event organisers', line: 'Prove the relationships your event created, and sell the day after.' },
        exhibitors: { title: 'Exhibitors', line: 'Accounts with an owner and a drafted follow-up, not scan lists.' },
        sponsors: { title: 'Sponsors', line: 'Banner reach counted honestly, and the people who tapped kept.' },
        individuals: { title: 'Visitors and professionals', line: 'A circle that lasts, with an assistant that remembers for you.' },
        companies: { title: 'Companies', line: 'Relationship memory that stays when a salesperson leaves.' },
      },
    },
    vignettes: {
      organisers: { title: 'Relationship report', sub: 'Gulf Tech Expo 2026', stats: [{ n: '4,812', l: 'relationships created' }, { n: '71%', l: 'met in person' }, { n: '1,206', l: 'accounts progressed in 30 days' }], bars: [{ w: 82, label: 'Exhibitors who became hubs', value: '82 of 100' }, { w: 64, label: 'Cross-industry clusters', value: '9' }, { w: 48, label: 'Next edition: CIOs engaged', value: '48%' }] },
      exhibitors: { title: 'Accounts', sub: 'Stand B-14 · day 2', rows: [{ company: 'Al Noor Trading', line: '5 conversations · 3 decision-makers · owner Mohammed', next: 'Send proposal' }, { company: 'Qamar Bank', line: '2 conversations · CIO met in person', next: 'Book a demo' }, { company: 'Oasis Energy', line: '1 conversation · pricing promised', next: 'Send pricing' }], owner: 'Strongest relationship owns each account', crm: 'One click to CRM' },
      sponsors: { title: 'What your sponsorship delivered', sub: 'Gold · Gulf Tech Expo', stats: [{ n: '38,420', l: 'banner views on screen' }, { n: '1,912', l: 'clicks' }], bar: { w: 27, label: 'Share of views · promised 25%', value: 'delivered 27%' }, note: 'Counted only when the banner was on screen. No cookie, no identity.' },
      individuals: { title: 'Today', sub: 'Thursday', cards: [{ kind: 'mail', line: 'Omar’s marathon is on Sunday. Wish him luck?', why: 'Met at Gulf Tech Expo · he mentioned the race', yes: 'Send a note', no: 'Not now' }, { kind: 'check', line: 'You promised Sara the pilot scope by Thursday.', why: 'Said in your voice note · 14 Oct', yes: 'Draft it', no: 'Later' }, { kind: 'mail', line: 'Yusuf changed company. Congratulate him?', why: 'Introduced by Omar · now at Al Noor', yes: 'Send a note', no: 'Not now' }] },
    },
    how: { eyebrow: 'How it works', h2: 'Five verbs, one loop.' },
    year: { eyebrow: 'One person, one year', h2: 'Trust first. Business follows.', p: 'Layla meets Omar in October. Eleven months later he asks her for a proposal. Everything in between is the assistant doing its job, and Layla saying yes.' },
    outcomes: {
      eyebrow: 'Why it matters', h2: 'The numbers behind the hall.',
      items: [{ n: '100+', l: 'people a visitor meets at a three-day show' }, { n: '47', l: 'days before a warm lead goes quiet' }, { n: '0', l: 'notes anyone keeps about what was said' }, { n: '1', l: 'tap to keep all of it' }],
    },
  },
  personas: {
    hero: { seeInside: 'What you will see' },
  },
};
export default story;
