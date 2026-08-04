"use client";

import { HeroCanvas, TAU, clamp01, smooth } from "@/components/hero-canvas";

/**
 * Lobule — polygonal tissue taking up the drug.
 *
 * WHAT THIS REPLACES, and why the replacement is a different kind of thing rather than
 * a better-tuned version of the same one. The science hero was eight radial gradients
 * expanding and fading. That is fuzzy blobs, and no amount of retiming changes what it
 * fundamentally is, because it has NO STRUCTURE: no edge anywhere, no relationship
 * between one form and the next, nothing constructed. Every field that has worked on
 * this site has edges and internal logic. Softness is a finish, not a subject.
 *
 * THE FIGURE. The liver is organised into polygonal lobules, and hepatocytes pack into
 * that tessellation. CIN-111 is a liver-targeted siRNA: it is taken up by hepatocytes
 * and silences AGT production inside them. So a polygonal partition is not a decorative
 * choice here, it is the actual architecture of the tissue this drug works in, and
 * watching that partition take up colour from a point outward is the mechanism itself.
 * It is the most literal thing on the site and it does not look literal at all.
 *
 * HOW IT IS BUILT. A true Voronoi partition, computed exactly rather than approximated:
 * each cell starts as the whole frame and is clipped by the perpendicular bisector
 * between its own seed and every other seed. That is Sutherland-Hodgman half-plane
 * clipping, and it produces mathematically exact convex cells with real edges, which is
 * the entire point. Seeds drift on slow sine paths, so cells continuously reshape and
 * trade area with their neighbours: the structure is never still and never repeats.
 *
 * UPTAKE. A front expands from one seed outward. Cells inside it carry deep cobalt;
 * cells beyond it sit pale. Each cell crosses over on its own short ramp, so uptake
 * moves through the tissue cell by cell rather than as a sweeping gradient, which is
 * how it actually happens. The front never reaches the far corners, because suppression
 * is deep but not total.
 */

/** Cells. Enough to read as tissue, few enough that exact clipping stays cheap. */
const SEEDS = 46;

/**
 * How far the uptake front travels, as a fraction of the frame diagonal.
 *
 * Deliberately short of the far corner. Real knockdown runs deep but not to zero, so
 * the tissue furthest from the source keeps its pale cells through the whole pass. At
 * 0.82 the front reached everything, which claimed more than the data does.
 */
const FRONT_REACH = 0.65;
/** Seconds for one full pass. */
const FRONT_PERIOD = 34;

/** Where uptake begins. */
const SOURCE_X = 0.74;
const SOURCE_Y = 0.38;

const PALE: [number, number, number] = [190, 215, 236];
const MID: [number, number, number] = [30, 174, 229];
const DEEP: [number, number, number] = [4, 115, 187];
const EDGE: [number, number, number] = [21, 150, 212];

/** Deterministic. Never Math.random: the tissue must survive a resize unchanged. */
function hash(i: number, salt: number) {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

type Pt = { x: number; y: number };

/**
 * Clip a convex polygon to the half-plane {p : p·n <= c}. Sutherland-Hodgman, one
 * plane at a time. The polygon stays convex throughout, which is what keeps this both
 * correct and cheap.
 */
function clipHalfPlane(poly: Pt[], nx: number, ny: number, c: number): Pt[] {
  const out: Pt[] = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % n];
    const da = a.x * nx + a.y * ny - c;
    const db = b.x * nx + b.y * ny - c;
    const ain = da <= 0;
    const bin = db <= 0;
    if (ain) out.push(a);
    if (ain !== bin) {
      const t = da / (da - db);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
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

/** Quiet under the copy column, same rule the rest of the site uses. */
const copyFade = (fx: number) => 0.1 + 0.9 * smooth((fx - 0.05) / 0.5);

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";
  ctx.lineJoin = "round";

  // ── Seeds. Placed on a jittered lattice so the tissue has even grain, then drifting
  //    on their own slow paths so no two cells deform together.
  const cols = 8;
  const rows = Math.ceil(SEEDS / cols);
  const pts: Pt[] = [];
  for (let i = 0; i < SEEDS; i++) {
    const gx = i % cols;
    const gy = Math.floor(i / cols);
    const jx = hash(i, 1) - 0.5;
    const jy = hash(i, 2) - 0.5;
    // Overscan past the frame so edge cells are bounded by real neighbours rather
    // than by the frame, which is what stops the border cells looking chopped.
    const bx = -0.16 + (1.32 * (gx + 0.5 + jx * 0.8)) / cols;
    const by = -0.16 + (1.32 * (gy + 0.5 + jy * 0.8)) / rows;
    const dx = Math.sin(t / (17 + hash(i, 3) * 26) + hash(i, 4) * TAU) * 0.035;
    const dy = Math.cos(t / (21 + hash(i, 5) * 29) + hash(i, 6) * TAU) * 0.03;
    pts.push({ x: (bx + dx) * w, y: (by + dy) * h });
  }

  // ── Uptake front.
  const diag = Math.hypot(w, h);
  const phase = (t / FRONT_PERIOD) % 1;
  const front = phase * FRONT_REACH * diag;
  const sx = SOURCE_X * w;
  const sy = SOURCE_Y * h;
  /** Width of the crossover band. Narrow, so cells flip rather than fade together. */
  const band = diag * 0.16;

  const frame: Pt[] = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];

  for (let i = 0; i < SEEDS; i++) {
    const p = pts[i];

    // Exact cell: clip the frame by the bisector against every other seed.
    let cell = frame;
    for (let j = 0; j < SEEDS && cell.length > 2; j++) {
      if (j === i) continue;
      const q = pts[j];
      const nx = 2 * (q.x - p.x);
      const ny = 2 * (q.y - p.y);
      const c = q.x * q.x + q.y * q.y - (p.x * p.x + p.y * p.y);
      cell = clipHalfPlane(cell, nx, ny, c);
    }
    if (cell.length < 3) continue;

    // How far this cell has taken up. Its own ramp, so uptake travels cell by cell.
    const d = Math.hypot(p.x - sx, p.y - sy);
    const uptake = smooth((front - d) / band + 0.5);

    const fx = p.x / w;
    const fade = copyFade(fx);
    // A little variance so no two cells at the same radius are identical.
    const vary = 0.82 + hash(i, 7) * 0.36;

    const col = uptake < 0.5 ? mix(PALE, MID, uptake * 2) : mix(MID, DEEP, (uptake - 0.5) * 2);
    const alpha = (0.1 + uptake * 0.34) * fade * vary;

    ctx.beginPath();
    ctx.moveTo(cell[0].x, cell[0].y);
    for (let k = 1; k < cell.length; k++) ctx.lineTo(cell[k].x, cell[k].y);
    ctx.closePath();

    ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;
    ctx.fill();

    // The edge is the piece. Hairline, and brighter where the cell has taken up, so
    // the structure reads as drawn rather than as a fill with a border.
    ctx.strokeStyle = `rgba(${EDGE[0]},${EDGE[1]},${EDGE[2]},${((0.16 + uptake * 0.4) * fade).toFixed(3)})`;
    ctx.lineWidth = Math.max(0.75, Math.min(w / 1400, 1.4)) * (1 + uptake * 0.5);
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
}

export function HeroLobule({ className = "" }: { className?: string }) {
  return <HeroCanvas render={render} className={className} stillAt={19} />;
}
