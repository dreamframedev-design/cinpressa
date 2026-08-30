import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { BurdenRail } from "@/components/burden-rail";
import { BurdenBanner } from "@/components/burden-banner";
import { DoseMigration } from "@/components/dose-migration";
import { Bleed } from "@/components/bleed";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import { RaasPathway } from "@/components/raas-pathway";

export const metadata: Metadata = {
  title: "Advancing a best-in-class siRNA for hypertension",
  description:
    "CinPressa is advancing CIN-111, a best-in-class, long-acting AGT siRNA designed to establish a durable, adherence-independent backbone of blood pressure control.",
};

/**
 * The complications, in the source document's order, which is the only order
 * they have. Moved here from /science with the sentence that introduces them.
 */
const complications = [
  "Stroke",
  "Myocardial infarction",
  "Heart failure",
  "Chronic kidney disease",
  "End-stage renal disease",
  "Peripheral arterial disease",
  "Vascular dementia",
];

/** The same seven, set as a run-in list: lowercased because they sit inside a
 *  sentence now, comma-separated, with "and" before the last. Derived rather
 *  than written out, so the array above stays the only place they live. */
const COMPLICATIONS_RUN = complications
  .map((c) => c.toLowerCase())
  .map((c, k, all) => (k === all.length - 1 ? `and ${c}.` : `${c},`))
  .join(" ");

export default function HomePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        <HomeHero />

        {/* THE FIGURES AS A BANNER, between the hero and the statement.

            They used to sit under the challenge copy as that section's helper.
            Moved up here they do a different job: the scale of the problem,
            stated once, immediately after the hero and before the argument
            starts. A band rather than a section - full-bleed hairline, mist
            ground, tight padding - so it reads as a rule across the page with
            numbers on it rather than as a section of its own.

            Mist, because the hero's gradient ends on mist. The band continues
            that colour instead of introducing a new one, so the only edge is
            the hairline, which is the edge that is meant to show. */}
        <BurdenBanner className="border-b border-line bg-mist">
          <div className="mx-auto w-full max-w-7xl px-6 pb-7 lg:px-10 lg:pb-8">
            <BurdenRail
              figures={[
              {
                value: "1.4",
                unit: "B",
                /* "worldwide" was never in the map; it says "globally". */
                label: "people globally live with hypertension",
                share: 1,
              },
              {
                value: "700",
                unit: "M+",
                label: "remain uncontrolled or untreated",
                share: 0.5,
              },
              {
                value: "70",
                unit: "%",
                label: "of treated patients do not achieve target blood pressure levels",
                share: 0.7,
              },
            ]}
            />
          </div>
        </BurdenBanner>

        {/* THE PROBLEM, IN TWO COLUMNS: THE CLAIM AND ITS EVIDENCE.

            This was three things - a hinge section, the Bleed, and a "Control
            that lasts remains elusive" section repeating the same argument in
            prose. The headline is deleted and what is left is split at its
            natural seam rather than stacked: the statement stands on the left,
            and everything that substantiates it - why persistence fails, and
            what failing costs - stacks on the right.

            The crescendo carries the left column on its own, so the split is
            weighted toward it: display type at 30 and 56px needs room to break
            where it wants to, and the right column is prose plus a tag list
            that reflows to whatever it is given.

            The lead-in ends in a colon and belongs to its list, so the two stay
            together inside the right column - the constraint that broke two
            earlier cuts of this content. */}
        <Section tone="sky" className="pt-14! lg:pt-20!">
          {/* TWO COLUMNS AND TWO ROWS, which is what makes the second beat of
              each column start on the same line as the other's. A fixed offset
              on the turn would only hold at one width - the paragraph across
              from it rewraps, so the distance to match changes with the
              viewport. Grid rows solve it outright: row one is the premise
              beside the cause, row two is the answer beside the consequence,
              and the browser aligns them at any measure.

              The cost is that the crescendo is two paragraphs rather than one.
              Both halves are whole sentences, and the sentence that runs into
              the payoff is not the one that got split, so nothing is broken for
              a screen reader by the change. */}
          <div className="grid gap-x-12 gap-y-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-x-16">
            <Reveal variant="fade">
              <p className="crescendo max-w-none">
                <span className="crescendo-lede">
                  In hypertension, the challenge is not whether blood pressure can
                  be lowered.
                </span>
              </p>
            </Reveal>

            <Reveal variant="fade" delay={120}>
              <p className="text-base leading-relaxed text-body">
                Medication non-adherence is the leading cause of poor blood
                pressure control, and hypertension is largely asymptomatic,
                resulting in poor long-term adherence and treatment persistence.
              </p>
            </Reveal>

            <Reveal variant="fade" delay={60}>
              <p className="crescendo max-w-none">
                <span className="crescendo-turn">
                  The challenge is whether it can remain{" "}
                </span>
                <span className="crescendo-point">
                  <span className="crescendo-key">controlled over time.</span>
                </span>
              </p>
            </Reveal>

            {/* THE SEVEN RUN IN, rather than sitting in badges. As tags they
                took three rows and most of this column; as a sentence they take
                two lines and finish the paragraph that introduces them, which
                is what a list of seven short terms wants to be.

                The colon goes with them - a colon introduces a list that is
                about to be set apart, and nothing is set apart any more. The
                terms lowercase because they are now inside a sentence rather
                than labels in their own right; not one of them is a proper
                noun, so nothing is lost. They stay in ink against the body
                grey, so the run still reads as the list it is.

                Still generated from the same array, so the terms and their
                order have one source. */}
            <Reveal variant="fade" delay={160}>
              <p className="text-base leading-relaxed text-body">
                Persistent uncontrolled blood pressure substantially increases
                the risk of serious complications for{" "}
                <span className="text-ink">{COMPLICATIONS_RUN}</span>
              </p>
            </Reveal>
          </div>
        </Section>

        {/* Bleed runs full-bleed rather than inside the container - it is a piece,
            not a figure, and gutters would make it read as an illustration sitting
            in a slot. It lands directly under the answer, which is the point. */}
        <Bleed
          /* The sky wash above ends on #e6f1fa, and the field's base is opaque,
             so the piece has to start on the same colour or its top edge is a
             rule across the page. */
          topColor="#e6f1fa"
          className="h-[190px] w-full sm:h-[250px] lg:h-[330px]"
        />

        {/* Our approach. White ground, no wash, no watermark: the note on the
            old treatment was that the dots floated in space over a green field.
            The year-draining-into-two-doses flight now runs inside a framed
            instrument card — the card IS the container — and it wants clean
            paper behind it, not atmosphere. See dose-migration.tsx. */}
        {/* NO SECTION HEADER, per review: the only headline above this animation
            is the one inside the card. The eyebrow, headline and deck that used
            to sit here were three lines of build-up in front of a figure that
            states its case in five words. (Those are site-map lines — removing
            them is a deliberate call, not an oversight.)

            THE CARD IS PAIRED, NOT STACKED. Held to its own measure the card
            stopped three quarters of the way across the frame while the
            sections either side of it ran the full width, and that mismatch is
            what read as the page listing to the left. The paragraph that used
            to sit under it now sits beside it, so the section fills its frame
            with content it already had. The card cannot simply be widened —
            its grid divides the width, so a wider card means coarser dots, not
            more of them. */}
        {/* COPY LEFT, FIGURE RIGHT, and the ratio turns over with them: the
            card was given the larger share because it is the thing being read,
            and it still is - it just reads from the other side now. Every other
            spread on this page opens on its argument, so this one no longer
            makes the reader start at a diagram and work backwards.

            THE FIRST SENTENCE LEADS. It is the claim - a long-acting siRNA,
            one to two administrations a year - and the two sentences after it
            qualify it. At one size the claim was buried in the middle of a
            block; set larger it becomes the section's opening line, which is
            what the dose card is illustrating. Not one word changes: the same
            map sentence, split at its own full stop. */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:items-center lg:gap-14">
            <Reveal variant="fade">
              <div>
                {/* Deck scale, not body scale. At text-lg/xl this was still
                    reading as the first paragraph of a block rather than as the
                    section's opening claim; it clamps up to 32px now, half
                    again the body around it, so it holds the column against a
                    card that is 686px wide. */}
                <p className="text-[clamp(1.45rem,2.4vw,2rem)] font-light leading-[1.2] tracking-tight text-ink">
                  CinPressa is advancing a long-acting AGT siRNA designed to
                  provide durable blood pressure reduction with one to two
                  administrations per year.
                </p>
                <p className="mt-5 text-base leading-relaxed text-body">
                  The goal is to establish a continuous backbone of blood
                  pressure control independent of daily patient adherence.
                  Meaningful baseline BP reduction may be sufficient for many
                  patients to achieve treatment goals as monotherapy, with
                  complementary antihypertensive agents layered onto an already
                  controlled foundation for patients requiring additional
                  control.
                </p>
              </div>
            </Reveal>
            <Reveal variant="rise" delay={120}>
              <DoseMigration />
            </Reveal>
          </div>
        </Section>

        {/* MECHANISM, MOVED HERE FROM /science.

            Placed after the dose card and before the colour band, which is the
            argument's order: the problem lasts (the challenge), the dosing
            changes (365 into two), and this is why it can — the cascade is shut
            off at its source rather than blocked late.

            TWO COLUMNS, because the cascade was too large on its own. It ran
            the full measure as a single stack with the prose above it, which
            made a five-step diagram the tallest thing on its page. Beside its
            own paragraphs it reads as the illustration of an argument instead
            of a chapter of one, and the section costs about half the height.

            THE CONTROL MODEL WENT BACK TO /science. It lived here for one
            cut, under the prose, on the reasoning that it was the conclusion
            the cascade earns and that it gave the left column height. The note
            back was that the section read as too busy with both, which is fair:
            two figures in one section makes the reader choose which one is the
            point. It is on the science page again, in the solution section it
            was built for.

            Without it the prose column is short against the diagram, so the
            split narrows to 0.7/1.3 — the copy runs longer at a measure it can
            still hold, rather than stopping a third of the way down. */}
        <Section id="mechanism" tone="sky">
          {/* EVERYTHING ON THE CENTRE LINE, and the cascade stays narrow.

              The brief was to put the header and both paragraphs above the
              diagram without letting the diagram get any wider - it is wanted
              compact. Stacked and left-aligned that fails badly: full-measure
              copy over a 670px box leaves the box hanging off the left edge of
              its own section, which is the exact fault this content was sent
              back for twice on the science page.

              Centring the BLOCK is what makes the stack work. Copy and figure
              share one axis, so the box reads as the section's figure rather
              than as something that ran out of room. The lines inside it read
              left; only the column is centred.

              The cascade holds 2xl, a shade wider than the 644px it had in the
              column, so nothing inside it reflows: both intervention tags still
              sit beside their node headings at this width. */}
          {/* LINES READ LEFT, THE BLOCK STAYS CENTRED. Centred lines were
              costing legibility on a paragraph this long, so the type is set
              left again - but the column is held to the cascade's own measure
              and centred on the page, so the copy and the diagram share one
              left edge and one right edge and the whole stack still sits on
              the page's axis. max-w-none! on the header because SectionHeader
              carries its own 3xl and the wrapper is what sets the measure
              here. */}
          <div className="mx-auto max-w-2xl">
            <SectionHeader
              eyebrow="Mechanism"
              title="Targeting AGT upstream"
              deck="RAAS modulation at the source"
              className="max-w-none!"
            />

            <Reveal variant="fade" delay={120}>
              <p className="mt-10 text-base leading-relaxed text-body">
                AGT is the precursor in the RAAS pathway and is crucial for
                blood pressure regulation. Standard RAAS inhibitors act
                downstream and do not completely suppress the RAAS pathway.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={180}>
              <p className="mt-5 text-base leading-relaxed text-body">
                By targeting AGT synthesis in the liver via RNA interference,
                CIN-111 is designed to block the RAAS cascade upstream.
              </p>
            </Reveal>
          </div>

          <Reveal variant="rise" delay={240} className="mx-auto mt-12 max-w-2xl">
            <RaasPathway />
          </Reveal>
        </Section>


      </main>

      <SiteFooter />
    </div>
  );
}
