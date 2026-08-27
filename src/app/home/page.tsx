import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { BurdenRail } from "@/components/burden-rail";
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
        <section className="border-b border-line bg-mist">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10 lg:px-10 lg:pb-12">
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
                label:
                  "of treated patients do not achieve target blood pressure levels, despite numerous approved therapies",
                share: 0.7,
              },
            ]}
            />
          </div>
        </section>

        {/* ONE BLOCK: THE PROBLEM, STATED ONCE.

            This was three things - a hinge section, then the Bleed, then a
            "Control that lasts remains elusive" section carrying the same
            argument in prose. The headline is deleted and the two halves are
            joined, because they were always one thought: the challenge is
            persistence, here is why persistence fails, here is what it costs.
            Squeezed to match - 40px between the statement and the cause, not a
            section boundary.

            LEFT-ALIGNED, and the reason the centring existed is gone. It was
            justified by the rail sitting underneath as three equal columns
            spanning the frame - a symmetrical figure wants a symmetrical header
            over it. That rail is the banner ABOVE this block now, so there is
            nothing symmetrical left inside the section for the copy to answer
            to, and three centred blocks in a row read as a poster rather than
            as an argument. Left is also what every other statement on the site
            does, including this same crescendo on /science.

            Reading order is the argument's order: the statement, the cause,
            then the consequence and what it costs. */}
        <Section tone="sky" className="pt-14! lg:pt-20!">
          <Reveal variant="fade">
            {/* One sentence pair to a screen reader; two sizes to an eye. */}
            <p className="crescendo max-w-5xl">
              <span className="crescendo-lede">
                In hypertension, the challenge is not whether blood pressure can
                be lowered.
              </span>
              <span className="crescendo-turn">
                The challenge is whether it can remain{" "}
              </span>
              <span className="crescendo-point">
                <span className="crescendo-key">controlled over time.</span>
              </span>
            </p>
          </Reveal>

          <Reveal variant="fade" delay={120}>
            <p className="mt-10 max-w-3xl text-base leading-relaxed text-body">
              Medication non-adherence is the leading cause of poor blood
              pressure control, and hypertension is largely asymptomatic,
              resulting in poor long-term adherence and treatment persistence.
            </p>
          </Reveal>

          {/* THE CONSEQUENCE, UNDER THE TICKERS. Moved here from /science so
              the whole cost of uncontrolled pressure is stated in one place:
              the scale of it in the figures above, and what it leads to
              underneath them.

              The lead-in ends in a colon and belongs to the list, so it can
              never be separated from it - a constraint that broke two earlier
              cuts of this content on /science. Held to the prose measure, where
              the seven break 4+3; wider and they break 6+1 and strand one tag
              on its own line. */}
          <Reveal variant="fade" delay={160}>
            <p className="mt-10 max-w-3xl text-base leading-relaxed text-body">
              Persistent uncontrolled blood pressure substantially increases the
              risk of serious complications:
            </p>
          </Reveal>

          <ul className="mt-5 flex max-w-3xl flex-wrap gap-2">
            {complications.map((c, i) => (
              <Reveal
                key={c}
                as="li"
                variant="fade"
                /* 90ms apart, so the list visibly ACCUMULATES as it arrives.
                   The sentence above says risk increases; the list should look
                   like it is. */
                delay={220 + i * 90}
              >
                <span className="risk-tag">
                  <span aria-hidden className="risk-dot" />
                  {c}
                </span>
              </Reveal>
            ))}
          </ul>
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
        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
            <Reveal variant="rise">
              <DoseMigration />
            </Reveal>
            <Reveal variant="fade" delay={120}>
              <p className="text-base leading-relaxed text-body">
              CinPressa is advancing a long-acting AGT siRNA designed to provide
              durable blood pressure reduction with one to two administrations
              per year. The goal is to establish a continuous backbone of blood
              pressure control independent of daily patient adherence. Meaningful
              baseline BP reduction may be sufficient for many patients to
              achieve treatment goals as monotherapy, with complementary
              antihypertensive agents layered onto an already controlled
                foundation for patients requiring additional control.
              </p>
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
        <Section tone="sky">
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
