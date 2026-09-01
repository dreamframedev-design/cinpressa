"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { ConvergenceMark } from "@/components/convergence-mark";
import { OpenFlow } from "@/components/open-flow";
import { PortfolioBadge } from "@/components/portfolio-badge";

/**
 * The homepage hero, with an A/B switch between its two treatments.
 *
 * A — THE FIELD, WITH THE BADGE IN THE LITERAL BRAND COLOUR, and the default.
 * The open flow: ribbons that widen and narrow but never pinch, spanning the
 * whole hero behind the copy the way a field does on an interior page, and
 * feathering into the section below so the boundary never cuts it. It traded
 * places with the churn, which is on /pipeline now.
 *
 * Its plate is #F9A81A itself, at full strength and full opacity - the value
 * off the brand sheet rather than a version of it, which was the brief. It
 * leads because that is the answer to the brief, and the default should be the
 * thing being proposed rather than the hedge against it.
 *
 * B — THE SAME HERO, WITH THE RESTRAINED PLATE. Same field, same thread, same
 * copy at the same size: the ONLY difference between A and B is the badge, and
 * that is the point of it. B runs the accent cut, which carries the orange on
 * the rings and the edge over a cream ground instead of filling the plate with
 * it. Holding everything else constant is the only way to actually judge that
 * one call.
 *
 * C — THE MARK. What the hero carried before: the logo converging, with its own
 * petal colours blooming outward behind it on four mismatched breaths.
 *
 * D — THE SAME FIELD AS A, WITHOUT THE THREAD, and the neutral one. One
 * component and one set of ribbons; the only difference from A is whether the
 * golden thread is drawn through it. It is also the only option whose badge
 * stays on the hairline cut, so the sole warm thing anywhere on D is the beam
 * crossing "hypertension".
 *
 * E — D'S FIELD, D'S COPY, SET SMALLER AND HIGHER. A typographic comparison
 * rather than an artistic one: it draws exactly the same field as D, so nothing
 * about the art is in question when the two are put side by side, and the only
 * differences are the ones being judged - the headline comes down about a fifth
 * and the whole block sits higher in the frame.
 *
 * That is the point of pairing it with D rather than with A. A carries the
 * thread, so comparing type against A would change two things at once.
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

type View = "a" | "b" | "c" | "d" | "e";

export function HomeHero() {
  const [view, setView] = useState<View>("a");
  const mark = view === "c";
  /** E's whole proposition: same field, smaller headline, higher block. */
  const compact = view === "e";

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
          {view === "d" || view === "e" ? (
            /* The same field as A, with nothing drawn in it - and D and E share
               it exactly, down to the mount key, so switching between those two
               does not even restart the art. Whatever is being compared there,
               it is not the field. */
            <OpenFlow key="plain" thread={false} className="absolute inset-0" />
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
        /* THE BLOCK SITS HIGHER IN THE FIELD. The section centres its content in
           a tall min-height, so where the copy lands is set by the difference
           between these two paddings rather than by either one alone. Taking 32
           off the top and adding 48 to the bottom moves the whole group up by
           40px without changing the hero's height or the area the field paints.
           Still 96px of clearance under a nav that is 76 tall.

           D OPTS OUT OF THE CENTRING ENTIRELY, and has to. Under items-center
           the position is a function of the CONTENT's height, so D's smaller
           headline made its block shorter and centring then pushed it 20px
           DOWN - the opposite of what a compact variant is for. self-start
           takes it off the centre line so its top padding places it outright:
           160px puts the badge 45px above where A and C hold theirs, and it
           stays there whatever the headline does. */
        className={`relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-24 lg:gap-10 lg:px-10 ${
          compact
            ? "self-start pt-24 lg:pb-28 lg:pt-40"
            : "pt-28 lg:pb-28 lg:pt-24"
        } ${mark ? "lg:grid-cols-[1.08fr_0.92fr]" : ""}`}
      >
        <div className={mark ? undefined : "max-w-2xl"}>
          {/* THE PROVENANCE IS A PLATE NOW, not a kicker. It was a hairline and
              a run of tracked caps - the same treatment every section label on
              the site uses - so the one piece of provenance on the page carried
              no more weight than a heading's garnish. See portfolio-badge.tsx;
              it is built to be lifted whole into any sibling company's site
              with one prop changed.

              THE TONE IS THE WHOLE SWITCH at three of the five stops. A is the
              solid cut, the plate at #F9A81A itself - and it is the default,
              because the default should be the thing being proposed rather than
              the hedge against it. D is the neutral cut: hairline plate, blue
              rings, so the only warm thing anywhere on it is the beam crossing
              "hypertension". Everything else runs the accent cut in between. */}
          <div className="anim-rise" style={{ animationDelay: "0.02s" }}>
            <PortfolioBadge
              parent="CinRx"
              tone={view === "d" ? "line" : view === "a" ? "solid" : "accent"}
            />
          </div>
          <h1
            className={`anim-rise mt-7 font-light leading-[1.04] tracking-tight text-ink ${
              compact
                ? "text-[clamp(2rem,4.1vw,3.25rem)]"
                : "text-[clamp(2.4rem,5.4vw,4.25rem)]"
            }`}
            style={{ animationDelay: "0.1s" }}
          >
            {/* The blue lands on "hypertension", not on "siRNA". The molecule
                class is what CinPressa makes; the disease is what the sentence
                is about, and it is the word a reader is scanning for. */}
            Advancing a best-in-class siRNA for{" "}
            <span className="hero-key">hypertension</span>
          </h1>
          {/* The hero paragraph is removed. What is left is the eyebrow, the
              headline and the switch - the headline already says what the
              company is doing, and the page states the rest three sections
              down. */}

          <div className="anim-rise mt-10 w-fit" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 border-t border-line/70 pt-3">
              {(
                [
                  { id: "a", label: "A" },
                  { id: "b", label: "B" },
                  { id: "c", label: "C" },
                  { id: "d", label: "D" },
                  { id: "e", label: "E" },
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
