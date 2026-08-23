"use client";

import { HeroCanvas, TAU, clamp01, smooth } from "@/components/hero-canvas";

/**
 * CadenceField — pulsatile flow resolving into a sustained level.
 *
 * WHAT MAKES IT DIFFERENT FROM THE FIELD ABOVE IT. The shared FlowField draws
 * continuous ribbons that are pinched and released; every band is unbroken end
 * to end, which is what "flow" looks like when it is already steady. Putting a
 * second one of those behind this section would say nothing the header field
 * has not already said.
 *
 * This one is built from GAPS. On the left the bands are not bands at all —
 * they are separate lobes with clear white between them, arriving one after
 * another: pulsatile flow, and the peak-and-trough of a drug taken daily. As
 * they travel they broaden, flatten and overlap, and by the right of the frame
 * the train has closed into one even, unbroken level that no longer pulses.
 * Same claim as the copy it sits behind, made in the same brand language —
 * translucent colour under multiply, so the deepest tone appears exactly where
 * the merging lobes cross — but a silhouette the site does not have anywhere
 * else, because nothing else here has holes in it.
 *
 * The pulses are not a heartbeat and are deliberately not timed like one: a
 * lobe takes eleven to seventeen seconds to cross, so it reads as tide rather
 * than as a vital sign. Nothing here is a monitor.
 */

type Band = {
  /** Centre height, as a fraction of the field. */
  base: number;
  /** Half-thickness once the train has merged into a level. */
  level: number;
  /** Peak half-thickness of a single lobe before merging. */
  peak: number;
  color: [number, number, number];
  alpha: number;
  blur: number;
  /** Distance between lobes, as a fraction of the width. */
  spacing: number;
  /** Seconds for a lobe to travel one full width. */
  period: number;
  /** Lobe half-width at the left edge, as a fraction of the width. */
  width: number;
  phase: number;
  /** Slow vertical drift, so the bands breathe against each other. */
  drift: number;
  driftPeriod: number;
};

const BANDS: Band[] = [
  { base: 0.34, level: 0.07, peak: 0.185, color: [4, 115, 187], alpha: 0.4, blur: 13, spacing: 0.26, period: 15, width: 0.03, phase: 0.0, drift: 0.04, driftPeriod: 41 },
  { base: 0.5, level: 0.055, peak: 0.155, color: [21, 150, 212], alpha: 0.44, blur: 0, spacing: 0.225, period: 11, width: 0.026, phase: 1.9, drift: 0.032, driftPeriod: 53 },
  { base: 0.63, level: 0.065, peak: 0.17, color: [103, 113, 181], alpha: 0.33, blur: 9, spacing: 0.3, period: 17, width: 0.034, phase: 3.6, drift: 0.045, driftPeriod: 47 },
  { base: 0.44, level: 0.035, peak: 0.105, color: [175, 219, 188], alpha: 0.42, blur: 6, spacing: 0.2, period: 13, width: 0.022, phase: 5.1, drift: 0.026, driftPeriod: 37 },
];

/**
 * How far across the pulses have finished merging into a level.
 *
 * Pushed late deliberately. The first cut merged between 22% and 78%, which
 * put every gap in the left third — exactly where the field is damped for the
 * copy — so the one thing that distinguishes this field was invisible and it
 * read as another continuous band. The lobes now stay separate across the
 * whole reading half and close only in the last quarter, where the section is
 * empty and the field is at full strength.
 */
const merged = (fx: number) => smooth((fx - 0.46) / 0.4);

const STEPS = 108;

/**
 * Half-thickness of a band at fx. Left of the merge the profile is a train of
 * separate lobes with nothing between them; right of it, a constant level. The
 * lobes also broaden as they travel, so they close the gaps themselves rather
 * than being cross-faded shut.
 */
function halfAt(b: Band, fx: number, t: number) {
  const m = merged(fx);
  const sigma = b.width * (1 + 1.7 * fx);
  const travel = ((t / b.period) + b.phase * 0.1) % b.spacing;

  let train = 0;
  const first = Math.floor((-0.2 - travel) / b.spacing);
  const last = Math.ceil((1.2 - travel) / b.spacing);
  for (let k = first; k <= last; k++) {
    const c = k * b.spacing + travel;
    const d = (fx - c) / sigma;
    if (d > 4 || d < -4) continue;
    train += Math.exp(-0.5 * d * d);
  }

  return b.peak * train * (1 - m) + b.level * m;
}

function centreAt(b: Band, fx: number, t: number) {
  return (
    b.base +
    b.drift * Math.sin((TAU * t) / b.driftPeriod + b.phase) +
    // A gentle sag across the frame so the level is not a ruled line.
    0.022 * Math.sin(TAU * fx * 0.55 + b.phase * 1.4)
  );
}

/** Quiet at the reading edge, full where the section is empty. */
const damp = (fx: number) => 0.3 + 0.7 * smooth((fx - 0.1) / 0.6);
/** Dissolve both ends so no band has a cut edge. */
const ends = (fx: number) => smooth(fx / 0.14) * smooth((1 - fx) / 0.12);

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";

  const blurScale = Math.min(w / 1400, 1.3);

  for (const b of BANDS) {
    const [cr, cg, cb] = b.color;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    for (let k = 0; k <= 10; k++) {
      const fx = k / 10;
      const a = b.alpha * damp(fx) * ends(fx);
      grad.addColorStop(fx, `rgba(${cr},${cg},${cb},${clamp01(a).toFixed(3)})`);
    }

    ctx.filter = b.blur > 0 ? `blur(${(b.blur * blurScale).toFixed(1)}px)` : "none";
    ctx.fillStyle = grad;

    ctx.beginPath();
    for (let i = 0; i <= STEPS; i++) {
      const fx = i / STEPS;
      const y = (centreAt(b, fx, t) - halfAt(b, fx, t)) * h;
      if (i === 0) ctx.moveTo(fx * w, y);
      else ctx.lineTo(fx * w, y);
    }
    for (let i = STEPS; i >= 0; i--) {
      const fx = i / STEPS;
      ctx.lineTo(fx * w, (centreAt(b, fx, t) + halfAt(b, fx, t)) * h);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
}

export function CadenceField({ className = "" }: { className?: string }) {
  return (
    <HeroCanvas
      render={render}
      className={className}
      maxWidth={1400}
      maxDpr={1.25}
      /* A composed moment: several lobes mid-flight, the right already level. */
      stillAt={9}
    />
  );
}
