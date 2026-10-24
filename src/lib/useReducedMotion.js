'use client';
import { useEffect, useState } from 'react';
export default function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => { const mq = matchMedia('(prefers-reduced-motion: reduce)'); const f = () => setReduce(mq.matches); f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f); }, []);
  return reduce;
}
