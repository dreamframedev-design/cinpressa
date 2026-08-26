import type { CSSProperties } from "react";

/**
 * Pipeline bloom — the mark's ovals, cropped to a band.
 *
 * WHY IT IS BACK, AND WHY IT IS DIFFERENT. A colour field lived in this section
 * once and was removed because it read as a blob: three ellipses parked in the
 * bottom-right corner with no relationship to anything on the page, tuned and
 * re-tuned and never fixed, because the problem was placement rather than
 * colour. Taking it out left the section honest but bare, and a near-white wash
 * with type on it is exactly the "washed out" note this brand has been given
 * before. Colour belongs here. It just has to be composed.
 *
 * The language is the contact page's, which is the one sanctioned source of
 * bold colour on this site: the mark's own ovals at architectural scale, in
 * spec-sheet colours, composited with MULTIPLY so that wherever two cross, a
 * deeper pool appears that neither had alone. Screenprint edges — no blur, no
 * gradients. The boldness is in the ink.
 *
 * WHAT MAKES THIS ONE WORK. Two rules the corner blob broke:
 *
 *   1. EVERY CENTRE SITS OUTSIDE THE FRAME. Only the arcs come in, so the
 *      composition reads as a crop of something much larger rather than a set
 *      of shapes placed in a box. Nothing has a findable middle.
 *   2. THE MIDDLE IS LEFT ALONE. The section is a two-column spread with ink
 *      text across nearly its whole width, so the mass is thrown to the top and
 *      bottom edges and the horizontal band the copy occupies keeps only the
 *      faint tails. The colour frames the argument instead of sitting under it.
 *
 * The two saturated ovals stay at very low alpha: their job is to deepen the
 * pale ones where they cross, not to be seen as blue and indigo shapes.
 *
 * Motion and entrance are the contact bloom's, shared rather than duplicated
 * (see .cb-enter / .cb-drift). Periods are 36–54s and no two are equal, so the
 * pools deepen and thin without the composition repeating or hurrying.
 *
 * Pure SVG + CSS: server-rendered, and a full still composition under reduced
 * motion and without JavaScript.
 */

type Oval = {
  color: string;
  alpha: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  /** Entrance offset. */
  ex: number;
  ey: number;
  delay: number;
  /** Drift vector, lean, flex, period. */
  dx: number;
  dy: number;
  dr: number;
  ds: number;
  dur: number;
};

/**
 * Read the cy values against the 620-tall viewBox: -60, -30, 760, 720, 730.
 * Every one is past an edge. The band from roughly y 190 to y 430, which is
 * where both columns of copy live, is reached only by the ovals' thinning
 * ends.
 */
const OVALS: Oval[] = [
  { color: "#AFDBBC", alpha: 0.62, cx: -120, cy: -60, rx: 640, ry: 350, rot: -12, ex: -40, ey: -26, delay: 0, dx: 26, dy: 16, dr: 1.4, ds: 1.03, dur: 38 },
  { color: "#95DAF8", alpha: 0.56, cx: 1570, cy: -30, rx: 660, ry: 370, rot: 10, ex: 44, ey: -20, delay: 0.1, dx: -28, dy: 18, dr: -1.6, ds: 0.98, dur: 46 },
  { color: "#AADBF6", alpha: 0.52, cx: 700, cy: 760, rx: 780, ry: 330, rot: -5, ex: 0, ey: 40, delay: 0.2, dx: 22, dy: -22, dr: 1.1, ds: 1.04, dur: 36 },
  { color: "#6771B5", alpha: 0.16, cx: 1430, cy: 720, rx: 520, ry: 300, rot: 22, ex: 36, ey: 26, delay: 0.28, dx: -18, dy: -16, dr: -2, ds: 1.02, dur: 54 },
  { color: "#2261AD", alpha: 0.12, cx: 30, cy: 730, rx: 470, ry: 290, rot: 28, ex: -32, ey: 26, delay: 0.24, dx: 18, dy: -18, dr: 1.7, ds: 0.975, dur: 50 },
];

export function PipelineBloom({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      /* Feathered top and bottom. Without it the ovals stop dead on the section
         boundary and the field reads as a coloured box butted against a white
         one — the one thing every piece of colour on this site is built to
         avoid. It dissolves into its neighbours instead. */
      className={`pipeline-bloom pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 1440 620"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {OVALS.map((o) => (
          <g
            key={o.color}
            className="cb-enter"
            style={
              {
                "--ex": `${o.ex}px`,
                "--ey": `${o.ey}px`,
                "--d": `${o.delay}s`,
              } as CSSProperties
            }
          >
            <g
              className="cb-drift"
              style={
                {
                  "--dx": `${o.dx}px`,
                  "--dy": `${o.dy}px`,
                  "--dr": `${o.dr}deg`,
                  "--ds": o.ds,
                  "--dur": `${o.dur}s`,
                } as CSSProperties
              }
            >
              <ellipse
                cx={o.cx}
                cy={o.cy}
                rx={o.rx}
                ry={o.ry}
                transform={`rotate(${o.rot} ${o.cx} ${o.cy})`}
                fill={o.color}
                fillOpacity={o.alpha}
                style={{ mixBlendMode: "multiply" }}
              />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
