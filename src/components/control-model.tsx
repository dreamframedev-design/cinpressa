import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import { FoundationFlow } from "@/components/foundation-flow";

/** Where the two administrations sit on the year line, percent across. */
const DOSES = [18, 62];
/** The recharge cycle: 12s, one dose at 0s, the other half a cycle later. */
const DELAYS = ["0s", "6s"];

/**
 * The control model — the foundation, and what can be built on it.
 *
 * WHY THIS IS A FIGURE AND NOT ANOTHER FIELD. This section had a wash behind
 * it, then a second, better wash, and both were the wrong instrument: the
 * section's argument is STRUCTURAL and a wash cannot state a structure. Read
 * the copy and it makes one claim that appears nowhere else on the site —
 * "complementary antihypertensive agents layered onto an already controlled
 * foundation" — which is an architectural idea. A base that is always there,
 * and optional courses laid on top of it only where a patient needs them.
 * That is drawable, and until now it was invisible.
 *
 * Three things, bottom to top, because that is the order they exist in:
 *
 *   1. ADMINISTRATIONS. A year, and two marks on it. The whole structure above
 *      rests on this, which is the point of the programme: everything is held
 *      up by one or two provider visits rather than by three hundred and sixty
 *      five patient decisions.
 *   2. THE FOUNDATION. One unbroken block, the heaviest thing in the frame,
 *      deliberately reading as ground rather than as a bar — this is the floor
 *      the rest stands on. It fills from the left as the figure arrives.
 *   3. THE OPTIONAL COURSE. Inset, lighter, a dashed edge, and it arrives LAST
 *      and only after the foundation has finished — it is additive, conditional
 *      and not load-bearing, and the sequence says so without a word.
 *
 * No axis, no numbers, no magnitudes: this is a model, not a result, and
 * implying a quantity here would be a claim the programme has not made. Every
 * line of text is a restatement of copy already approved on this page.
 *
 * AND IT LIVES. The first cut froze after its entrance, which undersold the
 * one word the section leans on: continuous. Three motions now run for as
 * long as the figure is on screen — a laminar current drifting through the
 * foundation (foundation-flow.tsx), a recharge cycle in which each
 * administration mark pings, lofts an orange charge into the block's
 * underside and blooms cool light through it (the orange dose becoming blue
 * control, the mark's own pairing), and the optional course hovering just
 * off the foundation because it is additive, not load-bearing. Choreography
 * lives in globals.css under "Control model".
 */
export function ControlModel() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_36px_72px_-52px_rgba(13,35,66,0.42)] sm:p-10">
      <div className="mb-9 flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-blue/40" />
        <p className="text-[0.84rem] font-semibold uppercase tracking-[0.19em] text-blue">
          The control model
        </p>
      </div>

      {/* ── 3. The optional course, laid on top ─────────────────────────── */}
      <Reveal variant="fade" delay={520}>
        <div className="cm-hover mx-auto w-[86%] rounded-t-2xl border border-b-0 border-dashed border-blue/35 bg-blue/[0.045] px-5 py-5 sm:w-[78%] sm:px-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span
              aria-hidden
              className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-blue/70"
            >
              If needed
            </span>
            <p className="text-base font-medium text-ink">
              Complementary antihypertensive agents
            </p>
          </div>
          <p className="mt-1.5 max-w-xl text-base leading-relaxed text-body">
            Layered on only for patients who require additional reduction.
          </p>
        </div>
      </Reveal>

      {/* ── 2. The foundation ───────────────────────────────────────────── */}
      <Reveal variant="rise" delay={140}>
        <div className="relative overflow-hidden rounded-2xl bg-[#14304f]">
          {/* The foundation being laid: the block starts as flat deep ink and
              the lit gradient wipes across it. The first cut put two near
              identical gradients on top of each other, so the wipe was
              technically running and visually nothing. */}
          <div
            aria-hidden
            className="track-progress absolute inset-0 origin-left bg-[linear-gradient(105deg,#14304f_0%,#2261ad_58%,#2f7ac9_100%)]"
          />
          {/* The current. Endless, one direction, calm: continuous control. */}
          <FoundationFlow className="absolute inset-0" />
          {/* Absorption blooms, one over each administration. Under the copy,
              which stays the brightest thing on the block. */}
          {DOSES.map((at, i) => (
            <span
              key={at}
              aria-hidden
              className="cm-bloom absolute bottom-[-30%] h-[150%] w-72"
              style={
                {
                  left: `${at}%`,
                  background:
                    "radial-gradient(ellipse 50% 65% at 50% 100%, rgba(149,218,248,0.6) 0%, rgba(149,218,248,0.18) 48%, rgba(149,218,248,0) 72%)",
                  "--cm-delay": DELAYS[i],
                } as CSSProperties
              }
            />
          ))}
          <div className="relative px-6 py-7 sm:px-8 sm:py-8">
            <p className="text-[1.05rem] font-medium text-white">
              CIN-111 &middot; long-acting AGT silencing
            </p>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/80">
              A continuous foundation of blood pressure control, independent of
              daily patient adherence.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 1. What holds it up ─────────────────────────────────────────── */}
      <Reveal variant="fade" delay={320}>
        <div className="mt-6">
          <div className="relative h-6">
            <span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line"
            />
            {DOSES.map((at, i) => (
              <span
                key={at}
                aria-hidden
                className="absolute top-1/2 flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white"
                style={{ left: `${at}%`, "--cm-delay": DELAYS[i] } as CSSProperties}
              >
                <span className="cm-ping absolute inset-0 rounded-full border-2 border-orange" />
                <span className="h-2.5 w-2.5 rounded-full bg-orange" />
                {/* The charge: risen off the mark, absorbed at the block's
                    underside; the bloom above takes over at contact. */}
                <span
                  className="cm-orb absolute left-1/2 top-1/2 -mt-[5px] h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle,#ffe2a8_0%,#f9a81a_65%)] shadow-[0_0_8px_2px_rgba(249,168,26,0.45)] opacity-0"
                />
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="text-base leading-relaxed text-body">
              <span className="font-medium text-ink">
                One to two administrations a year,
              </span>{" "}
              given by a provider.
            </p>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-muted">
              One year
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
