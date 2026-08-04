import { MARK_OVALS } from "@/components/geometry";

/**
 * Four Lenses: the mark's own parent ovals, drawn enormously oversized as hairlines
 * behind the hero mark.
 *
 * What this replaces was four blurred radial blobs on slow breathing loops. They were
 * competently done, but a soft coloured blob behind a logo is the single most generic
 * move available in this medium, and it is exactly what the audience for this site reads
 * as produced rather than commissioned.
 *
 * The replacement is not invented geometry. The CinPressa mark is four overlapping
 * ovals that were flattened into thirteen boolean fragments before anyone here got the
 * file; MARK_OVALS holds those four parents, recovered numerically by least-squares
 * conic fits to the fragment boundary arcs. This draws them at 3.2x about their own
 * centroid, so the mark stops being a logo sitting on a wash and becomes the dense core
 * of a much larger optical system that runs off the edges of the hero.
 *
 * Where the giant ovals cross, they multiply. That is the same operation the artwork
 * itself performs - every interior colour in the real mark is produced optically by
 * overlap rather than authored - so the field generates its own deeper colours by the
 * brand's own logic instead of by a gradient someone picked.
 *
 * NO MOTION, deliberately. ConvergenceMark already performs a full assembly sequence in
 * this exact spot; wrapping it in more movement would be noise. A still field around a
 * moving core is a composition decision, and restraint is the craft here.
 *
 * One drafted hairline colour for all four outlines, with the fills carrying each
 * oval's own identity: the line unifies the system, the colour differentiates within it.
 */

/** How far past the mark the system extends. Also the component's inset multiplier. */
const SCALE = 3.2;

/** The arrangement's own centre, derived rather than eyeballed. Comes out at
 *  (125.16, 121.73), which is the same centroid globals.css pivots the convergence
 *  animation around. */
const CX = MARK_OVALS.reduce((s, o) => s + o.cx, 0) / MARK_OVALS.length;
const CY = MARK_OVALS.reduce((s, o) => s + o.cy, 0) / MARK_OVALS.length;

/** The mark's tight artwork box, matching MarkArt's `tight` crop. */
const TIGHT = { x: 37.26, y: 18.61, w: 186.08, h: 205.04 };
const TIGHT_CX = TIGHT.x + TIGHT.w / 2;
const TIGHT_CY = TIGHT.y + TIGHT.h / 2;

/**
 * The mark renders at 66% of the hero column's width. This component covers SCALE times
 * that column, so for the two coordinate systems to agree the viewBox side must be
 * TIGHT.w * SCALE / 0.66. Anything else and the ovals would not line up with the mark
 * they were lifted from.
 */
const MARK_FRACTION = 0.66;
const VIEW = (TIGHT.w * SCALE) / MARK_FRACTION;
const VIEW_BOX = [
  TIGHT_CX - VIEW / 2,
  TIGHT_CY - VIEW / 2,
  VIEW,
  VIEW,
]
  .map((n) => n.toFixed(2))
  .join(" ");

/** Fill weights, tuned per oval so the four read as equal presence. The spec sheet's
 *  green and pale are much lighter than its blue and indigo, so a single alpha across
 *  all four would make half the system disappear. */
const FILL_ALPHA: Record<string, number> = {
  blue: 0.11,
  green: 0.2,
  pale: 0.17,
  indigo: 0.13,
};

const LENSES = MARK_OVALS.map((o) => ({
  name: o.name,
  fill: o.fill,
  cx: CX + (o.cx - CX) * SCALE,
  cy: CY + (o.cy - CY) * SCALE,
  rx: o.rx * SCALE,
  ry: o.ry * SCALE,
  angle: o.angle,
}));

/**
 * At the large breakpoint the system comes out around 970px wide against a 460px mark
 * column, so roughly 250px of it overhangs on each side - and the left side is the copy
 * column. This is the same quiet-under-copy rule the hero strata use: the field goes to
 * nothing where text sits and runs at full strength where it does not. The resulting
 * asymmetry is wanted. A field that is dense on one side and open on the other reads as
 * composed; one that is even all the way round reads as a texture.
 */
const MASK =
  "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.26) 24%, rgba(0,0,0,0.64) 40%, black 56%, black 100%)";

export function FourLenses({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      <svg viewBox={VIEW_BOX} className="h-full w-full" fill="none">
        {LENSES.map((l) => (
          <ellipse
            key={l.name}
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            transform={`rotate(${l.angle} ${l.cx} ${l.cy})`}
            fill={l.fill}
            fillOpacity={FILL_ALPHA[l.name] ?? 0.12}
            stroke="#0473bb"
            strokeOpacity={0.3}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            style={{ mixBlendMode: "multiply" }}
          />
        ))}
      </svg>
    </div>
  );
}
