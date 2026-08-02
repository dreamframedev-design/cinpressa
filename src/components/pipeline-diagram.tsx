import { Reveal } from "@/components/reveal";

const STAGES = ["Preclinical", "Phase 1", "Phase 2", "Phase 3"];

/**
 * Preclinical is complete: one full stage column, or 25% of a four-stage
 * track. Phase 1 is a quarter of the way in, so the bar stops at
 * 25% + (25% × 0.25), leaving it well clear of the Phase 2 boundary at 50%.
 */
const PROGRESS = 31.25;

/** Where the preclinical/Phase 1 handoff falls within the bar's own width. */
const HANDOFF = (25 / PROGRESS) * 100;

/** Label column plus the four equal stage columns, shared by header and row. */
const COLUMNS = "grid grid-cols-[minmax(9rem,1.15fr)_repeat(4,minmax(0,1fr))]";

const LEGEND = [
  { label: "Complete", swatch: "bg-blue" },
  { label: "In progress", swatch: "bg-sky" },
  { label: "Not started", swatch: "border border-line bg-white" },
];

/** Traditional four-stage development chart for the CIN-111 program. */
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
                {/* Leading edge, painted before the bar so it haloes the cap
                    instead of washing over it */}
                <span
                  aria-hidden
                  className="track-tip absolute top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: `${PROGRESS}%`,
                    background:
                      "radial-gradient(circle, rgba(30,174,229,0.42) 0%, rgba(30,174,229,0) 68%)",
                  }}
                />
                <div
                  className="track-progress relative h-11 origin-left overflow-hidden rounded-r-full shadow-[0_10px_26px_-14px_rgba(34,97,173,0.8)]"
                  style={{ width: `${PROGRESS}%` }}
                >
                  {/* Complete: solid core blue */}
                  <span
                    className="absolute inset-y-0 left-0 bg-blue"
                    style={{ width: `${HANDOFF}%` }}
                  />
                  {/* In progress: same colour family, different *texture*, so
                      the stage boundary is a deliberate edge rather than the
                      muddy blend a shade-to-shade gradient produces. */}
                  <span
                    className="absolute inset-y-0 right-0 bg-azure"
                    style={{ width: `${100 - HANDOFF}%` }}
                  >
                    <span className="track-stripes absolute inset-0" />
                  </span>
                  {/* Specular sweep across the finished stretch */}
                  <span className="track-sheen absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
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
              className={`h-2.5 w-6 rounded-full ${item.swatch}`}
            />
            {item.label}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
