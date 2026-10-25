// The few icons Home and the product notes use, inline (lucide strokes). lucide-react ships a client runtime even for
// server-rendered icons, which would put it in Home's first-load JS; these stay pure markup.
const Svg = ({ size = 16, className = '', children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>
);
export const ArrowRight = (p) => <Svg {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Svg>;
export const Check = (p) => <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>;
export const Mail = (p) => <Svg {...p}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></Svg>;
