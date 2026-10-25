'use client';
import dynamic from 'next/dynamic';

// The particle canvas is decoration: it loads as its own chunk after the page, never in anyone's first-load JS.
const Shore = dynamic(() => import('./Shore'), { ssr: false, loading: () => null });
export default function ShoreParticles() { return <Shore />; }
