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
 * So this is the mark at architectural scale. Four ovals in the spec-sheet
 * colours sweep corner to corner across the hero, multiply-blended, so
 * wherever two of them cross a deeper pool of colour appears that neither
 * had alone — which is the contact page's whole subject: where two parties
 * overlap, something new exists. A first cut dressed the colour with dashed
 * hairline orbits and a landed orange dose; the note back was that they
 * read as clutter and a stray dot, so the ovals now carry the piece alone.
 *
 * THE ORANGE IS NEGATIVE SPACE, WHICH IS WHAT IT IS IN THE LOGO. Open
 * cinpressa-mark.svg and there is exactly one warm shape in it, class cls-13:
 * not a petal, but the wedge left over between the green petal, the blue one
 * and the cyan one. It is the only colour in the mark that nothing draws — it
 * exists because of where the other shapes are not. Painting it here as its own
 * oval was the mistake, twice over: first as a faded wash on a big petal, then
 * as the exact colour on a small one. Both were still a shape. See NEGATIVE
 * below for how it is cut rather than drawn.
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
  { color: "#AFDBBC", alpha: 0.85, cx: 300, cy: 170, rx: 560, ry: 380, rot: -18, ex: -60, ey: -40, delay: 0, dx: 30, dy: 18, dr: 1.6, ds: 1.035, dur: 34 },
  { color: "#95DAF8", alpha: 0.8, cx: 1090, cy: 240, rx: 640, ry: 410, rot: 14, ex: 70, ey: -30, delay: 0.12, dx: -34, dy: 22, dr: -1.8, ds: 0.98, dur: 44 },
  { color: "#AADBF6", alpha: 0.85, cx: 760, cy: 820, rx: 560, ry: 380, rot: -9, ex: 0, ey: 70, delay: 0.24, dx: 26, dy: -26, dr: 1.3, ds: 1.045, dur: 38 },
  { color: "#6771B5", alpha: 0.3, cx: 1280, cy: 780, rx: 470, ry: 320, rot: 26, ex: 60, ey: 40, delay: 0.36, dx: -22, dy: -18, dr: -2.2, ds: 1.025, dur: 48 },
];

/**
 * THE NEGATIVE SPACE, AND HOW IT IS CUT.
 *
 * IT HAS TO CLAIM THE WHOLE GAP, WHICH IS WHAT THE LAST CUT GOT WRONG. The
 * allowance was sized to sit comfortably inside the open ground, so the petals
 * barely grazed it and what survived the mask was very nearly the allowance
 * itself: an oval. Correct machinery, wrong shape - it read as another sphere,
 * which is exactly the thing this replaces.
 *
 * The gap was then measured rather than guessed, by sampling the petals' own
 * implicit equations on a grid across the lower left. It is open from the left
 * edge to x=360 at y=580, narrowing to x=200 by y=740 and holding that width
 * down to the bottom edge - a wedge with the green petal closing it from above
 * and the pale blue one from the right.
 *
 * So the allowance now overruns that gap on every side: past the petals where
 * they cut it, and past the canvas where they do not. Nothing of its own
 * outline survives. Every edge of the orange is either a petal's curve or the
 * frame, which is the definition of the shape being left over rather than
 * drawn.
 *
 * There is a gap in the lower left where the green petal's underside and the
 * pale blue petal's left flank fall away from each other and neither covers the
 * ground. That gap is this composition's version of the wedge in the logo, and
 * this is the shape that claims it.
 *
 * It is an ALLOWANCE, not a petal. Nothing here is drawn at its own outline:
 * the orange is a flat fill of the whole canvas shown only through a mask, and
 * this oval is the white in that mask - the region we are willing to let orange
 * appear in at all. Every petal is then punched back out of it in black. What
 * survives is the part of this oval that no petal covers: a wedge bounded by
 * the green above, by the pale blue to its right, and by its own curve
 * elsewhere. Cut, not drawn, which is how the logo builds it.
 *
 * It has to OVERRUN the petals, and that is the whole trick. An allowance
 * sitting inside the gap survives whole and paints an oval, which is the thing
 * this replaces. Overrunning, the petals do all the cutting and the shape ends
 * up with curved edges it never declares.
 *
 * And it moves, because they do. The mask carries its own copies of all four on
 * the same entrance and the same drift, so the wedge stays in register as they
 * breathe - opening and closing a little on their own periods rather than
 * sliding out from under them.
 *
 * The numbers are the gap's own geometry rather than a guess. Sampling the two
 * petals' implicit equations, the ground is open from about (300,600) down to
 * (60,820), so the allowance is centred on that run and leaned -38 degrees to
 * lie along it. It is also held clear of the left edge on purpose: the viewBox
 * is sliced to cover, so a narrow window crops the first thirty or so units of
 * it, and a wedge that reaches the crop stops being a shape and becomes a
 * blob running off the side.
 *
 * And clear of the copy. It sat 70 units higher for a cut, where its point ran
 * up through "Parent company" and left that block half on orange and half off -
 * legible at 4.7:1, but a line of type straddling a colour boundary reads as a
 * collision whatever the contrast says. Dropped below the last line of the
 * column, the wedge has the lower left to itself.
 */
const NEGATIVE = { cx: 120, cy: 800, rx: 330, ry: 300, rot: 0 };

/** One ellipse inside its two animation groups. Used for the visible petals,
 *  and again in flat black for the mask that cuts the negative space. */
function Petal({
  o,
  fill,
  alpha,
  blend,
}: {
  o: Oval;
  fill: string;
  alpha: number;
  blend?: "multiply";
}) {
  return (
    <g
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
          fill={fill}
          fillOpacity={alpha}
          style={blend ? { mixBlendMode: blend } : undefined}
        />
      </g>
    </g>
  );
}

export function ContactBloom({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          {/* White is kept, black is cut. The allowance first, then every petal
              punched out of it at full black whatever its own alpha - the
              orange belongs to the bare ground, so anywhere a petal reaches at
              all is somewhere the orange is not. */}
          <mask
            id="cb-negative"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1440"
            height="900"
          >
            <ellipse
              cx={NEGATIVE.cx}
              cy={NEGATIVE.cy}
              rx={NEGATIVE.rx}
              ry={NEGATIVE.ry}
              transform={`rotate(${NEGATIVE.rot} ${NEGATIVE.cx} ${NEGATIVE.cy})`}
              fill="#ffffff"
            />
            {OVALS.map((o) => (
              <Petal key={`${o.color}-mask`} o={o} fill="#000000" alpha={1} />
            ))}
          </mask>
        </defs>

        {OVALS.map((o) => (
          <Petal
            key={o.color}
            o={o}
            fill={o.color}
            alpha={o.alpha}
            blend="multiply"
          />
        ))}

        {/* THE EXACT COLOUR, because nothing is mixed into it. A flat fill of
            the brand orange shown only where the mask lets it through, which by
            construction is only ever bare ground. No multiply and no alpha: an
            eyedropper anywhere in the wedge returns #F9A81A. */}
        <rect
          x="0"
          y="0"
          width="1440"
          height="900"
          fill="#F9A81A"
          mask="url(#cb-negative)"
        />
      </svg>
    </div>
  );
}
