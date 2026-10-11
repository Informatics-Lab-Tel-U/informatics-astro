'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface HeroTitlePair {
  line1: string;
  line2: string;
}

const DEFAULT_PAIR: HeroTitlePair = { line1: 'Informatics', line2: 'Laboratory' };

// Duration of each half of the flip animation (ms)
const HALF = 280;

interface HeroFlipTitleProps {
  pairs?: HeroTitlePair[];
  interval?: number;
  className?: string;
}

type Phase = 'idle' | 'out' | 'snap' | 'in';

function FlipLine({ text, phase }: { text: string; phase: Phase }) {
  const transformMap: Record<Phase, string> = {
    idle: 'rotateX(0deg)',
    out:  'rotateX(-90deg)',
    snap: 'rotateX(90deg)',
    in:   'rotateX(0deg)',
  };

  const transition =
    phase === 'out'
      ? `transform ${HALF}ms cubic-bezier(0.55, 0, 1, 1)`
      : phase === 'in'
      ? `transform ${HALF}ms cubic-bezier(0, 0, 0.45, 1)`
      : 'none';

  return (
    <span
      style={{
        display: 'block',
        transformOrigin: '50% 50%',
        transform: transformMap[phase],
        transition,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      {text}
    </span>
  );
}

export default function HeroFlipTitle({
  pairs,
  interval = 4500,
  className
}: HeroFlipTitleProps) {
  // Build full list: default always first, then valid extras (filter out duplicate of default)
  const fullPairs = React.useMemo<HeroTitlePair[]>(() => {
    const extras = Array.isArray(pairs)
      ? pairs.filter(
          (p) =>
            p &&
            typeof p.line1 === 'string' &&
            typeof p.line2 === 'string' &&
            p.line1.trim().length > 0 &&
            p.line2.trim().length > 0 &&
            !(
              p.line1.trim() === DEFAULT_PAIR.line1 &&
              p.line2.trim() === DEFAULT_PAIR.line2
            )
        )
      : [];
    return [DEFAULT_PAIR, ...extras];
  }, [pairs]);

  const isMulti = fullPairs.length > 1;

  const [currentPair, setCurrentPair] = useState<HeroTitlePair>(fullPairs[0]);
  const [phase, setPhase] = useState<Phase>('idle');
  const indexRef = useRef(0);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doFlip = useCallback((nextPair: HeroTitlePair) => {
    if (animRef.current) clearTimeout(animRef.current);

    // Phase 1: flip out (ease-in, accelerate into flip)
    setPhase('out');

    animRef.current = setTimeout(() => {
      // Phase 2: instant snap to opposite side + swap text
      // Both states invisible at 90deg via backfaceVisibility:hidden
      setCurrentPair(nextPair);
      setPhase('snap');

      // Two rAFs ensure browser commits the snap before transition resumes
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Phase 3: flip in (ease-out, decelerate to rest)
          setPhase('in');
          animRef.current = setTimeout(() => setPhase('idle'), HALF + 20);
        });
      });
    }, HALF);
  }, []);

  useEffect(() => {
    if (!isMulti) return;

    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % fullPairs.length;
      doFlip(fullPairs[indexRef.current]);
    }, interval);

    return () => {
      clearInterval(timer);
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [isMulti, interval, fullPairs, doFlip]);

  // No extras → static, no animation
  if (!isMulti) {
    return (
      <span className={cn('inline-block', className)}>
        <span className="block">{DEFAULT_PAIR.line1}</span>
        <span className="block">{DEFAULT_PAIR.line2}</span>
      </span>
    );
  }

  return (
    <span className={cn('inline-block', className)} style={{ perspective: '1200px' }}>
      <FlipLine text={currentPair.line1} phase={phase} />
      <FlipLine text={currentPair.line2} phase={phase} />
    </span>
  );
}
