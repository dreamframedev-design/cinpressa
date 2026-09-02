"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { ConvergenceMark } from "@/components/convergence-mark";
import { OpenFlow } from "@/components/open-flow";
import { PortfolioBadge } from "@/components/portfolio-badge";

/**
 * The homepage hero, with an A/B switch between its two treatments.
 *
 * ONE FIELD UNDER A AND E. The open flow - ribbons that widen and
 * narrow but never pinch - spans the whole hero behind the copy the way a field
 * does on an interior page, and feathers into the section below so the boundary
 * never cuts it. A and E draw it identically, down to the mount key, so
 * switching between them does not even restart the art. Only B swaps the field
 * out, and only E adds anything to it.
 *
 * A — THE DEFAULT. Open field, no mark, no thread. The badge is the same
 * words-only cut on every stop, so A against the others never asks a question
 * about the provenance line.
 *
 * B — THE MARK, AND THE NAV STANDS DOWN FOR IT. The logo converging in the
 * right column, with its own petal colours blooming outward behind it on four
 * mismatched breaths - and, because it is the only stop where the mark is
 * already on screen at architectural scale, the nav drops its own copy and
 * runs the wordmark alone: CINPRESSA with pharma hanging under it.
 *
 * Two marks on one screen, one of them 500px and one of them 44, is the larger
 * one asking to be looked at while the smaller one insists it is the logo. The
 * nav keeps its job either way - the wordmark is still a link home and still
 * says who this is - it just stops competing with a version of itself.
 *
 * E — A, PLUS THE GOLDEN THREAD. Same field as A; the only difference is the
 * line drawn through it.
 *
 * The typographic variant that used to hold this letter is gone. It set the
 * headline about a fifth smaller and pinned the block higher, and dropping it
 * takes the compact branch out of the padding and the h1 with it - one size and
 * one position for every stop now, which is one less thing differing between
 * any two of them.
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

type View = "a" | "b" | "e";

export function HomeHero() {
  const [view, setView] = useState<View>("a");
  const mark = view === "b";

  /* THE NAV IS NOT THIS COMPONENT'S TO RENDER, so the hero publishes a flag and
     the stylesheet reacts to it. SiteNav is a sibling in the page tree rather
     than a child, and threading one boolean between them would mean a context,
     a client wrapper around both, or lifting the switch's whole state out of
     the component that owns it - real structure for a control that exists to be
     deleted the moment one of these is chosen.

     Scoped to the document element and cleaned up on unmount, so no other page
     can inherit it. */
  useEffect(() => {
    const root = document.documentElement;
    if (mark) root.dataset.navMark = "off";
    else delete root.dataset.navMark;
    return () => {
      delete root.dataset.navMark;
    };
  }, [mark]);

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
          {view === "e" ? (
            /* The one stop that carries the thread. Same component and same
               ribbons as every other field on this hero; the only difference is
               whether the line is drawn through it. */
            <OpenFlow key="flow" className="absolute inset-0" />
          ) : (
            <OpenFlow key="plain" thread={false} className="absolute inset-0" />
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

           There used to be a second branch here for the compact variant, which
           had to opt out of the centring entirely: under items-center the
           position is a function of the CONTENT's height, so a smaller headline
           made that block shorter and centring pushed it DOWN. With the variant
           gone so is the branch, and every stop takes the same padding. */
        className={`relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-24 pt-28 lg:gap-10 lg:px-10 lg:pb-28 lg:pt-24 ${
          mark ? "lg:grid-cols-[1.08fr_0.92fr]" : ""
        }`}
      >
        <div className={mark ? undefined : "max-w-2xl"}>
          {/* THE PROVENANCE IS THE WORDS, not a plate. Same cut on every stop,
              so switching A, B and E never changes the badge. See
              portfolio-badge.tsx. */}
          <div className="anim-rise" style={{ animationDelay: "0.02s" }}>
            <PortfolioBadge parent="CinRx" />
          </div>
          {/* WEIGHT 400, NOT 300. The headline was set light because everything
              on this site is, but at 68px the 300 reads thin rather than
              elegant - the strokes go spindly at exactly the size that is
              supposed to carry the page. One step up is enough; 500 would make
              it a different headline. */}
          <h1
            className="anim-rise mt-7 text-[clamp(2.4rem,5.4vw,4.25rem)] font-normal leading-[1.04] tracking-tight text-ink"
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

      {/* PARKED OUT OF THE COMPOSITION. The switch used to sit in the copy
          column, under the headline, which put review furniture inside the very
          thing being reviewed - it took a line of vertical space, it drew the
          eye to the bottom left, and because the hero centres its content it
          was also changing where every version's copy block sat. You could not
          judge the balance of a hero while a control was standing in it.

          Corner-parked and out of flow, it costs the layout nothing: what is
          left in the column is exactly the badge and the headline, which is
          what ships.

          THE WRAPPER IS THE CONTENT CONTAINER, not a viewport offset, and that
          is what keeps it off the alley. SiteAlleys anchors its hairline at
          max(24px, calc(50% - 640px + 24px)) from each edge, which moves inboard
          once the 1280 container starts centring - so a control pinned 40px
          from the viewport edge clears it at 1280 and is crossed by it at about
          1340. Sharing max-w-7xl and the same px gutter as everything else puts
          the chip permanently inside the alley at any width.

          px-10 AT EVERY WIDTH, rather than matching the content gutter's px-6
          below lg. The alley's floor is 24px and so is that gutter, so aligning
          to it exactly would put the chip's right edge ON the hairline between
          640 and 1024 - clear everywhere else and touching in the one band. 40
          holds a margin at every width the alleys are drawn at, and at lg it
          lands on the content gutter anyway.

          pointer-events-none on the full-width strip so it cannot swallow
          clicks across the hero; the chip itself takes them back. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 lg:bottom-7">
        <div className="mx-auto flex w-full max-w-7xl justify-end px-10">
          <div className="hero-switch pointer-events-auto">
            {(
              [
                { id: "a", label: "A" },
                { id: "b", label: "B" },
                { id: "e", label: "E" },
            ] as { id: View; label: string }[]
            ).map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={v.id === view}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
