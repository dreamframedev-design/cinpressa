import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { HeroPulse } from "@/components/hero-pulse";
import { HeroLaminar } from "@/components/hero-laminar";
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

/**
 * Every line is a clause of the site map's Mechanism body. The previous set
 * carried compensatory-renin-rebound and RAAS-escape claims that the updated
 * copy no longer makes, so they are gone rather than restated.
 */
const upstreamBenefits = [
  "Prolonged duration of action",
  "Durable blood pressure reduction",
  "Residual pathway activity addressed at the source rather than downstream",
  "Differentiated from standard RAAS blockade",
];

export default function SciencePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* Pressure traces: many quarrelling daily readings on the left,
            funnelling into one calm synchronised braid. The page's own subject,
            stated before a word is read. See hero-pulse.tsx. */}
        <PageHero
          field={<HeroPulse className="absolute inset-0" />}
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

        {/* CinPressa solution. The backdrop is the laminar field: flow that
            holds its line unbroken past an obstruction, which is what "a
            continuous backbone" looks like. It sits behind the copy as
            atmosphere rather than inline as a figure, so it reads without
            asking to be decoded and costs the section no height. */}
        <Section
          tone="green"
          art={
            /* Watermark register, not hero register. The mark this replaced sat
               at 0.14; a full field of hairlines carries more ink than a mark,
               so it lands a little above that and no higher — the copy crosses
               it and must win. */
            <HeroLaminar
              transparent
              className="absolute inset-0 opacity-[0.3]"
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

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div>
              <Reveal variant="fade">
                <p className="text-base leading-relaxed text-body">
                  AGT is the precursor in the RAAS pathway and is crucial for
                  blood pressure regulation. Standard RAAS inhibitors act
                  downstream and do not completely suppress the RAAS pathway.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={100}>
                <p className="mt-6 text-base leading-relaxed text-body">
                  By targeting AGT synthesis in the liver via RNA interference,
                  CIN-111 is designed to block the RAAS cascade upstream:
                </p>
              </Reveal>

              <ul className="mt-7 space-y-4">
                {upstreamBenefits.map((benefit, i) => (
                  <Reveal
                    key={benefit}
                    as="li"
                    variant="fade"
                    delay={i * 70}
                    className="flex gap-3.5"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue/10"
                    >
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
                        <path
                          d="M2.5 6.2 5 8.5 9.5 3.5"
                          fill="none"
                          stroke="#2261AD"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-base leading-relaxed text-body">
                      {benefit}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>

            <Reveal variant="rise" delay={120}>
              <RaasPathway />
            </Reveal>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
