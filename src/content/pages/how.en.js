// how page copy (English). Merged into the dictionary by src/content/index.js.
const page_how_en = {
  // ---------- How it works ----------
  how: {
    title: 'How TapNConnect works — before, during and after an event, and every day',
    description: 'Tap, keep, remember, next step, outcome. How TapNConnect captures a relationship where it happens and keeps it alive, at an event and every day after.',
    hero: {
      h1: 'A relationship, from the handshake to the outcome.',
      sub: 'TapNConnect is the relationship OS for events and the people in them. One loop, five verbs. Here is what happens at an event and on an ordinary Tuesday.',
      sticker: { meta: 'Voice note, 20 seconds', note: 'Intro to Huda by Sunday.' },
    },
    event: {
      h2: 'At an event',
      label: 'Before, during and after an event',
      phases: [
        { title: 'Before', who: 'Visitor', p: 'The assistant tells you who is worth meeting, and why.', who2: 'Exhibitor', p2: 'Set your target accounts. It finds the warm paths through your team.' },
        { title: 'During', who: 'Visitor', p: 'Tap or scan, say one yes, and a 20-second voice note keeps the promise.', who2: 'Exhibitor', p2: 'The visitor becomes an account with an owner and a next step before the hall closes.' },
        { title: 'After', who: 'Visitor', p: 'Reminders are set and follow-ups are drafted, waiting for your yes.', who2: 'Exhibitor', p2: 'Accounts ranked and CRM-ready. The Monday hand-over is done.' },
      ],
      scenes: {
        before: { visitor: { meta: 'Your prep · sample', note: 'Worth a hello: Omar, Hall 3.' }, exhibitor: { meta: 'Target accounts · sample', note: 'Qamar Bank', line: 'Warm path: Mohammed.' } },
        during: { met: { meta: 'Sample · Hall 3, 11:20', note: 'Met in person' } },
        after: { draft: { meta: 'Draft for Omar · sample', note: 'Lovely to meet you. Pricing by Thursday.', yes: 'Send', no: 'Later' }, account: { meta: 'Qamar Bank · account', note: 'CIO met in person', line: 'Owner: Mohammed' }, reminder: { meta: 'Reminder', note: 'Send pricing, Thursday' }, crm: 'Ready for your CRM' },
      },
      organiser: { photoAlt: 'A hand lays out conference programmes beside blank name tags on a registration table.',
        title: 'And for the organiser',
        p: 'A report on what the taps created: new and repeat relationships, which exhibitors became hubs, who to aim for next time. Counts, never a visitor’s name.',
      },
    },
    daily: {
      h2: 'Every day after',
      rows: [
        { when: 'Morning', you: 'Open Today', it: 'Three cards: who needs you, what is due, who to meet. “Draft the three” is one tap.' },
        { when: 'Meeting', you: 'Hold to record', it: 'The memory is already filled.' },
        { when: 'Between things', you: 'Answer one WhatsApp question', it: '“How was the meeting with Sarah?” One reply, done.' },
        { when: 'Weekly', you: 'Decide on five', it: 'Keep, let go, or ask. One swipe each.' },
        { when: 'Anytime', you: 'Ask', it: 'In the app, WhatsApp, or your own assistant. Every answer shows its evidence.' },
      ],
    },
    capture: {
      h2: 'Six ways to capture, one result',
      items: ['Tap a card', 'Scan a badge', 'Scan a QR', 'Photo of a paper card', 'Voice note', 'Forward a WhatsApp message'],
      hint: 'Tap a tile to see what it saves.',
      memory: { meta: 'Sample memory', via: 'Captured by', name: 'Sara Khalid', where: 'Hall 3, Tuesday 11:20', said: 'We talked about the Q3 scope.', promised: 'You promised: send it Thursday.' },
      p: 'Every one saves the same memory: who, where, when, what you said, what each of you promised. Sure captures save silently, with undo.',
    },
    assistant: {
      h2: 'What the assistant may do on its own',
      p: 'It saves, reminds, suggests and drafts. It never sends, writes to your CRM or shares a name without your yes. After three identical yeses it offers, once, to make that one thing automatic.',
      consent: 'Your assistant may send email after you approve.',
      alone: { h: 'On its own', items: ['Save', 'Remind', 'Suggest', 'Draft'] },
      ask: { h: 'Only with your yes', items: ['Send a message', 'Write to your CRM', 'Share a name'] },
      demo: {
        to: 'Draft to Omar',
        note: 'Good luck on Sunday, Omar. Run it for the hall!',
        off: 'Sending is off, so this stays a draft. Turn the switch on to try it.',
        wait: 'Nothing leaves until you say yes.',
        approve: 'Yes, send it',
        sent: 'Sent, because you said yes.',
        next: 'Draft another',
        yeses: 'Same yes in a row',
        offer: 'Three yeses to the same thing. Make this one automatic?',
        offerYes: 'Yes, make it automatic',
        offerNo: 'Not now',
        auto: 'Automatic, for this one thing only. You can stop it any time.',
        stop: 'Stop sending on its own',
      },
    },
    cta: { h2: 'Go meet someone. We’ll remember the rest.' },
  },
};
export default page_how_en;
