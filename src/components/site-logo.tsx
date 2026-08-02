import type { CSSProperties } from "react";
import { MARK_OVALS, MARK_PATHS, MARK_PETALS, MarkArt } from "@/components/geometry";

/**
 * The CinPressa lockup, rebuilt from the real mark artwork plus live text.
 *
 * The supplied logo is a 768x160 PNG with "pharma" baked in as ~6px of light
 * grey, which is illegible at nav size and cannot be recoloured. Rebuilding it
 * gives three things the raster could not: "pharma" in ink instead of grey,
 * crisp edges at any size or DPI, and a mark that can animate.
 *
 * CAVEAT: the wordmark is set in Montserrat, the site's Gotham stand-in, not
 * the typeface in the original PNG. Compare them side by side at /brand. The
 * correct long-term fix is the vector logo from the brand package.
 *
 * Everything scales from a single font-size, so `height` drives the lockup.
 */

/**
 * Treatments for the "pharma" line. Compare them all at /brand.
 *
 * Measured off the PNG: "pharma" is about 0.25 of the lockup height, with
 * near-normal tracking. The earlier guess of 0.172em with 0.3em tracking was
 * simply wrong, which is why it read as spaced-out and tiny. At the correct
 * proportion it clears 11px in the nav, so faithful is also legible.
 */
/**
 * Sizes for the "pharma" line, in Stem.
 *
 * WEIGHT: only Stem Extra Light (200) is licensed into the repo, so every
 * option below renders at 200. Adding real weight needs the Stem Light or
 * Regular woff2 dropped into src/fonts; a browser-synthesised bold on a logo
 * looks wrong and is not worth it.
 */
export const PHARMA_STYLES = {
  /** Exact PNG width: 136px at a 768px lockup. */
  faithful: "text-[0.2352em] tracking-[0em]",
  /** A shade larger, for legibility at nav size. */
  larger: "text-[0.26em] tracking-[0em]",
  /** Largest before it starts competing with the wordmark. */
  largest: "text-[0.285em] tracking-[0em]",
} as const;

export type PharmaStyle = keyof typeof PHARMA_STYLES;

/** Change this one word to reskin every lockup on the site. */
export const DEFAULT_PHARMA: PharmaStyle = "faithful";

/** Tight crop shared with MarkArt: the artwork without the file's padding. */
const NAV_VIEW_BOX = "37.26 18.61 186.08 205.04";

/**
 * Fly-in offsets (the last few units of the hero convergence) and hover splay
 * offsets, both along each oval's radial bearing. Order matches MARK_OVALS.
 */
const NAV_MOVES = [
  { fx: "-11.3px", fy: "-6.5px", fr: "-12deg", delay: "0.55s", sx: "-5.6px", sy: "-3.2px", sr: "-4deg" },
  { fx: "6px", fy: "-11.5px", fr: "10deg", delay: "0.62s", sx: "3px", sy: "-5.8px", sr: "3.5deg" },
  { fx: "-8.1px", fy: "10.2px", fr: "9deg", delay: "0.69s", sx: "-4.1px", sy: "5.1px", sr: "3.5deg" },
  { fx: "10.5px", fy: "7.6px", fr: "-10deg", delay: "0.76s", sx: "5.3px", sy: "3.8px", sr: "-4deg" },
];

/**
 * The lockup mark as a miniature of the hero convergence: the four recovered
 * parent ovals slide into place under the authored artwork on load, and splay
 * apart, de-ignited, while the lockup is hovered. Pure CSS (see "Nav lockup
 * mark" in globals.css), so this stays a server component.
 */
function NavMark({ className = "" }: { className?: string }) {
  return (
    <span className={`nvm relative inline-flex shrink-0 ${className}`}>
      <svg
        viewBox={NAV_VIEW_BOX}
        aria-hidden
        className="block h-full w-auto overflow-visible"
        style={{ isolation: "isolate" }}
      >
        {MARK_OVALS.map((o, i) => (
          <g
            key={o.name}
            className="nvm-fly"
            style={
              {
                "--fx": NAV_MOVES[i].fx,
                "--fy": NAV_MOVES[i].fy,
                "--fr": NAV_MOVES[i].fr,
                "--nvm-delay": NAV_MOVES[i].delay,
              } as CSSProperties
            }
          >
            <g
              className="nvm-splay"
              style={
                {
                  "--sx": NAV_MOVES[i].sx,
                  "--sy": NAV_MOVES[i].sy,
                  "--sr": NAV_MOVES[i].sr,
                } as CSSProperties
              }
            >
              <path d={o.path} fill={o.fill} className="nvm-ink" />
            </g>
          </g>
        ))}
      </svg>
      <span className="nvm-art-layer pointer-events-none absolute inset-0">
        <svg viewBox={NAV_VIEW_BOX} aria-hidden className="nvm-art h-full w-full">
          {MARK_PATHS.map((d, i) => (
            <path key={i} d={d} fill={MARK_PETALS[i]} />
          ))}
        </svg>
      </span>
    </span>
  );
}

export function SiteLogo({
  height = 34,
  className = "",
  animate = false,
  pharma = DEFAULT_PHARMA,
  tone = "dark",
  mark = "static",
}: {
  /** Lockup height in pixels. */
  height?: number;
  className?: string;
  /** Suspend the mark. Reserve for large, foreground placements. */
  animate?: boolean;
  pharma?: PharmaStyle;
  /**
   * "dark" sets the pharma line in ink, for light surfaces. "light" reverses
   * it to white for dark surfaces — the wordmark itself stays sky, which
   * clears 6.2:1 on the deep navy and keeps the brand colour.
   */
  tone?: "dark" | "light";
  /**
   * "live" renders the mark as the four recovered ovals: a quick assemble on
   * mount and a splay-open while the lockup is hovered. Reserve for the nav;
   * "static" keeps the plain artwork everywhere else.
   */
  mark?: "static" | "live";
}) {
  return (
    <span
      className={`inline-flex items-center gap-[0.175em] ${
        mark === "live" ? "logo-hover-scope" : ""
      } ${className}`}
      style={{ fontSize: `${height}px` }}
    >
      {/* tight crops the viewBox to the artwork; without it two thirds of the
          mark's width is empty padding. */}
      {mark === "live" ? (
        <NavMark className="h-[0.95em]" />
      ) : (
        <MarkArt
          variant="brand"
          animate={animate}
          tight
          className="h-[0.95em] w-auto shrink-0"
        />
      )}
      {/* Stem Extra Light on the whole wordmark, both lines. Sizes and tracking
          are measured against the PNG, not guessed. */}
      <span
        className="flex flex-col items-end leading-none"
        style={{ fontFamily: "var(--font-stem)", fontWeight: 200 }}
      >
        <span className="text-[0.741em] uppercase leading-none tracking-[-0.0526em] text-sky">
          CinPressa
        </span>
        <span
          className={`mt-[0.23em] leading-none ${
            tone === "light" ? "text-white" : "text-ink"
          } ${PHARMA_STYLES[pharma]}`}
        >
          pharma
        </span>
      </span>
    </span>
  );
}
