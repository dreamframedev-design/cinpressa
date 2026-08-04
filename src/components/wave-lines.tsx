"use client";

import { useEffect, useRef } from "react";

/**
 * WaveLines — a ruled surface deforming in slow motion.
 *
 * The contact page went dark with a caustic field, and the read on it was right: bright
 * filigree on deep navy is a swimming pool, and no palette adjustment argues with that.
 * Two things were wrong, not one. The technique was wrong, and going dark was wrong for
 * a brand that lives in daylight blues on white.
 *
 * This is the same instinct, executed properly. A family of fine ruled lines is
 * displaced by two interfering wave systems, one travelling along the lines and one
 * travelling ACROSS them. The result is a surface, not a pattern: the lines crowd where
 * the surface tilts away and open where it faces you, so a wave is legible passing
 * through the whole field even though every element is a straight-drawn hairline.
 *
 * It is the most restrained thing on the site and the most constructed. There is no
 * blur, no glow, no translucency and no colour mass anywhere in it. Line only. That is
 * what makes it read as drafted rather than rendered, which is the register this brand
 * asks for and the one a "sophisticated, refined" note is pointing at.
 *
 * TEMPO. Everything is slow on purpose: the two systems run on 96 and 148 second
 * periods against each other, so the interference pattern takes minutes to repeat and
 * the motion is closer to a tide than to an animation. The brief said slowed down and
 * smoother, and slowness here is not a setting, it is most of the effect.
 *
 * DENSITY IS THE DRAWING. Line weight and opacity are derived from local spacing, so
 * where lines converge they darken into a soft band and where they spread they fall
 * away to almost nothing. Nothing is painted; the tone is entirely a consequence of
 * where the lines ended up.
 */

const VW = 1200;
const VH = 760;

const MAX_DPR = 1.5;
const MAX_BACKING_W = 1400;
const FRAME_MS = 33;

const TAU = Math.PI * 2;

/** Ruled lines across the field. */
const LINES = 52;
/** Samples along each line. */
const STEPS = 68;

/* Two wave systems, deliberately incommensurate so the field never repeats on any
   timescale a visitor would notice.

   THE KY VALUES ARE CONSTRAINED, not chosen freely. They set how fast the displacement
   changes from one line to the next, and if that gradient exceeds the resting spacing,
   adjacent lines swap order and cross. Crossings do not read as a surface; they read as
   a rendering fault. The bound is:

       TAU × (A1·|KY1| + A2·|KY2| + A3·|KY3|)  <  BASE_SPAN

   These sit at about 0.72 of that limit, which is close enough to drive the density
   hard into its crowded clamp while leaving the family provably non-crossing at every
   phase. */
const A1 = 0.085; // amplitude, fraction of height
const KX1 = 1.35; // cycles along the line
const KY1 = 0.36; // cycles ACROSS the family, which is what makes it a surface
const P1 = 96; // seconds

const A2 = 0.052;
const KX2 = 2.15;
const KY2 = -0.52;
const P2 = 148;

/** A third, very long, very small term. Stops the two systems ever settling into a
 *  visible beat. */
const A3 = 0.022;
const KX3 = 0.62;
const KY3 = 0.8;
const P3 = 233;

const COBALT = [4, 115, 187] as const;
const CYAN = [30, 174, 229] as const;
const PALE = [190, 215, 236] as const;

function mix(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ] as const;
}

/**
 * Where the family sits at rest, before displacement.
 *
 * The span has to leave room for the waves. A1+A2+A3 comes to 0.159 of the height, so
 * a family resting across 0.06 to 0.94 would swing to -0.10 and 1.10 and get its crests
 * sheared off by the section edges. These values keep the extremes just inside the
 * frame at every phase.
 */
const BASE_TOP = 0.17;
const BASE_SPAN = 0.66;

/** Vertical position of line `li` at horizontal fraction `fx`, at time t. */
function surface(li: number, fx: number, t: number) {
  const fy = li / (LINES - 1);
  const base = BASE_TOP + fy * BASE_SPAN;
  const d =
    A1 * Math.sin(TAU * (fx * KX1 + fy * KY1 - t / P1)) +
    A2 * Math.sin(TAU * (fx * KX2 + fy * KY2 + t / P2)) +
    A3 * Math.sin(TAU * (fx * KX3 + fy * KY3 - t / P3));
  return base + d;
}

/** Alpha stops sampled along each line to carry the density tone. */
const TONE_STOPS = 16;

/**
 * ONE STROKE PER LINE. This matters and it is not a micro-optimisation.
 *
 * The first build drew every line as STEPS separate segments, each with its own
 * beginPath, stroke and round cap. Two independent strokes that share an endpoint
 * composite twice over the pixels where their caps overlap, so every segment boundary
 * became a slightly darker dot. And because the boundaries are at i / STEPS, they land
 * at the SAME x on all 52 lines, so those dots stacked into faint vertical bands
 * running through the whole field: a regular grid artefact with no business being in a
 * piece about flowing surfaces.
 *
 * The fix is to stroke each line as a single continuous path. The tone that the
 * per-segment alpha was carrying moves into a horizontal gradient on the stroke, which
 * varies alpha along the line without ever splitting it. Line width becomes one value
 * per line, since a single stroke cannot taper; the tone was doing nearly all the work
 * anyway.
 *
 * It is also about seventy times fewer draw calls per frame, which is a fair by-product.
 */
function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";

  const sx = w / VW;

  // Nominal spacing between lines, used to judge whether a region has crowded.
  const nominal = BASE_SPAN / (LINES - 1);

  /** Local crowding at horizontal fraction f: 1 where lines converge, 0 where they open. */
  const crowdAt = (li: number, f: number) => {
    const gap =
      li < LINES - 1 ? surface(li + 1, f, t) - surface(li, f, t) : nominal;
    return Math.max(0, Math.min(1.4, nominal / Math.max(gap, 1e-4))) / 1.4;
  };

  for (let li = 0; li < LINES; li++) {
    const fy = li / (LINES - 1);

    // Colour walks the ladder down the field. No mass anywhere, so this is the only
    // colour information in the piece.
    const col =
      fy < 0.55
        ? mix(COBALT, CYAN, fy / 0.55)
        : mix(CYAN, PALE, (fy - 0.55) / 0.45);

    // Tone along the line, as a gradient rather than as segments. The field is also
    // quietest at the left, where the copy sits, and fullest on the right: the same
    // quiet-under-copy rule the rest of the site uses.
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    let widthSum = 0;
    let peak = 0;
    for (let k = 0; k <= TONE_STOPS; k++) {
      const f = k / TONE_STOPS;
      const crowd = crowdAt(li, f);
      const fade = 0.1 + 0.9 * Math.min(1, Math.max(0, (f - 0.02) / 0.42));
      const alpha = (0.1 + crowd * 0.62) * fade;
      if (alpha > peak) peak = alpha;
      widthSum += 0.7 + crowd * 0.75;
      grad.addColorStop(
        f,
        `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`,
      );
    }
    // Nothing to see on this line at all.
    if (peak < 0.012) continue;

    ctx.strokeStyle = grad;
    ctx.lineWidth =
      (widthSum / (TONE_STOPS + 1)) * Math.min(sx, 1.5);

    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const f = i / STEPS;
      const y = surface(li, f, t) * h;
      if (i === 0) ctx.moveTo(f * w, y);
      else ctx.lineTo(f * w, y);
    }
    ctx.stroke();
  }
}

export function WaveLines({ className = "" }: { className?: string }) {
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
      // A composed moment rather than every system at phase zero.
      draw(ctx, w, h, reduced ? 37 : 0);
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
        draw(ctx, w, h, Math.max(0, now - start) / 1000);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
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
