/**
 * The Horizon: one line, held, across the deep field.
 *
 * The footer was already the only dark surface on the site and it was spending that on
 * an orbit ring, two large radial glows and a crop of the logo at 0.07 opacity - which
 * is to say, on nothing you could actually see. This is the one thing that replaces all
 * of it.
 *
 * The line is NOT perfectly straight, and that is the entire piece. A mathematically
 * exact rule reads as a border - furniture, the edge of a box. A line that is almost
 * straight reads as a line being HELD: something maintained against pressure, which is
 * the drug's whole thesis and the reason this brand exists. The drift below is authored
 * point by point rather than generated, stays inside about a tenth of a percent of the
 * width, and never repeats. At a glance you read a straight line; if you actually look,
 * it is alive.
 *
 * Not a chart. No axis, no labels, no numbers, nothing that implies a clinical result.
 * EfficacyChart in this codebase carries a placeholder-data warning, and nothing here
 * should be mistakable for a plotted outcome. This is pure form.
 *
 * Reference points, per BRAND_DIRECTION section 1: the CEO collects Agnes Martin and
 * Brice Marden. One disciplined line in a large quiet field is the gesture that
 * audience is fluent in.
 */

const W = 1600;
const H = 40;
const BASE = H / 2;

/**
 * The drift, in user units against a 1600-unit width. Authored rather than generated:
 * a noise function produces a wobble that reads as noise, and what this needs is the
 * character of a line under load - long calm stretches, two slightly larger excursions
 * that recover, no periodicity anywhere. Peak deviation is 1.35 units on a 1600 unit
 * span, so roughly 0.08% off true.
 */
const DRIFT = [
  0, -0.22, 0.15, 0.41, -0.13, -0.48, 0.09, 0.34, 0.71, 0.26, -0.31, -0.62,
  -0.17, 0.28, 0.52, 1.05, 0.44, -0.08, -0.39, -0.74, -0.25, 0.19, 0.58, 0.33,
  -0.16, -0.51, -0.92, -0.35, 0.12, 0.44, 0.68, 0.21, -0.27, -0.59, -1.35,
  -0.42, 0.11, 0.37, 0.63, 0.18, -0.21, -0.44, -0.12, 0.24, 0.46, 0.13, -0.18,
  0.07, 0,
];

const STEP = W / (DRIFT.length - 1);
const PATH = DRIFT.map(
  (dy, i) => `${i === 0 ? "M" : "L"} ${(i * STEP).toFixed(1)} ${(BASE + dy).toFixed(2)}`,
).join(" ");

/** Where the single accent tick crosses the line, in user units. */
const ACCENT_X = 148;
const ACCENT_I = Math.round(ACCENT_X / STEP);

export function Horizon({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          {/* The line itself, climbing the icon ladder left to right. Runs at
              0.7-0.92, an order of magnitude above the 0.07 the old footer mark sat
              at - the client note was that the site reads washed out, and a dark
              ground is the one place full strength costs nothing in legibility. */}
          <linearGradient id="hz-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0783c6" stopOpacity="0.7" />
            <stop offset="0.32" stopColor="#1596d4" stopOpacity="0.85" />
            <stop offset="0.66" stopColor="#1eaee5" stopOpacity="0.92" />
            <stop offset="1" stopColor="#95daf8" stopOpacity="0.8" />
          </linearGradient>

          {/* The travelling luminance window. Padded either side, so only the band
              itself is bright and the rest of the line is untouched. */}
          <linearGradient id="hz-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Masking to a STROKE is why this is a mask and not a clipPath - clipPath
              only honours fill geometry, and the subject here is a hairline. */}
          <mask id="hz-mask">
            <path
              d={PATH}
              fill="none"
              stroke="#ffffff"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </mask>
        </defs>

        <path
          d={PATH}
          fill="none"
          stroke="url(#hz-line)"
          strokeWidth={1.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* One pass of light along the line, then a long rest. Masked to the stroke so
            it brightens the line rather than washing the field. */}
        <g mask="url(#hz-mask)">
          <rect
            className="horizon-sweep"
            x={-380}
            y={0}
            width={380}
            height={H}
            fill="url(#hz-glow)"
          />
        </g>

        {/* The single accent, where the line begins. Frost rather than indigo: on the
            deep ground #6771B5 has too little separation from the field to punctuate.
            Orange is reserved for dose semantics and quotations of the mark's petals,
            and this is neither. See ART_STRATEGY.md section 4. */}
        <line
          x1={ACCENT_X}
          y1={BASE + DRIFT[ACCENT_I] - 5.5}
          x2={ACCENT_X}
          y2={BASE + DRIFT[ACCENT_I] + 5.5}
          stroke="#95daf8"
          strokeWidth={1.4}
          strokeOpacity={0.75}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
