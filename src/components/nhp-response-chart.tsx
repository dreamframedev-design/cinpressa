import { Reveal } from "@/components/reveal";

/**
 * Illustrative schematic of the reported non-human-primate result: near-complete
 * AGT knockdown by ~1 month, sustained ~88% at Day 119. Only the stated points
 * are anchored; the connecting curve is a smooth schematic, labelled as such.
 */

const W = 720;
const H = 380;
const X0 = 56;
const X1 = 692;
const Y_TOP = 28; // 100%
const Y_BOTTOM = 320; // 0%

const MAX_DAY = 119;

// [day, AGT knockdown %]
const data: [number, number][] = [
  [0, 0],
  [7, 78],
  [14, 93],
  [28, 99],
  [60, 95],
  [90, 91],
  [119, 88],
];

const x = (day: number) => X0 + (day / MAX_DAY) * (X1 - X0);
const y = (pct: number) => Y_BOTTOM - (pct / 100) * (Y_BOTTOM - Y_TOP);

const points = data.map(([day, pct]) => [x(day), y(pct)] as [number, number]);

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const linePath = smoothPath(points);
const areaPath = `${linePath} L ${X1} ${Y_BOTTOM} L ${X0} ${Y_BOTTOM} Z`;

const xTicks = [0, 28, 60, 119];
const yTicks = [0, 50, 100];
const peak = points[3]; // Day 28
const endpoint = points[6]; // Day 119
const thresholdY = y(80);

export function NhpResponseChart() {
  return (
    <figure className="rounded-3xl border border-line bg-white p-5 shadow-[0_30px_60px_-45px_rgba(13,35,66,0.3)] sm:p-7">
      <Reveal variant="fade" className="block">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Schematic of AGT knockdown over time in non-human primates: near-complete knockdown by about one month, sustained near 88 percent at Day 119."
        >
          <defs>
            <linearGradient id="agtFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3AAED8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3AAED8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {yTicks.map((t) => (
            <line
              key={t}
              x1={X0}
              x2={X1}
              y1={y(t)}
              y2={y(t)}
              stroke="#DCE7F1"
              strokeWidth="1"
            />
          ))}

          {/* ≥80% threshold reference */}
          <line
            x1={X0}
            x2={X1}
            y1={thresholdY}
            y2={thresholdY}
            stroke="#5b6e83"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.6"
          />
          <text
            x={X1}
            y={thresholdY - 8}
            textAnchor="end"
            fontSize="11.5"
            fill="#5b6e83"
          >
            ≥ 80% knockdown · Phase 1 expansion threshold
          </text>

          {/* Y axis labels */}
          {yTicks.map((t) => (
            <text
              key={t}
              x={X0 - 12}
              y={y(t) + 4}
              textAnchor="end"
              fontSize="12"
              fill="#5b6e83"
            >
              {t}%
            </text>
          ))}

          {/* X axis labels */}
          {xTicks.map((t) => (
            <text
              key={t}
              x={x(t)}
              y={Y_BOTTOM + 26}
              textAnchor="middle"
              fontSize="12"
              fill="#5b6e83"
            >
              Day {t}
            </text>
          ))}

          {/* Area + line */}
          <path d={areaPath} fill="url(#agtFill)" className="chart-fade" />
          <path
            d={linePath}
            fill="none"
            stroke="#2261AD"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            className="chart-line"
          />

          {/* Peak marker (Day 28) */}
          <g className="chart-fade">
            <circle cx={peak[0]} cy={peak[1]} r="5" fill="#2261AD" stroke="#fff" strokeWidth="2" />
            <text x={peak[0] + 10} y={peak[1] - 10} fontSize="12.5" fill="#14304f" fontWeight="500">
              ~100% by ~1 month
            </text>
          </g>

          {/* Sustained endpoint marker (Day 119) — the orange accent */}
          <g className="chart-fade">
            <circle
              cx={endpoint[0]}
              cy={endpoint[1]}
              r="6"
              fill="none"
              stroke="#F9A81A"
              strokeWidth="1.5"
              className="pulse-ring"
            />
            <circle cx={endpoint[0]} cy={endpoint[1]} r="6" fill="#F9A81A" stroke="#fff" strokeWidth="2" />
            <text x={endpoint[0]} y={endpoint[1] - 16} textAnchor="end" fontSize="13" fill="#14304f" fontWeight="600">
              88% sustained
            </text>
          </g>
        </svg>
      </Reveal>

      <figcaption className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-muted">
        <span aria-hidden className="mt-[3px] h-3 w-3 shrink-0 rounded-full border border-line" />
        Illustrative schematic of reported non-human-primate data. AGT knockdown
        reached near-completion by roughly one month and remained near 88% at Day
        119, with systolic blood pressure held below 120&nbsp;mmHg from Day&nbsp;42.
      </figcaption>
    </figure>
  );
}
