"use client";

import { HeroCanvas, TAU, smooth, drawHeroWashes } from "@/components/hero-canvas";

/**
 * Churn, the /pipeline hero field.
 *
 * The other interior pages: /about and /news use the default treatment in
 * hero-field.tsx, and /science now takes the shared ribbon field in
 * flow-field.tsx. The hairline fields that used to sit on /science and on two
 * home sections were retired with that change; all are recoverable from
 * history.
 *
 * THE CONCEPT (kept on request): layered brand-colour ribbons continuously
 * STIRRED by a rotating warp — they curl, fold back on themselves and pinch
 * where they fold. Transform, not translate: with sliding removed, the
 * silhouette still changes by about a fifth of the frame height over five
 * seconds. Mass, not texture: broad forms at real alpha, never wallpaper.
 *
 * THE REFINEMENT PASS, after the field was called busy and the headline hard to
 * read — the same lessons the science hero already paid for:
 *
 * - Legibility is the washes' job, not the ribbons'. The shared copy washes
 *   (horizontal fade + elliptical headline guard + nav strip) are composited
 *   over the finished field; the ribbons only carry a gentle left-to-right
 *   build. Before this, mid-strength colour sat directly behind the title.
 * - Busy came from evenness: six ribbons at mid-peaked strength covered the
 *   whole frame equally. Now five ribbons build toward the right, the warp is
 *   a notch calmer, and the top of the frame stays airy under the nav.
 * - Three hairline crest lines ride the blue ribbons — the one element shared
 *   with every other field on the site, precision laid over softness. They are
 *   single strokes at single alphas; the washes do all their damping.
 */

/** Same fade window as the science hero, so the interior pages damp identically. */
const copyFade = (fx: number) => 0.05 + 0.95 * smooth((fx - 0.14) / 0.5);

/** Ribbons build from quiet-left to full-right; the washes carry the rest. */
const build = (fx: number) => 0.25 + 0.75 * smooth((fx - 0.1) / 0.55);

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
  /** Draw a hairline along this ribbon's crest. */
  crest?: boolean;
};

const RIBBONS: Ribbon[] = [
  { base: 0.24, weight: 0.28, color: [175, 219, 188], alpha: 0.36, blur: 16, swirl: 0.16, spin: 31, phase: 0.0 },
  { base: 0.37, weight: 0.36, color: [4, 115, 187], alpha: 0.38, blur: 14, swirl: 0.2, spin: -27, phase: 1.6, crest: true },
  { base: 0.52, weight: 0.24, color: [21, 150, 212], alpha: 0.44, blur: 0, swirl: 0.18, spin: 23, phase: 3.1, crest: true },
  { base: 0.64, weight: 0.3, color: [30, 174, 229], alpha: 0.4, blur: 0, swirl: 0.22, spin: -35, phase: 4.4, crest: true },
  { base: 0.78, weight: 0.32, color: [103, 113, 181], alpha: 0.34, blur: 8, swirl: 0.19, spin: -19, phase: 2.4 },
];

const STEPS = 72;

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

/** Thickness breathes with the warp, so the ribbon pinches where it folds. */
function churnThickness(r: Ribbon, fx: number, d: number) {
  return r.weight * (0.72 + 0.5 * Math.abs(Math.cos(TAU * fx * 0.8 + d * 3)));
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
      const a = r.alpha * build(fx);
      grad.addColorStop(fx, `rgba(${cr},${cg},${cb},${a.toFixed(3)})`);
    }

    ctx.filter = r.blur > 0 ? `blur(${(r.blur * blurScale).toFixed(1)}px)` : "none";
    ctx.fillStyle = grad;

    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const fx = -0.08 + (1.16 * i) / STEPS;
      const d = churnOffset(r, fx, t);
      const thick = churnThickness(r, fx, d);
      const y = (r.base + d - thick * 0.5) * h;
      if (i === 0) ctx.moveTo(fx * w, y);
      else ctx.lineTo(fx * w, y);
    }
    for (let i = STEPS; i >= 0; i--) {
      const fx = -0.08 + (1.16 * i) / STEPS;
      const d = churnOffset(r, fx, t);
      const thick = churnThickness(r, fx, d);
      ctx.lineTo(fx * w, (r.base + d + thick * 0.5) * h);
    }
    ctx.closePath();
    ctx.fill();
  }

  // ── Crest lines: one hairline riding each blue ribbon's upper edge. The one
  //    element every field on the site shares, precision laid over softness.
  ctx.filter = "none";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.1, w / 1400);
  for (const r of RIBBONS) {
    if (!r.crest) continue;
    const [cr, cg, cb] = r.color;
    ctx.strokeStyle = `rgba(${Math.round(cr * 0.55)},${Math.round(cg * 0.55)},${Math.round(cb * 0.72)},0.4)`;
    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const fx = -0.08 + (1.16 * i) / STEPS;
      const d = churnOffset(r, fx, t);
      const thick = churnThickness(r, fx, d);
      const y = (r.base + d - thick * 0.5) * h;
      if (i === 0) ctx.moveTo(fx * w, y);
      else ctx.lineTo(fx * w, y);
    }
    ctx.stroke();
  }

  drawHeroWashes(ctx, w, h, copyFade);
}

export function HeroChurn({ className = "" }: { className?: string }) {
  return (
    <HeroCanvas
      render={renderChurn}
      className={className}
      /* Soft fills tolerate upscale, but the crest hairlines and the crisp
         ribbon edges deserve a store closer to native than the shared default. */
      maxWidth={1800}
      maxDpr={1.5}
      stillAt={7}
    />
  );
}
