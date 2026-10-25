/** The TapNConnect mark: a rounded tile with a tap ring — petrol, with the coral thread at its heart. Pure SVG, no image request. */
export default function BrandMark({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--tnc-accent)" />
      <circle cx="16" cy="16" r="4" fill="var(--tnc-site-thread)" />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="var(--tnc-accent-ink)" strokeOpacity=".7" strokeWidth="1.6" />
      <path d="M16 3.5v3M16 25.5v3M3.5 16h3M25.5 16h3" stroke="var(--tnc-accent-ink)" strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
