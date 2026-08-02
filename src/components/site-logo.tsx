import { MarkArt } from "@/components/geometry";

/**
 * The CinPressa lockup, rebuilt from the real mark artwork plus live text.
 *
 * The supplied logo is a 768x160 PNG with "pharma" baked in as ~6px of light
 * grey, which is illegible at nav size and cannot be recoloured. Rebuilding it
 * gives us three things the raster could not: "pharma" in ink instead of grey,
 * crisp edges at any size or DPI, and a mark that can animate.
 *
 * CAVEAT: the wordmark is set in Montserrat, the site's Gotham stand-in, not
 * the typeface in the original PNG. At nav size the difference is very hard to
 * see, but the correct long-term fix is the vector logo file from the brand
 * package. Proportions and tracking here are measured off the PNG.
 *
 * Everything scales from a single font-size, so `height` drives the lockup.
 */
export function SiteLogo({
  height = 34,
  className = "",
  animate = false,
}: {
  /** Lockup height in pixels. */
  height?: number;
  className?: string;
  /** Drift the petals. Reserve for large, foreground placements. */
  animate?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-[0.34em] ${className}`}
      style={{ fontSize: `${height}px` }}
    >
      <MarkArt
        variant="brand"
        animate={animate}
        className="h-[0.86em] w-auto shrink-0"
      />
      <span className="flex flex-col items-end leading-none">
        <span className="text-[0.5em] font-light uppercase leading-none tracking-[0.19em] text-sky [margin-right:-0.19em]">
          CinPressa
        </span>
        {/* Held above the PNG's original ratio on purpose: at the source
            proportion this renders around 6px and is unreadable, which is the
            problem we were asked to fix. */}
        <span className="mt-[0.3em] text-[0.215em] font-semibold leading-none tracking-[0.26em] text-ink [margin-right:-0.26em]">
          pharma
        </span>
      </span>
    </span>
  );
}
