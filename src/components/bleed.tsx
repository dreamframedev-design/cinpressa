/**
 * Bleed — layered colour washing across the page.
 *
 * The brief for this site named one reference: the wave on cinrx.com/about, "layered
 * blue tones, like watercolour bleeding across the page." Everything attempted before
 * this was thin strokes on white, which is why it kept reading as diagram rather than
 * as art. This is mass.
 *
 * Six bands cross the field, each a closed ribbon with its own vertical gradient,
 * every one composited with multiply. That is the whole trick and it is the same
 * operation the CinPressa mark performs on itself: where two translucent bands cross,
 * their colours combine into something deeper than either, so the darkest, richest
 * areas in the piece are ones nobody picked — they are produced by the overlaps. Pigment
 * on wet paper behaves exactly this way, which is why it reads as painted rather than
 * plotted.
 *
 * Depth comes from selective blur, the trick a camera does for free:
 *   BACK   heavy blur, far behind the focal plane
 *   MID    no blur at all — these are the sharp, in-focus bands
 *   FRONT  slight blur, foreground falling out of focus
 * Without it, six translucent shapes read as six stickers on one plane.
 *
 * Every band fades to zero alpha at both ends, so nothing has a cut edge — the colour
 * arrives and leaves rather than starting and stopping.
 *
 * The palette is the spec sheet at real strength: alphas of 0.4–0.55 rather than the
 * 0.07–0.14 the site's art has been sitting at. On white, with multiply, that builds
 * genuinely deep colour in the crossings while the open ground stays clean.
 *
 * Motion is a slow lateral drift, each band on its own long period (48–96s) so the
 * layers separate and re-gather and the composition never repeats exactly. Nothing
 * pulses, nothing rotates, nothing reacts to the cursor. Frozen entirely under
 * prefers-reduced-motion, where it stays a perfectly good still image.
 */

const W = 1600;
const H = 460;

type Band = {
  /** Vertical centre of the ribbon at the left edge, in viewBox units. */
  top: number;
  /** How the centre drifts by the right edge. */
  rise: number;
  /** Ribbon thickness. Varied deliberately — evenly weighted bands read as stripes. */
  weight: number;
  /** Swell amplitude and wavelength as fractions of the field. */
  amp: number;
  lambda: number;
  phase: number;
  color: string;
  alpha: number;
  layer: "back" | "mid" | "front";
  /** Seconds for one drift cycle. Coprime-ish so the stack never re-aligns. */
  drift: number;
  /** Drift distance in viewBox units. */
  travel: number;
};

/**
 * Composition notes, since the numbers do not say it: the two heaviest bands sit low,
 * the field opens out toward the top, and the green sits furthest back where it reads
 * as air rather than as a colour choice. The indigo is the lowest and the least
 * saturated — it anchors without competing.
 */
const BANDS: Band[] = [
  { top: 150, rise: -26, weight: 116, amp: 34, lambda: 0.82, phase: 0.0, color: "#afdbbc", alpha: 0.5, layer: "back", drift: 96, travel: 58 },
  { top: 196, rise: 34, weight: 148, amp: 41, lambda: 0.66, phase: 2.2, color: "#0473bb", alpha: 0.42, layer: "back", drift: 78, travel: -46 },
  { top: 232, rise: -18, weight: 84, amp: 29, lambda: 0.9, phase: 4.1, color: "#1596d4", alpha: 0.5, layer: "mid", drift: 66, travel: 38 },
  { top: 286, rise: 22, weight: 104, amp: 33, lambda: 0.72, phase: 1.3, color: "#1eaee5", alpha: 0.44, layer: "mid", drift: 57, travel: -32 },
  { top: 176, rise: -12, weight: 52, amp: 24, lambda: 1.05, phase: 5.4, color: "#95daf8", alpha: 0.55, layer: "front", drift: 84, travel: 44 },
  { top: 338, rise: 16, weight: 122, amp: 27, lambda: 0.78, phase: 3.0, color: "#6771b5", alpha: 0.38, layer: "front", drift: 72, travel: -26 },
];

const TAU = Math.PI * 2;

/** One edge of a ribbon, sampled across the field. Two sine terms of different
 *  wavelength keep the crest from reading as a single clean sine. */
function edge(b: Band, offset: number, steps = 64): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const x = -120 + f * (W + 240);
    const centre = b.top + b.rise * f;
    const swell =
      b.amp * Math.sin(TAU * (f / b.lambda) + b.phase) +
      b.amp * 0.34 * Math.sin(TAU * (f / (b.lambda * 0.41)) + b.phase * 1.7);
    pts.push(`${x.toFixed(1)},${(centre + swell + offset).toFixed(1)}`);
  }
  return pts.join(" L ");
}

function ribbon(b: Band): string {
  const top = edge(b, -b.weight / 2);
  const bottom = edge(b, b.weight / 2).split(" L ").reverse().join(" L ");
  return `M ${top} L ${bottom} Z`;
}

const BLUR = { back: 26, mid: 0, front: 8 } as const;

export function Bleed({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          {BANDS.map((b, i) => (
            /* Horizontal fade to nothing at both ends, so no band has a cut edge. */
            <linearGradient key={i} id={`bleed-g${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={b.color} stopOpacity={0} />
              <stop offset="18%" stopColor={b.color} stopOpacity={b.alpha * 0.85} />
              <stop offset="46%" stopColor={b.color} stopOpacity={b.alpha} />
              <stop offset="74%" stopColor={b.color} stopOpacity={b.alpha * 0.9} />
              <stop offset="100%" stopColor={b.color} stopOpacity={0} />
            </linearGradient>
          ))}
          <filter id="bleed-back" x="-25%" y="-45%" width="150%" height="190%">
            <feGaussianBlur stdDeviation={BLUR.back} />
          </filter>
          <filter id="bleed-front" x="-25%" y="-45%" width="150%" height="190%">
            <feGaussianBlur stdDeviation={BLUR.front} />
          </filter>
        </defs>

        {(["back", "mid", "front"] as const).map((layer) => {
          const inLayer = BANDS.map((b, i) => ({ b, i })).filter(
            ({ b }) => b.layer === layer,
          );
          if (inLayer.length === 0) return null;
          const filter =
            layer === "back"
              ? "url(#bleed-back)"
              : layer === "front"
                ? "url(#bleed-front)"
                : undefined;
          return (
            <g key={layer} filter={filter}>
              {inLayer.map(({ b, i }) => (
                <g
                  key={i}
                  className="bleed-drift"
                  style={
                    {
                      "--bleed-dur": `${b.drift}s`,
                      "--bleed-travel": `${b.travel}px`,
                    } as React.CSSProperties
                  }
                >
                  <path
                    d={ribbon(b)}
                    fill={`url(#bleed-g${i})`}
                    style={{ mixBlendMode: "multiply" }}
                  />
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
