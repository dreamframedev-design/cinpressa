import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { FlowField } from "@/components/flow-field";
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
        {/* Flow held and then released — the page's own subject, stated in mass
            before a word is read. The forty-two hairline pressure traces that
            used to sit here made the same argument in a language this brand
            does not speak. See flow-field.tsx. */}
        <PageHero
          field={<FlowField className="absolute inset-0" />}
          eyebrow="Unmet need"
          title="Blood pressure control still depends on daily adherence"
          deck="The challenge is persistence"
        />

        {/* The burden */}
        <Section>
          <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <div>
              <Reveal variant="fade">
                <p className="text-base leading-relaxed text-body">
                  Medication non-adherence is the leading cause of poor blood
                  pressure control, and hypertension is largely asymptomatic,
                  resulting in poor long-term adherence and treatment
                  persistence.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={100}>
                <p className="mt-6 text-base leading-relaxed text-body">
                  Persistent uncontrolled blood pressure substantially increases
                  the risk of serious complications:
                </p>
              </Reveal>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {complications.map((c, i) => (
                  <Reveal key={c} as="span" variant="fade" delay={i * 50}>
                    <span className="inline-flex rounded-full border border-pale/70 bg-pale/25 px-4 py-2 text-base text-body">
                      {c}
                    </span>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Pull quote */}
            <Reveal variant="rise-blur" delay={120} className="lg:pt-4">
              <blockquote className="border-l-2 border-blue pl-7">
                <p className="text-[clamp(1.5rem,2.6vw,2.05rem)] font-light leading-[1.25] tracking-tight text-ink">
                  In hypertension, the challenge is not simply whether blood
                  pressure can be lowered. The challenge is whether it can remain{" "}
                  <span className="text-blue">controlled over time.</span>
                </p>
              </blockquote>
            </Reveal>
          </div>
        </Section>

        {/* CinPressa solution. The same field as the header, at watermark
            strength and seeded to a different moment so the two are siblings
            rather than the same picture twice. It sits behind the copy as
            atmosphere, so it reads without asking to be decoded and costs the
            section no height. */}
        <Section
          tone="green"
          art={
            <FlowField
              variant="ambient"
              transparent
              seed={2.6}
              strength={0.34}
              className="absolute inset-0"
            />
          }
        >
          <SectionHeader
            eyebrow="CinPressa solution"
            title="A new treatment paradigm"
            deck="Long-acting control with infrequent dosing"
          />
          <div className="mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal variant="fade">
              <p className="text-base leading-relaxed text-body">
                CinPressa is developing a treatment model that shifts
                hypertension management from daily patient behavior to
                infrequent provider-administered therapy.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={100}>
              <p className="text-base leading-relaxed text-body">
                Rather than relying on daily oral dosing, the aim is to deliver
                durable blood pressure control with long-acting AGT silencing,
                while still allowing complementary antihypertensive agents to be
                layered onto an already controlled foundation for patients who
                require additional reduction.
              </p>
            </Reveal>
          </div>
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
