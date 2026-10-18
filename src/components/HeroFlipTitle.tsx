"use client";

import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface HeroTitlePair {
  line1: string;
  line2: string;
}

const DEFAULT_PAIR: HeroTitlePair = { line1: "Informatics", line2: "Laboratory" };

interface HeroFlipTitleProps {
  pairs?: HeroTitlePair[];
  defaultInterval?: number; // duration for default pair "Informatics Laboratory" (ms)
  interval?: number; // duration for custom extra pairs (ms)
  className?: string;
}

/**
 * FlipLine: renders one line with a 3D cylindrical roll transition.
 *
 * - NO OPACITY FADE: text remains 100% crisp and solid throughout.
 * - 3D Tumbler effect: old text rolls up (y: 0 -> -100%, rotateX: 0 -> -90deg),
 *   while new text rolls in from below (y: 100% -> 0%, rotateX: 90 -> 0deg).
 * - Ultra-smooth custom cubic-bezier ease [0.16, 1, 0.3, 1] for silky deceleration.
 * - Ghost element maintains exact layout dimensions without any layout shifts.
 */
function FlipLine({ text, textKey, delay = 0 }: { text: string; textKey: number; delay?: number }) {
  return (
    <span
      className="relative -my-1 block overflow-hidden py-1"
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      {/* Ghost — keeps line height and width stable */}
      <span className="invisible block select-none" aria-hidden="true">
        {text || "\u00A0"}
      </span>

      <AnimatePresence initial={false}>
        <motion.span
          key={textKey}
          className="absolute inset-0 block w-full"
          initial={{ rotateX: 90, y: "100%" }}
          animate={{ rotateX: 0, y: "0%" }}
          exit={{ rotateX: -90, y: "-100%" }}
          transition={{
            duration: 0.65,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            transformOrigin: "50% 50%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function HeroFlipTitle({
  pairs,
  defaultInterval = 10000,
  interval = 3500,
  className,
}: HeroFlipTitleProps) {
  const fullPairs = React.useMemo<HeroTitlePair[]>(() => {
    const extras = Array.isArray(pairs)
      ? pairs.filter(
          (p): p is HeroTitlePair =>
            p !== null &&
            typeof p === "object" &&
            typeof p.line1 === "string" &&
            typeof p.line2 === "string" &&
            p.line1.trim().length > 0 &&
            p.line2.trim().length > 0 &&
            !(p.line1.trim() === DEFAULT_PAIR.line1 && p.line2.trim() === DEFAULT_PAIR.line2),
        )
      : [];
    return [DEFAULT_PAIR, ...extras];
  }, [pairs]);

  const isMulti = fullPairs.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isMulti) return;

    // Default text (index 0) stays visible longer than custom texts
    const currentDuration = currentIndex === 0 ? defaultInterval : interval;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % fullPairs.length);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, isMulti, defaultInterval, interval, fullPairs.length]);

  const currentPair = fullPairs[currentIndex];

  // Only 1 pair → render static, no animation
  if (!isMulti) {
    return (
      <span className={cn("inline-block", className)}>
        <span className="block">{DEFAULT_PAIR.line1}</span>
        <span className="block">{DEFAULT_PAIR.line2}</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-block w-full", className)}>
      {/* Line 1 flips first */}
      <FlipLine text={currentPair.line1} textKey={currentIndex} delay={0} />
      {/* Line 2 follows with a subtle 80ms stagger */}
      <FlipLine text={currentPair.line2} textKey={currentIndex} delay={0.08} />
    </span>
  );
}
