import { Reveal } from "@/components/reveal";

/**
 * The lead paragraph, drawn.
 *
 * The copy makes one argument: daily oral therapy has carried hypertension care for
 * decades, a large share of patients are still uncontrolled, and the answer is a
 * long-acting agent that holds control independent of whether a dose gets taken. This
 * figure is that sentence and nothing else.
 *
 *   - The upper trace is daily therapy. Each dose is absorbed, peaks, and clears before
 *     the next one, so the profile is a permanent climb-and-fall. It reaches the highest
 *     peaks on the page and cannot hold any of them.
 *   - Twice, a dose is missed. Nothing is labelled or pointed at; the trace simply keeps
 *     decaying through the interval and falls to the floor. Those two troughs are the
 *     "uncontrolled or untreated" in the paragraph above.
 *   - The lower trace is the long-acting profile. It rises once and holds. It never
 *     reaches the daily peaks, which is honest and is also the point: the argument is
 *     durability, not magnitude.
 *
 * The long-acting trace is the only one carrying a filled area beneath it, because the
 * word in the copy is "backbone" and mass is how you draw a foundation.
 *
 * NOT DATA. There is no axis, no scale, no unit and no product named - the two labels
 * describe modalities, not CIN-111. The shapes are the textbook behaviour of the two
 * dosing regimes, generated from a decay model below rather than from any dataset.
 * Nothing here should be read as a result; the real figures live on /pipeline.
 *
 * Everything is deterministic and generated at module scope. Motion is one draw-in on
 * scroll, reusing the site's existing .chart-line / .chart-fade system, so it is
 * already handled under prefers-reduced-motion and already renders complete without JS.
 * There is no loop, no hover state, and nothing vertical.
 */

const W = 1200;
const H = 290;

/** Zero effect. Everything is measured up from here. */
const BASE_Y = 252;
/** Effect units to viewBox units. */
const SCALE = 1.5625;
const y = (effect: number) => BASE_Y - effect * SCALE;

/* ── Daily oral therapy ────────────────────────────────────────────────────
   A first-order model: each dose is absorbed over a short window, and what is in
   the system decays continuously. Run it and the sawtooth, the accumulation to
   steady state, and the collapse after a missed dose all fall out on their own -
   none of it is drawn by hand. */

const INTERVAL = 58;
const FIRST_DOSE = 12;
/** Retained per unit of x. */
const DECAY = 0.972;
/** Total effect delivered by one dose, spread across the absorption window. */
const DOSE = 62;
/** Absorption window. Non-zero so the rise is steep but never a vertical stroke. */
const ABSORB = 7;
/** Two doses go untaken. Deliberately unmarked - the shape says it. */
const MISSED = new Set([8, 15]);

function dailySeries(): string {
  let level = 0;
  const out: string[] = [];
  for (let x = 0; x <= W; x++) {
    const k = Math.floor((x - FIRST_DOSE) / INTERVAL);
    const doseX = FIRST_DOSE + k * INTERVAL;
    const absorbing =
      k >= 0 && !MISSED.has(k) && x >= doseX && x < doseX + ABSORB;
    level = level * DECAY + (absorbing ? DOSE / ABSORB : 0);
    // Sample every other unit: enough to resolve the absorption rise, half the path data.
    if (x % 2 === 0) {
      out.push(`${x},${y(level).toFixed(1)}`);
    }
  }
  return `M ${out.join(" L ")}`;
}

/* ── Long-acting profile ───────────────────────────────────────────────────
   One rise to a plateau, then hold. The undulation is a fraction of a unit: enough
   that the line is not a printed rule, far too little to read as variation. */

const PLATEAU = 47.4;
const RISE_X = 235;

function backboneSeries(): string {
  const out: string[] = [];
  for (let x = 0; x <= W; x += 8) {
    const t = Math.min(x / RISE_X, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const drift = 0.55 * Math.sin(x / 96) + 0.25 * Math.sin(x / 41 + 1.2);
    out.push(`${x},${y(PLATEAU * eased + drift * t).toFixed(1)}`);
  }
  return `M ${out.join(" L ")}`;
}

const DAILY = dailySeries();
const BACKBONE = backboneSeries();
const BACKBONE_AREA = `${BACKBONE} L ${W},${BASE_Y} L 0,${BASE_Y} Z`;

const DAILY_COLOR = "#6bb2e2";
const BACKBONE_COLOR = "#2261ad";

function LegendRow({
  cy,
  color,
  label,
  weight,
}: {
  cy: number;
  color: string;
  label: string;
  weight: number;
}) {
  return (
    <g className="chart-fade">
      <line
        x1={0}
        y1={cy}
        x2={26}
        y2={cy}
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
      />
      {/* Cased in the string rather than via text-transform: support for that
          property on SVG text is inconsistent, and this cannot be eyeballed here. */}
      <text
        x={38}
        y={cy}
        dominantBaseline="middle"
        fontSize={14}
        fontWeight={600}
        letterSpacing={1.7}
        fill="#5b6e83"
      >
        {label}
      </text>
    </g>
  );
}

export function AdherenceProfile() {
  return (
    <Reveal variant="fade">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Schematic comparison of two dosing regimes: daily oral therapy, which peaks and falls between doses and drops to the floor when a dose is missed, against a long-acting agent that rises once and holds a continuous level."
      >
        <defs>
          <linearGradient id="ap-foundation" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BACKBONE_COLOR} stopOpacity={0.17} />
            <stop offset="60%" stopColor={BACKBONE_COLOR} stopOpacity={0.06} />
            <stop offset="100%" stopColor={BACKBONE_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>

        <LegendRow
          cy={18}
          color={DAILY_COLOR}
          label="DAILY ORAL THERAPY"
          weight={1.8}
        />
        <LegendRow
          cy={46}
          color={BACKBONE_COLOR}
          label="LONG-ACTING siRNA"
          weight={2.8}
        />

        {/* The floor. A horizontal hairline, so the two collapses have something to
            fall to and read as loss rather than as dips. */}
        <line
          className="chart-fade"
          x1={0}
          y1={BASE_Y}
          x2={W}
          y2={BASE_Y}
          stroke="#dce7f1"
          strokeWidth={1}
        />

        {/* Mass under the long-acting trace only: the copy's word is backbone. */}
        <path className="chart-fade" d={BACKBONE_AREA} fill="url(#ap-foundation)" />

        <path
          className="chart-line"
          pathLength={1}
          d={DAILY}
          fill="none"
          stroke={DAILY_COLOR}
          strokeWidth={1.7}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <path
          className="chart-line"
          pathLength={1}
          d={BACKBONE}
          fill="none"
          stroke={BACKBONE_COLOR}
          strokeWidth={2.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </Reveal>
  );
}
