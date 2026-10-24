'use client';
import { useEffect, useState } from 'react';
import { track, EVENTS } from '@/lib/analytics';

/** Three audiences, one page: the URL hash remembers the tab (#companies, #events) so links land on the right list. */
export default function PricingTabs({ tabs, panels }) {
  const keys = Object.keys(tabs);
  const [active, setActive] = useState(keys[0]);
  useEffect(() => { const h = location.hash.replace('#', ''); if (keys.includes(h)) setActive(h); if (h === 'card' || h === 'packs') setActive('people'); }, [keys]);
  const pick = (k) => { setActive(k); history.replaceState(null, '', `#${k}`); track(EVENTS.pricing_tab, { tab: k }); };
  return (
    <div>
      <div role="tablist" aria-label="Pricing" className="glass inline-flex flex-wrap gap-1 p-1">
        {keys.map((k) => <button key={k} role="tab" type="button" aria-selected={active === k} aria-controls={`panel-${k}`} id={`tab-${k}`} onClick={() => pick(k)} className={`btn btn-sm ${active === k ? 'btn-primary' : 'btn-quiet'}`}>{tabs[k]}</button>)}
      </div>
      {keys.map((k) => <div key={k} role="tabpanel" id={`panel-${k}`} aria-labelledby={`tab-${k}`} hidden={active !== k} className="mt-8">{panels[k]}</div>)}
    </div>
  );
}
