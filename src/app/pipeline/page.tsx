import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { PipelineTracker } from "@/components/pipeline-tracker";
import { NhpResponseChart } from "@/components/nhp-response-chart";
import { Timeline } from "@/components/timeline";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Pipeline",
  description:
    "CIN-111 is a best-in-class AGT siRNA candidate for hypertension — near-complete, durable AGT knockdown, a ~100-fold therapeutic window, and a planned first-in-human study in fall 2026.",
};

const nhpFindings = [
  "Near-complete AGT knockdown by ~1 month, with ~88% sustained at Day 119.",
  "Systolic blood pressure reduced below 120 mmHg from Day 42, with no significant rebound by Day 119.",
  "Outperformed Roche's zilebesiran at the same dose.",
  "~100-fold therapeutic window with an excellent safety profile in GLP toxicology studies.",
];

const phase1Spec = [
  { label: "Design", value: "Single-dose, single ascending dose (SAD)" },
  { label: "Population", value: "Patients with mild-to-moderate hypertension" },
  { label: "Washout", value: "2-week washout of concomitant antihypertensives before dosing" },
  { label: "Assessments", value: "Safety, PK, PD (AGT and blood pressure), and immunogenicity" },
  { label: "Randomization", value: "3:1 (CIN-111 : placebo)" },
  { label: "Cohorts", value: "8 subjects, expandable to 24 when a dose yields >80% AGT reduction at Day 28" },
];

const highlights = [
  { value: "~100×", label: "therapeutic window in GLP toxicology" },
  { value: "6 mo+", label: "potential dosing interval" },
  { value: "2044", label: "expected IP expiry — global, pending in major markets" },
];

export default function PipelinePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        <PageHero
          eyebrow="Lead program"
          title={
            <>
              <span className="text-blue">CIN-111</span> — a best-in-class AGT
              siRNA for hypertension
            </>
          }
          subtitle="CIN-111 is a best-in-class AGT siRNA candidate for hypertension-related indications, with a profile built around durability, depth of AGT knockdown, and safety."
        />

        {/* Program status */}
        <Section size="sm">
          <Reveal variant="rise" className="rounded-3xl border border-line bg-white p-7 sm:p-10">
            <PipelineTracker />
          </Reveal>
        </Section>

        {/* Preclinical evidence */}
        <Section tone="mist">
          <SectionHeader
            eyebrow="Preclinical evidence"
            title="Deep, durable AGT knockdown"
            subtitle="In hypertensive non-human primates, CIN-111 achieved nearly 100 percent reduction in AGT protein at one month, sustained near 88 percent at Day 119."
          />
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
            <NhpResponseChart />
            <ul className="space-y-5">
              {nhpFindings.map((finding, i) => (
                <Reveal
                  key={finding}
                  as="li"
                  variant="fade"
                  delay={i * 80}
                  className="flex gap-3.5 border-b border-line pb-5 last:border-0 last:pb-0"
                >
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                  <span className="text-base leading-relaxed text-body">{finding}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {highlights.map((h, i) => (
              <Reveal
                key={h.label}
                variant="rise"
                delay={i * 90}
                className="bg-white px-7 py-8"
              >
                <dd className="text-[clamp(2rem,3.5vw,2.75rem)] font-extralight leading-none tracking-tight text-blue">
                  {h.value}
                </dd>
                <dt className="mt-3 text-sm leading-relaxed text-body">{h.label}</dt>
              </Reveal>
            ))}
          </dl>
        </Section>

        {/* Clinical development */}
        <Section>
          <SectionHeader
            eyebrow="Clinical development"
            title="From IND to first-in-human"
            subtitle="CinPressa plans to submit a U.S. IND for CIN-111 around mid-2026, with a U.S.-based first-in-human study expected to commence in fall 2026."
          />
          <Reveal variant="rise" delay={100} className="mt-12 overflow-hidden rounded-2xl border border-line">
            <dl>
              {phase1Spec.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 gap-1 border-b border-line px-6 py-5 last:border-0 sm:grid-cols-[180px_1fr] sm:gap-6 sm:px-8"
                >
                  <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-blue sm:pt-0.5">
                    {row.label}
                  </dt>
                  <dd className="text-base leading-relaxed text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Section>

        {/* Capital & timeline */}
        <Section tone="mist">
          <SectionHeader
            eyebrow="Capital & timeline"
            title="Funding to Phase 1 and beyond"
            subtitle="CinPressa has been seeded with $11.5 million from CinRx to license CIN-111 and initiate first-in-human work, and is seeking a $25 million Series A to complete Phase 1."
          />
          <div className="mt-14 max-w-3xl">
            <Timeline
              items={[
                {
                  marker: "Seeded",
                  title: "$11.5M from CinRx",
                  body: "Capital to license CIN-111 and initiate first-in-human work.",
                },
                {
                  marker: "In progress",
                  title: "$25M Series A",
                  body: "Proceeds are intended to fund through a multi-dose first-in-human study in patients with hypertension and into early 2028.",
                },
                {
                  marker: "Beyond",
                  title: "$50M+ to end of Phase 2",
                  body: "Additional capital expected to reach the end of Phase 2. The plan includes chronic toxicology and reproductive studies, and serial readouts from single- and multiple-dose Phase 1 cohorts to support Phase 2 initiation.",
                },
              ]}
            />
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
