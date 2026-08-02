import { MarkArt } from "@/components/geometry";

/**
 * Backdrop for interior page headers.
 *
 * The home hero earns its space with the mark and its orbit rings. Interior
 * headers had nothing on the right, so any wash there read as an amorphous
 * pale smear. This anchors them instead with an oversized crop of the real
 * mark in its own petal colours, sitting in the dead lower-right quadrant.
 *
 * Chroma is deliberately weighted right and bottom: the headline column stays
 * near white so type never fights the field.
 */
export function HeroField({ mark = true }: { mark?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Base wash: saturated top-right, resolving to white under the copy */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_110%_at_84%_8%,#c8e2f8_0%,#d9ecfb_24%,#eaf3fc_46%,#f7fbfe_66%,#ffffff_84%)]" />
      {/* Core indigo, low and right */}
      <div className="absolute inset-0 bg-[radial-gradient(58%_72%_at_99%_95%,rgba(103,113,181,0.34)_0%,rgba(103,113,181,0)_68%)]" />
      {/* Core green, high and left */}
      <div className="absolute inset-0 bg-[radial-gradient(46%_60%_at_-4%_-2%,rgba(175,219,188,0.55)_0%,rgba(175,219,188,0)_70%)]" />

      {mark ? (
        <>
          <div className="anim-orbit absolute -bottom-[55%] -right-[4%] hidden aspect-square h-[165%] lg:block">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle
                cx="50"
                cy="50"
                r="49"
                fill="none"
                stroke="#2261AD"
                strokeOpacity="0.16"
                strokeWidth="0.14"
                strokeDasharray="0.35 2.2"
              />
              <circle
                cx="50"
                cy="50"
                r="37"
                fill="none"
                stroke="#2261AD"
                strokeOpacity="0.11"
                strokeWidth="0.14"
              />
            </svg>
          </div>
          {/* A phone header is all text and has no dead right column, so the
              mark tucks below the copy instead of sitting behind it. */}
          <MarkArt
            variant="brand"
            animate
            light
            className="absolute -bottom-[20%] -right-[30%] h-[42%] w-auto opacity-[0.3] lg:-bottom-[34%] lg:-right-[9%] lg:h-[145%] lg:opacity-[0.42]"
          />
        </>
      ) : null}

      {/* Settle into white so the first section starts clean. Needs real
          depth. A short fade leaves a hard horizontal cut across the mark. */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_35%,rgba(255,255,255,0.84)_66%,#ffffff_92%)]" />
    </div>
  );
}
