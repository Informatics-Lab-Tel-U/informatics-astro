'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export interface HeroTitlePair {
  line1: string;
  line2: string;
}

const DEFAULT_PAIR: HeroTitlePair = { line1: 'Informatics', line2: 'Laboratory' };

interface HeroFlipTitleProps {
  pairs?: HeroTitlePair[];
  interval?: number;
  className?: string;
}

// Per-character flip line: chars enter from rotateX(90→0) and exit (0→-90) with stagger
function FlipLine({
  text,
  enterDelay = 0,
}: {
  text: string;
  enterDelay?: number;
}) {
  return (
    <span className="inline-flex">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -75, opacity: 0 }}
          transition={{
            duration: 0.38,
            delay: enterDelay + i * 0.03,
            ease: [0.2, 0, 0.4, 1],
          }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function HeroFlipTitle({
  pairs,
  interval = 4500,
  className
}: HeroFlipTitleProps) {
  const fullPairs = React.useMemo<HeroTitlePair[]>(() => {
    const extras = Array.isArray(pairs)
      ? pairs.filter(
          (p): p is HeroTitlePair =>
            p !== null &&
            typeof p === 'object' &&
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isMulti) return;

    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % fullPairs.length;
      setCurrentIndex(indexRef.current);
    }, interval);

    return () => clearInterval(timer);
  }, [isMulti, interval, fullPairs.length]);

  // Static: no extras, no animation
  if (!isMulti) {
    return (
      <span className={cn('inline-block', className)}>
        <span className="block">{DEFAULT_PAIR.line1}</span>
        <span className="block">{DEFAULT_PAIR.line2}</span>
      </span>
    );
  }

  const currentPair = fullPairs[currentIndex];

  return (
    <span className={cn('inline-block', className)} style={{ perspective: '800px' }}>
      {/*
       * AnimatePresence mode="wait": old pair fully exits before new pair enters.
       * Key is shared across both lines so they exit/enter as one unit.
       */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className="inline-block"
        >
          {/* Line 1 */}
          <span className="block">
            <FlipLine text={currentPair.line1} enterDelay={0} />
          </span>
          {/* Line 2 — slight stagger after line 1 */}
          <span className="block">
            <FlipLine text={currentPair.line2} enterDelay={0.05} />
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
