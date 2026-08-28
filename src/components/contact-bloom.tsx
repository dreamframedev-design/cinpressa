import type { CSSProperties } from "react";

/**
 * Contact bloom — the mark, opened up to let you in.
 *
 * WHAT THIS REPLACES. Two hairline fields in a row died on this page: the
 * ruled wave surface said nothing about the science, and the duplex that
 * followed it was so restrained it read as a blank page. The note that
 * killed it asked for the opposite pole of the brand: bold colour,
 * artistic, unmissable. The site has exactly one sanctioned source of bold
 * colour — the mark itself, four translucent ovals whose OVERLAPS create
 * every interior colour in the logo.
 *
 * So this is the mark at architectural scale. Five ovals in the spec-sheet
 * colours sweep corner to corner across the hero, multiply-blended, so
 * wherever two of them cross a deeper pool of colour appears that neither
 * had alone — which is the contact page's whole subject: where two parties
 * overlap, something new exists. A first cut dressed the colour with dashed
 * hairline orbits and a landed orange dose; the note back was that they
 * read as clutter and a stray dot, so the ovals now carry the piece alone.
 *
 * MOTION. Each oval enters on its own slow settle, then breathes on its own
 * cycle (32-52s, ease-in-out, alternate): a drift of a couple dozen pixels,
 * a degree or two of lean, and a gentle scale flex, no two periods shared,
 * so the overlap pools continuously deepen and thin without the composition
 * ever repeating or hurrying. Screenprint edges, no blur, no gradients: the
 * boldness is in the ink, not in glow. The glass form panel frosts
 * whatever passes beneath it, which is the luminance it was built for.
 *
 * Pure SVG + CSS: server-rendered, static under reduced motion and without
 * JavaScript, full composition either way.
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
  /** Drift vector, lean, flex and period. */
  dx: number;
  dy: number;
  dr: number;
  ds: number;
  dur: number;
};

/** The spec-sheet colours at architectural scale. Light surfaces carry the
 *  high alphas; blue and indigo stay translucent so the pools they make
 *  where they cross the light ovals read as depth, not as mud. Some flex
 *  outward and some inward (ds either side of 1), so neighbouring overlaps
 *  deepen and thin against each other rather than in unison. */
const OVALS: Oval[] = [
  /* THE GOLD PETAL. This oval was the mark's green; it carries the accent now,
     which is the one colour in the logo the page had none of. Alpha is half the
     others because orange is a far stronger hue than the pale green it
     replaced - at the same 0.85 it stopped being a wash and became a tint over
     the whole upper left. At 0.42 multiplied over white it lands near
     rgb(253,220,163), a warm sand that the ink headline still clears 9:1 on,
     and it deepens to amber wherever the azure ovals cross it. Geometry and
     motion are untouched. */
  { color: "#F9A81A", alpha: 0.42, cx: 300, cy: 170, rx: 560, ry: 380, rot: -18, ex: -60, ey: -40, delay: 0, dx: 30, dy: 18, dr: 1.6, ds: 1.035, dur: 34 },
  { color: "#95DAF8", alpha: 0.8, cx: 1090, cy: 240, rx: 640, ry: 410, rot: 14, ex: 70, ey: -30, delay: 0.12, dx: -34, dy: 22, dr: -1.8, ds: 0.98, dur: 44 },
  { color: "#AADBF6", alpha: 0.85, cx: 760, cy: 820, rx: 560, ry: 380, rot: -9, ex: 0, ey: 70, delay: 0.24, dx: 26, dy: -26, dr: 1.3, ds: 1.045, dur: 38 },
  { color: "#6771B5", alpha: 0.3, cx: 1280, cy: 780, rx: 470, ry: 320, rot: 26, ex: 60, ey: 40, delay: 0.36, dx: -22, dy: -18, dr: -2.2, ds: 1.025, dur: 48 },
  { color: "#2261AD", alpha: 0.2, cx: 120, cy: 720, rx: 430, ry: 300, rot: 32, ex: -50, ey: 40, delay: 0.3, dx: 20, dy: -20, dr: 1.8, ds: 0.975, dur: 52 },
];

export function ContactBloom({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 900"
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
