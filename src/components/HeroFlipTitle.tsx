'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FlipText } from '@/components/block/flip-text';
import { cn } from '@/lib/utils';

const DEFAULT_TITLE = 'Informatics Laboratory';

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
  // Selalu mulai dari "Informatics Laboratory", lalu tambah teks ekstra (buang duplikat & kosong)
  const fullTitles = React.useMemo(() => {
    const extras = Array.isArray(titles)
      ? titles
          .map((t) => (typeof t === 'string' ? t.trim() : ''))
          .filter((t) => t.length > 0 && t !== DEFAULT_TITLE)
      : [];
    return [DEFAULT_TITLE, ...extras];
  }, [titles]);

  const isMulti = fullTitles.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  useEffect(() => {
    if (!isMulti) return;

    const timer = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        const nextIdx = (currentIndexRef.current + 1) % fullTitles.length;
        setCurrentIndex(nextIdx);
        setIsExiting(false);
      }, 350);
    }, interval);

    return () => clearInterval(timer);
  }, [isMulti, interval, fullTitles.length]);

  const currentTitle = fullTitles[currentIndex] ?? DEFAULT_TITLE;

  // Kalau hanya 1 teks (tidak ada ekstra), tampilkan statis tanpa animasi
  if (!isMulti) {
    return <span className={className}>{DEFAULT_TITLE}</span>;
  }

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
        duration={1.4}
        loop={false}
        together={false}
      >
        {currentTitle}
      </FlipText>
    </span>
  );
}
