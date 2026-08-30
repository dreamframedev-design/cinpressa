"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";

/**
 * CIN-111 development status.
 *
 * A SLIM SOLID BAR ON A FULL-LENGTH TRACK. Two earlier passes drew the fill as a
 * heavy 44px form — first with a rounded cap, then clipped to a chevron point — and
 * both read as an object rather than a measurement. The point is gone and the height
 * is down to a rule: at this weight the shape is unmistakably a gauge, and the eye
 * goes to WHERE it stops rather than to what it looks like.
 *
 * The empty track runs the whole four-stage width, so the fill states a position on a
 * known length instead of trailing off into white. That is what retired the legend:
 * with one colour there is no code to decode — the bar reaches Phase 1 and stops, and
 * a pipeline chart needs no instructions to be read.
 *
 * ONE COLOUR, ONE MOVING PART. Core brand blue, flat. The only motion inside the bar
 * is a soft beam that crosses in a beat and then leaves the chart still for five
 * seconds. Tempo is the whole trick: a continuous shine is a loading bar, and a
 * loading bar says "waiting". A single unhurried pass says the programme is live.
 *
 * INTERACTION THAT INFORMS. Hovering a stage column tints it and prints that stage's
 * status underneath; with no pointer at all the line carries the stage actually
 * underway, so the space holds information rather than an instruction to hover.
 * Every line is drawn from copy already approved on this page.
 */

/** Bar and track height. A rule, not a slab. */
const BAR_H = 18;

const FILL = "#2261ad";

/**
 * Preclinical is complete: one full stage column, or 25% of a four-stage track.
 *
 * It used to run to 31.25%, a quarter into Phase 1, with Phase 1 marked "live"
 * and its status reading "Underway", at a point when the page's own copy said
 * the IND was planned and the study expected to commence.
 *
 * IT REACHES INTO PHASE I AGAIN NOW, BY INSTRUCTION, and the copy has moved
 * with it: the status line reads that a single ascending dose study is ongoing.
 * The bar spans four stages, so a third of the way through the first phase is
 * 25% for the completed preclinical plus a third of the next quarter. What has
 * NOT moved is the Clinical development section further down the page, which
 * still reads "expected to commence in fall 2026" - flagged, not silently
 * reconciled, because which of the two is true is not a call this file can
 * make.
 */
const PROGRESS = 33.3;

const COLUMNS = "grid grid-cols-[minmax(9rem,1.15fr)_repeat(4,minmax(0,1fr))]";

/** Soft-cored, transparent at both ends, so the bar's own clip fades it in and out. */
const BEAM =
  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.34) 42%, rgba(255,255,255,0.62) 52%, rgba(255,255,255,0.3) 62%, rgba(255,255,255,0) 100%)";

/** "next" is the stage the programme is heading into, not one it has entered. */
type Stage = { name: string; status: string; state: "done" | "next" | "todo" };

/** Status lines are restatements of copy already approved on this page. */
const STAGES: Stage[] = [
  {
    name: "Preclinical",
    state: "done",
    status:
      "Complete. Non-human primate studies and GLP toxicology are done, with roughly a 100-fold therapeutic window.",
  },
  {
    /* COPY SUPPLIED, AND IT CONTRADICTS TWO THINGS ON THIS PAGE. "Ongoing"
       says the study has started; the Clinical development section below still
       reads "expected to commence in fall 2026", and this stage is still
       state "next" so the bar stops at the end of preclinical. Changed as
       asked and raised - if the study really has begun, that subtitle and this
       state both need to move with it, and neither is mine to decide. */
    name: "Phase I",
    state: "next",
    status: "A single ascending dose study is ongoing.",
  },
  { name: "Phase II", state: "todo", status: "Not started." },
  { name: "Phase III", state: "todo", status: "Not started." },
];

/** With nothing hovered the line reports the stage the programme is heading
 *  into. Falls back to the first stage if no stage is ever marked "next", so
 *  this cannot resolve to undefined. */
const NEXT = Math.max(
  0,
  STAGES.findIndex((stage) => stage.state === "next"),
);

export function PipelineDiagram() {
  const [active, setActive] = useState<number | null>(null);
  const shown = STAGES[active ?? NEXT];

  return (
    <Reveal variant="rise">
      {/* Narrow screens scroll the chart rather than compressing the stages. */}
      <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
        <div className="min-w-[36rem] overflow-hidden rounded-2xl border border-line bg-white">
          <div className={`${COLUMNS} border-b border-line bg-mist/70`}>
            <div className="px-5 py-4 text-[0.92rem] font-semibold uppercase tracking-[0.16em] text-body sm:px-7">
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
                className={`pl-stage border-l border-line px-3 py-4 text-center text-[0.92rem] font-semibold uppercase tracking-[0.16em] outline-none ${
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
              aria-label="CIN-111 development status: preclinical complete, Phase I underway, Phase II and Phase III not yet started."
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

              <div className="relative flex h-full items-center py-8">
                {/* The whole pipeline, empty. The fill below measures against it. */}
                <div
                  className="relative w-full rounded-full bg-line/70"
                  style={{ height: `${BAR_H}px` }}
                >
                  <div
                    className="track-progress absolute inset-y-0 left-0 origin-left overflow-hidden rounded-full"
                    style={{ width: `${PROGRESS}%`, background: FILL }}
                  >
                    <div
                      aria-hidden
                      className="pl-beam absolute inset-y-0 left-0 w-[30%]"
                      style={{ background: BEAM }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The status line. Live region so the change is announced rather than
          silent.

          NO MEASURE ON IT. It was held to 3xl like prose, which broke a
          two-clause sentence in half under a bar that runs the full frame; the
          line belongs to that bar and reads as its caption, so it takes the
          bar's width. min-h drops with it, since one line is now the common
          case rather than the exception. */}
      <div className="mt-5 min-h-[2.2rem]">
        <p
          aria-live="polite"
          className="text-[1.15rem] leading-relaxed text-ink transition-opacity duration-200"
        >
          <span className="font-semibold text-blue">{shown.name}.</span>{" "}
          {shown.status}
        </p>
      </div>
    </Reveal>
  );
}
