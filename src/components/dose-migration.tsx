"use client";

import { useRef } from "react";
import type { HeroRender } from "@/components/hero-canvas";
import { HeroCanvas, TAU, clamp01, smooth } from "@/components/hero-canvas";
import { CountUp } from "@/components/count-up";

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
 *     ▚▚▚▚▚▚▚▚▚   ▚▚▚▚▚▚▚▚▚      two half-years of days
 *        ╲   ╲     ╱   ╱         the fall, converging
 *            ●     ●             two doses
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
 * The year is laid out as TWO BLOCKS of six months rather than one of twelve,
 * and the reason is geometry as much as meaning. Twelve rows of thirty-one is
 * a 2.6:1 block, and in a card wider than that it can be full width or it can
 * be short, never both — the first cut of this layout came out as a small dense
 * square marooned in the middle of a wide card. Split in half and set side by
 * side it is 65 by 6, which spans the card and still leaves two thirds of the
 * frame to fall through.
 *
 * It also makes the argument exact: the left block IS the first half of the
 * year and the right block IS the second, so each falls to the dose that
 * covers it, and the split lands on a month boundary instead of mid-June.
 */
const HALF_ROWS = 6;
const BLOCK_COLS = 31;
const GAP_COLS = 3;
const COLS = BLOCK_COLS * 2 + GAP_COLS;

/** Precomputed grid cell per day index. The piece must survive a resize
 *  unchanged, so nothing about layout is derived from anything but the index. */
const CELL: { row: number; col: number }[] = [];
for (let m = 0; m < MONTHS.length; m++) {
  for (let d = 0; d < MONTHS[m]; d++) {
    CELL.push(
      m < HALF_ROWS
        ? { row: m, col: d }
        : { row: m - HALF_ROWS, col: BLOCK_COLS + GAP_COLS + d },
    );
  }
}

/** Day index where the second annual dose takes over: the turn of the year's
 *  first half, and exactly where the left block ends. */
const SPLIT = MONTHS.slice(0, HALF_ROWS).reduce((a, b) => a + b, 0);

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

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number): Pt {
  const v = 1 - u;
  const a = v * v * v;
  const b = 3 * v * v * u;
  const c = 3 * v * u * u;
  const d = u * u * u;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
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

  // ── Layout. The calendar spans the top as two wide, short blocks; the doses
  //    sit low and close together at the centre, so the two halves of the year
  //    collapse inward as well as downward and the whole frame funnels.
  const cell = Math.min((0.94 * w) / COLS, (0.34 * h) / HALF_ROWS);
  const gridW = COLS * cell;
  const gridH = HALF_ROWS * cell;
  const gx0 = (w - gridW) / 2;
  const gy0 = 0.07 * h;
  const dotR = 0.32 * cell;

  const R = Math.min(0.03 * w, 0.075 * h);
  const doseY = 0.86 * h;
  const d0: Pt = { x: 0.5 * w - 0.075 * w, y: doseY };
  const d1: Pt = { x: 0.5 * w + 0.075 * w, y: doseY };

  const slot = (i: number): Pt => ({
    x: gx0 + (CELL[i].col + 0.5) * cell,
    y: gy0 + (CELL[i].row + 0.5) * cell,
  });

  /** A long fall that drifts inward, then straightens into the dose from
   *  directly above — so the many paths resolve into two necks rather than
   *  arriving from every bearing. */
  const controls = (i: number, from: Pt): [Pt, Pt, Pt] => {
    const target = i < SPLIT ? d0 : d1;
    const j = hash(i, 3) - 0.5;
    return [
      {
        x: from.x + (target.x - from.x) * 0.34,
        y: from.y + (target.y - from.y) * 0.46,
      },
      {
        x: target.x + j * 0.05 * w,
        y: target.y - 0.24 * h,
      },
      target,
    ];
  };

  // ── The rails: one hairline per stream, always present, so the routes read
  //    even in the instants when few days are falling.
  ctx.lineWidth = Math.max(1, w / 1500);
  ctx.lineCap = "round";
  for (const half of [0, 1] as const) {
    const from: Pt = {
      x: gx0 + (half === 0 ? BLOCK_COLS * 0.5 : BLOCK_COLS * 1.5 + GAP_COLS) * cell,
      y: gy0 + gridH,
    };
    const [c1, c2, target] = controls(half === 0 ? 60 : 300, from);
    ctx.strokeStyle = `rgba(${BLUE},0.12)`;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, target.x, target.y);
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
    const [c1, c2, target] = controls(i, from);

    for (let k = 4; k >= 0; k--) {
      const tk = tau - k * 0.02;
      if (tk <= 0) continue;
      const u = smooth(tk);
      const pos = bezier(from, c1, c2, target, u);
      // The last stretch is the absorption: the day sinks into the dose.
      const sink = clamp01((tk - 0.88) / 0.12);
      const a = (k === 0 ? 0.9 : 0.34 - 0.06 * k) * (1 - sink);
      if (a < 0.02) continue;
      const r = dotR * (k === 0 ? 1 : 0.82 - 0.1 * k) * (1 - 0.6 * sink);
      ctx.fillStyle = `rgba(${OCEAN},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(r, 0.6), 0, TAU);
      ctx.fill();
    }
  }

  // ── The two annual doses, growing as they absorb their halves of the year.
  //    Orange inside a blue hairline orbit: the same pairing as the dose in
  //    the mark itself, and the page's one moment of orange punctuation.
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
      r * 2.6,
    );
    halo.addColorStop(0, `rgba(${ORANGE},0.2)`);
    halo.addColorStop(1, `rgba(${ORANGE},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(target.x, target.y, r * 2.6, 0, TAU);
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
      r + Math.max(5, 0.005 * w) + 1.5 * Math.sin((TAU * t) / 6.5 + half * 2),
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
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-[0_36px_72px_-44px_rgba(13,35,66,0.3)]">
      {/* The year, stated. Nothing separates this from the canvas below it:
          the days should look like they are falling out from under it. */}
      <div className="flex items-start justify-between gap-6 px-6 pt-7 sm:px-10 sm:pt-9">
        <div>
          <span aria-hidden className="mb-4 block h-px w-10 bg-stone/70" />
          <p className="text-[clamp(2.6rem,5.5vw,4rem)] font-extralight leading-[0.9] tracking-tight text-ink">
            <CountUp value="365" />
          </p>
          <p className="mt-3 max-w-[34ch] text-base leading-relaxed text-body">
            doses a year of daily oral therapy, dependent on adherence.
          </p>
        </div>

        {/* The chart-recorder readout, ticking with the drain. Dropped on narrow
            screens: it is decoration, and sharing a row with it squeezed the
            figure's caption into a four-line column. */}
        <div aria-hidden className="hidden shrink-0 items-center gap-2.5 pt-1 sm:flex">
          <span className="h-px w-6 bg-line" />
          <span
            ref={counterRef}
            className="text-[0.68rem] font-semibold tracking-[0.18em] text-muted tabular-nums"
          >
            DAY 365
          </span>
        </div>
      </div>

      <div className="relative -my-2 h-[280px] sm:h-[340px] lg:h-[390px]">
        <HeroCanvas
          render={draw}
          className="absolute inset-0"
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

      {/* What is left, seated directly under where the doses land. */}
      <div className="px-6 pb-8 sm:px-10 sm:pb-10">
        <span aria-hidden className="mb-4 block h-px w-10 bg-orange" />
        <p className="text-[clamp(2.6rem,5.5vw,4rem)] font-extralight leading-[0.9] tracking-tight text-blue">
          1–2
        </p>
        <p className="mt-3 max-w-[34ch] text-base leading-relaxed text-body">
          doses a year of CIN-111, independent of daily adherence.
        </p>
      </div>
    </div>
  );
}
