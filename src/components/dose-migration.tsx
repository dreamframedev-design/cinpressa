"use client";

import { useRef } from "react";
import type { HeroRender } from "@/components/hero-canvas";
import { HeroCanvas, TAU, clamp01, smooth } from "@/components/hero-canvas";
import { CountUp } from "@/components/count-up";

/**
 * Dose migration — a year of daily doses becoming two, in a frame.
 *
 * The original cut of this piece performed the argument in open space: the
 * calendar drains in day order, every dose flies a bundled stream across the
 * frame, and the two annual doses visibly grow as they absorb the year. That
 * motion was right — continuous, always mid-story, spectacle worth a pause —
 * but it floated on the section wash with nothing saying what a dot was a
 * unit OF, and the notes it earned were about exactly that: container,
 * frame, colour. A calendar-grid replacement fixed the frame and lost the
 * life. This cut keeps both:
 *
 *   – the flight animation, unchanged in structure: drain in calendar
 *     order, comet streams, ghost rings left in emptied slots, the two
 *     doses growing as they absorb their halves of the year, then the
 *     quiet refill and the cycle breathing again (~9s loop, motion
 *     continuous throughout);
 *   – inside an instrument card: hairline border, white ground, a DAY
 *     readout ticking with the drain like a chart recorder, and the two
 *     figure captions seated in a legend row directly beneath the side of
 *     the canvas they describe;
 *   – recoloured: the seated year is periwinkle from the icon ladder, not
 *     the old solid brand blue — the burden recedes. The airborne days are
 *     cyan. The two annual doses are ORANGE inside their blue hairline
 *     orbits, the same pairing as the orange dose in the mark itself, and
 *     the page's single moment of orange punctuation.
 *
 * STRUCTURE IS MEANING in three places: departure order is calendar order,
 * top-left first, so the drain reads as time passing; the first half of the
 * year flows to the first dose and the second half to the second, because
 * that is literally what one-to-two administrations a year covers; and the
 * second stream dips beneath the first dose on its way — the same
 * parting-around-a-mass figure the science hero draws.
 *
 * Everything is a pure function of t, rendered on the shared HeroCanvas
 * scaffold with the house rules: hairline rails, single-alpha strokes,
 * supersampled store, preallocated everything, no allocation in the frame
 * loop. The DAY readout rides the same loop — the render writes the current
 * phase to a module variable and the component's draw wrapper mirrors it
 * into the DOM only when the day changes.
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
const PERI = "126,170,219";
const OCEAN = "30,174,229";
const PALE = "190,215,236";
const ORANGE = "249,168,26";

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
    // Mount or resize: hold the year's start; the loop re-anchors next frame.
    anchor = -1;
    lastLoopT = -1;
    phase = 0;
  } else {
    if (anchor < 0 || t < lastLoopT || t - lastLoopT > 0.6) anchor = t;
    lastLoopT = t;
    phase = (t - anchor) % CYCLE;
  }
  currentPhase = phase;

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
  //    Periwinkle, not the old solid blue: the burden should recede.
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

    // Soft halo, then the mark, then its hairline orbit.
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
      <div className="relative h-[280px] sm:h-[340px] lg:h-[400px]">
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

        {/* The chart-recorder readout, ticking with the drain. */}
        <div
          aria-hidden
          className="absolute right-5 top-5 flex items-center gap-2.5 sm:right-8 sm:top-6"
        >
          <span className="h-px w-6 bg-line" />
          <span
            ref={counterRef}
            className="text-[0.68rem] font-semibold tracking-[0.18em] text-muted tabular-nums"
          >
            DAY 365
          </span>
        </div>
      </div>

      {/* Legend row: each caption seated under the side of the canvas it
          describes — the year on the left, the two doses on the right. */}
      <div className="grid gap-7 border-t border-line px-6 py-7 sm:grid-cols-2 sm:px-10 sm:py-8">
        <div>
          <span aria-hidden className="mb-4 block h-px w-10 bg-stone/70" />
          <p className="text-[clamp(2rem,3vw,2.6rem)] font-extralight leading-none tracking-tight text-ink">
            <CountUp value="365" />
          </p>
          <p className="mt-2.5 max-w-[30ch] text-base leading-relaxed text-body">
            doses a year of daily oral therapy, dependent on adherence.
          </p>
        </div>
        <div className="sm:text-right">
          <span aria-hidden className="mb-4 block h-px w-10 bg-orange sm:ml-auto" />
          <p className="text-[clamp(2rem,3vw,2.6rem)] font-extralight leading-none tracking-tight text-blue">
            1–2
          </p>
          <p className="mt-2.5 max-w-[30ch] text-base leading-relaxed text-body sm:ml-auto">
            doses a year of CIN-111, independent of daily adherence.
          </p>
        </div>
      </div>
    </div>
  );
}
