import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { OpenFlow } from "@/components/open-flow";
import { Section } from "@/components/section";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import { SectionHeader } from "@/components/section-header";
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
  /* Was "6 mo+ / potential dosing interval". The updated copy states a
     long-acting profile with infrequent administration and no longer claims a
     six-month interval, so the tile now carries the NHP durability figure the
     body does support. */
  { value: "~88%", label: "mean AGT reduction sustained to Day 119 in hypertensive NHPs", accent: "text-cobalt", rule: "bg-cobalt" },
  { value: "2044", label: "expected IP expiry, global and pending in major markets", accent: "text-indigo", rule: "bg-indigo" },
];

export default function PipelinePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* Open flow, moved here from /science: ribbons that widen and
            narrow but never pinch, which is the one gesture a page about an
            unconstricted pathway cannot make. The churn that was here went
            to the homepage hero, where it is now treatment A. */}
        <PageHero
          field={<OpenFlow className="absolute inset-0" />}
          eyebrow="Lead program"
          title={
            <>
              <span className="text-blue">CIN-111</span>{" "}
              {/* Stone, not ink. At display weight a full-strength pipe beside
                  "CIN-111" reads as a fourth 1 - the name looked like CIN-1111.
                  It is a separator, so it sits back with the rules. */}
              <span className="text-stone">|</span> Best-in-class AGT siRNA for
              hypertension
            </>
          }
        />

        {/* Development stage. FIRST ON THE PAGE, directly under the hero.
            This is the one thing a reader opens a pipeline page to see, and it
            was sitting third, below two screens of prose. Everything below it
            now reads as the detail behind it rather than the run-up to it.

            The bar itself stays as it is — it is the pipeline, and a pipeline
            page without one is a pipeline page without a pipeline. What was
            wrong with it was a claim, not the chart: it ran a quarter into Phase
            1 and called that stage "Underway", while this page's own copy says
            the IND is planned and the study is expected to commence. Corrected
            rather than deleted — the bar stops where the completed work stops,
            and the Phase 1 note under it says planned. See
            pipeline-diagram.tsx. */}
        <Section className="pt-12! pb-10! lg:pt-16! lg:pb-14!">
          {/* NO HEADLINE OVER THE BAR. "CIN-111 development stage" and its
              subtitle are deleted: the hero directly above already names the
              programme, and a headline repeating it pushed the one thing a
              reader opens this page for further down the screen. The eyebrow
              stays, so the figure is still labelled. SectionHeader is not used
              because it exists to set a headline, and there is no longer one. */}
          <Reveal variant="fade">
            <p className="flex items-center gap-3 text-[0.92rem] font-semibold uppercase tracking-[0.2em] text-blue">
              <span aria-hidden className="h-px w-8 bg-blue/40" />
              Pipeline
            </p>
          </Reveal>
          <div className="mt-9">
            <PipelineDiagram />
          </div>
        </Section>

        {/* Lead program: the map's body */}
        {/* Pulled up to meet the bar. The stage section's own bottom padding
            and this one's top padding stacked to about 250px of white under the
            Phase 1 note, which read as the page ending rather than continuing.
            The tone still changes at the seam, so the two keep some air, just
            not a screen of it. */}
        <Section tone="sky" className="pt-12! lg:pt-16!">
          <div className="grid gap-6 lg:max-w-4xl">
            <Reveal variant="fade">
              <p className="text-lg leading-relaxed text-body">
                CIN-111 is a best-in-class AGT siRNA candidate for
                hypertension-related indications, with a profile built around
                durability, depth of AGT knockdown, and safety. In hypertensive
                non-human primates, CIN-111 achieved nearly 100 percent reduction
                in AGT protein at one month, sustained with a mean of
                approximately 88 percent reduction on Day 119. CIN-111 reduced
                systolic blood pressure to below 120 mmHg from Day 42 onward,
                with no significant rebound trend by Day 119, and outperformed
                Roche&rsquo;s zilebesiran at the same dose.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={100}>
              <p className="text-lg leading-relaxed text-body">
                CIN-111 has demonstrated roughly a 100-fold therapeutic window
                with an excellent safety profile in GLP toxicology studies.
                Together, these data support a long-acting profile with
                infrequent administration. The IP estate for CIN-111 is global,
                pending in major markets, with expected expiry in 2044.
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
                <dt className="mt-3 text-base leading-relaxed text-body">{h.label}</dt>
              </Reveal>
            ))}
          </dl>

          {/* THE EFFICACY CURVES WERE DELETED HERE. Their own header said it:
              only four figures in that chart were real, and everything between
              the anchors — the baseline blood pressure, the shape of every
              curve, and the ENTIRE zilebesiran comparator — was invented so the
              layout could be designed. A fabricated head-to-head against a
              named competitor is not a placeholder, it is a claim. The four real
              figures are stated in the copy above, which is where they belong
              until the source dataset exists. */}
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
                  <dt className="text-[0.92rem] font-semibold uppercase tracking-[0.15em] text-blue sm:pt-0.5">
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
