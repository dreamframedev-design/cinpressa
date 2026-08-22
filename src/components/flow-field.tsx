"use client";

import {
  HeroCanvas,
  TAU,
  clamp01,
  smooth,
  drawHeroWashes,
} from "@/components/hero-canvas";

/**
 * FlowField — constricted flow opening out. One field, four placements.
 *
 * WHAT THIS REPLACES, AND WHY IT IS ONE COMPONENT INSTEAD OF FOUR.
 * The site had grown a bespoke artwork per section: streamlines bending round an
 * unseen sphere, forty-two pressure traces braiding into a corridor, a fan of
 * diverging wavefronts, capsules streaming to a focal point. Each was individually
 * defensible and collectively they were four different languages on one site, three
 * of them built from hairlines — and the direction that came back was that the
 * hairline fields do not read as this brand, and that not every section needs its
 * own picture. So they are gone, and every one of those places now takes this.
 *
 * THE LANGUAGE IS THE ONE ALREADY ACCEPTED: the layered wave on the home page and
 * the ribbon field on the pipeline hero. Broad translucent brand-colour ribbons
 * composited with MULTIPLY, which is the whole trick and the same operation the mark
 * performs on itself — where ribbons cross, the colour deepens, so the richest areas
 * are ones nobody chose. Per-layer blur for depth, edges dissolved rather than cut,
 * and nothing hurried: every period sits between 24 and 60 seconds, so it reads as
 * weather rather than as an animation.
 *
 * THE ONE IDEA IT ADDS: flow that is pinched and then released.
 *
 * Left of the gate every ribbon collapses toward a single line and thins — a tight,
 * crowded bundle, and because six translucent ribbons are stacked on the same path
 * under multiply, that bundle is the deepest colour in the frame WITHOUT anything
 * being painted darker. Past the gate they fan back to their own heights and open to
 * full weight, so the field broadens into calm layered flow. Constriction relieved,
 * stated in mass rather than in diagram. It needs no label and gets none.
 *
 * Every ribbon's wave also travels the same direction, unlike the home wave where
 * they run both ways. Weather can be directionless; flow cannot.
 *
 * The gate breathes across a 23-second cycle so the release is never a fixed
 * landmark, and it sits right of centre in the hero variant — where the eye leaves
 * the headline.
 */

/** The accepted palette: the mark's own ladder, as used by the home wave. */
type Ribbon = {
  /** Centre height once open, as a fraction of the field. */
  base: number;
  /** Thickness once open, as a fraction of the field. */
  weight: number;
  color: [number, number, number];
  alpha: number;
  blur: number;
  /** Swell amplitude (fraction of field) and wavelength (fraction of width). */
  amp: number;
  lambda: number;
  /** Seconds for the wave to travel one wavelength. All positive: flow has a
   *  direction. Varied so the crossings migrate instead of locking in step. */
  flow: number;
  /** Vertical drift, which is what opens and closes the overlaps. */
  bob: number;
  bobPeriod: number;
  phase: number;
  /** Hairline along this ribbon's upper edge — the one precision note the
   *  accepted pipeline field already carries. */
  crest?: boolean;
};

const RIBBONS: Ribbon[] = [
  { base: 0.26, weight: 0.25, color: [175, 219, 188], alpha: 0.34, blur: 20, amp: 0.055, lambda: 0.86, flow: 41, bob: 0.045, bobPeriod: 47, phase: 0.0 },
  { base: 0.38, weight: 0.33, color: [4, 115, 187], alpha: 0.4, blur: 15, amp: 0.07, lambda: 0.68, flow: 55, bob: 0.056, bobPeriod: 39, phase: 1.6, crest: true },
  { base: 0.5, weight: 0.22, color: [21, 150, 212], alpha: 0.46, blur: 0, amp: 0.048, lambda: 0.94, flow: 33, bob: 0.038, bobPeriod: 55, phase: 3.1, crest: true },
  { base: 0.62, weight: 0.28, color: [30, 174, 229], alpha: 0.42, blur: 0, amp: 0.062, lambda: 0.74, flow: 46, bob: 0.05, bobPeriod: 43, phase: 4.4 },
  { base: 0.44, weight: 0.13, color: [149, 218, 248], alpha: 0.5, blur: 6, amp: 0.04, lambda: 1.08, flow: 28, bob: 0.032, bobPeriod: 60, phase: 5.4 },
  { base: 0.75, weight: 0.29, color: [103, 113, 181], alpha: 0.33, blur: 8, amp: 0.045, lambda: 0.8, flow: 60, bob: 0.042, bobPeriod: 33, phase: 2.4 },
];

/** The line the bundle collapses onto before the gate. */
const BUNDLE = 0.5;
/** How much spread and weight survive inside the constriction. */
const HELD_SPREAD = 0.14;
const HELD_WEIGHT = 0.24;

const STEPS = 72;

type Shape = { gate: number; span: number; seed: number; strength: number };

/** 0 while the flow is held, 1 once it has opened out. */
function opened(fx: number, t: number, s: Shape) {
  // The gate breathes, so the release is a moving event rather than a landmark.
  const gate = s.gate + 0.032 * Math.sin((TAU * t) / 23 + s.seed);
  return smooth((fx - gate) / s.span);
}

function centreOf(r: Ribbon, fx: number, t: number, s: Shape) {
  const open = opened(fx, t, s);
  const bob = r.bob * Math.sin((TAU * t) / r.bobPeriod + r.phase + s.seed);
  const swell =
    r.amp *
    Math.sin(TAU * (fx / r.lambda) - (TAU * t) / r.flow + r.phase + s.seed);
  // A second swell at its own rate, so the sum never settles into a clean sine.
  const cross =
    r.amp *
    0.36 *
    Math.sin(TAU * (fx / (r.lambda * 0.43)) - (TAU * t) / (r.flow * 1.6) + r.phase * 1.7);

  const spread = HELD_SPREAD + (1 - HELD_SPREAD) * open;
  // Swell and drift are held back inside the constriction along with the spread:
  // pinched flow is not just narrow, it is orderly.
  return BUNDLE + (r.base - BUNDLE) * spread + (bob + swell + cross) * spread;
}

function weightOf(r: Ribbon, fx: number, t: number, s: Shape) {
  return r.weight * (HELD_WEIGHT + (1 - HELD_WEIGHT) * opened(fx, t, s));
}

/** Ink across the width. Dissolves in from the left edge so nothing has a cut end. */
function inkAt(fx: number, s: Shape, fadeRight: boolean) {
  const inn = smooth(fx / 0.16);
  const out = fadeRight ? smooth((1 - fx) / 0.14) : 1;
  return s.strength * inn * out;
}

function makeRender(
  s: Shape,
  opts: { transparent: boolean; crest: boolean; hero: boolean; damp: (fx: number) => number },
) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "none";
    ctx.clearRect(0, 0, w, h);
    if (!opts.transparent) {
      // Multiply needs something to multiply into.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = "multiply";

    const blurScale = Math.min(w / 1400, 1.3);
    const fadeRight = !opts.hero;

    for (const r of RIBBONS) {
      const [cr, cg, cb] = r.color;
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      for (let k = 0; k <= 10; k++) {
        const fx = k / 10;
        const a = r.alpha * inkAt(fx, s, fadeRight) * opts.damp(fx);
        grad.addColorStop(fx, `rgba(${cr},${cg},${cb},${clamp01(a).toFixed(3)})`);
      }

      ctx.filter = r.blur > 0 ? `blur(${(r.blur * blurScale).toFixed(1)}px)` : "none";
      ctx.fillStyle = grad;

      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        // Overshoot both edges so no ribbon shows an end inside the frame.
        const fx = -0.06 + (1.12 * i) / STEPS;
        const y = centreOf(r, fx, t, s) - weightOf(r, fx, t, s) * 0.5;
        if (i === 0) ctx.moveTo(fx * w, y * h);
        else ctx.lineTo(fx * w, y * h);
      }
      for (let i = STEPS; i >= 0; i--) {
        const fx = -0.06 + (1.12 * i) / STEPS;
        const y = centreOf(r, fx, t, s) + weightOf(r, fx, t, s) * 0.5;
        ctx.lineTo(fx * w, y * h);
      }
      ctx.closePath();
      ctx.fill();
    }

    // One hairline riding the crest of the blue ribbons. Single stroke at a
    // single alpha — an alpha ramp along a hairline reads as dashes.
    if (opts.crest) {
      ctx.filter = "none";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(1.1, w / 1400);
      for (const r of RIBBONS) {
        if (!r.crest) continue;
        const [cr, cg, cb] = r.color;
        ctx.strokeStyle = `rgba(${Math.round(cr * 0.55)},${Math.round(cg * 0.55)},${Math.round(cb * 0.72)},0.38)`;
        ctx.beginPath();
        for (let i = 0; i <= STEPS; i++) {
          const fx = -0.06 + (1.12 * i) / STEPS;
          const y = centreOf(r, fx, t, s) - weightOf(r, fx, t, s) * 0.5;
          if (i === 0) ctx.moveTo(fx * w, y * h);
          else ctx.lineTo(fx * w, y * h);
        }
        ctx.stroke();
      }
    }

    if (opts.hero) drawHeroWashes(ctx, w, h, opts.damp, opts.transparent);
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "none";
  };
}

type FlowFieldProps = {
  className?: string;
  /**
   * hero: full-strength field behind a page header, damped under the left copy
   *   column by the shared hero washes, gate right of centre.
   * ambient: a quiet backdrop that runs under body copy, damped evenly and
   *   dissolved at both ends.
   */
  variant?: "hero" | "ambient";
  /** Overall ink. Ambient placements sit far below their copy. */
  strength?: number;
  /** Where the flow is released, as a fraction across, and how far that takes. */
  gate?: number;
  span?: number;
  /** Composite onto the surface behind rather than onto white. */
  transparent?: boolean;
  /** Hairline on the blue crests. */
  crest?: boolean;
  /** Phase offset, so two placements on one page are not the same picture. */
  seed?: number;
};

export function FlowField({
  className = "",
  variant = "hero",
  strength,
  gate,
  span,
  transparent = false,
  crest,
  seed = 0,
}: FlowFieldProps) {
  const hero = variant === "hero";
  const shape: Shape = {
    gate: gate ?? (hero ? 0.42 : 0.3),
    span: span ?? (hero ? 0.34 : 0.42),
    seed,
    strength: strength ?? (hero ? 1 : 0.5),
  };

  // The hero washes handle legibility for a headline block. An ambient field
  // has no such block to guard — copy can run anywhere across it — so it keeps
  // the same left-quiet-to-right-full build at a fraction of the range: the
  // reading edge stays clear and the ink gathers where a section's right side
  // is usually emptier. An earlier cut weighted BOTH ends and put the heaviest
  // colour under the right-hand half of a full-width milestone row.
  const damp = hero
    ? (fx: number) => 0.06 + 0.94 * smooth((fx - 0.06) / 0.46)
    : (fx: number) => 0.34 + 0.66 * smooth((fx - 0.08) / 0.62);

  return (
    <HeroCanvas
      className={className}
      render={makeRender(shape, {
        transparent,
        crest: crest ?? hero,
        hero,
        damp,
      })}
      /* Soft masses tolerate upscale; the crest hairlines want a store closer
         to native than the shared default. */
      maxWidth={hero ? 1800 : 1400}
      maxDpr={crest ?? hero ? 1.5 : 1.25}
      stillAt={11}
    />
  );
}
