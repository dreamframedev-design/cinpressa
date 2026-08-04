import { HeldLine, type HeldLineVariant } from "@/components/held-line";

/**
 * Backdrop for interior page headers.
 *
 * This used to be a pale radial wash with an oversized crop of the logo sitting in the
 * dead lower-right quadrant, on all five interior pages. That was an honest stopgap -
 * its own comment said the right column had nothing in it and any wash there read as an
 * amorphous smear - but it hardened into the site's entire art system, and it is the
 * literal source of the client note that the only art we have is the same repeated logo
 * over and over. Five pages opened with the same crop in the same position.
 *
 * The mark is gone from here. In its place each page gets its own composition from the
 * HeldLine family: strata entering turbulent and settling into a held horizontal, in a
 * different arrangement per page. See held-line.tsx for the geometry and the reasoning.
 *
 * The washes are gone too, and nothing replaces them. Gradient-as-bandage is explicitly
 * on the list of things this brand's audience reads as generic, and the strokes carry
 * the field on their own now that they are allowed to run at full strength instead of
 * the 0.42 opacity ceiling the old art sat under.
 */
export function HeroField({
  variant,
  tone = "light",
}: {
  variant: HeldLineVariant;
  tone?: "light" | "dark";
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* The ground. Deep for the showpiece hero, plain white otherwise - the strata
          are the artwork, so there is nothing else to lay down here. */}
      <div
        className={`absolute inset-0 ${tone === "dark" ? "bg-deep" : "bg-white"}`}
      />
      <HeldLine variant={variant} tone={tone} />
    </div>
  );
}
