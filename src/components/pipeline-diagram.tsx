import { Reveal } from "@/components/reveal";

/**
 * CIN-111 development status.
 *
 * REBUILT after client review. The previous version drew the track as a bar with
 * `rounded-r-full` — a fully rounded cap on a 44px-tall bar — and then painted a soft
 * radial glow haloing that cap. The resulting silhouette was, accurately, not something
 * to put on a pharma site. The note was: make it an arrow tip.
 *
 * What changed:
 *   - The cap is a real chevron point. Direction, not termination.
 *   - The tip is a FIXED-SIZE element beside a flexible shaft, not part of a stretched
 *     viewBox. A single SVG scaled with preserveAspectRatio="none" would shear the
 *     point into a spike or a stub depending on how wide the column happened to be;
 *     this way the tip angle is identical at every container size.
 *   - The tail is square. Two identical round ends read as a lozenge; an origin and a
 *     heading read as progress.
 *   - Completed and in-progress are split by TEXTURE, not by a second shape or a
 *     shade-to-shade gradient — a gradient at that seam reads as a rendering artefact,
 *     a texture change reads as a deliberate handover.
 *   - The glow is gone. Nothing haloes the tip.
 *   - The hatch is STATIC. The old build ran it on a 1.1s barber-pole loop plus a 5.5s
 *     specular sweep; at that tempo it reads as a loading bar, which is the wrong idea
 *     entirely — this is a programme, not a progress spinner.
 */

const STAGES = ["Preclinical", "Phase 1", "Phase 2", "Phase 3"];

/**
 * Preclinical is complete: one full stage column, or 25% of a four-stage track. Phase 1
 * is a quarter of the way in, so the arrow reaches 25% + (25% × 0.25) and stops well
 * clear of the Phase 2 boundary at 50%. That is the honest position: Phase 1 has not
 * begun dosing.
 */
const PROGRESS = 31.25;
/** Where the preclinical/Phase 1 handover falls within the arrow's own length. */
const HANDOFF = (25 / PROGRESS) * 100;

const COLUMNS = "grid grid-cols-[minmax(9rem,1.15fr)_repeat(4,minmax(0,1fr))]";

const BAR_H = 44;
/** Tip length in px. About 0.6× the bar height — long enough to read as an arrow,
 *  short enough that it does not become a dart. */
const TIP_W = 26;

const COMPLETE = "#2261ad";
const LIVE = "#1596d4";

/** Static diagonal hatch. Authored as a gradient rather than an SVG pattern so it
 *  cannot be distorted by any parent scaling. */
const HATCH = `repeating-linear-gradient(-58deg, ${LIVE} 0 7px, rgba(255,255,255,0.34) 7px 13px)`;

const LEGEND = [
  { label: "Complete", swatch: COMPLETE },
  { label: "In progress", swatch: LIVE },
  { label: "Not started", swatch: null },
];

export function PipelineDiagram() {
  return (
    <Reveal variant="rise">
      {/* Narrow screens scroll the chart rather than compressing the stages. */}
      <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
        <div className="min-w-[36rem] overflow-hidden rounded-2xl border border-line bg-white">
          <div className={`${COLUMNS} border-b border-line bg-mist/70`}>
            <div className="px-5 py-4 text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-body sm:px-7">
              Program
            </div>
            {STAGES.map((stage) => (
              <div
                key={stage}
                className="border-l border-line px-3 py-4 text-center text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-body"
              >
                {stage}
              </div>
            ))}
          </div>

          <div className={`${COLUMNS} items-center`}>
            <div className="px-5 py-7 sm:px-7">
              <p className="text-base font-medium text-ink">CIN-111</p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-body">
                AGT siRNA &middot; Hypertension
              </p>
            </div>

            <div
              className="relative col-span-4 self-stretch"
              role="img"
              aria-label="CIN-111 development status: preclinical complete, Phase 1 underway, Phase 2 and Phase 3 not yet started."
            >
              {/* Stage boundaries, aligned to the header columns above. */}
              {[0, 25, 50, 75].map((left) => (
                <span
                  key={left}
                  aria-hidden
                  className="absolute inset-y-0 w-px bg-line"
                  style={{ left: `${left}%` }}
                />
              ))}

              <div className="relative flex h-full items-center py-7">
                <div
                  className="track-progress relative flex origin-left"
                  style={{ width: `${PROGRESS}%`, height: `${BAR_H}px` }}
                >
                  {/* Shaft: the live stretch runs the whole length and the completed
                      stretch is laid over its start, so there is one continuous form
                      rather than two abutting bars. */}
                  <div
                    className="h-full flex-1"
                    style={{ background: HATCH }}
                  />

                  {/* The point. Fixed width, so its angle never changes. */}
                  <svg
                    aria-hidden
                    width={TIP_W}
                    height={BAR_H}
                    viewBox={`0 0 ${TIP_W} ${BAR_H}`}
                    className="block shrink-0"
                  >
                    <polygon
                      points={`0,0 ${TIP_W},${BAR_H / 2} 0,${BAR_H}`}
                      fill={LIVE}
                    />
                  </svg>

                  {/* Completed stretch. */}
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-0"
                    style={{ width: `${HANDOFF}%`, background: COMPLETE }}
                  />

                  {/* The handover, stated as an edge. */}
                  <div
                    aria-hidden
                    className="absolute inset-y-0 w-px bg-white/55"
                    style={{ left: `${HANDOFF}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
        {LEGEND.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-2.5 text-sm text-body"
          >
            <span
              aria-hidden
              className="h-2.5 w-6 rounded-full"
              style={
                item.swatch
                  ? { background: item.swatch }
                  : { border: "1px solid var(--color-line)", background: "#fff" }
              }
            />
            {item.label}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
