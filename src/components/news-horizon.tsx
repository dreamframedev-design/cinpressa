"use client";

import { HeroCanvas, TAU, clamp01, smooth } from "@/components/hero-canvas";

/**
 * Horizon — the open calendar, as light moving forward.
 *
 * THE SECTION WAS A STARK WHITE BOX. It closes the homepage, it carries the
 * forward calendar, and it had no art at all, so the page ended on a blank.
 *
 * THE FIGURE follows the milestone axis's own logic rather than inventing a
 * new one. That axis deliberately "runs past the last station and dissolves,
 * because the programme continues past the part we can currently put a date
 * on." This is that sentence as a field: wavefronts of time sweeping out of a
 * bright near edge and opening into unmarked space on the right. Near fronts
 * are close-packed and deep — the part of the programme that has dates on it.
 * They spread and pale as they travel, because the further ahead you look the
 * less there is to say. Nothing arrives anywhere; the picture is anticipation,
 * which is the honest content of a section about work that has not happened.
 *
 * WHY A FAN, AND WHY ONLY FIVE LINES. The first build drew twenty-two
 * expanding wavefronts and they read as vertical wallpaper: struck from a
 * centre far off the frame, an arc flattens into a straight line, and twenty-
 * two evenly spaced straight lines behind dense copy is a texture, not a
 * gesture. These are five, widely spaced, and they DIVERGE — near the left
 * they run close together, and they spread apart as they travel right. That is
 * the honest shape of a forward calendar: the near term is tightly specified
 * and the far term is a widening range of outcomes. Five lines can be sparse
 * enough to sit behind text and still read as drawn.
 *
 * A SCATTER OF UNDATED MOMENTS rides outward with the fronts and fades: events
 * that belong to the programme but cannot yet be placed. They are the smallest
 * marks on the page and they are the only ones with no label, on purpose.
 *
 * House rules throughout: hairlines, one stroke at one alpha (never a gradient
 * along a stroke, which reads as dashes), a transparent canvas so the page's
 * own surface shows through, edges dissolved with destination-out rather than
 * painted white, nothing allocated per frame, and nothing hurried — a front
 * takes half a minute to cross.
 */

/** Lines in the fan. Sparse on purpose: see the note above. */
const LINES = 5;
/** Where the fan is gathered, and how far it opens by the right edge. */
const ORIGIN_Y = 0.46;
const SPREAD = 0.44;
/** Seconds for a moment to travel the whole span. */
const PERIOD = 34;

/** Undated moments riding the fan outward. */
const MOTES = 14;

/** The path of fan line k (-1..1) at horizontal fraction fx. */
function fanY(k: number, fx: number, t: number, h: number, i: number) {
  const open = Math.pow(clamp01(fx), 1.5);
  const drift = 0.018 * Math.sin(TAU * (fx * 0.8 + t / 26) + i * 1.7);
  return (ORIGIN_Y + k * SPREAD * open + drift * (0.35 + open)) * h;
}

/** The blue ladder: deep at the near edge, dissolving into the open. */
const LADDER: Array<[number, number, number]> = [
  [34, 97, 173],
  [4, 115, 187],
  [21, 150, 212],
  [30, 174, 229],
  [149, 218, 248],
];

/** Deterministic. The field must survive a resize unchanged. */
function hash(i: number, salt: number) {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function ladder(u: number) {
  const s = clamp01(u) * (LADDER.length - 1);
  const a = LADDER[Math.min(Math.floor(s), LADDER.length - 1)];
  const b = LADDER[Math.min(Math.floor(s) + 1, LADDER.length - 1)];
  const f = s - Math.floor(s);
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ] as const;
}

/**
 * How present the field is allowed to be at a point, given what the section
 * puts there. The header sits upper-left, the milestone entries fill the lower
 * band; the open upper-right is where this can actually breathe.
 */
const presence = (fx: number, fy: number) =>
  (0.16 + 0.84 * smooth((fx - 0.12) / 0.5)) *
  (1 - 0.72 * smooth((fy - 0.42) / 0.4));

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.clearRect(0, 0, w, h);

  // ── Light, so the section is not a white box before it is anything else.
  //    Two soft blooms in the brand's own colours, placed where the copy is
  //    not: blue high on the right, a breath of green low and left.
  const blue = ctx.createRadialGradient(
    0.82 * w,
    0.1 * h,
    0,
    0.82 * w,
    0.1 * h,
    0.95 * w,
  );
  blue.addColorStop(0, "rgba(190,215,236,0.5)");
  blue.addColorStop(0.45, "rgba(190,215,236,0.16)");
  blue.addColorStop(1, "rgba(190,215,236,0)");
  ctx.fillStyle = blue;
  ctx.fillRect(0, 0, w, h);

  const green = ctx.createRadialGradient(
    0.04 * w,
    0.92 * h,
    0,
    0.04 * w,
    0.92 * h,
    0.62 * w,
  );
  green.addColorStop(0, "rgba(175,219,188,0.34)");
  green.addColorStop(1, "rgba(175,219,188,0)");
  ctx.fillStyle = green;
  ctx.fillRect(0, 0, w, h);

  // ── The fan. Gathered at the left, opening across the frame.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, w / 1400);

  const STEPS = 60;
  for (let i = 0; i < LINES; i++) {
    const k = (i / (LINES - 1) - 0.5) * 2;
    const off = Math.abs(k);
    const col = ladder(off * 0.85);
    // Presence is sampled once, at the line's midpoint, and held for the whole
    // stroke: alpha may never vary along a hairline or it reads as dashes.
    const a =
      (0.4 - 0.14 * off) * presence(0.62, fanY(k, 0.62, t, h, i) / h);
    if (a < 0.015) continue;

    ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`;
    ctx.beginPath();
    for (let s = 0; s <= STEPS; s++) {
      const fx = -0.05 + (1.1 * s) / STEPS;
      const x = fx * w;
      const y = fanY(k, fx, t, h, i);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // ── Undated moments, carried outward along the fan.
  for (let i = 0; i < MOTES; i++) {
    const p = (t / (PERIOD * (0.8 + hash(i, 1) * 0.5)) + hash(i, 2)) % 1;
    // Its own lane, anywhere across the fan rather than only on the five lines.
    const k = (hash(i, 3) - 0.5) * 2;
    const x = p * w;
    const y = fanY(k, p, t, h, i * 3.1);
    if (y < -20 || y > h + 20) continue;

    const life = smooth(p / 0.12) * (1 - smooth((p - 0.5) / 0.5));
    const a = life * 0.6 * presence(clamp01(x / w), clamp01(y / h));
    if (a < 0.02) continue;
    const col = ladder(Math.abs(k) * 0.85);
    const r = Math.max(1.4, w / 620) * (1 - 0.35 * p);

    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    halo.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${(a * 0.32).toFixed(3)})`);
    halo.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 5, 0, TAU);
    ctx.fill();

    ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  // ── Dissolve every edge. The canvas is transparent so the page shows
  //    through it, which means the fades must ERASE ink rather than paint
  //    white — white would lay an opaque band over the page surface.
  ctx.globalCompositeOperation = "destination-out";

  //    The left dissolve is long, not a token edge softener. The fan is
  //    gathered off the left edge and the section's eyebrow and headline sit
  //    there; letting it emerge out of nothing around a third of the way in
  //    keeps that copy clear and reads better than a visible origin.
  const fx = ctx.createLinearGradient(0, 0, w, 0);
  for (let s = 0; s <= 16; s++) {
    const u = s / 16;
    const keep = smooth((u - 0.06) / 0.3) * clamp01((1 - u) / 0.08);
    fx.addColorStop(u, `rgba(0,0,0,${(1 - keep).toFixed(3)})`);
  }
  ctx.fillStyle = fx;
  ctx.fillRect(0, 0, w, h);

  const fy = ctx.createLinearGradient(0, 0, 0, h);
  for (let s = 0; s <= 12; s++) {
    const u = s / 12;
    const keep = clamp01(u / 0.12) * clamp01((1 - u) / 0.14);
    fy.addColorStop(u, `rgba(0,0,0,${(1 - keep).toFixed(3)})`);
  }
  ctx.fillStyle = fy;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "source-over";
}

export function NewsHorizon({ className = "" }: { className?: string }) {
  return (
    <HeroCanvas
      render={render}
      className={className}
      /* Hairlines need real pixels; the fronts move slowly enough that 30fps
         is indistinguishable from 60 and the budget is better spent on
         resolution. */
      superSample={1.5}
      maxWidth={3400}
      maxDpr={2.4}
      frameMs={33}
      stillAt={12}
    />
  );
}
