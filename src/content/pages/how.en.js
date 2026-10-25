// how page copy (English). Merged into the dictionary by src/content/index.js.
const page_how_en = {
  // ---------- How it works ----------
  how: {
    title: 'How TapNConnect works — before, during and after an event, and every day',
    description: 'Tap, keep, remember, next step, outcome. How TapNConnect captures a relationship where it happens and keeps it alive, at an event and every day after.',
    hero: {
      h1: 'A relationship, from the handshake to the outcome.',
      sub: 'TapNConnect is the relationship OS for events and the people in them. One loop, five verbs. Here is what happens at an event and on an ordinary Tuesday.',
      photoAlt: 'A woman explaining something with her hands to two listeners at an event.',
      sticker: { meta: 'Voice note, 20 seconds', note: 'Intro to Huda by Sunday.' },
    },
    event: {
      h2: 'At an event',
      photoAlt: 'Two men talking in a bright hall, with a small group chatting behind them.',
      phases: [
        { title: 'Before', who: 'Visitor', p: 'Your profile and what you are looking for are known. The assistant tells you who is worth meeting and why.', who2: 'Exhibitor', p2: 'Target accounts and booth goals set. Warm paths to them surfaced from your team’s own relationships.' },
        { title: 'During', who: 'Visitor', p: 'Tap or scan. Details are exchanged with one yes. A 20-second voice note becomes a memory with the promise in it.', who2: 'Exhibitor', p2: 'A visitor becomes an account with an owner, an intent and a suggested follow-up, before the hall closes.' },
        { title: 'After', who: 'Visitor', p: 'You leave with a circle that persists, reminders set, and the follow-ups drafted for your yes.', who2: 'Exhibitor', p2: 'Prioritised accounts, who on the team knows each company, CRM-ready. The Monday hand-over done.' },
      ],
      organiser: {
        title: 'And for the organiser',
        p: 'A report that answers “what did those tap moments create?”: new and repeat relationships, cross-industry clusters, which exhibitors became hubs, what to target for the next edition. Counts and aggregates, never a visitor’s name.',
        photoAlt: 'Four speakers on a panel with microphones, and an audience seated at tables in front of them.',
      },
    },
    daily: {
      h2: 'Every day after',
      rows: [
        { when: 'Morning', you: 'Open Today', it: 'Three cards: a relationship that needs attention, a promise due, a chance to connect. “Draft the three” is one tap.' },
        { when: 'Meeting', you: 'Hold to record', it: 'The memory is already filled; nothing else appears.' },
        { when: 'Between things', you: 'Reply to one WhatsApp question', it: '“How was the meeting with Sarah? Anything to remember?” One reply, done.' },
        { when: 'Weekly', you: 'Decide on five', it: 'Keep, let go, or ask about five relationships, one swipe each.' },
        { when: 'Anytime', you: 'Ask', it: 'In the app, in WhatsApp, or in your own assistant (ChatGPT, Claude, Siri). Every answer with its evidence.' },
      ],
    },
    capture: {
      h2: 'Six ways to capture, one result',
      items: ['Tap a card', 'Scan a badge', 'Scan a QR', 'Photo of a paper card', 'Voice note', 'Forward a WhatsApp message'],
      hint: 'Tap a tile to see what it saves.',
      memory: { meta: 'Sample memory', via: 'Captured by', name: 'Sara Khalid', where: 'Hall 3, Tuesday 11:20', said: 'We talked about the Q3 scope.', promised: 'You promised: send it Thursday.' },
      p: 'Every one creates the same memory: who, where, when, what you discussed, what each of you promised. High-confidence captures save silently, with undo. A question is asked only when the answer changes what happens next.',
    },
    assistant: {
      h2: 'What the assistant may do on its own',
      p: 'Save, remind, suggest and draft. It never sends, writes to your CRM or shares a name without your yes. After three identical yeses it offers, once, to make that one thing automatic. You can turn it back off in one sentence.',
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
