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
  /**
   * Lay this oval on rather than multiplying it in. Exactly one does - the
   * gold - and see the note on it for why.
   */
  onTop?: boolean;
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
  /* Back to the mark's green. This one carried the accent for a while, and at
     560x380 it was the wrong petal for it: the note was that the gold read as a
     faded version of the brand colour on one of the big shapes. It was faded,
     necessarily - at 0.42, because orange at the 0.85 the light surfaces run
     stopped being a wash and became a tint over the whole upper left. The fix
     is not a stronger wash on a big petal. It is the exact colour on a small
     one, which is the last entry. */
  { color: "#AFDBBC", alpha: 0.85, cx: 300, cy: 170, rx: 560, ry: 380, rot: -18, ex: -60, ey: -40, delay: 0, dx: 30, dy: 18, dr: 1.6, ds: 1.035, dur: 34 },
  { color: "#95DAF8", alpha: 0.8, cx: 1090, cy: 240, rx: 640, ry: 410, rot: 14, ex: 70, ey: -30, delay: 0.12, dx: -34, dy: 22, dr: -1.8, ds: 0.98, dur: 44 },
  { color: "#AADBF6", alpha: 0.85, cx: 760, cy: 820, rx: 560, ry: 380, rot: -9, ex: 0, ey: 70, delay: 0.24, dx: 26, dy: -26, dr: 1.3, ds: 1.045, dur: 38 },
  { color: "#6771B5", alpha: 0.3, cx: 1280, cy: 780, rx: 470, ry: 320, rot: 26, ex: 60, ey: 40, delay: 0.36, dx: -22, dy: -18, dr: -2.2, ds: 1.025, dur: 48 },
  /* THE GOLD PETAL, AND IT IS THE EXACT COLOUR. The smallest oval in the set at
     430x300, and the only one that is neither multiplied nor translucent: an
     eyedropper anywhere inside it returns #F9A81A.
     
     BOTH OF THOSE ARE REQUIRED, and for the same reason. Multiply would mix it
     with whatever it crosses, and the pale azure petal runs straight through
     this corner - gold multiplied into that lands near rgb(166,144,25), a dark
     mustard, which is the dingy yellow this page has already been told twice it
     must never show. Alpha below 1 would mix it with the white underneath and
     make it the pale sand the note was about. Laid on at full strength it can
     only ever be the brand colour.
     
     AND IT IS ACTUALLY SMALL, which the others are not. Every oval here is sized
     for a viewBox that gets scaled up to cover the section, so the "smallest" of
     them at 430x300 still rendered 1154px across - a solid orange wall down the
     left of the page rather than a petal. At 220x152 it comes out near 500px:
     large enough to be a shape in the composition, small enough to be an accent
     in it.

     Last in the list so nothing draws over it, and set low left, below where the
     copy column ends. That matters more than usual now that it is opaque: body
     grey clears 4.7:1 on this colour and the ink headline 6.8:1, but the small
     blue eyebrow only manages 3.2:1, so no text sits on it at all. Screenprint
     edge and no blur, same as the rest. */
  { color: "#F9A81A", alpha: 1, onTop: true, cx: 158, cy: 812, rx: 220, ry: 152, rot: 32, ex: -50, ey: 40, delay: 0.3, dx: 20, dy: -20, dr: 1.8, ds: 0.975, dur: 52 },
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
                style={{ mixBlendMode: o.onTop ? "normal" : "multiply" }}
              />
            </g>
          </g>
        ))}

      </svg>
    </div>
  );
}
