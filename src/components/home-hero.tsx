"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { ConvergenceMark } from "@/components/convergence-mark";
import { HeroChurn } from "@/components/hero-fields";

/**
 * The homepage hero, with an A/B switch between its two treatments.
 *
 * A — THE FIELD, and the default. The churn that was on /pipeline: layered
 * colour being stirred, every sample displaced by a rotating warp so the bands
 * curl and fold instead of sliding. It spans the whole hero behind the copy,
 * the way it does on an interior page, and feathers into the section below so
 * the section boundary never cuts it.
 *
 * B — THE MARK. What the hero carried before: the logo converging, with its own
 * petal colours blooming outward behind it on four mismatched breaths.
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

type View = "a" | "b";

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
          <HeroChurn key="churn" className="absolute inset-0" />
          {/* Feather into the section below, so the field is not cut off by the
              boundary after all the work it does to avoid a visible edge. The
              same treatment PageHero gives it on an interior page. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 lg:h-44"
            style={{
              background:
                "linear-gradient(0deg, #ffffff 0%, rgba(255,255,255,0) 100%)",
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
            <span aria-hidden className="h-px w-8 bg-blue/40" />
            A CinRx company
          </p>
          <h1
            className="anim-rise mt-7 text-[clamp(2.4rem,5.4vw,4.25rem)] font-light leading-[1.04] tracking-tight text-ink"
            style={{ animationDelay: "0.1s" }}
          >
            {/* The blue lands on "hypertension", not on "siRNA". The molecule
                class is what CinPressa makes; the disease is what the sentence
                is about, and it is the word a reader is scanning for. */}
            Advancing a best-in-class siRNA for{" "}
            <span className="text-blue">hypertension</span>
          </h1>
          <p
            className="anim-rise mt-7 max-w-xl text-lg leading-relaxed text-body"
            style={{ animationDelay: "0.28s" }}
          >
            CinPressa is advancing CIN-111, a best-in-class AGT siRNA for the
            treatment of hypertension, designed to prevent the formation of
            angiotensinogen and deliver long-acting blood pressure control.
          </p>

          <div className="anim-rise mt-10 w-fit" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 border-t border-line/70 pt-3">
              {(
                [
                  { id: "a", label: "A" },
                  { id: "b", label: "B" },
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
