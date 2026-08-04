"use client";

import { useEffect, useRef } from "react";

/**
 * The interior-page hero artwork: strata that enter turbulent on the left and
 * flatten into a held horizontal on the right.
 *
 * This is CinPressa's answer to CinRx's hero wave, and the difference is the point.
 * CinRx's /about band gathers many strata into one cable, because CinRx is a parent
 * company and its subject is many-becoming-one. CinPressa is one molecule, one target,
 * one program: its subject is DURATION. So the same wave family is used to say the
 * opposite thing, and the metaphor lives in one term rather than in a caption - an
 * amplitude envelope that decays to almost nothing across the width. Variable,
 * uncontrolled pressure resolving into durable control.
 *
 * Three deliberate departures from the CinRx piece:
 *
 *   1. NO ROTATION. CinRx tilts every hero band to a -8 degree house axis. This one is
 *      dead horizontal, because the whole idea is a line held flat and a tilt would
 *      undermine it. That is also the axis discipline that keeps the two sites apart.
 *   2. STROKES, NOT FILLS. CinRx's two filled variants carry colour as mass. PRODUCT.md
 *      principle 1 is that the hairline is the brand, so boldness here comes from
 *      saturation, weight and count rather than from area.
 *   3. THE STRATA PACK RATHER THAN MERGE. They tighten to an evenly spaced stave on the
 *      right and stay individually legible, instead of resolving into one band.
 *
 * Five STRUCTURALLY different variants, one per page. Not parameter variations of one
 * geometry: CinRx rejected exactly that on 6/11/26 ("parameter variations of the same
 * waves all read identical; each page gets its own geometry"), and the same standard
 * applies here. Each variant changes the arrangement, not just the numbers.
 *
 * Structural interest is deliberately kept to the right of centre. The copy column
 * occupies the left of the hero, and the mask below takes the art to nothing there, so
 * everything that matters happens where nobody is reading. That is what lets the lines
 * run at full strength instead of the 0.42 ceiling the rest of the site sat under.
 *
 * Performance follows the CinRx envelope: backing store <=1500px at DPR <=1.5, ~30fps,
 * paused off-screen, one static frame under prefers-reduced-motion, and one static
 * frame on touch/coarse pointers where the animation buys nothing and costs battery.
 */

export type HeldLineVariant =
  | "source"
  | "interval"
  | "lineage"
  | "cadence"
  | "open";

const TAU = Math.PI * 2;
const MAX_DPR = 1.5;
const MAX_BACKING_W = 1500;
const FRAME_MS = 33; // ~30fps

/** Icon ladder, deepest to lightest. Spec-sheet values, never interpolated. */
const LIGHT_LADDER = ["#0473bb", "#0783c6", "#1596d4", "#1eaee5", "#6bb2e2"];
/** On the deep ground the deepest rungs disappear, so the ladder shifts up. */
const DARK_LADDER = ["#1596d4", "#1eaee5", "#6bb2e2", "#95daf8", "#aadbf6"];

interface Stratum {
  /** Resting height at the left edge, as a fraction of canvas height. */
  baseL: number;
  /** Resting height at the right edge. The drift between them is eased, not linear. */
  baseR: number;
  /** Primary swell: amplitude (fraction of h), wavelength (fraction of w), period (s). */
  a1: number;
  l1: number;
  p1: number;
  /** Secondary swell. Travels the OPPOSITE direction so the sum never resolves into a
   *  clean repeating sine - this is what keeps the turbulence from reading mechanical. */
  a2: number;
  l2: number;
  p2: number;
  phase: number;
  /** Ladder index. */
  rung: number;
  weight: number;
  /** Where the flattening begins and completes, as fractions of width. */
  onset: number;
  settle: number;
  /** Alpha at the left and right ends of the stroke gradient. */
  alphaL: number;
  alphaR: number;
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/**
 * The flatness envelope: 1 while the stratum is still turbulent, easing to a small
 * residual once it has settled. The residual is not zero on purpose - a perfectly dead
 * line reads as a printed rule, and what we want is a line being HELD, which needs a
 * trace of life left in it.
 */
const RESIDUAL = 0.045;

function envelope(fx: number, onset: number, settle: number) {
  if (fx <= onset) return 1;
  if (fx >= settle) return RESIDUAL;
  const t = (fx - onset) / (settle - onset);
  return RESIDUAL + (1 - RESIDUAL) * (1 - smoothstep(t));
}

function strataY(s: Stratum, x: number, w: number, h: number, t: number) {
  const fx = x / w;
  // Ease the vertical drift so the pack tightens gracefully instead of on a ramp.
  const base = s.baseL + (s.baseR - s.baseL) * smoothstep(fx);
  const env = envelope(fx, s.onset, s.settle);
  return (
    base * h +
    env *
      (s.a1 * h * Math.sin((TAU * x) / (s.l1 * w) - (TAU * t) / (s.p1 * 1000) + s.phase) +
        s.a2 *
          h *
          Math.sin((TAU * x) / (s.l2 * w) + (TAU * t) / (s.p2 * 1000) + s.phase * 2.3))
  );
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** Stroke gradient that fades in from the quiet (left) side. */
function strokeRamp(
  ctx: CanvasRenderingContext2D,
  w: number,
  hex: string,
  alphaL: number,
  alphaR: number,
): CanvasGradient {
  const [r, g, b] = hexToRgb(hex);
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, `rgba(${r},${g},${b},${alphaL})`);
  grad.addColorStop(0.5, `rgba(${r},${g},${b},${(alphaL + alphaR) * 0.5})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},${alphaR})`);
  return grad;
}

// ════════════════════════════════════════════════════════════════════════════
// Variant geometry
//
// Each entry is a different ARRANGEMENT, not a retune. source fans from a point,
// interval is cut into stages, lineage merges two families, cadence is already held
// and carries events, open is a single line in mostly empty space.
// ════════════════════════════════════════════════════════════════════════════

/** /science - everything issues from one point and spreads out, already settling.
 *  Suppression at the source: one intervention, distributed durable effect. */
const SOURCE: Stratum[] = [
  { baseL: 0.62, baseR: 0.50, a1: 0.052, l1: 0.74, p1: 61, a2: 0.019, l2: 0.29, p2: -44, phase: 0.0, rung: 0, weight: 1.7, onset: 0.44, settle: 0.80, alphaL: 0, alphaR: 0.92 },
  { baseL: 0.62, baseR: 0.585, a1: 0.046, l1: 0.63, p1: -53, a2: 0.017, l2: 0.26, p2: 39, phase: 1.7, rung: 1, weight: 1.6, onset: 0.44, settle: 0.78, alphaL: 0, alphaR: 0.9 },
  { baseL: 0.62, baseR: 0.67, a1: 0.049, l1: 0.81, p1: 47, a2: 0.018, l2: 0.31, p2: -57, phase: 3.4, rung: 2, weight: 1.6, onset: 0.44, settle: 0.79, alphaL: 0, alphaR: 0.9 },
  { baseL: 0.62, baseR: 0.755, a1: 0.043, l1: 0.69, p1: -67, a2: 0.016, l2: 0.24, p2: 51, phase: 5.0, rung: 3, weight: 1.5, onset: 0.44, settle: 0.77, alphaL: 0, alphaR: 0.85 },
];

/** /pipeline - the band cut into stages by vertical rules, flattening across them.
 *  Time as measured intervals rather than as a continuum. Rendered on the dark ground. */
const INTERVAL: Stratum[] = [
  { baseL: 0.46, baseR: 0.55, a1: 0.06, l1: 0.7, p1: 58, a2: 0.021, l2: 0.27, p2: -41, phase: 0.4, rung: 1, weight: 1.7, onset: 0.30, settle: 0.86, alphaL: 0, alphaR: 0.95 },
  { baseL: 0.60, baseR: 0.63, a1: 0.054, l1: 0.83, p1: -49, a2: 0.019, l2: 0.32, p2: 45, phase: 2.3, rung: 2, weight: 1.6, onset: 0.30, settle: 0.84, alphaL: 0, alphaR: 0.9 },
  { baseL: 0.76, baseR: 0.71, a1: 0.048, l1: 0.66, p1: 71, a2: 0.018, l2: 0.25, p2: -55, phase: 4.1, rung: 3, weight: 1.5, onset: 0.30, settle: 0.85, alphaL: 0, alphaR: 0.82 },
];

/** Stage boundaries for `interval`, as fractions of width. Authored to sit clear of
 *  the copy column, so the cuts read as structure rather than as damage. */
const INTERVAL_GAPS = [0.46, 0.615, 0.77, 0.915];
const GAP_HALF = 0.008; // half-width of each cut

/** /about - two families enter independently and interleave into one stave.
 *  The CinRx engine and the CinCor founding team, carried forward together. */
const LINEAGE: Stratum[] = [
  // upper family
  { baseL: 0.38, baseR: 0.545, a1: 0.055, l1: 0.77, p1: 63, a2: 0.02, l2: 0.3, p2: -46, phase: 0.0, rung: 0, weight: 1.7, onset: 0.42, settle: 0.82, alphaL: 0, alphaR: 0.92 },
  { baseL: 0.47, baseR: 0.635, a1: 0.05, l1: 0.71, p1: 68, a2: 0.018, l2: 0.28, p2: -49, phase: 0.9, rung: 1, weight: 1.6, onset: 0.42, settle: 0.82, alphaL: 0, alphaR: 0.88 },
  // lower family - different period and counter-phase, so they read as a separate
  // population until the interleave
  { baseL: 0.82, baseR: 0.59, a1: 0.052, l1: 0.59, p1: -44, a2: 0.019, l2: 0.23, p2: 62, phase: 3.6, rung: 2, weight: 1.6, onset: 0.42, settle: 0.8, alphaL: 0, alphaR: 0.9 },
  { baseL: 0.91, baseR: 0.68, a1: 0.047, l1: 0.64, p1: -51, a2: 0.017, l2: 0.26, p2: 57, phase: 4.5, rung: 3, weight: 1.5, onset: 0.42, settle: 0.8, alphaL: 0, alphaR: 0.85 },
];

/** /news - already held from early on, carrying discrete events along the baseline.
 *  The line is the stable programme; the ticks are what gets announced against it. */
const CADENCE: Stratum[] = [
  { baseL: 0.60, baseR: 0.60, a1: 0.035, l1: 0.8, p1: 74, a2: 0.013, l2: 0.31, p2: -52, phase: 0.0, rung: 1, weight: 1.8, onset: 0.20, settle: 0.52, alphaL: 0, alphaR: 0.95 },
  { baseL: 0.70, baseR: 0.695, a1: 0.028, l1: 0.67, p1: -61, a2: 0.011, l2: 0.27, p2: 48, phase: 2.6, rung: 3, weight: 1.3, onset: 0.20, settle: 0.5, alphaL: 0, alphaR: 0.6 },
];

/** Event marks for `cadence`, as fractions of width. Irregular on purpose: evenly
 *  spaced ticks read as a ruler, uneven ones read as things having happened. */
const CADENCE_TICKS = [0.545, 0.63, 0.665, 0.755, 0.86, 0.925];

/** /contact - one line, flattening, in mostly empty space. The quietest of the five. */
const OPEN: Stratum[] = [
  { baseL: 0.66, baseR: 0.62, a1: 0.058, l1: 0.72, p1: 66, a2: 0.021, l2: 0.28, p2: -48, phase: 0.0, rung: 1, weight: 1.8, onset: 0.34, settle: 0.72, alphaL: 0, alphaR: 0.95 },
];

const STRATA: Record<HeldLineVariant, Stratum[]> = {
  source: SOURCE,
  interval: INTERVAL,
  lineage: LINEAGE,
  cadence: CADENCE,
  open: OPEN,
};

/** Which stratum carries the single accent mark, per variant. */
const ACCENT_INDEX: Record<HeldLineVariant, number> = {
  source: 0,
  interval: 0,
  lineage: 0,
  cadence: 0,
  open: 0,
};

// ════════════════════════════════════════════════════════════════════════════
// Drawing
// ════════════════════════════════════════════════════════════════════════════

/** Build a stratum's path across [x0, x1] as fractions of width. */
function segmentPath(
  s: Stratum,
  w: number,
  h: number,
  t: number,
  x0: number,
  x1: number,
  steps: number,
): Path2D {
  const p = new Path2D();
  for (let i = 0; i <= steps; i++) {
    const fx = x0 + ((x1 - x0) * i) / steps;
    const x = fx * w;
    const y = strataY(s, x, w, h, t);
    if (i === 0) p.moveTo(x, y);
    else p.lineTo(x, y);
  }
  return p;
}

function draw(
  ctx: CanvasRenderingContext2D,
  variant: HeldLineVariant,
  ladder: string[],
  accent: string,
  w: number,
  h: number,
  t: number,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = "round";

  const strata = STRATA[variant];

  // `interval` is the one variant whose strata are cut rather than continuous, so it
  // walks stage ranges instead of drawing a single path per stratum.
  const ranges: Array<[number, number]> = [];
  if (variant === "interval") {
    let cursor = 0;
    for (const g of INTERVAL_GAPS) {
      ranges.push([cursor, g - GAP_HALF]);
      cursor = g + GAP_HALF;
    }
    ranges.push([cursor, 1]);
  } else {
    ranges.push([0, 1]);
  }

  for (const s of strata) {
    ctx.strokeStyle = strokeRamp(ctx, w, ladder[s.rung], s.alphaL, s.alphaR);
    ctx.lineWidth = s.weight;
    for (const [x0, x1] of ranges) {
      if (x1 <= x0) continue;
      // Sample density follows segment length so short stages are not over-sampled.
      const steps = Math.max(12, Math.round((x1 - x0) * 150));
      ctx.stroke(segmentPath(s, w, h, t, x0, x1, steps));
    }
  }

  // Stage rules for `interval`: faint verticals spanning the strata band, drawn after
  // the lines so the cut reads as deliberate.
  if (variant === "interval") {
    const top = 0.4 * h;
    const bottom = 0.84 * h;
    ctx.lineWidth = 1;
    for (const g of INTERVAL_GAPS) {
      const x = g * w;
      const grad = ctx.createLinearGradient(0, top, 0, bottom);
      grad.addColorStop(0, "rgba(149,218,248,0)");
      grad.addColorStop(0.5, "rgba(149,218,248,0.34)");
      grad.addColorStop(1, "rgba(149,218,248,0)");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    }
  }

  // Event ticks for `cadence`: short verticals rising off the held line.
  if (variant === "cadence") {
    const s = strata[0];
    ctx.lineWidth = 1.2;
    for (let i = 0; i < CADENCE_TICKS.length; i++) {
      const fx = CADENCE_TICKS[i];
      const x = fx * w;
      const y = strataY(s, x, w, h, t);
      // Alternating heights, authored rather than random, so the row has rhythm
      // without looking generated.
      const len = (i % 3 === 0 ? 0.055 : i % 3 === 1 ? 0.032 : 0.042) * h;
      ctx.strokeStyle = `rgba(30,174,229,${0.35 + 0.09 * (i % 3)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - len);
      ctx.stroke();
    }
  }

  // The single accent: one short vertical tick at the point the carrying line first
  // reads as held. Orange is reserved for dose semantics and for direct quotations of
  // the mark's petals, so ambient art punctuates in indigo (frost on the dark ground).
  // See ART_STRATEGY.md section 4.
  const acc = strata[ACCENT_INDEX[variant]];
  const ax = acc.settle * w;
  const ay = strataY(acc, ax, w, h, t);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(ax, ay - 0.028 * h);
  ctx.lineTo(ax, ay + 0.028 * h);
  ctx.stroke();
}

// ════════════════════════════════════════════════════════════════════════════

export function HeldLine({
  variant,
  tone = "light",
}: {
  variant: HeldLineVariant;
  tone?: "light" | "dark";
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ladder = tone === "dark" ? DARK_LADDER : LIGHT_LADDER;
    // Read the accent from the stylesheet rather than hard-coding it, so the one-line
    // indigo/orange reversal in globals.css propagates here for free.
    const root = getComputedStyle(document.documentElement);
    const accent =
      (tone === "dark"
        ? root.getPropertyValue("--color-accent-dark")
        : root.getPropertyValue("--color-accent")
      ).trim() || (tone === "dark" ? "#95daf8" : "#6771b5");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A coarse pointer or a narrow viewport gets one static frame. The motion is a
    // slow drift nobody watches on a phone, and a continuous rAF loop is a real
    // battery cost for it.
    const still =
      reduced ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches ||
      window.innerWidth < 768;

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
      draw(ctx, variant, ladder, accent, w, h, performance.now());
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (still) {
      return () => ro.disconnect();
    }

    let rafId = 0;
    let inView = true;
    let last = 0;
    const loop = (t: number) => {
      if (inView && w > 0 && t - last > FRAME_MS) {
        last = t;
        draw(ctx, variant, ladder, accent, w, h, t);
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
  }, [variant, tone]);

  // The copy column sits over the left of the hero. This mask takes the art to nothing
  // there and to full strength on the right, which is what allows the strokes to run at
  // 0.85-0.95 alpha instead of the 0.42 ceiling the rest of the site sat under. The
  // turbulent end of every variant is the end that gets hidden, which is convenient:
  // the metaphor and the legibility requirement want the same thing.
  const mask =
    "linear-gradient(90deg, transparent 0%, transparent 22%, rgba(0,0,0,0.12) 36%, rgba(0,0,0,0.45) 54%, rgba(0,0,0,0.82) 72%, black 86%, black 100%)";

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
