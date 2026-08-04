"use client";

import { useEffect, useRef } from "react";

/**
 * Bleed — layered colour moving across the page.
 *
 * The reference this site was given at the outset: the wave on cinrx.com/about,
 * layered blue tones bleeding across the page. Six translucent bands cross the field,
 * every one composited with MULTIPLY, which is the whole trick and is the same
 * operation the CinPressa mark performs on itself — where two bands cross, the colour
 * deepens, so the richest areas are ones nobody chose. Pigment on wet paper behaves
 * exactly this way.
 *
 * WHY THIS IS CANVAS AND NOT SVG.
 * The first build was static SVG shapes translated sideways by CSS. That was the wrong
 * gesture twice over: the travel was ~3% of the field over 96s, which is invisible, and
 * sliding a whole shape is the least interesting thing colour can do. What makes a
 * layered field feel alive is the CRESTS TRAVELLING THROUGH the bands, because then the
 * crossings migrate and the deep colour moves with them. That needs the geometry
 * recomputed every frame, which is canvas work.
 *
 * Four motions run at once, all on different periods so the field never repeats:
 *
 *   1. FLOW      each band's wave travels along its own length, some left, some
 *                right. This is the motion you actually read.
 *   2. BOB       the whole band rises and falls a little, so bands drift toward and
 *                away from each other and the overlaps open and close.
 *   3. BREATHE   swell amplitude modulates, so crests deepen and flatten.
 *   4. SKEW      the secondary swell runs at its own rate against the primary, so the
 *                two never resolve into a clean repeating sine.
 *
 * Nothing pulses, nothing rotates, nothing tracks the cursor. Every period is between
 * 34 and 96 seconds — this should read as weather, not as an animation.
 *
 * Depth is per-layer blur: heavy behind, none in the middle, slight in front. Without
 * it, six translucent shapes read as six stickers on one plane.
 *
 * Perf: the field is entirely soft, so resolution barely matters — the backing store is
 * capped hard and the blur cost falls out with it. ~30fps, paused off-screen, and a
 * single static frame under prefers-reduced-motion, where it stays a good still image.
 */

const VW = 1600;
const VH = 460;

const MAX_DPR = 1.25;
const MAX_BACKING_W = 1200;
const FRAME_MS = 33;

const TAU = Math.PI * 2;

type Band = {
  /** Vertical centre at the left edge, in viewBox units. */
  top: number;
  /** Drift of that centre by the right edge. */
  rise: number;
  /** Ribbon thickness. Varied deliberately — even weights read as stripes. */
  weight: number;
  /** Swell amplitude and wavelength. */
  amp: number;
  lambda: number;
  phase: number;
  color: [number, number, number];
  alpha: number;
  blur: number;
  /** Seconds for the wave to travel one wavelength. Sign sets the direction. */
  flow: number;
  /** Vertical drift: amplitude in units, period in seconds. */
  bob: number;
  bobPeriod: number;
  /** Swell modulation: fraction of amp, period in seconds. */
  breathe: number;
  breathePeriod: number;
};

/**
 * Composition: the two heaviest bands sit low, the field opens toward the top, the
 * green sits furthest back where it reads as air rather than as a colour decision, and
 * the indigo is lowest and least saturated so it anchors without competing. Alphas run
 * 0.38–0.55 against the 0.07–0.14 this site's art had been sitting at.
 */
const BANDS: Band[] = [
  { top: 150, rise: -26, weight: 116, amp: 34, lambda: 0.82, phase: 0.0, color: [175, 219, 188], alpha: 0.5, blur: 22, flow: 63, bob: 16, bobPeriod: 71, breathe: 0.22, breathePeriod: 54 },
  { top: 196, rise: 34, weight: 148, amp: 41, lambda: 0.66, phase: 2.2, color: [4, 115, 187], alpha: 0.42, blur: 22, flow: -84, bob: 21, bobPeriod: 58, breathe: 0.26, breathePeriod: 67 },
  { top: 232, rise: -18, weight: 84, amp: 29, lambda: 0.9, phase: 4.1, color: [21, 150, 212], alpha: 0.5, blur: 0, flow: 48, bob: 13, bobPeriod: 83, breathe: 0.2, breathePeriod: 45 },
  { top: 286, rise: 22, weight: 104, amp: 33, lambda: 0.72, phase: 1.3, color: [30, 174, 229], alpha: 0.44, blur: 0, flow: -57, bob: 18, bobPeriod: 64, breathe: 0.24, breathePeriod: 76 },
  { top: 176, rise: -12, weight: 52, amp: 24, lambda: 1.05, phase: 5.4, color: [149, 218, 248], alpha: 0.55, blur: 7, flow: 41, bob: 11, bobPeriod: 92, breathe: 0.3, breathePeriod: 38 },
  { top: 338, rise: 16, weight: 122, amp: 27, lambda: 0.78, phase: 3.0, color: [103, 113, 181], alpha: 0.38, blur: 7, flow: -72, bob: 15, bobPeriod: 49, breathe: 0.18, breathePeriod: 61 },
];

/** Centre line of a band at horizontal fraction f and time t (seconds). */
function centre(b: Band, f: number, t: number) {
  const bob = b.bob * Math.sin((TAU * t) / b.bobPeriod + b.phase);
  const amp = b.amp * (1 + b.breathe * Math.sin((TAU * t) / b.breathePeriod + b.phase * 0.7));
  const travel = (TAU * t) / b.flow;
  return (
    b.top +
    b.rise * f +
    bob +
    amp * Math.sin(TAU * (f / b.lambda) - travel + b.phase) +
    // The secondary swell runs at its own rate against the primary, so the sum never
    // settles into a clean repeating wave.
    amp * 0.34 * Math.sin(TAU * (f / (b.lambda * 0.41)) - travel * 0.63 + b.phase * 1.7)
  );
}

const STEPS = 56;

function traceBand(
  ctx: CanvasRenderingContext2D,
  b: Band,
  w: number,
  h: number,
  t: number,
) {
  const sx = w / VW;
  const sy = h / VH;
  // Overshoot both edges so no band ever shows an end inside the frame.
  const x0 = -140;
  const x1 = VW + 140;

  ctx.beginPath();
  for (let i = 0; i <= STEPS; i++) {
    const f = i / STEPS;
    const x = x0 + (x1 - x0) * f;
    const y = centre(b, f, t) - b.weight / 2;
    if (i === 0) ctx.moveTo(x * sx, y * sy);
    else ctx.lineTo(x * sx, y * sy);
  }
  for (let i = STEPS; i >= 0; i--) {
    const f = i / STEPS;
    const x = x0 + (x1 - x0) * f;
    const y = centre(b, f, t) + b.weight / 2;
    ctx.lineTo(x * sx, y * sy);
  }
  ctx.closePath();
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Multiply needs something to multiply into. The section is white, so the field is.
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "multiply";

  const blurScale = w / VW;
  for (const b of BANDS) {
    const [r, g, bl] = b.color;
    // Fade to nothing at both ends so no band has a cut edge — the colour arrives
    // and leaves rather than starting and stopping.
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, `rgba(${r},${g},${bl},0)`);
    grad.addColorStop(0.18, `rgba(${r},${g},${bl},${(b.alpha * 0.85).toFixed(3)})`);
    grad.addColorStop(0.46, `rgba(${r},${g},${bl},${b.alpha.toFixed(3)})`);
    grad.addColorStop(0.74, `rgba(${r},${g},${bl},${(b.alpha * 0.9).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);

    ctx.filter = b.blur > 0 ? `blur(${(b.blur * blurScale).toFixed(1)}px)` : "none";
    ctx.fillStyle = grad;
    traceBand(ctx, b, w, h, t);
    ctx.fill();
  }

  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";
}

export function Bleed({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const scale = Math.min(
        Math.min(window.devicePixelRatio || 1, MAX_DPR),
        MAX_BACKING_W / rect.width,
      );
      w = Math.round(rect.width * scale);
      h = Math.round(rect.height * scale);
      canvas.width = w;
      canvas.height = h;
      // A fixed offset rather than 0, so the still frame is a composed moment
      // rather than every band sitting at its start phase.
      draw(ctx, w, h, reduced ? 19 : 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (reduced) return () => ro.disconnect();

    let rafId = 0;
    let inView = true;
    let last = 0;
    const start = performance.now();

    const loop = (now: number) => {
      if (inView && w > 0 && now - last > FRAME_MS) {
        last = now;
        draw(ctx, w, h, (now - start) / 1000);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
