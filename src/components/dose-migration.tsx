"use client";

import { useRef } from "react";
import type { HeroRender } from "@/components/hero-canvas";
import { HeroCanvas, TAU, clamp01, smooth } from "@/components/hero-canvas";

/**
 * Dose migration — a year of daily doses falling into two.
 *
 * THIS CUT TURNED THE ARGUMENT THROUGH NINETY DEGREES. The piece used to run
 * left to right: a block of days on the left, two doses on the right, and the
 * 365 and the 1–2 seated side by side in a legend beneath. Read as a sentence
 * that was fine; read as a QUANTITY it was not, because nothing about "left"
 * means "more". Reduction is a vertical idea — things fall, stacks collapse,
 * totals come down — so the whole piece now runs top to bottom:
 *
 *     365  ....................  the year, stated
 *          ▚▚▚▚▚▚▚▚▚▚▚          one block, twelve month rows
 *            ╲╲╲╱╱╱             the bundle
 *             ╲╱ ╲╱              two necks
 *              ●   ●              two doses
 *     1–2  ...................   what is left
 *
 * The two figures are stacked in the same column with the animation running
 * between them, so the eye travels 365 → 2 in one downward move and the
 * artwork is the connective tissue rather than a picture beside a caption.
 *
 * IT IS A REAL CALENDAR NOW: rows are months, ragged at the right end of each
 * one where the short months stop. The old block was twenty-four arbitrary
 * columns, and the note it earned the first time round was that nothing said
 * what a dot was a unit OF. February saying it in one glance is worth more
 * than any label.
 *
 * STRUCTURE IS MEANING: departure order is calendar order, so the drain reads
 * as a year passing; the first half of the year falls to the first dose and
 * the second half to the second, because that is literally what one-to-two
 * administrations a year covers, and because it makes the two doses fill in
 * sequence rather than together — the left one through spring, the right one
 * through autumn.
 *
 * ONE BUNDLE, TWO BEADS — the note this cut answers. The year used to sit as
 * two separate slabs that fanned out into two very large orange orbs, and it
 * read wrong twice over. Two slabs are two things, not one year; and a dose
 * drawn at that scale is a horse pill, which is the opposite of the claim the
 * product is making. So the calendar is now a single block, every day is
 * routed through a common waist before it peels to its dose, and the doses are
 * beads rather than orbs. Small is the argument: a year of burden collapsing
 * into two things you would barely notice.
 *
 * Everything is a pure function of t on the shared HeroCanvas scaffold, with
 * the house rules: hairline rails, single-alpha strokes, supersampled store,
 * nothing allocated in the frame loop. The DAY readout rides the same loop —
 * the render writes the current phase to a module variable and the component's
 * draw wrapper mirrors it into the DOM only when the day changes.
 */

/** Twelve months, non-leap. Sums to 365, which is the point. */
const MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS = 365;

/**
 * One block: twelve month rows of up to thirty-one days, ragged at the right
 * where the short months stop. An earlier cut split it into two six-month
 * slabs set side by side, which spanned the card better but said the wrong
 * thing — two slabs are two quantities, and there is only one year here. The
 * block is narrower than the card as a result, and that is fine: it is a mass
 * with air around it, and the air is what lets the fall read as a bundle
 * drawing inward rather than as a curtain dropping straight down.
 */
const ROWS = 12;
const COLS = 31;

/** Precomputed grid cell per day index. The piece must survive a resize
 *  unchanged, so nothing about layout is derived from anything but the index. */
const CELL: { row: number; col: number }[] = [];
for (let m = 0; m < MONTHS.length; m++) {
  for (let d = 0; d < MONTHS[m]; d++) {
    CELL.push({ row: m, col: d });
  }
}

/** Day index where the second annual dose takes over: the turn of the year's
 *  first half, which is also the row where the block's top half ends. */
const SPLIT = MONTHS.slice(0, ROWS / 2).reduce((a, b) => a + b, 0);

/** The loop, in seconds. The full argument resolves in under five — drain,
 *  fall, and two grown doses — then the emptied calendar holds for a beat
 *  before the year refills. A glance catches the whole story; a second glance
 *  catches the next year. */
const CYCLE = 9;
const DEPART_SPAN = 3.2;
const FLIGHT = 1.4;
const REFILL_START = 7;
const REFILL_SPAN = 1.6;
const REFILL_RAMP = 0.35;

const BLUE = "34,97,173";
const PERI = "126,170,219";
const OCEAN = "30,174,229";
const PALE = "190,215,236";
const ORANGE = "249,168,26";

/** Deterministic per-day jitter. */
function hash(i: number, salt: number) {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

type Pt = { x: number; y: number };

/** One point reused by every path evaluation. The value is consumed by the
 *  very next draw call, so a single scratch is safe and keeps the frame loop
 *  allocation-free. */
const SCRATCH: Pt = { x: 0, y: 0 };

/** Scalar cubic Bezier, written into `out`. */
function cubic(
  x0: number, y0: number,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  u: number,
  out: Pt,
) {
  const v = 1 - u;
  const a = v * v * v;
  const b = 3 * v * v * u;
  const c = 3 * v * u * u;
  const d = u * u * u;
  out.x = a * x0 + b * x1 + c * x2 + d * x3;
  out.y = a * y0 + b * y1 + c * y2 + d * y3;
}

/**
 * The loop re-zeroes whenever animated frames RESUME after a gap. HeroCanvas
 * only runs the loop while the canvas intersects the viewport, so a gap in t
 * between consecutive frames is precisely "the visitor scrolled away and came
 * back" — including the very first arrival. Every viewing therefore starts at
 * the year's beginning instead of joining an already-drained cycle.
 */
const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let anchor = -1;
let lastLoopT = -1;
/** The phase of the most recent frame, mirrored into the DAY readout. */
let currentPhase = 0;

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) {
  ctx.clearRect(0, 0, w, h);
  let phase: number;
  if (reduced) {
    phase = t % CYCLE;
  } else if (t === 0) {
    anchor = -1;
    lastLoopT = -1;
    phase = 0;
  } else {
    if (anchor < 0 || t < lastLoopT || t - lastLoopT > 0.6) anchor = t;
    lastLoopT = t;
    phase = (t - anchor) % CYCLE;
  }
  currentPhase = phase;

  // ── Layout. One calendar block centred at the top, the two doses low and
  //    close together beneath it, and a waist between them where every path is
  //    gathered before it peels. Width is capped generously and height governs
  //    on a wide card, so the block stays a mass rather than a stripe.
  // THE BLOCK IS THE MEASURE. Every earlier cut sized it as a fraction of the
  // canvas and centred what was left, which meant it floated: a figure with a
  // margin nobody chose, on a card whose text started somewhere else entirely.
  // The canvas element is now inset to the card's own gutter (see the wrapper
  // below), so the grid simply divides the full width and the artwork begins
  // and ends exactly where the headline above it does. Nothing to centre,
  // nothing to align — it is the same column.
  const cell = w / COLS;
  const gridW = w;
  const gridH = ROWS * cell;
  const gx0 = 0;
  const gy0 = 0.05 * h;
  const gridBottom = gy0 + gridH;
  // Wider than the gap it leaves, which is what makes 365 marks read as one
  // mass rather than as a lattice of separate dots.
  const dotR = 0.29 * cell;

  /** Beads, not orbs. Floored against the day dot so the dose never becomes
   *  smaller than the thing it is absorbing on a narrow screen. */
  const R = Math.max(Math.min(0.0115 * w, 0.032 * h), dotR * 2.2);
  const doseY = 0.9 * h;
  // Close together on purpose: the fork should be the last thing that happens,
  // a short peel off a long trunk, not two diverging streams. Measured off the
  // bead rather than off the canvas — tied to width they collided the moment
  // the card got narrower.
  const half = Math.max(0.03 * w, R * 2.3);
  const d0: Pt = { x: 0.5 * w - half, y: doseY };
  const d1: Pt = { x: 0.5 * w + half, y: doseY };
  /** Where the rope is at its narrowest, between the block and the doses. */
  const waistY = gridBottom + 0.62 * (doseY - gridBottom);

  const slot = (i: number): Pt => ({
    x: gx0 + (CELL[i].col + 0.5) * cell,
    y: gy0 + (CELL[i].row + 0.5) * cell,
  });

  /** The flight is TWO curves, not one, and the join is the whole point.
   *
   *  A single cubic from a day's seat to its dose cannot be made to bundle. Pull
   *  its control points as hard as you like toward the middle and the curve
   *  still leaves the grid on its own bearing and only closes in over the last
   *  third — which is what the first cut of this did, and it read as a fan
   *  collapsing rather than a rope. A cubic simply does not go where you point
   *  it, it goes where its endpoints let it.
   *
   *  So the path is stated as two: seat → waist, then waist → dose. Every one of
   *  the 365 passes THROUGH the waist by construction, at the same height, at
   *  the same moment in its flight. Both halves meet it travelling straight
   *  down — the inner control of each shares the waist's x — so the join has no
   *  corner in it.
   *
   *  The jitter on the waist's x is what gives the rope its thickness. Without
   *  it the entire year would pass through one pixel column, which reads as a
   *  fold rather than as a bundle. */
  const WAIST_U = 0.62;
  const pathAt = (i: number, fx: number, fy: number, u: number, out: Pt) => {
    const wx = 0.5 * w + (hash(i, 3) - 0.5) * 0.05 * w;
    if (u <= WAIST_U) {
      const s = u / WAIST_U;
      cubic(
        fx, fy,
        fx + (wx - fx) * 0.5, fy + (waistY - fy) * 0.28,
        wx, fy + (waistY - fy) * 0.62,
        wx, waistY,
        s, out,
      );
      return;
    }
    const target = i < SPLIT ? d0 : d1;
    const s = (u - WAIST_U) / (1 - WAIST_U);
    cubic(
      wx, waistY,
      wx, waistY + (target.y - waistY) * 0.45,
      target.x, waistY + (target.y - waistY) * 0.8,
      target.x, target.y,
      s, out,
    );
  };

  // ── The rails: one hairline per stream, always present, so the routes read
  //    even in the instants when few days are falling. Both leave the block's
  //    bottom centre and share a trunk down to the waist, so at rest the piece
  //    already shows the Y. Sampled rather than curve-drawn because the path is
  //    two joined cubics and the seam has to be walked, not declared.
  ctx.lineWidth = Math.max(1, w / 1500);
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgba(${BLUE},0.12)`;
  for (const half of [0, 1] as const) {
    const i = half === 0 ? 60 : 300;
    ctx.beginPath();
    for (let k = 0; k <= 28; k++) {
      pathAt(i, 0.5 * w, gridBottom, k / 28, SCRATCH);
      if (k === 0) ctx.moveTo(SCRATCH.x, SCRATCH.y);
      else ctx.lineTo(SCRATCH.x, SCRATCH.y);
    }
    ctx.stroke();
  }

  // ── The calendar: seated days, ghost rings of departed days, refill.
  //    Periwinkle, not solid brand blue: the burden should recede.
  const refillP = clamp01((phase - REFILL_START) / REFILL_SPAN);
  for (let i = 0; i < DAYS; i++) {
    const p = slot(i);
    const depart = (i / DAYS) * DEPART_SPAN;
    const refillAt = REFILL_START + (i / DAYS) * (REFILL_SPAN - REFILL_RAMP);
    const back = clamp01((phase - refillAt) / REFILL_RAMP);
    const seated = phase < depart ? 1 : back;

    if (seated > 0.002) {
      ctx.fillStyle = `rgba(${PERI},${(0.95 * seated).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, dotR * (0.6 + 0.4 * seated), 0, TAU);
      ctx.fill();
    }
    if (seated < 0.998 && phase >= depart) {
      ctx.strokeStyle = `rgba(${PALE},${(0.75 * (1 - seated)).toFixed(3)})`;
      ctx.lineWidth = Math.max(1, w / 1600);
      ctx.beginPath();
      ctx.arc(p.x, p.y, dotR * 0.82, 0, TAU);
      ctx.stroke();
    }
  }

  // ── The fall: every airborne day, with a short comet of its recent past.
  for (let i = 0; i < DAYS; i++) {
    const depart = (i / DAYS) * DEPART_SPAN;
    const tau = (phase - depart) / FLIGHT;
    if (tau <= 0 || tau >= 1) continue;
    const from = slot(i);

    for (let k = 4; k >= 0; k--) {
      const tk = tau - k * 0.02;
      if (tk <= 0) continue;
      const u = smooth(tk);
      pathAt(i, from.x, from.y, u, SCRATCH);
      // The last stretch is the absorption: the day sinks into the dose.
      const sink = clamp01((tk - 0.88) / 0.12);
      const a = (k === 0 ? 0.9 : 0.34 - 0.06 * k) * (1 - sink);
      if (a < 0.02) continue;
      const r = dotR * (k === 0 ? 1 : 0.82 - 0.1 * k) * (1 - 0.6 * sink);
      ctx.fillStyle = `rgba(${OCEAN},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(SCRATCH.x, SCRATCH.y, Math.max(r, 0.6), 0, TAU);
      ctx.fill();
    }
  }

  // ── The two annual doses, growing as they absorb their halves of the year.
  //    Orange inside a blue hairline orbit: the same pairing as the dose in
  //    the mark itself, and the page's one moment of orange punctuation. Held
  //    small on purpose — see the note at the top of this file.
  const arrived = clamp01((phase - FLIGHT) / DEPART_SPAN) * DAYS;
  for (const half of [0, 1] as const) {
    const target = half === 0 ? d0 : d1;
    const own =
      half === 0
        ? clamp01(arrived / SPLIT)
        : clamp01((arrived - SPLIT) / (DAYS - SPLIT));
    const grown = Math.sqrt(own);
    // The refill shrinks them back: next year's doses, waiting.
    const r = R * (0.52 + 0.48 * grown) * (1 - 0.3 * smooth(refillP));

    const halo = ctx.createRadialGradient(
      target.x,
      target.y,
      r * 0.4,
      target.x,
      target.y,
      r * 2.4,
    );
    halo.addColorStop(0, `rgba(${ORANGE},0.16)`);
    halo.addColorStop(1, `rgba(${ORANGE},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(target.x, target.y, r * 2.4, 0, TAU);
    ctx.fill();

    ctx.fillStyle = `rgba(${ORANGE},0.95)`;
    ctx.beginPath();
    ctx.arc(target.x, target.y, r, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = `rgba(${BLUE},0.4)`;
    ctx.lineWidth = Math.max(1, w / 1500);
    ctx.beginPath();
    ctx.arc(
      target.x,
      target.y,
      r + Math.max(4, 0.0035 * w) + 1.2 * Math.sin((TAU * t) / 6.5 + half * 2),
      0,
      TAU,
    );
    ctx.stroke();
  }
}

export function DoseMigration() {
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const lastDayRef = useRef(-1);

  /** The canvas render, plus the DAY readout riding the same frame loop:
   *  spins up with the drain, rests at 365 through the hold, rewinds with
   *  the refill. Under reduced motion the readout keeps its SSR value. */
  const draw: HeroRender = (ctx, w, h, t) => {
    render(ctx, w, h, t);
    const el = counterRef.current;
    if (!el || reduced) return;
    const phase = currentPhase;
    let day: number;
    if (phase < DEPART_SPAN) {
      day = Math.round(clamp01(phase / DEPART_SPAN) * DAYS);
    } else if (phase < REFILL_START) {
      day = DAYS;
    } else {
      day = Math.round(DAYS * (1 - clamp01((phase - REFILL_START) / REFILL_SPAN)));
    }
    day = Math.max(1, day);
    if (day !== lastDayRef.current) {
      lastDayRef.current = day;
      el.textContent = `DAY ${String(day).padStart(3, "0")}`;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white pb-6 shadow-[0_36px_72px_-44px_rgba(13,35,66,0.3)] sm:pb-8">
      {/* The year, stated. Nothing separates this from the canvas below it:
          the days should look like they are falling out from under it. */}
      <div className="flex items-start justify-between gap-6 px-6 pt-8 sm:px-10 sm:pt-10">
        <div>
          {/* No rule above the figure. A hairline in this system divides,
              measures or leads a label; one floating over a numeral does none
              of those, and the pair of them here were the loudest thing in a
              card whose whole argument is that less is the point.

              The two captions that used to sit above and below the artwork are
              gone with them. The headline states the claim outright now, and
              the picture underneath is the proof — saying it a second time in
              small type under each end was the caption explaining the diagram
              back to someone who had just watched it happen. */}
          <h3 className="max-w-[22ch] text-[clamp(1.65rem,3vw,2.4rem)] font-light leading-[1.12] tracking-tight text-ink">
            <span className="font-normal">365</span> doses, compressed into two
          </h3>
        </div>

        {/* The chart-recorder readout, ticking with the drain. Dropped on narrow
            screens: it is decoration, and sharing a row with it squeezed the
            figure's caption into a four-line column. */}
        <div aria-hidden className="hidden shrink-0 items-center gap-2.5 pt-1 sm:flex">
          <span className="h-px w-6 bg-line" />
          <span
            ref={counterRef}
            className="text-[0.76rem] font-semibold tracking-[0.18em] text-muted tabular-nums"
          >
            DAY 365
          </span>
        </div>
      </div>

      {/* Shorter than it was. With the two captions gone the card had no reason
          to keep the height they needed, and the block is compact enough now
          that a taller frame would only add space around it. Bottom margin is
          zero — the card's own padding carries the room under the doses. */}
      {/* The canvas is inset to the card's own gutter rather than run full
          bleed, so the grid inside it can use the whole width and still line up
          with the headline. That inset IS the layout — see the note on `cell`
          in the render. */}
      <div className="relative -mt-2 h-[300px] sm:h-[440px] lg:h-[460px]">
        <HeroCanvas
          render={draw}
          className="absolute inset-y-0 left-6 right-6 sm:left-10 sm:right-10"
          superSample={1.4}
          maxWidth={3200}
          maxDpr={2.4}
          frameMs={15}
          stillAt={2.2}
          /* The story anchors to visibility, so don't let it begin while the
             piece is still a sliver at the fold. */
          ioThreshold={0.45}
        />
      </div>

    </div>
  );
}
