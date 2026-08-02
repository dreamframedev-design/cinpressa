import { Reveal } from "@/components/reveal";
import { PlaceholderNote } from "@/components/placeholder-note";

/**
 * Non-human primate results for CIN-111: AGT knockdown and systolic blood
 * pressure over 119 days, against zilebesiran at the same dose.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ THE SERIES BELOW ARE PLACEHOLDER CURVES. DO NOT PUBLISH AS-IS.      │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * Only these four figures are real. They are the ones already published in
 * the pipeline page copy:
 *
 *   • AGT reduction ~100% at one month          (plotted at Day 28)
 *   • AGT reduction ~88% mean at Day 119
 *   • Systolic BP below 120 mmHg from Day 42 onward
 *   • No significant rebound trend by Day 119
 *
 * Every other point (the shape between anchors, the baseline blood pressure,
 * and the entire zilebesiran comparator) is invented so the layout can be
 * designed. Replace all three arrays wholesale with the source dataset, then
 * delete the PlaceholderNote at the bottom of this file.
 */

type Point = { d: number; v: number };

/* PLACEHOLDER: see header. Anchors marked. */
const AGT_CIN111: Point[] = [
  { d: 0, v: 0 },
  { d: 7, v: 58 },
  { d: 14, v: 86 },
  { d: 28, v: 98 }, // anchor: "nearly 100 percent at one month"
  { d: 42, v: 97 },
  { d: 63, v: 95 },
  { d: 91, v: 91 },
  { d: 119, v: 88 }, // anchor: "approximately 88 percent on Day 119"
];

/* PLACEHOLDER: baseline invented; only the sub-120 crossing is documented. */
const SBP_CIN111: Point[] = [
  { d: 0, v: 150 },
  { d: 14, v: 138 },
  { d: 28, v: 126 },
  { d: 42, v: 119 }, // anchor: "below 120 mmHg from Day 42 onward"
  { d: 63, v: 117 },
  { d: 91, v: 116 },
  { d: 119, v: 118 }, // anchor: "no significant rebound trend by Day 119"
];

/* PLACEHOLDER: entirely invented. Only "outperformed at the same dose" is documented. */
const SBP_ZILEBESIRAN: Point[] = [
  { d: 0, v: 150 },
  { d: 14, v: 143 },
  { d: 28, v: 136 },
  { d: 42, v: 130 },
  { d: 63, v: 128 },
  { d: 91, v: 129 },
  { d: 119, v: 132 },
];

const W = 780;
const H = 462;
const PAD_L = 58;
const PAD_R = 22;
const PLOT_W = W - PAD_L - PAD_R;

const P1_TOP = 20;
const P2_TOP = 254;
const PANEL_H = 168;

const DAY_MAX = 119;
/** Framed to the data range rather than a round 100 to 160, which left a third
 *  of the panel empty. */
const SBP_MIN = 110;
const SBP_MAX = 155;

const CIN = "#2261AD";
const COMPARATOR = "#A3ABAE";

const xFor = (d: number) => PAD_L + (d / DAY_MAX) * PLOT_W;
const yPct = (v: number) => P1_TOP + PANEL_H - (v / 100) * PANEL_H;
const ySbp = (v: number) =>
  P2_TOP + PANEL_H - ((v - SBP_MIN) / (SBP_MAX - SBP_MIN)) * PANEL_H;

type XY = { x: number; y: number };

/** Catmull-Rom through the points, low tension so it never overshoots. */
function smooth(pts: XY[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = 0.18;
    d +=
      `C${(p1.x + (p2.x - p0.x) * t).toFixed(1)},${(p1.y + (p2.y - p0.y) * t).toFixed(1)}` +
      ` ${(p2.x - (p3.x - p1.x) * t).toFixed(1)},${(p2.y - (p3.y - p1.y) * t).toFixed(1)}` +
      ` ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

const toXY = (pts: Point[], y: (v: number) => number): XY[] =>
  pts.map((p) => ({ x: xFor(p.d), y: y(p.v) }));

const agtXY = toXY(AGT_CIN111, yPct);
const sbpXY = toXY(SBP_CIN111, ySbp);
const zileXY = toXY(SBP_ZILEBESIRAN, ySbp);

const AGT_PATH = smooth(agtXY);
const AGT_AREA = `${AGT_PATH}L${agtXY[agtXY.length - 1].x.toFixed(1)},${(P1_TOP + PANEL_H).toFixed(1)}L${agtXY[0].x.toFixed(1)},${(P1_TOP + PANEL_H).toFixed(1)}Z`;
const SBP_PATH = smooth(sbpXY);
const ZILE_PATH = smooth(zileXY);

const DAY_TICKS = [0, 28, 42, 63, 91, 119];
const PCT_TICKS = [0, 25, 50, 75, 100];
const SBP_TICKS = [110, 120, 130, 140, 150];

const AXIS = "#DCE7F1";
const LABEL = "#5b6e83";

/**
 * The two published AGT figures, called out on the curve. `dy` sends the Day 28
 * label below its marker. Above it would collide with the panel title.
 */
const AGT_CALLOUTS: {
  d: number;
  v: number;
  text: string;
  dy: number;
  anchor: "middle" | "end";
}[] = [
  { d: 28, v: 98, text: "~100% at 1 month", dy: 22, anchor: "middle" },
  { d: 119, v: 88, text: "~88% at Day 119", dy: -14, anchor: "end" },
];

function Panel({
  top,
  label,
  ticks,
  format,
  yOf,
}: {
  top: number;
  label: string;
  ticks: number[];
  format: (v: number) => string;
  yOf: (v: number) => number;
}) {
  return (
    <g>
      <text
        x={PAD_L}
        y={top - 8}
        fontSize="11.5"
        fontWeight="600"
        letterSpacing="1.4"
        fill={LABEL}
      >
        {label.toUpperCase()}
      </text>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={PAD_L}
            y1={yOf(t)}
            x2={W - PAD_R}
            y2={yOf(t)}
            stroke={AXIS}
            strokeWidth="1"
          />
          <text
            x={PAD_L - 10}
            y={yOf(t) + 4}
            fontSize="11"
            textAnchor="end"
            fill={LABEL}
          >
            {format(t)}
          </text>
        </g>
      ))}
    </g>
  );
}

export function EfficacyChart() {
  return (
    <Reveal variant="fade">
      <div className="overflow-hidden rounded-3xl border border-line bg-white px-5 py-8 sm:px-9 sm:py-10">
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full min-w-[40rem]"
            role="img"
            aria-label="Two charts over 119 days in hypertensive non-human primates: AGT protein reduction reaching nearly 100 percent at one month and approximately 88 percent at Day 119, and systolic blood pressure falling below 120 mmHg from Day 42 onward, compared with zilebesiran at the same dose."
          >
            <defs>
              <linearGradient id="agt-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CIN} stopOpacity="0.16" />
                <stop offset="100%" stopColor={CIN} stopOpacity="0" />
              </linearGradient>
            </defs>

            <Panel
              top={P1_TOP}
              label="AGT protein reduction"
              ticks={PCT_TICKS}
              format={(v) => `${v}%`}
              yOf={yPct}
            />
            <Panel
              top={P2_TOP}
              label="Systolic blood pressure"
              ticks={SBP_TICKS}
              format={(v) => `${v}`}
              yOf={ySbp}
            />

            {/* AGT knockdown */}
            <path className="chart-fade" d={AGT_AREA} fill="url(#agt-fill)" />
            <path
              className="chart-line"
              pathLength={1}
              d={AGT_PATH}
              fill="none"
              stroke={CIN}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            {AGT_CALLOUTS.map((a) => (
              <g className="chart-fade" key={a.d}>
                <circle
                  cx={xFor(a.d)}
                  cy={yPct(a.v)}
                  r="4"
                  fill="#ffffff"
                  stroke={CIN}
                  strokeWidth="2.4"
                />
                <text
                  x={xFor(a.d)}
                  y={yPct(a.v) + a.dy}
                  fontSize="11.5"
                  fontWeight="600"
                  textAnchor={a.anchor}
                  fill={CIN}
                >
                  {a.text}
                </text>
              </g>
            ))}

            {/* 120 mmHg reference */}
            <line
              className="chart-fade"
              x1={PAD_L}
              y1={ySbp(120)}
              x2={W - PAD_R}
              y2={ySbp(120)}
              stroke={COMPARATOR}
              strokeWidth="1.2"
              strokeDasharray="5 5"
            />
            <text
              className="chart-fade"
              x={W - PAD_R}
              y={ySbp(120) - 7}
              fontSize="11"
              textAnchor="end"
              fill={LABEL}
            >
              120 mmHg
            </text>

            {/* Comparator first, so CIN-111 reads on top. It fades rather than
                draws: .chart-line sets stroke-dasharray for the draw effect,
                which would override the dash pattern that marks it as the
                reference series. */}
            <path
              className="chart-fade"
              d={ZILE_PATH}
              fill="none"
              stroke={COMPARATOR}
              strokeWidth="2.2"
              strokeDasharray="7 6"
              strokeLinecap="round"
            />
            <path
              className="chart-line"
              pathLength={1}
              d={SBP_PATH}
              fill="none"
              stroke={CIN}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <g className="chart-fade">
              <circle
                cx={xFor(42)}
                cy={ySbp(119)}
                r="4"
                fill="#ffffff"
                stroke={CIN}
                strokeWidth="2.4"
              />
              <text
                x={xFor(42) + 9}
                y={ySbp(119) - 9}
                fontSize="11.5"
                fontWeight="600"
                fill={CIN}
              >
                Below 120 from Day 42
              </text>
            </g>

            {/* Shared time axis */}
            <line
              x1={PAD_L}
              y1={P2_TOP + PANEL_H}
              x2={W - PAD_R}
              y2={P2_TOP + PANEL_H}
              stroke={AXIS}
              strokeWidth="1"
            />
            {DAY_TICKS.map((d) => (
              <text
                key={d}
                x={xFor(d)}
                y={P2_TOP + PANEL_H + 22}
                fontSize="11"
                textAnchor={d === 0 ? "start" : d === DAY_MAX ? "end" : "middle"}
                fill={LABEL}
              >
                {d === 0 ? "Day 0" : d}
              </text>
            ))}
          </svg>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
          <span className="flex items-center gap-2.5 text-[0.95rem] text-body">
            <span aria-hidden className="h-[3px] w-7 rounded-full bg-blue" />
            CIN-111
          </span>
          <span className="flex items-center gap-2.5 text-[0.95rem] text-body">
            <span
              aria-hidden
              className="h-[3px] w-7 rounded-full"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, ${COMPARATOR} 0 7px, transparent 7px 12px)`,
              }}
            />
            Zilebesiran, same dose
          </span>
        </div>

        <div className="mt-6">
          <PlaceholderNote>
            Placeholder curves. Only the four published figures are real. Every
            other point, the baseline blood pressure, and the whole zilebesiran
            series are invented for layout. Swap in the source dataset before
            this goes public.
          </PlaceholderNote>
        </div>
      </div>
    </Reveal>
  );
}
