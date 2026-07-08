import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { RaasPathway } from "@/components/raas-pathway";
import { PetalBloom } from "@/components/geometry";
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

const upstreamBenefits = [
  "Prolonged duration of action from liver-specific AGT suppression",
  "Consistent, durable blood pressure reduction with infrequent dosing",
  "Reduced risk of compensatory renin rebound",
  "Potential to overcome RAAS escape through sustained upstream suppression",
];

export default function SciencePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        <PageHero
          eyebrow="Unmet need"
          title="Blood pressure control still depends on daily adherence"
          subtitle="Hypertension requires lifelong treatment, yet long-term control remains difficult to achieve for a large proportion of patients despite numerous approved therapies."
        />

        {/* The burden */}
        <Section>
          <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <div>
              <Reveal variant="fade">
                <p className="text-base leading-relaxed text-body">
                  Approximately 1.4 billion people globally live with
                  hypertension, and more than 700 million remain uncontrolled or
                  untreated. Around 70 percent of treated patients do not reach
                  target blood pressure levels. Medication non-adherence is the
                  leading cause of poor control, and because hypertension is
                  largely asymptomatic, long-term persistence is difficult to
                  sustain over time.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={100}>
                <p className="mt-6 text-base leading-relaxed text-body">
                  Persistent uncontrolled blood pressure substantially increases
                  the risk of serious cardiovascular, renal, and neurological
                  complications:
                </p>
              </Reveal>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {complications.map((c, i) => (
                  <Reveal key={c} as="span" variant="fade" delay={i * 50}>
                    <span className="inline-flex rounded-full border border-line bg-mist px-4 py-2 text-sm text-body">
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
                  The challenge is not simply whether blood pressure can be
                  lowered. It is whether it can remain{" "}
                  <span className="text-blue">controlled over time.</span>
                </p>
              </blockquote>
            </Reveal>
          </div>
        </Section>

        {/* CinPressa solution */}
        <Section
          tone="mist"
          art={
            <PetalBloom
              petals={9}
              stroke="#BED7EC"
              tint="#3AAED8"
              tintOpacity={0.05}
              spin="slow"
              className="absolute -right-44 -top-40 h-[560px] w-[560px] opacity-80"
            />
          }
        >
          <SectionHeader
            eyebrow="CinPressa solution"
            title="A continuous backbone of blood pressure control"
            subtitle="CinPressa is developing a long-acting AGT siRNA designed to provide durable blood pressure reduction with one to two administrations per year."
          />
          <div className="mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal variant="fade">
              <p className="text-base leading-relaxed text-body">
                By shifting hypertension management from daily patient behavior
                to infrequent, provider-administered treatment, CinPressa is
                pursuing a model designed for durability, consistency, and
                real-world persistence.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={100}>
              <p className="text-base leading-relaxed text-body">
                Meaningful baseline reduction may be sufficient for many patients
                as monotherapy. For those who require additional control,
                complementary agents can be layered onto an already-controlled
                foundation.
              </p>
            </Reveal>
          </div>
        </Section>

        {/* Mechanism */}
        <Section>
          <SectionHeader
            eyebrow="Mechanism"
            title="Targeting AGT and RAAS upstream"
            subtitle="Angiotensinogen is the precursor in the RAAS pathway and is crucial for blood pressure regulation."
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div>
              <Reveal variant="fade">
                <p className="text-base leading-relaxed text-body">
                  Standard RAAS inhibitors such as ACE inhibitors and ARBs act
                  downstream and do not completely suppress the pathway — renin
                  production increases, and angiotensin II and aldosterone can
                  rebound over time. Residual activity contributes to persistent
                  hypertension and ongoing cardiovascular and renal risk.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={100}>
                <p className="mt-6 text-base leading-relaxed text-body">
                  By targeting AGT synthesis in the liver via RNA interference,
                  CIN-111 is designed to block the RAAS cascade at its source:
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
                    <span className="text-sm leading-relaxed text-body">
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
