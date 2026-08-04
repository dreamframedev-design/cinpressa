import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { EfficacyChart } from "@/components/efficacy-chart";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Pipeline",
  description:
    "CIN-111 is a best-in-class AGT siRNA candidate for hypertension: durable AGT knockdown, a ~100-fold therapeutic window, and a planned first-in-human study in fall 2026.",
};

const phase1Spec = [
  { label: "Design", value: "Single-dose, single ascending dose (SAD)" },
  { label: "Population", value: "Patients with mild-to-moderate hypertension" },
  { label: "Washout", value: "2-week washout of concomitant antihypertensives before dosing" },
  { label: "Assessments", value: "Safety, PK, PD (AGT and blood pressure), and immunogenicity" },
  { label: "Randomization", value: "3:1 (CIN-111 : placebo)" },
  { label: "Cohorts", value: "8 subjects, expandable to 24 when a dose yields >80% AGT reduction at Day 28" },
];

const highlights = [
  { value: "~100×", label: "therapeutic window in GLP toxicology", accent: "text-blue", rule: "bg-blue" },
  { value: "6 mo+", label: "potential dosing interval", accent: "text-cobalt", rule: "bg-cobalt" },
  { value: "2044", label: "expected IP expiry, global and pending in major markets", accent: "text-indigo", rule: "bg-indigo" },
];

export default function PipelinePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* The dark showpiece. Pipeline is the lead-programme page, so it carries the
            one inverted hero on the site, and `interval` cuts the band into stages -
            time as measured intervals rather than as a continuum. */}
        <PageHero
          variant="interval"
          tone="dark"
          eyebrow="Lead program"
          title={
            /* Cyan rather than blue: #2261AD is a 6.6:1 colour chosen for white, and
               on the deep ground it all but disappears. */
            <>
              <span className="text-cyan">CIN-111</span> | Best-in-class AGT
              siRNA for hypertension
            </>
          }
          subtitle="CIN-111 is a best-in-class AGT siRNA candidate for hypertension-related indications, with a profile built around durability, depth of AGT knockdown, and safety."
        />

        {/* Lead program: the map's body */}
        <Section tone="sky">
          <div className="grid gap-6 lg:max-w-4xl">
            <Reveal variant="fade">
              <p className="text-lg leading-relaxed text-body">
                In hypertensive non-human primates, CIN-111 achieved nearly 100
                percent reduction in AGT protein at one month, sustained with a
                mean of approximately 88 percent reduction on Day 119. CIN-111
                reduced systolic blood pressure to below 120 mmHg from Day 42
                onward, with no significant rebound trend by Day 119, and
                outperformed Roche&rsquo;s zilebesiran at the same dose.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={100}>
              <p className="text-lg leading-relaxed text-body">
                CIN-111 has demonstrated roughly a 100-fold therapeutic window
                with an excellent safety profile in GLP toxicology studies. These
                data support the potential for six-month or longer dosing
                intervals. The IP estate for CIN-111 is global, pending in major
                markets, with expected expiry in 2044.
              </p>
            </Reveal>
          </div>

          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {highlights.map((h, i) => (
              <Reveal
                key={h.label}
                variant="rise"
                delay={i * 90}
                className="bg-white px-7 py-8"
              >
                <span aria-hidden className={`mb-5 block h-px w-10 ${h.rule}`} />
                <dd
                  className={`text-[clamp(2rem,3.5vw,2.75rem)] font-extralight leading-none tracking-tight ${h.accent}`}
                >
                  {h.value}
                </dd>
                <dt className="mt-3 text-[0.95rem] leading-relaxed text-body">{h.label}</dt>
              </Reveal>
            ))}
          </dl>

          {/* The curves behind the two paragraphs above */}
          <div className="mt-14">
            <EfficacyChart />
          </div>
        </Section>

        {/* Development stage */}
        <Section>
          <SectionHeader
            eyebrow="Pipeline"
            title="CIN-111 development stage"
            subtitle="A single, focused program advancing from preclinical work into first-in-human development."
          />
          <div className="mt-14">
            <PipelineDiagram />
          </div>
        </Section>

        {/* Clinical development */}
        <Section tone="indigo">
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
                  <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.15em] text-blue sm:pt-0.5">
                    {row.label}
                  </dt>
                  <dd className="text-base leading-relaxed text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Section>

      </main>

      <SiteFooter />
    </div>
  );
}
