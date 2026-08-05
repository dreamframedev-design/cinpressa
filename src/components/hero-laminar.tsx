"use client";

import {
  HeroCanvas,
  TAU,
  clamp01,
  smooth,
  drawHeroWashes,
  type HeroRender,
} from "@/components/hero-canvas";

/**
 * Laminar — streamlines bending around an unseen sphere.
 *
 * WHAT THIS REPLACES. The tessellation read as cracked tile, and the blobs before it
 * read as fog. Both failed the same way: they filled the frame with incident. This
 * field is built from the opposite instinct: one figure, and everything else is calm
 * hairline flow, because the site's own first principle is that the hairline is the
 * brand. The figure is a lens — parallel rays bending around a mass they never
 * touch, the core drawn only as the white space the flow refuses to cross.
 *
 * THE MATHS. Ideal laminar flow past a cylinder, from the exact closed-form
 * solution: a uniform stream plus a doublet, retraced every frame. Laminar is also
 * the word cardiology uses for flow that stays smooth and controlled, which is the
 * entire claim of the program; the metaphor needs no label and gets none.
 *
 * THREE FAILURES ARE BURIED HERE. Each looked like a rendering nit and was actually
 * a structural mistake; none may be reintroduced:
 *
 * 1. NO CIRCULATION TERM. An oscillating vortex made the figure lean, and made
 *    rim-hugging lines wrap the core and exit as a jet that CROSSED the field.
 *    Streamlines cannot cross and the eye knows it. Symmetric flow cannot produce
 *    a crossing, and the bilateral calm is precisely the lens image.
 * 2. SEEDS ARE PLACED RELATIVE TO THE CENTRELINE, never at absolute heights. With
 *    absolute seeds, the drifting core eventually crosses one, and that line flips
 *    sides in a single frame — the whole path teleporting from under the sphere to
 *    over it. Offsets from the moving centreline, with an exclusion gap no seed may
 *    enter, make a flip impossible: the k-th line above the centre stays the k-th
 *    line above the centre forever.
 * 3. SUPERSAMPLED, NOT NATIVE. At standard display density a one-pixel
 *    near-horizontal line is stair-steps no matter how exactly it is traced; there
 *    are not enough pixels. The canvas renders ~1.6x above device resolution and
 *    the browser's downscale averages the aliasing away, which is what lets a fine
 *    line look printed rather than plotted.
 *
 * THE COMPOSITION. Seed offsets grow geometrically from the exclusion gap outward,
 * so density is an argument: a luminous compressed band hugs the horizon — the
 * innermost pair inked in the deep brand navy — and the family relaxes toward airy,
 * near-white parallels at the frame edges. Dye comets ride the lines at the local
 * flow speed, stretching through the fast polar gaps; where the flow stalls at the
 * nose they fade out rather than parking as a dot. The core breathes (13s), drifts
 * (23/29s), and every line re-spaces continuously against its neighbours; nothing
 * translates, nothing repeats, nothing is faster than the unhurried-motion rule
 * allows. All ink is one stroke at one alpha — the copy fade and nav clearance are
 * two white washes over the finished field, so no hairline ever carries a visible
 * alpha step. Geometry lives in preallocated buffers; the GC never wakes.
 */

/**
 * Seed offsets from the centreline, as fractions of frame height, mirrored above
 * and below. Geometric growth: dense at the horizon, airy at the edges. The first
 * two are the photon-ring pair; nothing may be seeded inside 0.0075.
 */
const OFFSETS: number[] = (() => {
  const out = [0.0075, 0.011];
  for (let v = 0.0148; v < 0.86; v *= 1.15) out.push(v);
  return out;
})();
/** Ring pair count: the innermost offsets drawn in flat navy. */
const RING = 2;

const MAX_LINES = OFFSETS.length * 2;
/** Base arc-length step; adaptively shortened near the rim where curvature peaks. */
const STEP_FRAC = 1 / 260;
const MAX_STEPS = 640;

/** Core placement. Right of the headline, a touch above centre, breathing slowly. */
const CORE_X = 0.72;
const CORE_Y = 0.455;

/** Far-field speed: the frame takes ~18s to cross, per the unhurried-motion rule. */
const CROSS_SECONDS = 18;

/** The blue ladder, deep at the core band and pale at the frame edges. */
const BLUE: [number, number, number] = [34, 97, 173];
const DEEP: [number, number, number] = [4, 115, 187];
const AZURE: [number, number, number] = [21, 150, 212];
const OCEAN: [number, number, number] = [30, 174, 229];
const PALE: [number, number, number] = [190, 215, 236];

/** Deterministic. The field must survive a resize unchanged. */
function hash(i: number, salt: number) {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function mix(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
) {
  const k = clamp01(t);
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ] as const;
}

/** Ladder colour for a line by its offset from the centreline, 0..1. */
function ladder(u: number) {
  if (u < 0.3) return mix(DEEP, AZURE, u / 0.3);
  if (u < 0.58) return mix(AZURE, OCEAN, (u - 0.3) / 0.28);
  return mix(OCEAN, PALE, (u - 0.58) / 0.42);
}

/**
 * Quiet under the copy. Applied as a white wash over the finished ink rather than
 * as per-line alpha, so the falloff is perfectly continuous; the comets also carry
 * it directly so the field's brightest events die out well before the headline.
 */
const copyFade = (fx: number) => 0.05 + 0.95 * smooth((fx - 0.14) / 0.5);

/** Retraced geometry, allocated once. xs/ys in px, tt cumulative seconds of travel. */
const xs = new Float32Array(MAX_LINES * MAX_STEPS);
const ys = new Float32Array(MAX_LINES * MAX_STEPS);
const tt = new Float32Array(MAX_LINES * MAX_STEPS);
const counts = new Int32Array(MAX_LINES);
const lineAlpha = new Float32Array(MAX_LINES);

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  transparent: boolean,
) {
  ctx.globalCompositeOperation = "source-over";
  if (transparent) {
    // Sitting on a section's own colour wash rather than on the page white.
    ctx.clearRect(0, 0, w, h);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }

  // ── The breathing field.
  const U = w / CROSS_SECONDS;
  const R =
    Math.min(h * 0.285, w * 0.21) * (1 + 0.045 * Math.sin((TAU * t) / 13 + 0.7));
  const cx = (CORE_X + 0.012 * Math.sin((TAU * t) / 29 + 1.0)) * w;
  const cy = (CORE_Y + 0.02 * Math.sin((TAU * t) / 23 + 2.1)) * h;
  const R2 = R * R;
  const rMin = R2 * 1.0002;

  // ── Trace. Fixed arc-length steps (RK2 on direction), cumulative travel time
  //    kept per vertex so the comets can move at the pace the field actually flows.
  const stepBase = w * STEP_FRAC;
  const x0 = -0.04 * w;
  const xEnd = 1.04 * w;
  const eps = U * 1e-4;

  for (let i = 0; i < MAX_LINES; i++) {
    const oi = i >> 1;
    const off = OFFSETS[oi] * (i & 1 ? -1 : 1);
    const seedY = cy + off * h;
    const u01 = clamp01(OFFSETS[oi] / 0.86);
    // Deep ink at the horizon, dissolving to near-nothing at the frame edges: the
    // figure is a lens floating in white, not a rectangle of ruling. Computed
    // before tracing so invisible lines cost nothing at all.
    lineAlpha[i] =
      oi < RING
        ? 0.6 - 0.05 * oi
        : (0.58 - 0.4 * smooth(u01)) * (1 - 0.85 * smooth((u01 - 0.4) / 0.55));
    // Off-frame or invisible seeds do no work.
    if (seedY < -0.2 * h || seedY > 1.2 * h || lineAlpha[i] < 0.02) {
      counts[i] = 0;
      continue;
    }
    const base = i * MAX_STEPS;
    let x = x0;
    let y = seedY;
    let n = 0;
    let clock = 0;
    while (n < MAX_STEPS) {
      // Field maths inlined twice: this loop runs ~30k times a frame at 60fps.
      let dx = x - cx;
      let dy = y - cy;
      let r2 = dx * dx + dy * dy;
      if (r2 < rMin) r2 = rMin;
      // Shorter steps near the rim, where all the curvature lives.
      const near = clamp01((Math.sqrt(r2) - R) / (0.6 * R));
      const step = stepBase * (0.4 + 0.6 * near);
      let r4 = r2 * r2;
      const u1 = U * (1 + (R2 * (dy * dy - dx * dx)) / r4);
      const v1 = (-2 * U * R2 * dx * dy) / r4;
      const s1 = Math.sqrt(u1 * u1 + v1 * v1);
      if (s1 < eps) break;
      dx = x + (u1 / s1) * step * 0.5 - cx;
      dy = y + (v1 / s1) * step * 0.5 - cy;
      r2 = dx * dx + dy * dy;
      if (r2 < rMin) r2 = rMin;
      r4 = r2 * r2;
      const u2 = U * (1 + (R2 * (dy * dy - dx * dx)) / r4);
      const v2 = (-2 * U * R2 * dx * dy) / r4;
      const s2 = Math.sqrt(u2 * u2 + v2 * v2);
      if (s2 < eps) break;
      xs[base + n] = x;
      ys[base + n] = y;
      tt[base + n] = clock;
      clock += step / s2;
      x += (u2 / s2) * step;
      y += (v2 / s2) * step;
      n++;
      if (x > xEnd) break;
    }
    counts[i] = n;
  }

  ctx.globalCompositeOperation = "multiply";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // ~1.35 CSS px once the supersampled store is scaled down: fine, but printed.
  const hair = Math.max(1.5, w / 1300);

  // ── Streamlines. One stroke, one alpha per line: any alpha step along a hairline
  //    reads as a dash, so all shading is done by the washes afterwards.
  ctx.lineWidth = hair;
  for (let i = 0; i < MAX_LINES; i++) {
    const base = i * MAX_STEPS;
    const n = counts[i];
    if (n < 2) continue;
    const oi = i >> 1;
    const u01 = clamp01(OFFSETS[oi] / 0.86);
    const col = oi < RING ? BLUE : ladder(u01);
    const a = lineAlpha[i];

    ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(xs[base], ys[base]);
    for (let p = 1; p < n; p++) ctx.lineTo(xs[base + p], ys[base + p]);
    ctx.stroke();
  }

  // ── Dye comets. A window of fixed DURATION, not length: it stretches into a
  //    long soft streak where the flow is fast. Each visible run is ONE stroke
  //    following EVERY traced vertex, shaded by ONE linear gradient laid from its
  //    tail to its head — never alpha-stepped runs, whose overlapping round caps
  //    double-multiply into dark knots, and never sparse sampling, which cuts
  //    corners across the curve. Arc-length steps make index fraction ≈ arc
  //    fraction, so gradient stops sampled by index land where they should. Both
  //    gradient ends are forced to zero: a streak may end mid-field (the window
  //    edge, or the stall zone at the nose where it would otherwise park as a
  //    dot), and a soft dissolve is the only acceptable way to end a line.
  //    Everything is a pure function of t, so the reduced-motion frame composes.
  const PULSE_SECS = 2.6;
  const dwellDt = stepBase / (0.3 * U);
  const STOPS = 6;
  ctx.lineWidth = hair * 1.6;
  for (let i = 0; i < MAX_LINES; i++) {
    const oi = i >> 1;
    const u01 = clamp01(OFFSETS[oi] / 0.86);
    // Dye favours the horizon, where the story is.
    if (hash(i, 8) > 0.8 - 0.55 * u01) continue;
    const base = i * MAX_STEPS;
    const n = counts[i];
    if (n < 8) continue;

    const total = tt[base + n - 1];
    const cycle = total * (1.5 + hash(i, 9) * 1.2);
    const head = ((t + hash(i, 10) * cycle) % cycle) - PULSE_SECS * 0.5;
    if (head <= 0 || head > total + PULSE_SECS) continue;

    const col = mix(ladder(u01), BLUE, 0.5);
    const aTop =
      (0.34 + 0.22 * (1 - smooth(u01))) * (1 - 0.85 * smooth((u01 - 0.4) / 0.55));
    if (aTop < 0.03) continue;

    // Visible vertex range for this window.
    let i0 = 0;
    while (i0 < n && tt[base + i0] <= head - PULSE_SECS) i0++;
    let i1 = i0;
    while (i1 < n - 1 && tt[base + i1 + 1] < head) i1++;

    // Walk it as continuous runs, splitting where the flow stalls.
    let runStart = i0;
    for (let p = i0; p <= i1; p++) {
      const last = p === i1;
      if (!last && tt[base + p + 1] - tt[base + p] <= dwellDt) continue;
      const runEnd = p;
      if (runEnd - runStart >= 3) {
        const gx0 = xs[base + runStart];
        const gy0 = ys[base + runStart];
        const gx1 = xs[base + runEnd];
        const gy1 = ys[base + runEnd];
        if (Math.hypot(gx1 - gx0, gy1 - gy0) >= hair * 4) {
          const grad = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
          for (let k = 0; k <= STOPS; k++) {
            let a = 0;
            if (k > 0 && k < STOPS) {
              const v = base + runStart + Math.round(((runEnd - runStart) * k) / STOPS);
              const tau = clamp01((head - tt[v]) / PULSE_SECS);
              a =
                aTop *
                Math.sin(Math.PI * Math.pow(tau, 0.7)) *
                copyFade(xs[v] / w);
            }
            grad.addColorStop(
              k / STOPS,
              `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`,
            );
          }
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(gx0, gy0);
          for (let q = runStart + 1; q <= runEnd; q++) {
            ctx.lineTo(xs[base + q], ys[base + q]);
          }
          ctx.stroke();
        }
      }
      runStart = p + 1;
    }
  }

  drawHeroWashes(ctx, w, h, copyFade, transparent);
}

/* Two bound renderers rather than one closure per React render, so HeroCanvas
   never sees a changing identity and nothing is allocated per frame. */
const renderOnWhite: HeroRender = (ctx, w, h, t) => draw(ctx, w, h, t, false);
const renderOnTone: HeroRender = (ctx, w, h, t) => draw(ctx, w, h, t, true);

export function HeroLaminar({
  className = "",
  /** Render onto a section's colour wash instead of the page white. */
  transparent = false,
}: {
  className?: string;
  transparent?: boolean;
}) {
  return (
    <HeroCanvas
      render={transparent ? renderOnTone : renderOnWhite}
      className={className}
      /* Failure 3 in the header: supersample 1.5x over device pixels so the
         browser's downscale averages hairline aliasing away. The few dozen strokes
         here can afford the area; the soft blurred fields neither can nor need to. */
      superSample={1.5}
      maxWidth={3800}
      maxDpr={2.6}
      frameMs={15}
      stillAt={8}
    />
  );
}
