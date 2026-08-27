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
import { PipelineBloom } from "@/components/pipeline-bloom";
import { ControlModel } from "@/components/control-model";
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

        {/* THE HINGE, REPLACED. It carried "The unmet need in hypertension
            is not efficacy. It is persistence." for four cuts - a plain grey
            paragraph, a two-column split, a strikethrough on "efficacy", and
            finally a colour migration from the wrong answer to the right one.
            The new copy was handed over verbatim and says the same thing in the
            open rather than by implication, so none of that machinery survives
            with it: there is no "not X / it is Y" pair left to play ink against.

            It is set as a crescendo, which is the same three-beat build the
            science page uses for its own statement, and it is already tuned:
            two sizes rather than three, one voice across the setup, balanced
            lines, and the colour arriving on the last phrase over a second and
            a half. The section is about whether control lasts over time; the
            line that says so takes time to say it. See .crescendo-* in the
            stylesheet.

            The verdict-* rules are deleted with the copy they were written
            for. */}
        <section className="bg-[linear-gradient(180deg,var(--color-mist)_0%,rgba(255,255,255,0.96)_38%,#fff_100%)]">
          <div className="relative mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
            <div className="max-w-5xl">
              <Reveal variant="fade">
                <p className="max-w-4xl text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.62] text-muted">
                  Daily oral therapy has been the backbone of hypertension care for
                  decades, yet a large proportion of patients remain uncontrolled or
                  untreated.
                </p>
              </Reveal>

              <Reveal variant="fade" delay={110} className="mt-9 lg:mt-11">
                {/* One sentence pair to a screen reader; two sizes to an eye. */}
                <p className="crescendo max-w-5xl">
                  <span className="crescendo-lede">
                    In hypertension, the challenge is not whether blood pressure
                    can be lowered.
                  </span>
                  <span className="crescendo-turn">
                    The challenge is whether it can remain{" "}
                  </span>
                  <span className="crescendo-point">
                    <span className="crescendo-key">controlled over time.</span>
                  </span>
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        {/* Bleed runs full-bleed rather than inside the container - it is a piece,
            not a figure, and gutters would make it read as an illustration sitting
            in a slot. It lands directly under the answer, which is the point. */}
        <Bleed className="h-[190px] w-full sm:h-[250px] lg:h-[330px]" />

        {/* The challenge. Stripped twice over. The eyebrow went because the
            headline already says what this section is; the first half of the
            paragraph went because it read the stat rail's numbers back to the
            reader in prose, which is where the redundancy actually lived. What
            is left is the sentence those numbers were building toward, and it
            now leads the section instead of trailing it.

            Copy first, figure second: the rail is a helper, and helpers come
            after the thing they help.

            CENTRED, and this is the one section on the site that should be. The
            rail underneath is three equal columns spanning the full frame — the
            most symmetrical thing here — and a left-aligned header over a
            symmetrical figure sits off its own axis. The header now shares the
            rail's centre line. Everywhere else on the site the figure is
            asymmetric and the copy stays left, which is why this does not
            generalise. */}
        <Section tone="sky" className="pt-12! lg:pt-16!">
          <SectionHeader title="Control that lasts remains elusive" align="center" />
          <Reveal variant="fade" delay={120}>
            <p className="mx-auto mt-8 max-w-3xl text-center text-lg font-light leading-snug tracking-tight text-ink md:text-xl">
              Medication non-adherence is the leading cause of poor blood
              pressure control, and hypertension is largely asymptomatic,
              resulting in poor long-term adherence and treatment persistence.
            </p>
          </Reveal>
          <BurdenRail
            className="mt-14 lg:mt-16"
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

          {/* THE CONSEQUENCE, UNDER THE TICKERS. Moved here from /science so
              the whole cost of uncontrolled pressure is stated in one place:
              the scale of it in the figures above, and what it leads to
              underneath them.

              Centred, because this section is. Everything above is on the
              centre line and a left-aligned block under it would read as a
              different section that had been appended.

              The lead-in ends in a colon and belongs to the list, so it can
              never be separated from it - a constraint that broke two earlier
              cuts of this content on /science. Held to the prose measure, where
              the seven break 4+3; wider and they break 6+1 and strand one tag
              on its own line. */}
          <Reveal variant="fade" delay={160}>
            <p className="mx-auto mt-16 max-w-3xl text-balance text-center text-base leading-relaxed text-body">
              Persistent uncontrolled blood pressure substantially increases the
              risk of serious complications:
            </p>
          </Reveal>

          <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
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

            The control model comes with it, under the prose rather than in a
            row of its own. It is the conclusion the cascade earns — silence AGT
            upstream and control stops depending on the patient — and putting it
            in the left column also gives that column enough height to stand
            against the diagram. */}
        <Section tone="sky">
          <SectionHeader
            eyebrow="Mechanism"
            title="Targeting AGT upstream"
            deck="RAAS modulation at the source"
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
            <div>
              <Reveal variant="fade">
                <p className="text-base leading-relaxed text-body">
                  AGT is the precursor in the RAAS pathway and is crucial for
                  blood pressure regulation. Standard RAAS inhibitors act
                  downstream and do not completely suppress the RAAS pathway.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={100}>
                <p className="mt-5 text-base leading-relaxed text-body">
                  By targeting AGT synthesis in the liver via RNA interference,
                  CIN-111 is designed to block the RAAS cascade upstream.
                </p>
              </Reveal>

              <Reveal variant="rise" delay={200} className="mt-12">
                <ControlModel />
              </Reveal>
            </div>

            <Reveal variant="rise" delay={140}>
              <RaasPathway />
            </Reveal>
          </div>
        </Section>

        {/* THE PIPELINE SECTION IS COLOUR ONLY NOW.

            Every word here has been removed by request: the heading, both
            paragraphs, the Visit Pipeline link and the findings spec. What is
            left is the field — the mark's own ovals cropped so every centre
            sits outside the frame — which makes this a breath between the two
            sections that do carry copy rather than a section competing with
            them. The pipeline itself is a page, and the nav goes there.

            The height is explicit because there is no content to set it: a
            section with art and nothing else collapses to its own padding. With
            the spacer the band is 368px, which is where the ovals stop reading
            as a stripe without leaving a screen of pale nothing above them. The
            mask's top fade is what blends it out of the white section above, so
            the upper third is meant to be almost empty. Both oval centres sit
            below the frame, so the swell rises into the footer rather than
            sitting in the middle of the band. See pipeline-bloom.tsx. */}
        <Section tone="indigo" art={<PipelineBloom className="absolute inset-0" />}>
          <div aria-hidden className="h-24 lg:h-36" />
        </Section>

      </main>

      <SiteFooter />
    </div>
  );
}
