"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { ConvergenceMark } from "@/components/convergence-mark";
import { OpenFlow } from "@/components/open-flow";
import { PortfolioBadge } from "@/components/portfolio-badge";

/**
 * The homepage hero, with an A/B switch between its two treatments.
 *
 * ONE FIELD UNDER ALL BUT TWO OF THEM. The open flow - ribbons that widen and
 * narrow but never pinch - spans the whole hero behind the copy the way a field
 * does on an interior page, and feathers into the section below so the boundary
 * never cuts it. A, B, D and E draw it identically, down to the mount key, so
 * switching between any of those does not even restart the art. Only C swaps
 * the field out, and only F adds anything to it.
 *
 * That is deliberate. With the art held constant across four of the six stops,
 * every one of those comparisons isolates exactly one variable, which is the
 * only way any of them can actually be judged.
 *
 * A — THE BADGE IN THE LITERAL BRAND COLOUR, and the default. Its plate is
 * #F9A81A itself, at full strength and full opacity - the value off the brand
 * sheet rather than a version of it, which was the brief. It leads because the
 * default should be the thing being proposed rather than the hedge against it.
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
 * C — THE SAME HERO AS A WITH THE RESTRAINED PLATE. The accent cut carries the
 * orange on the edge and the relation over a cream ground instead of filling
 * the plate with it. Nothing else differs from A at all.
 *
 * D — THE NEUTRAL ONE. Same field again, and the only option whose badge stays
 * on the hairline cut, so the sole warm thing anywhere on D is the beam
 * crossing "hypertension".
 *
 * E — D'S FIELD AND D'S COPY, SET SMALLER AND HIGHER. A typographic comparison
 * rather than an artistic one: the headline comes down about a fifth and the
 * whole block sits higher in the frame.
 *
 * F — D, PLUS THE GOLDEN THREAD. The thread used to be welded to A, which meant
 * it could never be judged on its own: A differed from the others in the badge
 * AND in the thread at the same time. It is its own stop now, on the neutral
 * base, so F against D is a question about one line drawn through a field and
 * nothing else.
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

type View = "a" | "b" | "c" | "d" | "e" | "f";

export function HomeHero() {
  const [view, setView] = useState<View>("a");
  const mark = view === "b";
  /** E's whole proposition: same field, smaller headline, higher block. */
  const compact = view === "e";

  /* THE NAV IS NOT THIS COMPONENT'S TO RENDER, so the hero publishes a flag and
     the stylesheet reacts to it. SiteNav is a sibling in the page tree rather
     than a child, and threading one boolean between them would mean a context,
     a client wrapper around both, or lifting the switch's whole state out of
     the component that owns it - real structure for a control that exists to be
     deleted the moment one of these six is chosen.

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
          {view === "f" ? (
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

              A is the solid cut, the plate at #F9A81A itself, and it is the
              default because the default should be the thing being proposed
              rather than the hedge against it. D and F take the hairline cut -
              F is D plus the thread, so it has to carry D's badge or the two
              would differ in two things at once. Everything else, B and C and
              E, runs the accent cut in between. */}
          <div className="anim-rise" style={{ animationDelay: "0.02s" }}>
            <PortfolioBadge
              parent="CinRx"
              tone={
                view === "d" || view === "f"
                  ? "line"
                  : view === "a"
                    ? "solid"
                    : "accent"
              }
            />
          </div>
          {/* WEIGHT 400, NOT 300. The headline was set light because everything
              on this site is, but at 68px the 300 reads thin rather than
              elegant - the strokes go spindly at exactly the size that is
              supposed to carry the page. One step up is enough; 500 would make
              it a different headline. */}
          <h1
            className={`anim-rise mt-7 font-normal leading-[1.04] tracking-tight text-ink ${
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
          what ships. */}
      <div className="absolute bottom-5 right-6 z-10 flex items-center gap-3 lg:bottom-7 lg:right-10">
        {(
          [
            { id: "a", label: "A" },
            { id: "b", label: "B" },
            { id: "c", label: "C" },
            { id: "d", label: "D" },
            { id: "e", label: "E" },
            { id: "f", label: "F" },
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
                : "text-[0.76rem] tracking-[0.08em] text-stone/70 transition-colors hover:text-body"
            }
          >
            {v.label}
          </button>
        ))}
      </div>
    </section>
  );
}
