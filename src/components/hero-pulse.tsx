"use client";

import {
  HeroCanvas,
  TAU,
  clamp01,
  smooth,
  drawHeroWashes,
} from "@/components/hero-canvas";

/**
 * Consensus — pressure traces converging into control.
 *
 * Option B for the /science hero, and the literal reading of the page: each
 * hairline is an arterial pressure trace. On the left they are what daily-dose
 * hypertension actually looks like across a population — the same waveform
 * grammar at quarrelling amplitudes, rates and phases, wandering restlessly. As
 * they cross the frame every trace funnels into a single tight corridor where
 * all of them beat small, slow and in perfect synchrony, and the braid runs
 * level to the right edge. Scattered to controlled, chaos to consensus, with the
 * convergence happening exactly where the eye leaves the headline. One dark
 * braid of order is the destination of the whole picture, which is the claim of
 * the program stated without a single word.
 *
 * THE WAVEFORM. Every trace shares one pulse shape — a fast systolic peak and a
 * smaller dicrotic shoulder, two gaussians — so the left side reads as many
 * readings of the same signal rather than as scribble. Disorder lives only in
 * the parameters: amplitude, rate, phase and a slow arrhythmic wander, all of
 * it easing to zero variance inside the corridor.
 *
 * DISCIPLINE. Same rules as the laminar field, learned the hard way there: one
 * stroke at one alpha per trace (never alpha steps along a hairline), density
 * makes the ink (the corridor darkens because forty traces overlap under
 * multiply, not because anything is painted darker), supersampled backing so
 * near-horizontal hairlines resolve smoothly, geometry rebuilt every frame from
 * scratch with nothing allocated, and motion that is unhurried everywhere: the
 * chaos wanders on nine-second-plus clocks and the consensus pulse drifts
 * through the corridor slower still.
 */

/** Traces. Enough to make the corridor braid read as mass. */
const N = 42;
/** Samples per trace. The waveform is gentle; this resolves it cleanly. */
const STEPS = 260;

/** Where the corridor sits and how tight it holds. Below the subtitle line, so
 *  the braid emerges into open frame rather than behind reading text. */
const CORRIDOR_Y = 0.58;
const CORRIDOR_SPREAD = 0.028;
/** Scattered baselines fan this far around the corridor on the left. */
const FAN = 0.23;

/** Convergence window, in frame fractions: the neck sits right of the headline. */
const CONV_START = 0.32;
const CONV_END = 0.78;

/** The blue ladder, deep for traces born near the centre, pale at the fan edge. */
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

function ladder(u: number) {
  if (u < 0.3) return mix(DEEP, AZURE, u / 0.3);
  if (u < 0.62) return mix(AZURE, OCEAN, (u - 0.3) / 0.32);
  return mix(OCEAN, PALE, (u - 0.62) / 0.38);
}

/**
 * One heartbeat of an arterial line: sharp systolic rise, dicrotic shoulder.
 * u in [0,1) is one cardiac cycle; returns 0..~1.
 */
function beat(u: number) {
  const a = u - 0.1;
  const b = u - 0.46;
  return Math.exp((-a * a) / 0.0045) + 0.32 * Math.exp((-b * b) / 0.016);
}

/** Same fade window as the laminar field, so A and B damp identically. */
const copyFade = (fx: number) => 0.05 + 0.95 * smooth((fx - 0.14) / 0.5);

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
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const hair = Math.max(1.5, w / 1300);
  ctx.lineWidth = hair;

  // The corridor itself breathes a little, so control reads as alive, not flat.
  const corridor = (CORRIDOR_Y + 0.01 * Math.sin((TAU * t) / 21 + 1.2)) * h;
  // The consensus pulse: one rate, one phase, shared by every converged trace,
  // sliding through the corridor at a stately pace.
  const consensusRate = 5.5;
  const consensusPhase = t / 26;

  for (let i = 0; i < N; i++) {
    // ── This trace's disorder, all of it eased out inside the corridor.
    const fan = (i / (N - 1) - 0.5) * 2; // -1..1 across the fan
    const base = corridor + fan * FAN * h;
    const amp = (0.04 + 0.1 * hash(i, 1)) * h;
    const rate = 5 + 4.5 * hash(i, 2); // beats across the frame
    const drift = t / (14 + 10 * hash(i, 3)) + hash(i, 4);
    // Arrhythmia: the beat clock itself wobbles on its own slow cycle.
    const wobble = 0.16 * Math.sin((TAU * t) / (9 + 7 * hash(i, 5)) + i * 1.7);
    // Restless baseline wander.
    const wander =
      0.028 * h * Math.sin((TAU * t) / (11 + 6 * hash(i, 6)) + i * 2.3);

    // Where in the fan this trace lands inside the corridor braid.
    const braid = corridor + fan * CORRIDOR_SPREAD * h;

    const u01 = Math.abs(fan);
    const col = ladder(u01);
    // Modest per-line ink: the corridor darkens because forty traces overlap
    // under multiply, and a heavier weight there turns braid into marker. The
    // hash variance keeps the stack from congealing into one flat tone.
    const alpha = (0.3 - 0.13 * smooth(u01)) * (0.8 + 0.4 * hash(i, 7));

    ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;
    ctx.beginPath();
    for (let p = 0; p <= STEPS; p++) {
      const fx = -0.02 + (1.04 * p) / STEPS;
      const x = fx * w;
      // 0 = full disorder, 1 = full consensus.
      const m = smooth((fx - CONV_START) / (CONV_END - CONV_START));

      const chaosY =
        base +
        wander -
        amp * beat((fx * rate + drift + wobble * Math.sin(TAU * fx * 1.7)) % 1);
      // A soft interleave inside the corridor: threads cross gently instead of
      // stacking parallel, which is what makes braid read as braid.
      const weave =
        0.0055 * h * Math.sin(TAU * (fx * 2.4 + i * 0.37) + (TAU * t) / 23);
      const calmY =
        braid +
        weave -
        0.013 * h * beat((fx * consensusRate + consensusPhase) % 1);

      const y = chaosY + (calmY - chaosY) * m;
      if (p === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  drawHeroWashes(ctx, w, h, copyFade);
}

export function HeroPulse({ className = "" }: { className?: string }) {
  return (
    <HeroCanvas
      render={render}
      className={className}
      /* Same rendering budget as the laminar field, for the same reason:
         near-horizontal hairlines need supersampling to resolve smoothly. */
      superSample={1.5}
      maxWidth={3800}
      maxDpr={2.6}
      frameMs={15}
      stillAt={11}
    />
  );
}
