// JS mirror of the motion tokens in src/styles/tokens.css, for WAAPI and the story scene. Keep the two in step.
export const DUR = { instant: 120, quick: 200, base: 320, slow: 560, story: 800 };
export const EASE = {
  out: 'cubic-bezier(.16,1,.3,1)',
  inOut: 'cubic-bezier(.65,0,.35,1)',
  exit: 'cubic-bezier(.4,0,1,1)',
  pop: 'linear(0, .5 18%, 1.08 40%, .98 62%, 1)',
};

// Scalar curves for scroll-scrubbed values (0..1 in, 0..1 out)
export const easeOut = (x) => 1 - Math.pow(1 - x, 4);
export const easeInOut = (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2);
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
/** Local progress of p inside [a, b], clamped to 0..1. */
export const span = (p, a, b) => clamp01((p - a) / (b - a));

export function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
