import type { CSSProperties } from "react";

/**
 * Pipeline bloom — the mark's ovals, cropped to a band.
 *
 * WHY IT IS BACK, AND WHY IT IS QUIET. A colour field lived in this section
 * once and was removed for reading as a blob. It came back as five overlapping
 * ovals filling the frame, and the note on that was fair too: too much, and the
 * handoff from the white section above it was abrupt. The feather could not
 * save it, because a mask that fades the first 14% is useless when the ovals
 * are already at full strength by 14%. The fix was never the mask.
 *
 * SO IT IS TWO OVALS THAT CROSS ONCE. The mark's whole behaviour is that where
 * two translucent forms overlap, a deeper colour appears that neither had
 * alone. Five ovals say that five times and the section stops being a section.
 * Two say it once, which is the minimum that can say it at all, and one pool is
 * the entire event.
 *
 * AND IT LIVES IN THE LOWER HALF. Both centres sit below the frame, so only
 * their upper arcs rise into it. The top third stays clean, which is what
 * actually blends this into the white section above — not a gradient over
 * colour, but no colour there to begin with. The copy band sits above the
 * swell; it dissolves again before the bottom edge so the section below starts
 * on its own ground. The colour is a swell inside the section rather than a
 * field laid across it.
 *
 * Alphas are roughly two thirds of the first attempt. Screenprint edges, no
 * blur, no gradients: the softness is in the placement, not in a haze.
 *
 * Motion and entrance are the contact bloom's, shared rather than duplicated
 * (see .cb-enter / .cb-drift), and slowed further here because two large forms
 * moving read as more motion than five small ones.
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
 * Both cy values are past the 620-tall frame, so only the upper arcs enter.
 * They cross low and slightly left of centre: one pool, well under the copy.
 */
const OVALS: Oval[] = [
  { color: "#AFDBBC", alpha: 0.4, cx: 250, cy: 715, rx: 760, ry: 300, rot: -7, ex: -30, ey: 30, delay: 0, dx: 20, dy: -14, dr: 1, ds: 1.025, dur: 52 },
  { color: "#95DAF8", alpha: 0.38, cx: 1190, cy: 675, rx: 720, ry: 285, rot: 8, ex: 34, ey: 26, delay: 0.14, dx: -18, dy: -12, dr: -1.2, ds: 0.985, dur: 62 },
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
