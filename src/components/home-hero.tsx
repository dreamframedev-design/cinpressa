"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { ConvergenceMark } from "@/components/convergence-mark";
import { OpenFlow } from "@/components/open-flow";
import { Bleed } from "@/components/bleed";

/**
 * The homepage hero, with an A/B switch between its two treatments.
 *
 * A — THE FIELD, and the default. The open flow: ribbons that widen and narrow
 * but never pinch. It spans the whole hero behind the copy, the way a field
 * does on an interior page, and feathers into the section below so the boundary
 * never cuts it. It traded places with the churn, which is on /pipeline now.
 *
 * B — THE MARK. What the hero carried before: the logo converging, with its own
 * petal colours blooming outward behind it on four mismatched breaths.
 *
 * C — THE LAYERED FIELD. The wave piece from further down the page, brought up
 * here: six translucent bands composited with multiply, so where two cross the
 * colour deepens and the violet band reads as a shadow under the blue. It is the
 * same component, not a copy - see bleed.tsx.
 *
 * C CARRIES NO SCRIM OF ITS OWN, which A does. Down the page that field has
 * nothing over it, so it never needed one; under a headline it does, or the
 * copy sits on full-strength colour. The two gradients over it here are the
 * ones A paints into its own canvas, at the same strengths, so the three
 * treatments put the headline on the same paper.
 *
 * The two are not variants of one layout, which is why this holds the whole
 * hero rather than just its art slot. A is a backdrop and wants the copy on one
 * measure with the field open to its right; B is an object in a column and
 * wants the two-column grid. Switching remounts the art (see key), so each
 * treatment plays from its first frame every time it is chosen.
 *
 * THE SWITCH IS REVIEW FURNITURE, and is dressed as such — the same language as
 * the mark-variant picker it replaces. A hairline rather than a panel, no fill,
 * no backdrop, labels at the smallest size the ramp goes to, and colour only on
 * the one that is selected. It has to be legible enough to use and faint enough
 * to ignore on a hero that is being judged.
 */

/**
 * Petal colours blooming behind the mark. Positions roughly mirror where each
 * colour sits inside the artwork, so the glow reads as the logo's own light
 * rather than decoration placed around it. Durations are mismatched so the four
 * breaths never sync up.
 */
const BLOOMS = [
  { color: "175,219,188", size: 74, x: 2, y: -6, low: 0.4, high: 0.75, dur: 15, delay: 0 },
  { color: "149,218,248", size: 68, x: 32, y: 4, low: 0.45, high: 0.8, dur: 19, delay: -5 },
  { color: "34,97,173", size: 54, x: -4, y: 28, low: 0.18, high: 0.34, dur: 17, delay: -9 },
  { color: "103,113,181", size: 62, x: 34, y: 36, low: 0.2, high: 0.4, dur: 23, delay: -13 },
];

type View = "a" | "b" | "c";

export function HomeHero() {
  const [view, setView] = useState<View>("a");
  const mark = view === "b";

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-gradient-to-b from-white via-white to-mist lg:min-h-[76vh]">
      {mark ? (
        /* The glow belongs to the mark: it echoes the artwork sitting in front
           of it. Under the field there is already colour, and a second wash
           only muddies it. */
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/2 h-[680px] w-[680px] -translate-y-1/2 rounded-full opacity-55"
          style={{
            background:
              "radial-gradient(circle, rgba(190,215,236,0.5) 0%, rgba(190,215,236,0) 65%)",
          }}
        />
      ) : (
        <>
          {view === "c" ? (
            <>
              {/* White above it, because this sits at the top of the page. */}
              <Bleed key="bleed" topColor="#ffffff" className="absolute inset-0" />
              {/* The scrims A paints into its own canvas, at A's strengths. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.44) 34%, rgba(255,255,255,0) 66%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.72) 30%, rgba(255,255,255,0.08) 62%, rgba(255,255,255,0) 100%)",
                }}
              />
            </>
          ) : (
            <OpenFlow key="flow" className="absolute inset-0" />
          )}
          {/* Feather into the section below, so neither field is cut off by the
              boundary after all the work it does to avoid a visible edge.

              IT FADES TO MIST, NOT TO WHITE. PageHero's version fades to white
              because the interior sections under it are white; this hero's own
              gradient ends on mist and the section below it opens on mist, so a
              white feather laid over that painted the hero's last pixel row
              white against a mist neighbour - a hard rule across the full width
              at exactly the section boundary, which is the seam the field was
              added to avoid in the first place. Matching the colour underneath
              is the whole fix. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 lg:h-44"
            style={{
              background:
                "linear-gradient(0deg, var(--color-mist) 0%, rgba(244,248,252,0) 100%)",
            }}
          />
        </>
      )}

      <div
        className={`relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-32 lg:gap-10 lg:px-10 lg:pb-16 lg:pt-32 ${
          mark ? "lg:grid-cols-[1.08fr_0.92fr]" : ""
        }`}
      >
        <div className={mark ? undefined : "max-w-2xl"}>
          <p
            className="anim-rise flex items-center gap-3 text-[0.92rem] font-semibold uppercase tracking-[0.22em] text-blue"
            style={{ animationDelay: "0.02s" }}
          >
            {/* ORANGE, AND THIS IS THE PLACE FOR IT. The hero carried none:
                the mark has it, the dose beads have it, the cascade's upstream
                node has it, and between the top of the page and the middle
                there was no trace of the one colour that is only ever
                punctuation. A 1px rule 32px long is the smallest thing on the
                page that can carry it, which is exactly why it can. */}
            <span aria-hidden className="h-px w-8 bg-orange" />
            A CinRx portfolio company
          </p>
          <h1
            className="anim-rise mt-7 text-[clamp(2.4rem,5.4vw,4.25rem)] font-light leading-[1.04] tracking-tight text-ink"
            style={{ animationDelay: "0.1s" }}
          >
            {/* The blue lands on "hypertension", not on "siRNA". The molecule
                class is what CinPressa makes; the disease is what the sentence
                is about, and it is the word a reader is scanning for. */}
            Advancing a best-in-class siRNA for{" "}
            <span className="hero-key">hypertension</span>
          </h1>
          <p
            className="anim-rise mt-7 max-w-xl text-lg leading-relaxed text-body"
            style={{ animationDelay: "0.28s" }}
          >
            {/* Opens on "Designed". The clause it replaced - "CinPressa is
                advancing CIN-111, a best-in-class AGT siRNA for the treatment
                of hypertension," - restated the headline directly above it,
                which already says best-in-class siRNA for hypertension. */}
            Designed to prevent the formation of angiotensinogen and deliver
            long-acting blood pressure control.
          </p>

          <div className="anim-rise mt-10 w-fit" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 border-t border-line/70 pt-3">
              {(
                [
                  { id: "a", label: "A" },
                  { id: "b", label: "B" },
                  { id: "c", label: "C" },
                ] as { id: View; label: string }[]
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={v.id === view}
                  onClick={() => setView(v.id)}
                  className={
                    v.id === view
                      ? "text-[0.76rem] font-semibold tracking-[0.08em] text-blue underline decoration-blue/40 underline-offset-4"
                      : "text-[0.76rem] tracking-[0.08em] text-stone transition-colors hover:text-body"
                  }
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mark ? (
          /* No entrance rise here: the convergence IS the mark's entrance. */
          <div className="relative mx-auto flex aspect-square w-[300px] items-center justify-center sm:w-[390px] lg:w-[500px]">
            <div aria-hidden className="bloom-layer pointer-events-none absolute inset-0">
              {BLOOMS.map((b) => (
                <span
                  key={b.color}
                  className="bloom"
                  style={
                    {
                      width: `${b.size}%`,
                      aspectRatio: "1",
                      left: `${b.x}%`,
                      top: `${b.y}%`,
                      background: `radial-gradient(circle, rgba(${b.color},1) 0%, rgba(${b.color},0) 68%)`,
                      "--bloom-low": b.low,
                      "--bloom-high": b.high,
                      "--bloom-dur": `${b.dur}s`,
                      "--bloom-delay": `${b.delay}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            <div className="mark-lift relative w-[68%]">
              <ConvergenceMark key="mark" className="w-full" variant="cascade" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
