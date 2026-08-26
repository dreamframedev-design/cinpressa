import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import { FoundationFlow } from "@/components/foundation-flow";

/** Where the two administrations sit on the year line, percent across. */
const DOSES = [18, 62];
/** The recharge cycle: 9s, one dose at 0s, the other half a cycle later. Down
 *  from 12s — a delivery a reader may only catch once should not make them wait
 *  that long for it. */
const DELAYS = ["0s", "4.5s"];

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
 *   3. THE OPTIONAL COURSE. Type only — a label, a name and a line of copy,
 *      sitting above the foundation with nothing drawn around or under it. It
 *      arrives LAST and only after the foundation has finished, and it hovers
 *      slowly rather than settling: additive, conditional, not load-bearing,
 *      and the sequence says so without a word. The width matters too — it
 *      starts on the same edge as everything else and runs out early, so the
 *      shortfall is on the right where it can be read as meaning something.
 *
 *      There is no rule under it. A dashed hairline lived here for one round
 *      and was read as a rendering artifact rather than as an edge, which is
 *      the correct verdict: "IF NEEDED" already says conditional, in words, and
 *      a line that has to be explained is a line that is not working.
 *
 * NO CONTAINERS. The first cut put all of this inside a bordered white card,
 * and the optional course inside a dashed BOX inside that — a box, in a box, in
 * a section. Three frames to draw two ideas. Both are gone. The only enclosed
 * shape left is the foundation itself, which SHOULD be enclosed: it is the one
 * thing here that is solid, and it is now the only thing the eye reads as an
 * object.
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
 *
 * MAKING THE DELIVERY LEGIBLE. First cut: a small orb popped off the mark and
 * was gone inside a quarter second, over a gap of about twenty pixels, once
 * every twelve seconds. Three separate reasons nobody could tell what had
 * happened. The gap is wider now, the charge is bigger and brighter, a stroke
 * rises behind it so the path can be followed rather than guessed at, and the
 * cycle is shorter so a reader who looks up is likely to catch one.
 */
export function ControlModel() {
  return (
    /* No card. The figure stands on the section's own ground — see the note on
       containers above. The label the card used to carry is gone with it: the
       section already has an eyebrow, and this needed a second one only because
       it had become a thing inside a thing. */
    <div className="relative">
      {/* ── 3. The optional course, resting on the foundation ───────────── */}
      <Reveal variant="fade" delay={520}>
        {/* Left-aligned, not centred. Centring put this block's edge at an x
            that matched nothing else on the page; starting it on the section's
            own edge and letting it STOP SHORT says the same thing — a course
            that does not cover the whole base — while keeping one edge for the
            whole section. */}
        <div className="cm-hover w-[88%] sm:w-[76%]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
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
        <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#14304f]">
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
                  /* Brighter than it was. The charge arriving needs a payoff
                     inside the block or the flight reads as a dot that goes
                     nowhere; at the old alphas the absorption was lost against
                     the foundation's own gradient. */
                  background:
                    "radial-gradient(ellipse 52% 68% at 50% 100%, rgba(149,218,248,0.9) 0%, rgba(149,218,248,0.32) 46%, rgba(149,218,248,0) 74%)",
                  "--cm-delay": DELAYS[i],
                } as CSSProperties
              }
            />
          ))}
          <div className="relative px-6 py-7 sm:px-8 sm:py-8">
            <p className="text-[1.05rem] font-medium text-white">
              CIN-111 &middot; long-acting AGT silencing
            </p>
            {/* Measured to break at its own comma. At the block's full width
                this ran "…independent of daily / patient adherence.", which
                strands two words on a line of its own; balance plus a 46ch cap
                puts the turn where the sentence already pauses. */}
            <p className="mt-2 max-w-[46ch] text-balance text-base leading-relaxed text-white/80">
              A continuous foundation of blood pressure control, independent of
              daily patient adherence.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 1. What holds it up ─────────────────────────────────────────── */}
      <Reveal variant="fade" delay={320}>
        {/* Wider than it was. The charge had about twenty pixels to cross, which
            is not enough distance for anyone to see a thing travel — the note
            back was that the two dots "aren't super clear". Give it room. */}
        <div className="mt-10">
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
                {/* The trail. The charge alone was a dot appearing and gone
                    again; a rising stroke behind it makes the delivery a path
                    you can follow rather than a flicker. It exists only during
                    the flight — nothing is drawn here at rest. */}
                <span
                  aria-hidden
                  className="cm-trail absolute bottom-1/2 left-1/2 -ml-px w-0.5 rounded-full bg-[linear-gradient(0deg,rgba(249,168,26,0)_0%,rgba(249,168,26,0.75)_45%,rgba(255,226,168,0.95)_100%)] opacity-0"
                />
                {/* The charge: risen off the mark, absorbed at the block's
                    underside; the bloom above takes over at contact. */}
                <span
                  className="cm-orb absolute left-1/2 top-1/2 -mt-[5px] h-3 w-3 rounded-full bg-[radial-gradient(circle,#fff3d6_0%,#f9a81a_62%)] shadow-[0_0_12px_3px_rgba(249,168,26,0.55)] opacity-0"
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
