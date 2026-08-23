"use client";

import { HeroCanvas, TAU, clamp01, smooth } from "@/components/hero-canvas";

/**
 * FoundationFlow — the current inside the foundation block.
 *
 * The control-model figure states the architecture, but the first cut of it
 * was a still image after its entrance, and a dead diagram undersells the one
 * word the whole section leans on: CONTINUOUS. So the foundation is not a
 * painted slab — it is a window onto moving water. Light streaks drift along
 * it endlessly, all in one direction, calm and laminar, never pulsing: the
 * backbone of control as flow that simply does not stop.
 *
 * Same discipline as every field on the site: soft masses, no hairlines, slow
 * periods (15–43s), a second harmonic so nothing resolves into a clean repeat,
 * and edges dissolved before the frame. Drawn in the icon ladder's light blues
 * over the block's deep gradient, so it reads as depth inside the foundation
 * rather than decoration on it.
 */

type Streak = {
  /** Centreline height, fraction of the block. */
  y: number;
  /** Swell of the centreline, fraction of the block. */
  amp: number;
  /** Half-thickness, fraction of the block. */
  half: number;
  /** Wavelength (fraction of width) and travel period (s). */
  lam: number;
  per: number;
  ph: number;
  color: [number, number, number];
  alpha: number;
  blur: number;
};

const STREAKS: Streak[] = [
  { y: 0.28, amp: 0.1, half: 0.16, lam: 0.85, per: 24, ph: 0.0, color: [126, 170, 219], alpha: 0.2, blur: 9 },
  { y: 0.52, amp: 0.13, half: 0.12, lam: 0.6, per: 15, ph: 2.1, color: [149, 218, 248], alpha: 0.24, blur: 0 },
  { y: 0.72, amp: 0.11, half: 0.15, lam: 1.1, per: 31, ph: 4.2, color: [170, 219, 246], alpha: 0.16, blur: 7 },
  /* One broad pale sheen behind the others: the water's own light. */
  { y: 0.44, amp: 0.08, half: 0.26, lam: 1.5, per: 43, ph: 5.3, color: [255, 255, 255], alpha: 0.1, blur: 13 },
];

const STEPS = 64;

/** Dissolve both ends so no streak has a cut edge inside the block. */
const ends = (fx: number) => smooth(fx / 0.1) * smooth((1 - fx) / 0.1);

function centreAt(s: Streak, fx: number, t: number) {
  return (
    s.y +
    s.amp * Math.sin(TAU * (fx / s.lam) - (TAU * t) / s.per + s.ph) +
    s.amp * 0.4 * Math.sin(TAU * (fx / (s.lam * 0.47)) - (TAU * t) / (s.per * 1.7) + s.ph * 1.6)
  );
}

/** Thickness pinches gently along the run, so the streaks read as current
 *  rather than as tubes. */
function halfAt(s: Streak, fx: number, t: number) {
  return s.half * (0.68 + 0.42 * Math.abs(Math.cos(TAU * fx * 0.8 + s.ph + (TAU * t) / (s.per * 2.1))));
}

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.clearRect(0, 0, w, h);

  const blurScale = Math.min(w / 1000, 1.4);

  for (const s of STREAKS) {
    const [cr, cg, cb] = s.color;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    for (let k = 0; k <= 8; k++) {
      const fx = k / 8;
      const a = s.alpha * ends(fx);
      grad.addColorStop(fx, `rgba(${cr},${cg},${cb},${clamp01(a).toFixed(3)})`);
    }

    ctx.filter = s.blur > 0 ? `blur(${(s.blur * blurScale).toFixed(1)}px)` : "none";
    ctx.fillStyle = grad;

    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const fx = i / STEPS;
      const y = (centreAt(s, fx, t) - halfAt(s, fx, t)) * h;
      if (i === 0) ctx.moveTo(fx * w, y);
      else ctx.lineTo(fx * w, y);
    }
    for (let i = STEPS; i >= 0; i--) {
      const fx = i / STEPS;
      ctx.lineTo(fx * w, (centreAt(s, fx, t) + halfAt(s, fx, t)) * h);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.filter = "none";
}

export function FoundationFlow({ className = "" }: { className?: string }) {
  return (
    <HeroCanvas
      render={render}
      className={className}
      maxWidth={1200}
      maxDpr={1.25}
      stillAt={13}
    />
  );
}
