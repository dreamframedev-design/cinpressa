import { useId } from "react";
import type { CSSProperties } from "react";

/**
 * The actual CinPressa mark, its 13 overlapping petals, used as background
 * art. Rendered as a flat monochrome silhouette ("solid"), hairline line-art
 * ("outline"), or in the mark's own petal colours ("brand"), so it reads as an
 * oversized watermark of the real logo rather than an invented decoration.
 *
 * Meant to be sized large and cropped off an edge via className so each
 * placement shows a different slice of the mark. Always decorative:
 * aria-hidden and non-interactive.
 */

export const MARK_PATHS = [
  "M196.84,104.36c-20.54-24.74-48.24-36.45-69.31-28.02-7.21-10.94-16.09-19.63-25.42-25.46,3.57-3.63,7.49-7.11,11.73-10.38,34.18-26.41,76.18-29.33,93.8-6.51,13.81,17.88,8.57,46.23-10.79,70.38Z",
  "M127.53,76.34c-1.4.55-2.78,1.21-4.12,1.95-8.92,4.93-15.19,13.26-18.71,23.65-9.21,2.23-18.72,6.17-27.84,11.85-3.63-19.17,5.83-43.23,25.24-62.91,9.33,5.84,18.21,14.52,25.42,25.46Z",
  "M76.87,113.79c-.71.44-1.42.89-2.13,1.35-6.46,4.23-12.2,9.02-17.14,14.13-.89-1.38-1.76-2.79-2.59-4.24-18.06-31.29-15.78-66.43,5.11-78.49,12-6.93,27.53-4.73,41.99,4.34-19.41,19.68-28.87,43.75-25.24,62.91Z",
  "M103.37,142.68c-7.91-2.42-14.64-6.76-19.51-13.06-3.6-4.65-5.9-10.02-7-15.83,9.12-5.68,18.62-9.62,27.84-11.85-3.94,11.63-4.44,25.84-1.33,40.74Z",
  "M110.14,163.92c-17.84.19-38.48-12.9-52.54-34.65,4.93-5.11,10.68-9.9,17.14-14.13.71-.46,1.42-.92,2.13-1.35,1.1,5.81,3.4,11.18,7,15.83,4.87,6.3,11.6,10.64,19.51,13.06,1.46,6.99,3.71,14.14,6.77,21.24Z",
  "M126.12,190.78c-.41.28-.83.56-1.25.83-31.64,20.74-68.5,20.43-82.35-.68-11.02-16.8-4.13-41.72,15.08-61.65,14.06,21.74,34.7,34.84,52.54,34.65,1.54,3.59,3.29,7.15,5.25,10.69,3.23,5.83,6.84,11.24,10.73,16.16Z",
  "M139.73,102.64c-9.92-3.56-22.2-3.8-35.02-.7,3.52-10.39,9.8-18.72,18.71-23.65,1.34-.74,2.72-1.39,4.12-1.95,1.08,1.63,2.11,3.3,3.11,5.03,4.04,7,7.07,14.19,9.09,21.28Z",
  "M196.84,104.36c-5.35,6.68-11.77,13.03-19.18,18.75-4.98,3.85-10.13,7.2-15.34,10.03-.17-6.28-1.87-12.18-5.24-17.32-4.05-6.18-10.07-10.58-17.36-13.18-2.02-7.08-5.05-14.28-9.09-21.28-1-1.73-2.03-3.4-3.11-5.03,21.08-8.43,48.78,3.28,69.31,28.02Z",
  "M139.74,142.26c4.09-11.01,4.15-25.08-.01-39.62,7.29,2.61,13.31,7,17.36,13.18,3.37,5.14,5.07,11.04,5.24,17.32-7.49,4.09-15.12,7.14-22.59,9.11Z",
  "M139.74,142.26c-13.15,3.48-25.81,3.66-36.37.42-3.11-14.9-2.61-29.11,1.33-40.74,12.83-3.1,25.1-2.86,35.02.7,4.16,14.54,4.1,28.61.01,39.62Z",
  "M139.74,142.26c-2.83,7.61-7.58,13.77-14.2,17.59-4.68,2.7-9.91,4.02-15.39,4.07-3.06-7.1-5.31-14.25-6.77-21.24,10.55,3.24,23.21,3.06,36.37-.42Z",
  "M126.12,190.78c-3.89-4.93-7.5-10.33-10.73-16.16-1.96-3.54-3.71-7.11-5.25-10.69,5.49-.05,10.71-1.37,15.39-4.07,6.62-3.82,11.38-9.98,14.2-17.59,7.47-1.98,15.1-5.02,22.59-9.11.55,19.19-13.04,41.96-36.21,57.63Z",
  "M201.27,218.99c-22.03,12.2-53.12-.32-75.15-28.21,23.17-15.67,36.76-38.44,36.21-57.63,5.21-2.83,10.36-6.19,15.34-10.03,7.4-5.72,13.83-12.08,19.18-18.75,4.55,5.49,8.76,11.61,12.45,18.29,21.5,38.86,17.91,81.98-8.03,96.33Z",
];

/** Per-petal fills, in the same order as MARK_PATHS, taken from the logo file. */
export const MARK_PETALS = [
  "#b0dbbc",
  "#faa81a",
  "#2162ae",
  "#97dbf8",
  "#1884c6",
  "#bed9ef",
  "#1b96d3",
  "#6bb2e2",
  "#abddf7",
  "#1dade4",
  "#0374bb",
  "#7ca9db",
  "#6772b6",
];

/**
 * The four parent ovals the thirteen fragments were flattened from, recovered
 * by least-squares conic fits to the fragment boundary arcs (every boundary
 * arc in the artwork lies on one of these to within a quarter unit). Drawn as
 * arc-pair paths so CSS animation transforms never fight a transform
 * attribute. Geometry (centre, semi-axes, tilt) is included for hit-testing.
 */
export const MARK_OVALS = [
  {
    name: "blue",
    fill: "#2162ae",
    cx: 92.73,
    cy: 103.11,
    rx: 65.31,
    ry: 43.63,
    angle: 60.08,
    path: "M125.307 159.722A65.312 43.628 60.082 1 1 60.157 46.506A65.312 43.628 60.082 1 1 125.307 159.722Z",
  },
  {
    name: "green",
    fill: "#b0dbbc",
    cx: 145.74,
    cy: 81.82,
    rx: 78.24,
    ry: 52.21,
    angle: -37.71,
    path: "M207.643 33.972A78.236 52.213 -37.705 1 1 83.847 129.671A78.236 52.213 -37.705 1 1 207.643 33.972Z",
  },
  {
    name: "pale",
    fill: "#bed9ef",
    cx: 99.83,
    cy: 153.35,
    rx: 68.54,
    ry: 45.73,
    angle: -33.25,
    path: "M157.149 115.772A68.541 45.73 -33.252 1 1 42.513 190.937A68.541 45.73 -33.252 1 1 157.149 115.772Z",
  },
  {
    name: "indigo",
    fill: "#6772b6",
    cx: 162.33,
    cy: 148.62,
    rx: 80.44,
    ry: 53.68,
    angle: 61.03,
    path: "M201.291 218.996A80.443 53.675 61.029 1 1 123.363 78.243A80.443 53.675 61.029 1 1 201.291 218.996Z",
  },
] as const;

export function MarkArt({
  className = "",
  variant = "outline",
  color = "#2261AD",
  animate = false,
  tight = false,
  light = false,
}: {
  className?: string;
  variant?: "outline" | "solid" | "brand";
  color?: string;
  /**
   * Suspend the mark: float, a degree or two of drift, a faint breath. Applied
   * to the whole SVG, never to individual paths.
   *
   * MARK_PATHS are NOT thirteen shapes. They are the boolean fragments left
   * behind when four overlapping ovals were flattened, so each oval is split
   * across several paths and several paths are shared between ovals. Moving
   * them individually tears the ovals into shards. Animating the four ovals as
   * ovals needs the layered source file, not this flattened artwork.
   */
  animate?: boolean;
  /**
   * Crop the viewBox to the artwork. The supplied file's box is 258.82x242.26
   * but the mark only occupies 186.08x205.04 at an offset of (37.26, 18.61),
   * so the default box is mostly padding. Sizing that padding is what made the
   * lockup's mark render small and sit too far from the wordmark.
   */
  tight?: boolean;
  /**
   * Light making its rounds: a soft sheen pans along each parent oval's major
   * axis in turn, clockwise around the mark, one pass every 28 seconds. The
   * band is clipped to the oval (MARK_OVALS geometry) and composited with
   * soft-light, so it reads as light falling across an arm: pure luminance,
   * the brand hues untouched. For large background placements of the brand
   * variant; the whole rig disappears under reduced motion.
   */
  light?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  /* Clockwise around the mark: blue (top-left), green (top-right),
     indigo (bottom-right), pale (bottom-left). Order matches MARK_OVALS. */
  const LIGHT_DELAYS = [0, 7, 21, 14];
  return (
    <svg
      viewBox={tight ? "37.26 18.61 186.08 205.04" : "0 0 258.82 242.26"}
      fill="none"
      aria-hidden
      className={`${animate ? "mark-suspend " : ""}${className}`}
    >
      {MARK_PATHS.map((d, i) => {
        if (variant === "brand") {
          return <path key={i} d={d} fill={MARK_PETALS[i]} />;
        }
        if (variant === "solid") {
          return <path key={i} d={d} fill={color} />;
        }
        return (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {light && variant === "brand" ? (
        <>
          <defs>
            <linearGradient id={`ml-g${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            {MARK_OVALS.map((o, i) => (
              <clipPath key={o.name} id={`ml-c${uid}${i}`}>
                <path d={o.path} />
              </clipPath>
            ))}
          </defs>
          {MARK_OVALS.map((o, i) => (
            <g key={o.name} clipPath={`url(#ml-c${uid}${i})`}>
              <g transform={`translate(${o.cx} ${o.cy}) rotate(${o.angle})`}>
                <rect
                  className="mark-light-band"
                  x={-55}
                  y={-(o.ry + 24)}
                  width={110}
                  height={2 * o.ry + 48}
                  fill={`url(#ml-g${uid})`}
                  style={
                    {
                      "--from": `${-(o.rx + 75)}px`,
                      "--to": `${o.rx + 75}px`,
                      "--light-delay": `${LIGHT_DELAYS[i]}s`,
                    } as CSSProperties
                  }
                />
              </g>
            </g>
          ))}
        </>
      ) : null}
    </svg>
  );
}
