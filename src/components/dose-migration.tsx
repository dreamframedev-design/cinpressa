"use client";

import { HeroCanvas, TAU, clamp01, smooth } from "@/components/hero-canvas";
import { Reveal } from "@/components/reveal";

/**
 * Dose migration — a year of daily doses becoming two.
 *
 * The two-panel comparison this replaces showed 365 dots beside 2 dots and
 * asked the reader to infer the relationship. This piece performs it: the
 * calendar drains in day order, every dose flies a bundled stream across the
 * frame, and the two annual doses on the right visibly grow as they absorb the
 * year. Each departed day leaves a pale ghost ring in its slot, so by the end
 * the left side is an emptied calendar of outlines standing against two full
 * marks — the receipt of the argument. Then the year quietly refills and the
 * cycle breathes again. Both of the pictures asked for — the box draining, the
 * dots becoming two — are the same event seen at its two ends.
 *
 * STRUCTURE IS MEANING here in three places: departure order is calendar
 * order, top-left first, so the drain reads as time passing; the first half of
 * the year flows to the first dose and the second half to the second, because
 * that is literally what one-to-two administrations a year covers; and the
 * second stream dips beneath the first dose on its way — the same
 * parting-around-a-mass figure the science hero draws.
 *
 * Everything is a pure function of t (a ~23s loop), rendered on the shared
 * HeroCanvas scaffold with the house rules: hairline rails, single-alpha
 * strokes, supersampled store, preallocated everything, no allocation in the
 * frame loop. The canvas is transparent — the piece sits directly on the
 * section wash, not in a panel.
 */

const DAYS = 365;
const COLS = 24;
const ROWS = Math.ceil(DAYS / COLS);
/** Day index where the second annual dose takes over coverage. */
const SPLIT = 183;

/** The loop, in seconds. The full argument resolves in under five — drain,
 *  flight, and two grown doses — then the emptied calendar holds for a beat
 *  before the year refills. Around 160 days are airborne at the peak; the
 *  river is the spectacle and it should feel like one. A glance catches the
 *  whole story; a second glance catches the next year. */
const CYCLE = 9;
const DEPART_SPAN = 3.2;
const FLIGHT = 1.4;
const REFILL_START = 7;
const REFILL_SPAN = 1.6;
const REFILL_RAMP = 0.35;

const BLUE = "34,97,173";
const DEEP = "4,115,187";
const SKY = "58,174,216";
const OCEAN = "30,174,229";
const PALE = "190,215,236";

/** Deterministic per-day jitter. The piece must survive a resize unchanged. */
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
 * back" — including the very first arrival, since the piece sits below the
 * fold and its early frames stop as soon as the IntersectionObserver reports.
 * Every viewing therefore starts at the year's beginning instead of joining an
 * already-drained cycle. Under prefers-reduced-motion there is no loop and no
 * anchor: the single still renders at stillAt, a mid-drain frame that shows
 * calendar, streams and doses at once.
 */
const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let anchor = -1;
let lastLoopT = -1;

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
    // Mount or resize: hold the year's start; the loop re-anchors next frame.
    anchor = -1;
    lastLoopT = -1;
    phase = 0;
  } else {
    if (anchor < 0 || t < lastLoopT || t - lastLoopT > 0.6) anchor = t;
    lastLoopT = t;
    phase = (t - anchor) % CYCLE;
  }

  // ── Layout.
  const cell = Math.min((0.46 * w) / COLS, (0.86 * h) / ROWS);
  const gridW = COLS * cell;
  const gridH = ROWS * cell;
  const gx0 = 0.03 * w;
  const gy0 = (h - gridH) / 2;
  const dotR = 0.3 * cell;

  const R = Math.min(0.028 * w, 0.075 * h);
  const d0: Pt = { x: 0.715 * w, y: 0.5 * h };
  const d1: Pt = { x: 0.88 * w, y: 0.5 * h };

  const slot = (i: number): Pt => ({
    x: gx0 + ((i % COLS) + 0.5) * cell,
    y: gy0 + (Math.floor(i / COLS) + 0.5) * cell,
  });

  /** Control points bundle each half-year into its own stream; the second
   *  stream dips beneath the first dose on its way to the second. */
  const controls = (i: number, from: Pt): [Pt, Pt, Pt] => {
    const j = hash(i, 3) - 0.5;
    if (i < SPLIT) {
      return [
        { x: from.x + 0.1 * w, y: from.y + (d0.y - from.y) * 0.25 },
        { x: d0.x - 0.12 * w, y: d0.y - 0.06 * h + j * 0.05 * h },
        d0,
      ];
    }
    return [
      { x: from.x + 0.12 * w, y: from.y + (0.74 * h - from.y) * 0.35 },
      { x: d1.x - 0.12 * w, y: 0.71 * h + j * 0.05 * h },
      d1,
    ];
  };

  // ── The rails: one hairline per stream, always present, so the routes read
  //    even in the instants when few travellers are airborne.
  ctx.lineWidth = Math.max(1, w / 1500);
  ctx.lineCap = "round";
  for (const half of [0, 1] as const) {
    const from: Pt = {
      x: gx0 + gridW,
      y: gy0 + gridH * (half === 0 ? 0.3 : 0.72),
    };
    const [c1, c2, target] = controls(half === 0 ? 60 : 280, from);
    ctx.strokeStyle = `rgba(${BLUE},0.12)`;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, target.x, target.y);
    ctx.stroke();
  }

  // ── The calendar: seated days, ghost rings of departed days, refill.
  const refillP = clamp01((phase - REFILL_START) / REFILL_SPAN);
  for (let i = 0; i < DAYS; i++) {
    const p = slot(i);
    const depart = (i / DAYS) * DEPART_SPAN;
    const refillAt = REFILL_START + (i / DAYS) * (REFILL_SPAN - REFILL_RAMP);
    const back = clamp01((phase - refillAt) / REFILL_RAMP);
    const seated = phase < depart ? 1 : back;

    if (seated > 0.002) {
      ctx.fillStyle = `rgba(${BLUE},${(0.85 * seated).toFixed(3)})`;
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

  // ── The migration: every airborne day, with a short comet of its recent past.
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
      ctx.fillStyle = `rgba(${k === 0 ? BLUE : OCEAN},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(r, 0.6), 0, TAU);
      ctx.fill();
    }
  }

  // ── The two annual doses, growing as they absorb their halves of the year.
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

    // Soft halo, then the mark, then its hairline orbit.
    const halo = ctx.createRadialGradient(
      target.x,
      target.y,
      r * 0.4,
      target.x,
      target.y,
      r * 2.6,
    );
    halo.addColorStop(0, `rgba(${SKY},0.22)`);
    halo.addColorStop(1, `rgba(${SKY},0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(target.x, target.y, r * 2.6, 0, TAU);
    ctx.fill();

    ctx.fillStyle = `rgba(${DEEP},0.92)`;
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
  return (
    <div>
      <div className="relative h-[280px] sm:h-[360px] lg:h-[430px]">
        <HeroCanvas
          render={render}
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

      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end sm:gap-8">
        <Reveal variant="fade">
          <p className="max-w-sm text-[clamp(1.1rem,1.6vw,1.35rem)] font-light leading-snug text-body">
            <span className="font-medium text-blue">365 doses a year</span> of
            daily oral therapy, dependent on adherence.
          </p>
        </Reveal>
        <Reveal variant="fade" delay={120}>
          <p className="max-w-sm text-[clamp(1.1rem,1.6vw,1.35rem)] font-light leading-snug text-body sm:text-right">
            <span className="font-medium text-blue">1&ndash;2 doses a year</span>{" "}
            of CIN-111, independent of daily adherence.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
