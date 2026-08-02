import { MarkArt } from "@/components/geometry";

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

export function SiteLogo({
  height = 34,
  className = "",
  animate = false,
  pharma = DEFAULT_PHARMA,
  tone = "dark",
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
}) {
  return (
    <span
      className={`inline-flex items-center gap-[0.175em] ${className}`}
      style={{ fontSize: `${height}px` }}
    >
      {/* tight crops the viewBox to the artwork; without it two thirds of the
          mark's width is empty padding. */}
      <MarkArt
        variant="brand"
        animate={animate}
        tight
        className="h-[0.95em] w-auto shrink-0"
      />
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
