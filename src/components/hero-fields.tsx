"use client";

import {
  HeroCanvas,
  TAU,
  clamp01,
  copyFade,
  smooth,
} from "@/components/hero-canvas";

/**
 * Three interior hero fields, one per page.
 *
 * /about keeps the original treatment and is untouched. These three are for /science,
 * /pipeline and /news, and the requirement was that each read as its own thing rather
 * than one backdrop recoloured three times.
 *
 * They are separated by MARK-MAKING, not by palette or speed, because that is the only
 * separation the eye actually registers. Recolouring one geometry gives you three
 * versions of the same picture; changing what the picture is MADE OF gives you three
 * pictures. Each also picks a language nothing else on the site already uses:
 *
 *   Bleed          home lead        soft colour mass, multiply           (existing)
 *   FocusField     home pipeline    capsules streaming inward            (existing)
 *   WaveLines      contact          fine ruled surface                   (existing)
 *
 *   Dispersion     /science         POINTS. A stippled field.
 *   Advance        /pipeline        ARCS. Long fronts sweeping past.
 *   Interleave     /news            CROSSED DIAGONALS. A woven lattice.
 *
 * All three share the house rules: spec-sheet colour only, multiply where things
 * overlap so the deep tones are produced rather than picked, quiet under the copy
 * column, everything fading at the frame edge so nothing is ever cut, and periods long
 * enough to read as weather.
 */

/* ═══════════════════════════════════════════════════════════════════════════
   SCIENCE — Dispersion

   Points, because the page is about a molecule distributing through tissue and
   suppressing production where it arrives. A stippled field is the one mark-making
   language that reads as "many small things" rather than "a shape", and density is
   the only variable it needs: the field concentrates and thins as slow waves of
   availability move through it. Nothing here is a diagram; the page already carries
   two, and they explain the mechanism perfectly well on their own.
   ═══════════════════════════════════════════════════════════════════════════ */

const DOT_COLS = 96;
const DOT_ROWS = 46;

/** Deterministic hash. Never Math.random: the field must survive a resize unchanged. */
function hash(i: number) {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const DISPERSION_COLORS: Array<[number, number, number]> = [
  [4, 115, 187],
  [21, 150, 212],
  [30, 174, 229],
  [126, 170, 219],
  [175, 219, 188],
];

function renderDispersion(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";

  const s = Math.min(w / 1200, 1.4);

  for (let gy = 0; gy < DOT_ROWS; gy++) {
    for (let gx = 0; gx < DOT_COLS; gx++) {
      const i = gy * DOT_COLS + gx;

      // Jittered lattice. A true grid reads as a screen; jitter makes it a population.
      const fx = (gx + 0.5) / DOT_COLS + (hash(i) - 0.5) * 0.85 / DOT_COLS;
      const fy = (gy + 0.5) / DOT_ROWS + (hash(i + 7919) - 0.5) * 0.85 / DOT_ROWS;

      // Availability: two slow waves crossing, one travelling right and one down, so
      // the dense regions migrate rather than pulsing in place.
      const a =
        Math.sin(TAU * (fx * 1.15 + fy * 0.42 - t / 71)) +
        Math.sin(TAU * (fx * 0.58 - fy * 0.95 + t / 103)) * 0.8 +
        Math.sin(TAU * (fx * 2.1 + fy * 1.6 - t / 47)) * 0.35;
      // Steep, so most of the field is sparse and the concentrations are events.
      const density = clamp01((a / 2.15 + 1) * 0.5);
      const weight = Math.pow(density, 2.4);

      // Dissolve at the top edge. Points are small enough that clipping one is
      // invisible, but the FIELD ending on a straight line is not: a stipple that
      // stops dead reads as a cropped texture. Fading it in means the population
      // begins rather than starts.
      const alpha = weight * 0.5 * copyFade(fx) * smooth(fy / 0.13);
      if (alpha < 0.012) continue;

      // Colour follows concentration: the sparse edges sit pale and green, the dense
      // cores go to cobalt. So the field reads as depth of effect, not as decoration.
      const ci = Math.min(
        DISPERSION_COLORS.length - 1,
        Math.floor((1 - weight) * DISPERSION_COLORS.length),
      );
      const [r, g, b] = DISPERSION_COLORS[ci];

      // A slow drift on top, so individual points are never quite still.
      const dx = Math.sin(t / 37 + i * 0.7) * 2.2 * s;
      const dy = Math.cos(t / 53 + i * 1.1) * 1.8 * s;

      const radius = (0.7 + weight * 2.1) * s;
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(fx * w + dx, fy * h + dy, radius, 0, TAU);
      ctx.fill();
    }
  }

  ctx.globalCompositeOperation = "source-over";
}

export function HeroDispersion({ className = "" }: { className?: string }) {
  return <HeroCanvas render={renderDispersion} className={className} stillAt={23} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PIPELINE — Advance

   Arcs, because the page is one programme moving through stages and the field should
   have a direction. Fronts sweep across and pass; each one is a boundary crossed.

   ANTI-RADAR, which is the whole risk with arcs: the centre sits far off the lower
   left, several frame-widths away, so the curvature is gentle and you never perceive
   concentric rings. What you see is a series of long shallow curves crossing the
   field, which is a different object entirely from a target.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Centre, in multiples of the frame. Far enough out that curvature stays subtle. */
const ARC_CX = -1.35;
const ARC_CY = 2.4;

/** Seconds for one front to cross. Long: this is a programme, not a scanner. */
const ARC_PERIOD = 26;
const ARC_COUNT = 5;

const ARC_COLORS: Array<[number, number, number]> = [
  [4, 115, 187],
  [21, 150, 212],
  [30, 174, 229],
  [126, 170, 219],
  [149, 218, 248],
  [103, 113, 181],
  [175, 219, 188],
];

function renderAdvance(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";
  ctx.lineCap = "butt";

  const d = Math.hypot(w, h);
  const cx = ARC_CX * w;
  const cy = ARC_CY * h;

  // The sweep is derived from where the frame actually sits relative to the centre,
  // not guessed. A front is only visible while its radius is between the nearest and
  // farthest corner, so anchoring the range to those two distances (plus a margin to
  // enter and leave on) means fronts spend their life crossing the frame rather than
  // travelling invisibly outside it.
  let rMin = Infinity;
  let rMax = 0;
  for (const [x, y] of [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ]) {
    const r = Math.hypot(x - cx, y - cy);
    if (r < rMin) rMin = r;
    if (r > rMax) rMax = r;
  }
  const margin = (rMax - rMin) * 0.14;
  const near = rMin - margin;
  const far = rMax + margin;

  for (let i = 0; i < ARC_COUNT; i++) {
    const p = ((t / ARC_PERIOD) + i / ARC_COUNT) % 1;
    const radius = near + (far - near) * p;

    // In and out at the ends of the pass, so fronts arrive and leave rather than
    // appearing and vanishing.
    const alpha = 0.34 * smooth(p / 0.18) * (1 - smooth((p - 0.7) / 0.3));
    if (alpha < 0.01) continue;

    const [r, g, b] = ARC_COLORS[i % ARC_COLORS.length];

    // Wide, soft strokes rather than hairlines: WaveLines already owns fine ruled
    // line-work, and this needs to read as a body of colour passing through.
    ctx.lineWidth = (0.055 + 0.03 * Math.sin(TAU * (p + i * 0.37))) * d;

    // Alpha along the front, so it fades under the copy and at both of its own ends.
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    for (let k = 0; k <= 8; k++) {
      const fx = k / 8;
      const a = alpha * copyFade(fx) * (0.45 + 0.55 * Math.sin(Math.PI * fx));
      grad.addColorStop(fx, `rgba(${r},${g},${b},${a.toFixed(3)})`);
    }
    ctx.strokeStyle = grad;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.lineWidth = 1;
}

export function HeroAdvance({ className = "" }: { className?: string }) {
  return <HeroCanvas render={renderAdvance} className={className} stillAt={11} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   NEWS — Interleave

   Two families of soft bands crossing at opposite diagonals. Where they cross they
   multiply, so a lattice of deeper colour appears at the intersections and travels as
   the two families slide against each other.

   Diagonal and CROSSED is the point. Everything else on this site is either parallel
   or radial, so a woven field is immediately its own thing, and weave is the right
   figure for a newsroom: separate threads, one fabric.
   ═══════════════════════════════════════════════════════════════════════════ */

type Weave = {
  /** Angle in radians. The two families sit at opposite tilts. */
  angle: number;
  /** Offset across the family's own axis, as a fraction of the frame. */
  offset: number;
  /** Band thickness, fraction of the diagonal. */
  weight: number;
  /** Seconds to travel one full band spacing. Sign sets the direction. */
  period: number;
  color: [number, number, number];
  alpha: number;
};

const TILT = 0.36;

const WEAVE: Weave[] = [
  { angle: TILT, offset: 0.04, weight: 0.1, period: 58, color: [4, 115, 187], alpha: 0.3 },
  { angle: TILT, offset: 0.34, weight: 0.07, period: 74, color: [30, 174, 229], alpha: 0.32 },
  { angle: TILT, offset: 0.66, weight: 0.12, period: 47, color: [126, 170, 219], alpha: 0.26 },
  { angle: TILT, offset: 0.88, weight: 0.06, period: 91, color: [149, 218, 248], alpha: 0.34 },
  { angle: -TILT, offset: 0.12, weight: 0.09, period: -66, color: [21, 150, 212], alpha: 0.28 },
  { angle: -TILT, offset: 0.45, weight: 0.13, period: -83, color: [175, 219, 188], alpha: 0.3 },
  { angle: -TILT, offset: 0.72, weight: 0.08, period: -53, color: [103, 113, 181], alpha: 0.24 },
  { angle: -TILT, offset: 0.95, weight: 0.1, period: -71, color: [190, 215, 236], alpha: 0.3 },
];

function renderInterleave(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";

  const d = Math.hypot(w, h);
  const cx = w / 2;
  const cy = h / 2;

  for (const b of WEAVE) {
    // Travel across the family's own axis, wrapped, so bands leave one side and
    // return on the other without a seam.
    const travel = ((t / b.period) % 1 + 1) % 1;
    const pos = ((b.offset + travel) % 1) * 1.6 - 0.3;

    const nx = Math.cos(b.angle + Math.PI / 2);
    const ny = Math.sin(b.angle + Math.PI / 2);
    // Centre of the band, offset from the frame centre along the family's normal.
    const mx = cx + nx * (pos - 0.5) * d;
    const my = cy + ny * (pos - 0.5) * d;

    const [r, g, b2] = b.color;
    const half = b.weight * d * 0.5;

    // Soft-edged band: a gradient across its own normal, so the edges dissolve and
    // nothing in the field has a hard boundary.
    const grad = ctx.createLinearGradient(
      mx - nx * half,
      my - ny * half,
      mx + nx * half,
      my + ny * half,
    );
    grad.addColorStop(0, `rgba(${r},${g},${b2},0)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b2},${b.alpha.toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r},${g},${b2},0)`);

    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(b.angle);
    ctx.fillStyle = grad;
    // Overlong on the band's own axis so its ends are always outside the frame.
    ctx.fillRect(-d, -half, d * 2, half * 2);
    ctx.restore();
  }

  // The copy column is damped last, over the whole composited field, because these
  // bands cross each other and damping them individually would lighten the
  // intersections twice.
  const veil = ctx.createLinearGradient(0, 0, w, 0);
  for (let k = 0; k <= 8; k++) {
    const fx = k / 8;
    veil.addColorStop(fx, `rgba(255,255,255,${(1 - copyFade(fx)).toFixed(3)})`);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, w, h);
}

export function HeroInterleave({ className = "" }: { className?: string }) {
  return <HeroCanvas render={renderInterleave} className={className} stillAt={29} />;
}
