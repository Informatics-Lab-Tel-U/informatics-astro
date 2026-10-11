import React, { useState, useEffect, useRef, useCallback } from "react";

export interface HeroImageSlide {
  id: string;
  image: string;
  title?: string;
  alt?: string;
  order?: number;
}

interface HeroSliderProps {
  slides: HeroImageSlide[];
  interval?: number;
}

/* Pola 35x6 dari wave-block-2.svg ('.' = kosong) */
const PATTERN = [
  "bbeeaeaebbbbacabbbbbedcaaeebbecaaba",
  "bbccbaaebeccaeaddbbbcbbaaeeeccaeedb",
  "ccbbad.aceaad..eccccbaaddeeeaedbbec",
  "eeaadd.aceaad..eeeeead.ddeeeae.bbec",
  "aaaa.a....ab...aec.ccd.....ecb...aa",
  "aa.........b...aac.......cd.cb...aa",
];

const PAL: Record<string, string> = {
  a: "#3E4C95",
  b: "#631774",
  c: "#8FC2DD",
  d: "#9C2999",
  e: "#5B6790",
};

const KEYS = Object.keys(PAL);
const COLS = KEYS.map((k) => PAL[k]);
const FILL = "aaaaaaaabbbbcccdddee";

const DUR = 260;
const SWEEP = 800;
const HOLD = 120;

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface CanvasState {
  W: number;
  H: number;
  s: number;
  n: number;
  rows: number;
  dpr: number;
  fc: Uint8Array;
  dIn: Float32Array;
  dOut: Float32Array;
}

export default function HeroSlider({ slides, interval = 10000 }: HeroSliderProps) {
  const validSlides =
    slides && slides.length > 0
      ? slides
      : [
          {
            id: "default-1",
            image: "/backgrounds/bg-1.jpeg",
            alt: "Informatics Laboratory Hero Showcase",
          },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const busyRef = useRef(false);
  const currentIndexRef = useRef(0);
  const stateRef = useRef<CanvasState | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const isMultiSlide = validSlides.length > 1;

  const X = (c: number, s: number, dpr: number) => Math.round(c * s * dpr);
  const Y = (r: number, s: number, dpr: number) => Math.round(r * s * dpr);

  const draw = useCallback((mode: number, t: number) => {
    const cv = canvasRef.current;
    const st = stateRef.current;
    if (!cv || !st) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const { s, n, rows, dpr, fc, dIn, dOut } = st;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (mode) {
      const pr = Math.min(t / 250, 1);
      for (let c = 0; c < n; c++) {
        for (let r = 0; r < rows; r++) {
          const i = c * rows + r;
          let v: number;
          if (mode === 2) {
            v = 1;
          } else if (reduceMotion) {
            v = mode === 1 ? pr : 1 - pr;
          } else {
            const delay = mode === 1 ? dIn[i] : dOut[i];
            const p = Math.min(Math.max((t - delay) / DUR, 0), 1);
            const q = p >= 1 ? 1 : Math.floor(p * 3) / 3;
            v = mode === 1 ? q : 1 - q;
          }

          if (v <= 0) continue;
          const x0 = X(c, s, dpr);
          const y0 = Y(r, s, dpr);
          const w = X(c + 1, s, dpr) - x0;
          const h = Y(r + 1, s, dpr) - y0;
          ctx.fillStyle = COLS[fc[i]];

          if (v >= 1) {
            ctx.globalAlpha = 1;
            ctx.fillRect(x0, y0, w, h);
          } else {
            const k = 0.2 + 0.8 * v;
            const nw = Math.round(w * k);
            const nh = Math.round(h * k);
            ctx.globalAlpha = v;
            ctx.fillRect(x0 + Math.round((w - nw) / 2), y0 + Math.round((h - nh) / 2), nw, nh);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    // Pola awal (6 baris teratas dari wave-block-2.svg) selalu berada di lapisan paling depan
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < n; c++) {
        const k = PATTERN[r][c % 35];
        if (k === ".") continue;
        ctx.fillStyle = PAL[k];
        const x0 = X(c, s, dpr);
        const y0 = Y(r, s, dpr);
        const w = X(c + 1, s, dpr) - x0;
        const h = Y(r + 1, s, dpr) - y0;
        ctx.fillRect(x0, y0, w, h);
      }
    }
  }, []);

  const build = useCallback(() => {
    const cv = canvasRef.current;
    const container = containerRef.current;
    if (!cv || !container) return;

    const rect = container.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    if (W <= 0 || H <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);

    const s = W / 35;
    const n = 35;
    const rows = Math.ceil(H / s) + 1;

    const rand = rng(7);
    const N = n * rows;
    const fc = new Uint8Array(N);
    const dIn = new Float32Array(N);
    const dOut = new Float32Array(N);

    for (let c = 0; c < n; c++) {
      let prev = -1;
      for (let r = 0; r < rows; r++) {
        const i = c * rows + r;
        let k: number;
        do {
          k = KEYS.indexOf(FILL[Math.floor(rand() * 20)]);
        } while (k === prev);
        prev = k;
        fc[i] = k;
        const y = r / rows;
        dIn[i] = (y * 0.6 + Math.random() * 0.4) * SWEEP;
        dOut[i] = ((1 - y) * 0.6 + Math.random() * 0.4) * SWEEP;
      }
    }

    stateRef.current = { W, H, s, n, rows, dpr, fc, dIn, dOut };
    draw(0, 0);
  }, [draw]);

  const run = useCallback(
    (mode: number) =>
      new Promise<void>((resolve) => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const total = (reduceMotion ? 250 : SWEEP + DUR) + 16;
        let t0: number | null = null;
        const frame = (now: number) => {
          if (t0 === null) t0 = now;
          const t = now - t0;
          draw(mode, t);
          if (t < total) {
            requestAnimationFrame(frame);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(frame);
      }),
    [draw],
  );

  const goToSlide = useCallback(
    async (targetIdx: number) => {
      if (busyRef.current || targetIdx === currentIndexRef.current) return;
      busyRef.current = true;
      try {
        await run(1);
        draw(2, 0);
        setCurrentIndex(targetIdx);
        currentIndexRef.current = targetIdx;
        await new Promise((r) => setTimeout(r, HOLD));
        await run(3);
        draw(0, 0);
      } finally {
        busyRef.current = false;
      }
    },
    [run, draw],
  );

  const nextSlide = useCallback(() => {
    const nextIdx = (currentIndexRef.current + 1) % validSlides.length;
    goToSlide(nextIdx);
  }, [goToSlide, validSlides.length]);

  const prevSlide = useCallback(() => {
    const prevIdx = (currentIndexRef.current - 1 + validSlides.length) % validSlides.length;
    goToSlide(prevIdx);
  }, [goToSlide, validSlides.length]);

  // Autoplay dengan jeda yang lebih lama (default 10 detik)
  useEffect(() => {
    if (!isMultiSlide || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [isMultiSlide, isPaused, nextSlide, interval]);

  // Inisialisasi canvas dan listener resize
  useEffect(() => {
    build();
    let tm: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(tm);
      tm = setTimeout(() => {
        if (!busyRef.current) build();
      }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(tm);
    };
  }, [build]);

  // Touch handlers untuk swipe mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const swipeThreshold = 50;

    if (diff > swipeThreshold) {
      nextSlide();
    } else if (diff < -swipeThreshold) {
      prevSlide();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-muted/30 md:aspect-[21/9] md:rounded-3xl md:border md:border-border"
      aria-roledescription="carousel"
      aria-label="Hero Image Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gambar Slide Aktif */}
      <img
        src={validSlides[currentIndex].image}
        alt={
          validSlides[currentIndex].alt ||
          validSlides[currentIndex].title ||
          "Informatics Laboratory Hero Showcase"
        }
        width="2100"
        height="900"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover"
      />

      {/* Wave Block Canvas: menggantikan svg statis dan menangani transisi pixel block */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-12 h-full w-full"
        aria-hidden="true"
      />

      {/* Mobile Backdrop Overlay */}
      <div className="pointer-events-none absolute inset-0 z-15 bg-background/80 md:hidden" />

      {/* Indikator Titik Pagination di Bawah Banner */}
      {isMultiSlide && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border/30 bg-background/40 px-2 py-0.5 shadow-xs backdrop-blur-sm">
          {validSlides.map((slide, idx) => (
            <button
              key={`dot-${slide.id || idx}`}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Buka slide ${idx + 1}`}
              aria-current={idx === currentIndex ? "true" : undefined}
              className="group flex items-center px-0.5 py-1 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-foreground/30 group-hover:bg-foreground/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
