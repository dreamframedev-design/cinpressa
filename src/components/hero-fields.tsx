"use client";

import { HeroCanvas, TAU, smooth } from "@/components/hero-canvas";

/**
 * Churn, the /pipeline hero field.
 *
 * The other interior pages: /about and /news use the default treatment in
 * hero-field.tsx, and /science uses the tessellation in hero-lobule.tsx. Two other
 * fields lived in this file and were removed when their pages changed; both are
 * recoverable from history.
 *
 * TWO RULES, both learned the hard way and both load-bearing here.
 *
 * MASS, NOT TEXTURE. Thin sparse fields read as wallpaper however clever the geometry
 * is. This runs at 0.36-0.50 alpha on forms that cover most of the frame.
 *
 * TRANSFORM, NOT TRANSLATE. Sliding a shape is the least interesting thing it can do.
 * The ribbons here are displaced by a rotating warp, so they curl, fold back on
 * themselves and pinch where they fold: with pure translation removed, the silhouette
 * still changes by about a fifth of the frame height over five seconds.
 */

/** The copy sits left on every interior hero, so every field is damped there. */
const copyFade = (fx: number) => 0.08 + 0.92 * smooth((fx - 0.04) / 0.5);

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
