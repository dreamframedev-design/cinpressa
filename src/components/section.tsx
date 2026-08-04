import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  /** Vertical padding scale. */
  size?: "default" | "sm";
  /** Optional decorative geometry layer, clipped to the section. */
  art?: ReactNode;
  /**
   * Draw the brand hairline at this section's top edge. On by default: each section
   * owns its own leading seam, so adjacent sections produce exactly one rule per
   * boundary. Pass false where a section follows something that already resolves its
   * own bottom edge (a hero's white fade, for instance), since a rule there reads as
   * a stray line rather than a joint.
   */
  seam?: boolean;
};

type Tone = keyof typeof TONES;

/**
 * Section washes, drawn from the spec sheet's core colours.
 *
 * Deepened 2026-08-03 (ART_STRATEGY.md §2). These were previously mixed at roughly 6
 * to 10%, which put every end-stop above 96% luminance: #f5fbf7 is not perceptibly
 * different from white, so a long page read as a stack of white boxes and the site
 * as a whole read washed out. Each end-stop is now roughly double its old presence
 * and still sits far inside AA for body copy on top.
 *
 * Each is a vertical gradient rather than a flat fill so a long page reads as light
 * moving across it.
 */
const TONES = {
  white: "bg-white",
  mist: "bg-mist",
  sky: "bg-[linear-gradient(180deg,#ffffff_0%,#edf5fc_45%,#d8e9f7_100%)]",
  green: "bg-[linear-gradient(180deg,#ffffff_0%,#eff8f3_45%,#ddefe4_100%)]",
  indigo: "bg-[linear-gradient(180deg,#ffffff_0%,#f1f3fa_45%,#e1e5f4_100%)]",
  deep: "bg-deep text-white",
} as const;

/** Consistent page section: max width, gutters, and vertical rhythm. */
export function Section({
  id,
  tone = "white",
  children,
  className = "",
  size = "default",
  art,
  seam = true,
}: SectionProps) {
  const bg = TONES[tone];
  const pad = size === "sm" ? "py-14 lg:py-20" : "py-20 lg:py-28";

  return (
    <section id={id} className={`relative ${art ? "overflow-hidden" : ""} ${bg}`}>
      {seam ? (
        <div
          aria-hidden
          className={`section-seam ${tone === "deep" ? "section-seam-dark" : ""}`}
        />
      ) : null}
      {art ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {art}
        </div>
      ) : null}
      <div className={`relative mx-auto max-w-7xl px-6 lg:px-10 ${pad} ${className}`}>
        {children}
      </div>
    </section>
  );
}
