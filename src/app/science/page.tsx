import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { OpenFlow } from "@/components/open-flow";
import { ControlModel } from "@/components/control-model";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { RaasPathway } from "@/components/raas-pathway";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Science",
  description:
    "CIN-111 targets angiotensinogen (AGT) synthesis in the liver via RNA interference, blocking the RAAS cascade upstream for durable, adherence-independent blood pressure control.",
};

const complications = [
  "Stroke",
  "Myocardial infarction",
  "Heart failure",
  "Chronic kidney disease",
  "End-stage renal disease",
  "Peripheral arterial disease",
  "Vascular dementia",
];

export default function SciencePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* Open flow, stated in mass before a word is read. What was here before
            pinched the ribbons through a gate and released them — a good picture
            of pressure, which is precisely why it was wrong: a hypertension
            brand cannot open on a bundle being squeezed. Nothing in this field
            narrows anywhere. See open-flow.tsx. */}
        <PageHero
          field={<OpenFlow className="absolute inset-0" />}
          eyebrow="Unmet need"
          title="Blood pressure control still depends on daily adherence"
          deck="The challenge is persistence"
        />

        {/* The burden.

            THE PROBLEM WAS THAT IT WAS A WALL. Set as one four-line block of
            display type, the statement had no shape — every line the same size,
            the same weight, the same colour, so there was nothing to read except
            length. Two rounds of moving it around the page did not help, because
            the arrangement was never the fault.

            SO IT IS NOT A BLOCK ANY MORE, IT IS A CRESCENDO. The sentence
            already has three parts and they are not equal, so they are not set
            equal: the qualifier is small and grey, the turn is mid-sized and
            ink, and the point is large and arrives in blue. The type does what
            the sentence does. That is the whole idea and it needs no picture,
            no rule and no box to carry it — which is also why this section can
            stay on white without reading as empty: the colour event IS the
            argument landing.

            The three beats arrive in order with a held pause between them, and
            the blue on the last one does not simply appear — it sweeps in over
            a second and a half. The section is about whether control lasts over
            time; the line that says so takes time to say it. */}
        <Section>
          <Reveal variant="fade">
            {/* One sentence pair to a screen reader; three sizes to an eye. */}
            <p className="crescendo max-w-5xl">
              <span className="crescendo-lede">
                In hypertension, the challenge is not simply whether blood
                pressure can be lowered.
              </span>
              <span className="crescendo-turn">
                The challenge is whether it can remain{" "}
              </span>
              <span className="crescendo-point">
                <span className="crescendo-key">controlled over time.</span>
              </span>
            </p>
          </Reveal>

          {/* TWO PARAGRAPHS ACROSS, THEN THE TAGS ACROSS.

              The previous cut put one paragraph on the left and the other
              paragraph PLUS all seven tags on the right, which made the columns
              wildly unequal: three lines beside five, a void under the short one,
              and the tags crushed into half the width so they broke over three
              ragged rows. Fixing the page's left-hugging problem had introduced
              a worse one.

              The two paragraphs are close in length, so they pair cleanly. The
              tags want width more than anything else — given the whole frame they
              settle into two even rows instead of three ragged ones — so they get
              their own full-width band underneath. The colon at the end of the
              right-hand paragraph still runs straight into them. */}
          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="fade" delay={120}>
              <p className="text-base leading-relaxed text-body">
                Medication non-adherence is the leading cause of poor blood
                pressure control, and hypertension is largely asymptomatic,
                resulting in poor long-term adherence and treatment persistence.
              </p>
            </Reveal>

            <Reveal variant="fade" delay={180}>
              <p className="text-base leading-relaxed text-body">
                Persistent uncontrolled blood pressure substantially increases
                the risk of serious complications:
              </p>
            </Reveal>
          </div>

          {/* Seven terms as small hairline tags — outlines only, no fill, no
              hover. The hover lit them in blue and the note back was that it
              made them feel clickable, which is exactly right: colour that
              responds to a cursor is a promise of somewhere to go, and there is
              nowhere to go. They are labels. They sit still.

              The stagger is what gives them life instead — 110ms apart rather
              than 45, so the list visibly ACCUMULATES as it arrives. The
              sentence above says risk increases; the list should look like it
              is increasing. */}
          <ul className="mt-8 flex flex-wrap gap-2">
            {complications.map((c, i) => (
              <Reveal key={c} as="li" variant="fade" delay={240 + i * 110}>
                <span className="risk-tag">
                  <span aria-hidden className="risk-dot" />
                  {c}
                </span>
              </Reveal>
            ))}
          </ul>
        </Section>

        {/* CinPressa solution. NO BACKDROP. This section had a wash, then a
            better wash, and both were the wrong instrument: its argument is
            structural — a foundation with optional courses laid on it — and a
            wash cannot state a structure. It carries a figure instead. See
            control-model.tsx.

            COPY PROVENANCE, since it was asked: every word in this section is
            verbatim from the approved site map (Google Doc, "Science" →
            "CinPressa solution"). Eyebrow, headline and subheadline are exact;
            the body is the map's single Section body paragraph, split at its
            sentence boundary into the two columns. Nothing here is written. The
            PDFs checked into this repo are an OLDER revision of that map and
            disagree — the doc is the source. */}
        <Section tone="green">
          <SectionHeader
            eyebrow="CinPressa solution"
            title="A new treatment paradigm"
          />
          {/* The deck sits ON its paragraph rather than under the headline. It
              was reading as a third heading stacked on the first two; a
              subheadline introduces the body, so the gap above it is wider than
              the gap below and the pair reads as one block. */}
          <Reveal variant="fade" delay={80}>
            <p className="mt-11 max-w-3xl text-lg font-medium leading-snug tracking-tight text-ink md:text-xl">
              Long-acting control with infrequent dosing
            </p>
          </Reveal>
          {/* ONE paragraph, because that is what it is. The map carries this as a
              single Section body and it was being split at its sentence
              boundary into two columns — which left three lines beside six and
              a hole under the short one. A two-column set only works when both
              columns fill; this one never could. */}
          <Reveal variant="fade" delay={140}>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-body">
              CinPressa is developing a treatment model that shifts hypertension
              management from daily patient behavior to infrequent
              provider-administered therapy. Rather than relying on daily oral
              dosing, the aim is to deliver durable blood pressure control with
              long-acting AGT silencing, while still allowing complementary
              antihypertensive agents to be layered onto an already controlled
              foundation for patients who require additional reduction.
            </p>
          </Reveal>

          {/* Wider than the prose, deliberately. Held to the copy's measure the
              figure stopped three quarters of the way across a frame the
              sections either side of it fill, which is what made the page read
              as listing to the left. Unlike the dose card this one scales
              cleanly — the foundation is a bar and the year line is a rule, so
              width costs it nothing. */}
          <Reveal variant="rise" delay={200} className="mt-14 max-w-5xl">
            <ControlModel />
          </Reveal>
        </Section>

        {/* Mechanism */}
        <Section tone="sky">
          <SectionHeader
            eyebrow="Mechanism"
            title="Targeting AGT upstream"
            deck="RAAS modulation at the source"
          />

          {/* One column, per the site map revision. The two paragraphs used to
              sit in a left-hand column opposite the diagram; they now open the
              section above it, so the argument is made once, in order, and the
              cascade is read as its conclusion rather than as a sidebar.
              Prose keeps a reading measure while the diagram steps out wider —
              the same column, set to the width each thing actually wants. */}
          <div className="mt-10 max-w-3xl space-y-6">
            <Reveal variant="fade">
              <p className="text-lg leading-relaxed text-body">
                AGT is the precursor in the RAAS pathway and is crucial for
                blood pressure regulation. Standard RAAS inhibitors act
                downstream and do not completely suppress the RAAS pathway.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={100}>
              <p className="text-lg leading-relaxed text-body">
                By targeting AGT synthesis in the liver via RNA interference,
                CIN-111 is designed to block the RAAS cascade upstream.
              </p>
            </Reveal>
          </div>

          <Reveal variant="rise" delay={140} className="mt-14 max-w-5xl">
            <RaasPathway />
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
