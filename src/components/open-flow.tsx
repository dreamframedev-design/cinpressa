"use client";

import type { HeroRender } from "@/components/hero-canvas";
import { HeroCanvas, TAU } from "@/components/hero-canvas";

/**
 * OpenFlow — flow that is never constricted.
 *
 * WHAT THIS REPLACES AND WHY. The field that used to sit here was built on one
 * idea: ribbons collapsing onto a single line, crowding, and then released past
 * a gate. It was a good picture of pressure, which turned out to be exactly the
 * problem — a hypertension brand cannot open its science page with a bundle
 * being squeezed. The note that came back was blunt and correct: no funnels.
 * Constriction is the condition, not the offer.
 *
 * So the one idea here is the opposite one, and it is stated by what the field
 * REFUSES to do. Every ribbon holds its full weight from edge to edge. None of
 * them narrows, none converges on another, and there is no point anywhere in the
 * frame where the flow is tighter than anywhere else. The eye keeps looking for
 * the event and never finds one, which is the argument: nothing here is being
 * squeezed, and the passage is open the whole way across.
 *
 * The material is the brand's own and is unchanged — broad translucent ribbons
 * from the mark's colour ladder composited with MULTIPLY, the same operation the
 * mark performs on itself. Where two cross, the colour deepens on its own, so
 * the richest areas of the field are ones nobody chose. In the old field the
 * deepest colour sat at the pinch, which is to say the beauty was made by
 * crowding. Here it is made by TIME: the crests travel, the crossings migrate,
 * and the deep colour moves with them.
 *
 * Every ribbon travels the same direction. Weather can be directionless; flow
 * cannot, and this is flow.
 *
 * COMPOSITION. The mass sits low and dissolves upward, so the field reads as a
 * ground the headline stands on rather than a band laid across it. The left
 * column is damped hard because the copy lives there. Both are painted as
 * gradients rather than cut, so the field has no edge anywhere.
 *
 * Nothing is fast: every period sits between 26 and 74 seconds. Under reduced
 * motion HeroCanvas holds a single composed frame, which is a good still image.
 */

type Ribbon = {
  /** Centre height as a fraction of the field. */
  base: number;
  /** Drift of that centre from the left edge to the right. */
  rise: number;
  /** Thickness as a fraction of the field. CONSTANT — see the note above. */
  weight: number;
  /** Swell amplitude (fraction of field) and wavelength (fraction of width). */
  amp: number;
  lambda: number;
  phase: number;
  color: [number, number, number];
  alpha: number;
  blur: number;
  /** Seconds for the wave to travel one wavelength. All the same sign. */
  flow: number;
  /** Vertical drift — what opens and closes the overlaps. */
  bob: number;
  bobPeriod: number;
  /** Swell modulation: fraction of amp, period in seconds. */
  breathe: number;
  breathePeriod: number;
  /** Hairline along the upper edge — the brand's one precision note. */
  crest?: boolean;
};

/**
 * Six ribbons, all from the spec sheet's ladder. The heavy ones sit low and the
 * light ones ride above them, so the field has a floor and a haze rather than a
 * uniform stripe. Alphas run 0.30–0.52; nothing here is a tint.
 */
/**
 * TUNED TOWARD THE BLEED. The note was that this field was missing the darkness
 * and the purple the second wave piece has, and the reason was specific rather
 * than general: both fields already multiply, and both draw from the same
 * palette, but in this one the deep blue and the violet were its two most
 * transparent and most heavily blurred ribbons. The colours that carry a field's
 * weight were the ones being washed out.
 *
 * Against the bleed's own numbers: its deep blue runs alpha 0.42 at blur 22 with
 * the heaviest weight in the stack, its azure 0.5 at blur 0, and its violet 0.38
 * at blur 7. This ran 0.34/blur 26, 0.44/blur 10, and 0.30/blur 20. Those three
 * are brought to the bleed's strength and given back their edges; the rest of
 * the stack is untouched, and so is the geometry - the ribbons still widen and
 * narrow without ever pinching, which is the whole reason this field exists.
 */
const RIBBONS: Ribbon[] = [
  { base: 0.86, rise: -0.05, weight: 0.36, amp: 0.045, lambda: 0.78, phase: 0.0, color: [4, 115, 187], alpha: 0.46, blur: 12, flow: 58, bob: 0.03, bobPeriod: 52, breathe: 0.26, breathePeriod: 41 },
  { base: 0.74, rise: 0.06, weight: 0.26, amp: 0.055, lambda: 0.64, phase: 2.1, color: [21, 150, 212], alpha: 0.5, blur: 3, flow: 44, bob: 0.038, bobPeriod: 39, breathe: 0.3, breathePeriod: 47, crest: true },
  { base: 0.63, rise: -0.04, weight: 0.17, amp: 0.048, lambda: 0.88, phase: 4.0, color: [30, 174, 229], alpha: 0.46, blur: 0, flow: 66, bob: 0.031, bobPeriod: 58, breathe: 0.24, breathePeriod: 33 },
  { base: 0.55, rise: 0.05, weight: 0.13, amp: 0.042, lambda: 0.71, phase: 1.2, color: [149, 218, 248], alpha: 0.52, blur: 6, flow: 37, bob: 0.027, bobPeriod: 45, breathe: 0.34, breathePeriod: 29 },
  { base: 0.48, rise: -0.03, weight: 0.1, amp: 0.036, lambda: 1.02, phase: 5.3, color: [175, 219, 188], alpha: 0.4, blur: 14, flow: 74, bob: 0.022, bobPeriod: 63, breathe: 0.28, breathePeriod: 37, crest: true },
  { base: 0.93, rise: 0.04, weight: 0.32, amp: 0.038, lambda: 0.83, phase: 3.1, color: [103, 113, 181], alpha: 0.42, blur: 8, flow: 50, bob: 0.026, bobPeriod: 34, breathe: 0.22, breathePeriod: 26 },
];

/** Centre line of a ribbon at horizontal fraction f and time t, in fractions. */
function centre(b: Ribbon, f: number, t: number) {
  const bob = b.bob * Math.sin((TAU * t) / b.bobPeriod + b.phase);
  const amp =
    b.amp * (1 + b.breathe * Math.sin((TAU * t) / b.breathePeriod + b.phase * 0.7));
  const travel = (TAU * t) / b.flow;
  return (
    b.base +
    b.rise * f +
    bob +
    amp * Math.sin(TAU * (f / b.lambda) - travel + b.phase) +
    // A second swell on its own rate, so the sum never settles into a clean
    // repeating wave and the crossings never lock in step.
    amp * 0.32 * Math.sin(TAU * (f / (b.lambda * 0.43)) - travel * 0.61 + b.phase * 1.7)
  );
}

const STEPS = 52;

/** Walk one edge of a ribbon. `side` is -0.5 for the top, +0.5 for the bottom. */
function edge(
  ctx: CanvasRenderingContext2D,
  b: Ribbon,
  w: number,
  h: number,
  t: number,
  side: number,
  reverse: boolean,
  start: boolean,
) {
  for (let i = 0; i <= STEPS; i++) {
    const k = reverse ? STEPS - i : i;
    const f = k / STEPS;
    // Overshoot both edges so no ribbon ever shows an end inside the frame.
    const x = -0.08 * w + 1.16 * w * f;
    const y = (centre(b, f, t) + side * b.weight) * h;
    if (start && i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}

function render(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Multiply needs something to multiply into, and the hero is white.
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "multiply";
  const blurScale = w / 1600;

  for (const b of RIBBONS) {
    const [r, g, bl] = b.color;
    // Fade to nothing at both ends: the colour arrives and leaves rather than
    // starting and stopping, which is what keeps the field from having edges.
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, `rgba(${r},${g},${bl},0)`);
    grad.addColorStop(0.2, `rgba(${r},${g},${bl},${(b.alpha * 0.82).toFixed(3)})`);
    grad.addColorStop(0.55, `rgba(${r},${g},${bl},${b.alpha.toFixed(3)})`);
    grad.addColorStop(0.86, `rgba(${r},${g},${bl},${(b.alpha * 0.9).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);

    ctx.filter = b.blur > 0 ? `blur(${(b.blur * blurScale).toFixed(1)}px)` : "none";
    ctx.fillStyle = grad;
    ctx.beginPath();
    edge(ctx, b, w, h, t, -0.5, false, true);
    edge(ctx, b, w, h, t, 0.5, true, false);
    ctx.closePath();
    ctx.fill();
  }

  ctx.filter = "none";

  // The crest hairlines, drawn after the masses so they stay crisp.
  ctx.globalCompositeOperation = "source-over";
  ctx.lineWidth = Math.max(1, w / 1700);
  for (const b of RIBBONS) {
    if (!b.crest) continue;
    const [r, g, bl] = b.color;
    const line = ctx.createLinearGradient(0, 0, w, 0);
    line.addColorStop(0, `rgba(${r},${g},${bl},0)`);
    line.addColorStop(0.4, `rgba(${r},${g},${bl},0.5)`);
    line.addColorStop(1, `rgba(${r},${g},${bl},0)`);
    ctx.strokeStyle = line;
    ctx.beginPath();
    edge(ctx, b, w, h, t, -0.5, false, true);
    ctx.stroke();
  }

  // Dissolve upward, so the field is a ground rather than a band. Eased back
  // with the ribbons: these scrims were set against a paler stack, and at their
  // old strength they took most of the added depth straight back off.
  const up = ctx.createLinearGradient(0, 0, 0, h);
  up.addColorStop(0, "rgba(255,255,255,1)");
  up.addColorStop(0.34, "rgba(255,255,255,0.44)");
  up.addColorStop(0.66, "rgba(255,255,255,0)");
  ctx.fillStyle = up;
  ctx.fillRect(0, 0, w, h);

  // Damp the left column hard: the headline lives there and must sit on paper.
  // The left column is held at full strength - the headline still has to sit on
  // paper - and only the half with nothing over it is let through darker.
  const left = ctx.createLinearGradient(0, 0, w, 0);
  left.addColorStop(0, "rgba(255,255,255,0.94)");
  left.addColorStop(0.3, "rgba(255,255,255,0.72)");
  left.addColorStop(0.62, "rgba(255,255,255,0.08)");
  left.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = left;
  ctx.fillRect(0, 0, w, h);
}

export function OpenFlow({ className = "" }: { className?: string }) {
  const draw: HeroRender = (ctx, w, h, t) => render(ctx, w, h, t);
  return (
    <HeroCanvas
      render={draw}
      className={className}
      superSample={1.25}
      maxWidth={2600}
      maxDpr={2}
      frameMs={33}
      /* A composed moment rather than every ribbon at its start phase. */
      stillAt={17}
      ioThreshold={0.05}
    />
  );
}
