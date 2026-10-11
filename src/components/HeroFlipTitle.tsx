'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FlipText } from '@/components/block/flip-text';
import { cn } from '@/lib/utils';

interface HeroFlipTitleProps {
  titles?: string[];
  interval?: number;
  className?: string;
}

export default function HeroFlipTitle({
  titles,
  interval = 4500,
  className
}: HeroFlipTitleProps) {
  const validTitles = React.useMemo(() => {
    if (Array.isArray(titles) && titles.length > 0) {
      const filtered = titles.map((t) => (typeof t === 'string' ? t.trim() : '')).filter(Boolean);
      if (filtered.length > 0) return filtered;
    }
    return ['Informatics Laboratory'];
  }, [titles]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  const isMulti = validTitles.length > 1;

  useEffect(() => {
    if (!isMulti) return;

    const timer = setInterval(() => {
      // Mulai transisi flip keluar sebentar
      setIsExiting(true);

      setTimeout(() => {
        const nextIdx = (currentIndexRef.current + 1) % validTitles.length;
        setCurrentIndex(nextIdx);
        setIsExiting(false);
      }, 350);
    }, interval);

    return () => clearInterval(timer);
  }, [isMulti, interval, validTitles.length]);

  const currentTitle = validTitles[currentIndex] || validTitles[0];

  return (
    <span
      className={cn(
        'inline-block transition-all duration-350 transform-gpu',
        isExiting
          ? 'opacity-0 scale-95 [transform:rotateX(75deg)]'
          : 'opacity-100 scale-100 [transform:rotateX(0deg)]',
        className
      )}
      style={{ perspective: '1000px', transformOrigin: '50% 50%' }}
    >
      <FlipText
        key={`${currentIndex}-${currentTitle}`}
        duration={isMulti ? 1.4 : 2.2}
        loop={!isMulti}
        together={false}
      >
        {currentTitle}
      </FlipText>
    </span>
  );
}
