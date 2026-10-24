'use client';
import { useEffect } from 'react';
import { track, EVENTS } from '@/lib/analytics';
export default function PersonaView({ persona }) { useEffect(() => { track(EVENTS.persona_view, { persona }); }, [persona]); return null; }
