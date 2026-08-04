"use client";

import { HeroCanvas, TAU, smooth } from "@/components/hero-canvas";

/**
 * Interior hero fields for /science and /pipeline.
 *
 * /about and /news both use the default treatment in hero-field.tsx. A third field
 * lived here for /news and was removed when that page was pointed at the default; it
 * is recoverable from history if it is ever wanted.
 *
 * WHAT THE PREVIOUS ATTEMPT GOT WRONG, since it is the reason these are built the way
 * they are. That set was points, arcs and a weave, and I argued they were separated by
 * mark-making. They were not separated by anything that matters: all three were sparse
 * translucent shapes SLIDING slowly across white. Different geometry, one perceptual
 * result, and the notes back were three descriptions of the same failure.
 *
 * Two rules came out of that, and both are load-bearing here.
 *
 * MASS, NOT TEXTURE. The one field on this site that has worked is the colour bleed on
 * the home page: full bleed, real density, depth from selective blur. It is a picture.
 * Thin sparse fields read as wallpaper no matter how clever the geometry is. So these
 * run at 0.34-0.55 alpha on large forms that cover the frame.
 *
 * TRANSFORM, NOT TRANSLATE. Sliding a shape is the least interesting thing it can do,
 * and it is what all three of the last set did. Each of these changes its own SHAPE
 * over time instead:
 *
 *   Bloom   /science   masses expand out of dense cores and dissolve as they spread
 *   Churn   /pipeline  the field is stirred; bands curl and fold through a rotating warp
 *
 * Shared: canvas, multiply compositing so overlaps produce the deep tones rather than
 * anyone picking them, spec-sheet colour only, selective blur for depth, and everything
 * fading before the frame edge so nothing is ever cut.
 */

/** The copy sits left on every interior hero, so every field is damped there. */
const copyFade = (fx: number) => 0.08 + 0.92 * smooth((fx - 0.04) / 0.5);

/* ═══════════════════════════════════════════════════════════════════════════
   SCIENCE — Bloom

   Ink opening into water. Each mass is born small and dense, expands, softens as it
   spreads, and dissolves; another is already opening behind it. The transformation is
   the whole piece: nothing here travels, it GROWS, which is the correct figure for a
   molecule distributing and taking effect.
   ═══════════════════════════════════════════════════════════════════════════ */

type Bloom = {
  /** Where it opens, as a fraction of the frame. */
  x: number;
  y: number;
  /** Seconds from first appearance to fully dissolved. */
  life: number;
  /** Phase offset, so they do not breathe in unison. */
  offset: number;
  /** Radius at birth and at dissolve, as a fraction of the short side. */
  r0: number;
  r1: number;
  /** Vertical squash, so these are never perfect discs. */
  squash: number;
  tilt: number;
  color: [number, number, number];
  alpha: number;
};

const BLOOMS: Bloom[] = [
  { x: 0.72, y: 0.34, life: 19, offset: 0.00, r0: 0.05, r1: 0.62, squash: 0.72, tilt: -0.3, color: [4, 115, 187], alpha: 0.42 },
  { x: 0.55, y: 0.62, life: 24, offset: 0.17, r0: 0.06, r1: 0.7, squash: 0.84, tilt: 0.22, color: [21, 150, 212], alpha: 0.4 },
  { x: 0.88, y: 0.58, life: 16, offset: 0.33, r0: 0.04, r1: 0.52, squash: 0.66, tilt: 0.41, color: [30, 174, 229], alpha: 0.44 },
  { x: 0.63, y: 0.18, life: 27, offset: 0.5, r0: 0.07, r1: 0.75, squash: 0.78, tilt: -0.18, color: [175, 219, 188], alpha: 0.4 },
  { x: 0.8, y: 0.8, life: 21, offset: 0.66, r0: 0.05, r1: 0.6, squash: 0.9, tilt: 0.34, color: [126, 170, 219], alpha: 0.38 },
  { x: 0.44, y: 0.4, life: 30, offset: 0.82, r0: 0.06, r1: 0.68, squash: 0.74, tilt: -0.4, color: [103, 113, 181], alpha: 0.34 },
  { x: 0.95, y: 0.28, life: 18, offset: 0.42, r0: 0.04, r1: 0.5, squash: 0.8, tilt: 0.12, color: [149, 218, 248], alpha: 0.46 },
  { x: 0.68, y: 0.95, life: 25, offset: 0.9, r0: 0.06, r1: 0.66, squash: 0.7, tilt: -0.26, color: [21, 150, 212], alpha: 0.36 },
];

function renderBloom(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";

  const short = Math.min(w, h);

  for (const b of BLOOMS) {
    const p = ((t / b.life + b.offset) % 1 + 1) % 1;

    // Fast out of the core, slowing as it spreads: how ink actually opens.
    const grow = 1 - Math.pow(1 - p, 2.2);
    const radius = (b.r0 + (b.r1 - b.r0) * grow) * short;

    // Dense at birth, thinning as the same pigment covers more ground. That
    // relationship is what makes it read as diffusion rather than as a growing circle.
    const alpha = b.alpha * smooth(p / 0.1) * (1 - smooth((p - 0.3) / 0.7));
    if (alpha < 0.006) continue;

    const [r, g, bl] = b.color;
    const cx = b.x * w;
    const cy = b.y * h;
    const fade = copyFade(b.x);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(b.tilt);
    ctx.scale(1, b.squash);

    // Soft all the way through: a radial falloff rather than an edge, so the mass has
    // no boundary at any point in its life.
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    const a = alpha * fade;
    grad.addColorStop(0, `rgba(${r},${g},${bl},${(a * 0.95).toFixed(3)})`);
    grad.addColorStop(0.42, `rgba(${r},${g},${bl},${(a * 0.62).toFixed(3)})`);
    grad.addColorStop(0.74, `rgba(${r},${g},${bl},${(a * 0.24).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  ctx.globalCompositeOperation = "source-over";
}

export function HeroBloom({ className = "" }: { className?: string }) {
  return <HeroCanvas render={renderBloom} className={className} stillAt={13} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PIPELINE — Churn

   The same layered colour as the home field, but STIRRED. Every sample is displaced by
   a slowly rotating warp, so the bands curl, fold back on themselves and pull apart
   rather than travelling in a straight line. The silhouette is different every second,
   which is the difference between a shape that moves and a shape being moved.
   ═══════════════════════════════════════════════════════════════════════════ */

type Ribbon = {
  base: number;
  weight: number;
  color: [number, number, number];
  alpha: number;
  blur: number;
  /** Warp strength and its own rotation rate. */
  swirl: number;
  spin: number;
  phase: number;
};

const RIBBONS: Ribbon[] = [
  { base: 0.2, weight: 0.3, color: [175, 219, 188], alpha: 0.4, blur: 22, swirl: 0.19, spin: 31, phase: 0.0 },
  { base: 0.34, weight: 0.38, color: [4, 115, 187], alpha: 0.4, blur: 20, swirl: 0.24, spin: -27, phase: 1.6 },
  { base: 0.5, weight: 0.24, color: [21, 150, 212], alpha: 0.46, blur: 0, swirl: 0.21, spin: 23, phase: 3.1 },
  { base: 0.63, weight: 0.32, color: [30, 174, 229], alpha: 0.42, blur: 0, swirl: 0.26, spin: -35, phase: 4.4 },
  { base: 0.42, weight: 0.16, color: [149, 218, 248], alpha: 0.5, blur: 6, swirl: 0.17, spin: 39, phase: 5.7 },
  { base: 0.78, weight: 0.34, color: [103, 113, 181], alpha: 0.36, blur: 8, swirl: 0.22, spin: -19, phase: 2.4 },
];

const CHURN_STEPS = 60;

/**
 * The warp. Two counter-rotating cells displace every sample vertically, and because
 * the displacement depends on x as well as time, a straight ribbon is bent into
 * something that folds and unfolds instead of sliding.
 */
function churnOffset(r: Ribbon, fx: number, t: number) {
  const a = TAU * (fx * 1.15 - t / r.spin) + r.phase;
  const b = TAU * (fx * 0.47 + t / (r.spin * 1.9)) + r.phase * 1.7;
  return r.swirl * (Math.sin(a) + 0.55 * Math.sin(b) + 0.3 * Math.sin(a * 2.3 + b));
}

function renderChurn(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";

  const blurScale = Math.min(w / 1400, 1.3);

  for (const r of RIBBONS) {
    const [cr, cg, cb] = r.color;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    for (let k = 0; k <= 8; k++) {
      const fx = k / 8;
      const a = r.alpha * copyFade(fx) * (0.55 + 0.45 * Math.sin(Math.PI * fx));
      grad.addColorStop(fx, `rgba(${cr},${cg},${cb},${a.toFixed(3)})`);
    }

    ctx.filter = r.blur > 0 ? `blur(${(r.blur * blurScale).toFixed(1)}px)` : "none";
    ctx.fillStyle = grad;

    // Thickness breathes with the warp too, so the ribbon pinches where it folds.
    ctx.beginPath();
    for (let i = 0; i <= CHURN_STEPS; i++) {
      const fx = -0.08 + (1.16 * i) / CHURN_STEPS;
      const d = churnOffset(r, fx, t);
      const thick = r.weight * (0.72 + 0.5 * Math.abs(Math.cos(TAU * fx * 0.8 + d * 3)));
      const y = (r.base + d - thick * 0.5) * h;
      if (i === 0) ctx.moveTo(fx * w, y);
      else ctx.lineTo(fx * w, y);
    }
    for (let i = CHURN_STEPS; i >= 0; i--) {
      const fx = -0.08 + (1.16 * i) / CHURN_STEPS;
      const d = churnOffset(r, fx, t);
      const thick = r.weight * (0.72 + 0.5 * Math.abs(Math.cos(TAU * fx * 0.8 + d * 3)));
      ctx.lineTo(fx * w, (r.base + d + thick * 0.5) * h);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";
}

export function HeroChurn({ className = "" }: { className?: string }) {
  return <HeroCanvas render={renderChurn} className={className} stillAt={7} />;
}
