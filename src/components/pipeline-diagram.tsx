"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";

/**
 * CIN-111 development status.
 *
 * The silhouette was rebuilt once already, after the original drew the track with
 * `rounded-r-full` on a 44px bar and haloed the cap with a radial glow. The chevron
 * survived review; this pass is about finish.
 *
 * ONE CLIPPED SHAPE, NOT A SHAFT PLUS A TIP. The arrow is a single element wearing a
 * clip-path polygon whose point is specified in absolute px:
 *
 *     polygon(0 0, calc(100% - 26px) 0, 100% 50%, calc(100% - 26px) 100%, 0 100%)
 *
 * That keeps the tip angle identical at every container width (the reason the previous
 * build refused to put the arrow in a stretched viewBox) while letting fills, gradients
 * and the beam run continuously across the whole form. Two abutting elements could not
 * share a highlight; this can.
 *
 * TIGHT AND CLINICAL, which is a tempo decision as much as a visual one:
 *   - The beam crosses in under a second and then the track holds still for six. A slow
 *     continuous shine is a loading bar. A quick one is light catching a machined edge.
 *   - The hatch is two blues rather than blue and white. White stripes read as caution
 *     tape; a tight two-tone reads as a survey pattern.
 *   - Both stretches carry a directional gradient, so the form has depth without any
 *     glow, blur or shadow anywhere in it.
 *
 * INTERACTION THAT INFORMS. Hovering a stage column tints it and prints that stage's
 * actual status underneath. Every line is drawn from copy already approved on this
 * page; nothing here invents a milestone. Keyboard users get the same thing on focus,
 * and with no pointer at all the default line still explains the chart.
 */

const BAR_H = 44;
/** Tip length in px. Absolute, so the point never shears. */
const TIP_W = 26;

const COMPLETE_A = "#1a4f8f";
const COMPLETE_B = "#2a6fbf";
const LIVE_A = "#1596d4";
const LIVE_B = "#48b4e4";

/**
 * Preclinical is complete: one full stage column, or 25% of a four-stage track. Phase 1
 * is a quarter of the way in, so the arrow reaches 25% + (25% × 0.25) and stops well
 * clear of the Phase 2 boundary. That is the honest position: Phase 1 has not dosed.
 */
const PROGRESS = 31.25;
const HANDOFF = (25 / PROGRESS) * 100;

const COLUMNS = "grid grid-cols-[minmax(9rem,1.15fr)_repeat(4,minmax(0,1fr))]";

const ARROW_CLIP = `polygon(0 0, calc(100% - ${TIP_W}px) 0, 100% 50%, calc(100% - ${TIP_W}px) 100%, 0 100%)`;

/** Two blues, finely pitched. Reads as a survey hatch rather than caution tape. */
const HATCH = `repeating-linear-gradient(-60deg, ${LIVE_A} 0 5px, ${LIVE_B} 5px 10px)`;

type Stage = { name: string; status: string; state: "done" | "live" | "todo" };

/** Status lines are restatements of copy already approved on this page. */
const STAGES: Stage[] = [
  {
    name: "Preclinical",
    state: "done",
    status:
      "Complete. Non-human primate studies and GLP toxicology are done, with roughly a 100-fold therapeutic window.",
  },
  {
    name: "Phase 1",
    state: "live",
    status:
      "Underway. A U.S. IND is planned for around mid-2026, with a first-in-human single ascending dose study expected to commence in fall 2026.",
  },
  { name: "Phase 2", state: "todo", status: "Not started." },
  { name: "Phase 3", state: "todo", status: "Not started." },
];

const DEFAULT_LINE =
  "A single program. Hover a stage for its current status.";

const LEGEND = [
  { label: "Complete", swatch: COMPLETE_B },
  { label: "In progress", swatch: LIVE_A },
  { label: "Not started", swatch: null },
];

export function PipelineDiagram() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Reveal variant="rise">
      {/* Narrow screens scroll the chart rather than compressing the stages. */}
      <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
        <div className="min-w-[36rem] overflow-hidden rounded-2xl border border-line bg-white">
          <div className={`${COLUMNS} border-b border-line bg-mist/70`}>
            <div className="px-5 py-4 text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-body sm:px-7">
              Program
            </div>
            {STAGES.map((stage, i) => (
              <button
                key={stage.name}
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${stage.name}: ${stage.status}`}
                className={`pl-stage border-l border-line px-3 py-4 text-center text-[0.84rem] font-semibold uppercase tracking-[0.16em] outline-none ${
                  active === i ? "bg-blue/[0.07] text-blue" : "text-body"
                }`}
              >
                {stage.name}
              </button>
            ))}
          </div>

          <div className={`${COLUMNS} items-center`}>
            <div className="px-5 py-7 sm:px-7">
              <p className="text-base font-medium text-ink">CIN-111</p>
              <p className="mt-1.5 text-base leading-relaxed text-body">
                AGT siRNA &middot; Hypertension
              </p>
            </div>

            <div
              className="relative col-span-4 self-stretch"
              role="img"
              aria-label="CIN-111 development status: preclinical complete, Phase 1 underway, Phase 2 and Phase 3 not yet started."
            >
              {/* Stage boundaries, aligned to the header columns above. The column
                  under the cursor tints its full height, so the hover reads down the
                  chart rather than stopping at the header. */}
              {STAGES.map((_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="pl-stage absolute inset-y-0 border-l border-line"
                  style={{
                    left: `${i * 25}%`,
                    width: "25%",
                    backgroundColor:
                      active === i ? "rgba(34,97,173,0.05)" : "transparent",
                  }}
                />
              ))}

              <div className="relative flex h-full items-center py-7">
                <div
                  className="track-progress relative origin-left overflow-hidden"
                  style={{
                    width: `${PROGRESS}%`,
                    height: `${BAR_H}px`,
                    clipPath: ARROW_CLIP,
                  }}
                >
                  {/* In-progress stretch, running the whole length. */}
                  <div className="absolute inset-0" style={{ background: HATCH }} />

                  {/* Completed stretch, laid over its start. Directional gradient, so
                      the form has depth with no glow anywhere. */}
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${HANDOFF}%`,
                      background: `linear-gradient(90deg, ${COMPLETE_A} 0%, #2261ad 58%, ${COMPLETE_B} 100%)`,
                    }}
                  />

                  {/* The handover, stated as an edge. */}
                  <div
                    aria-hidden
                    className="absolute inset-y-0 w-px bg-white/45"
                    style={{ left: `${HANDOFF}%` }}
                  />

                  {/* The beam. Clipped to the arrow along with everything else, so it
                      crosses the point rather than stopping at a seam. */}
                  <div
                    aria-hidden
                    className="pl-beam absolute inset-y-0 left-0 w-[14%]"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The status line. Live region so the change is announced rather than silent. */}
      <div className="mt-6 min-h-[3.5rem]">
        <p
          aria-live="polite"
          className="max-w-3xl text-[1.05rem] leading-relaxed text-ink transition-opacity duration-200"
        >
          {active === null ? (
            <span className="text-body">{DEFAULT_LINE}</span>
          ) : (
            <>
              <span className="font-semibold text-blue">
                {STAGES[active].name}.
              </span>{" "}
              {STAGES[active].status}
            </>
          )}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
        {LEGEND.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-2.5 text-base text-body"
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
