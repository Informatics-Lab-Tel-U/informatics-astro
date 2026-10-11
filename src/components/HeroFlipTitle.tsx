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

/**
 * FlipLine: renders one line of text with a 3D flip transition.
 *
 * The ghost <span> holds layout space so there is no layout jump.
 * The animated <motion.span> is absolutely positioned so both the
 * exiting (old) and entering (new) spans share exactly the same
 * pixel position. AnimatePresence (sync/default mode) lets them
 * overlap in time: old rotates out while new rotates in simultaneously,
 * so the viewer clearly sees the new text arriving.
 */
function FlipLine({
  text,
  textKey,
  delay = 0,
}: {
  text: string;
  textKey: number;
  delay?: number;
}) {
  return (
    <span className="relative block" style={{ perspective: '1200px' }}>
      {/* Ghost — invisible, keeps line height stable */}
      <span className="invisible block select-none" aria-hidden="true">
        {text || '\u00A0'}
      </span>

      {/*
       * AnimatePresence default (sync): exit and enter run simultaneously.
       * When textKey changes:
       *   - old span: rotateX(0 → -90deg) + fade out  ← folds up and away
       *   - new span: rotateX(90 → 0deg) + fade in    ← unfolds from below
       * Both at absolute position → overlap = visible flip between two texts.
       */}
      <AnimatePresence>
        <motion.span
          key={textKey}
          className="absolute top-0 left-0 w-full"
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{
            duration: 0.45,
            delay,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
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

  const currentPair = fullPairs[currentIndex];

  // Only 1 pair → render static, no animation
  if (!isMulti) {
    return (
      <span className={cn('inline-block', className)}>
        <span className="block">{DEFAULT_PAIR.line1}</span>
        <span className="block">{DEFAULT_PAIR.line2}</span>
      </span>
    );
  }

  return (
    <span className={cn('inline-block w-full', className)}>
      {/* Line 1 flips first */}
      <FlipLine text={currentPair.line1} textKey={currentIndex} delay={0} />
      {/* Line 2 follows with a 60ms stagger */}
      <FlipLine text={currentPair.line2} textKey={currentIndex} delay={0.06} />
    </span>
  );
}
