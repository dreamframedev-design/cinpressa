import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { TeamGrid } from "@/components/team-grid";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "CinPressa is powered by CinRx Pharma's development engine and led by the founding team behind CinCor's baxdrostat program and its $1.9B exit to AstraZeneca.",
};

/** One petal colour per discipline, echoing the mark's overlapping palette. */
const disciplines = [
  { label: "Clinical strategy", dot: "bg-blue" },
  { label: "Translational science", dot: "bg-cobalt" },
  { label: "Toxicology", dot: "bg-azure" },
  { label: "CMC", dot: "bg-cyan" },
  { label: "Pharmacology", dot: "bg-green" },
  { label: "Data management", dot: "bg-periwinkle" },
  { label: "Finance", dot: "bg-indigo" },
  { label: "Business development", dot: "bg-sky" },
];

export default function AboutPage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* `lineage`: two families of strata enter independently and interleave into
            one stave. The page's argument is that this team and the CinRx engine are
            carried forward together. */}
        <PageHero
          variant="lineage"
          eyebrow="CinPressa leadership"
          title="The team behind CIN-111"
          subtitle="CinPressa is powered by CinRx Pharma's proven development engine and led by the founding team behind CinCor Pharma's baxdrostat program and its $1.9 billion exit to AstraZeneca."
        />

        {/* Track record + team */}
        <Section>
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <Reveal variant="fade">
                <p className="text-base leading-relaxed text-body">
                  Our cross-functional team spans scientific, technical, and
                  clinical development expertise. The scalable hub-and-spoke
                  CinRx model has put more than $300 million to work across
                  multiple CinCos, with embedded partnership from Medpace CRO for
                  operational efficiency and trial quality.
                </p>
              </Reveal>

              <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-px overflow-hidden">
                {disciplines.map((d, i) => (
                  <Reveal
                    key={d.label}
                    variant="fade"
                    delay={i * 50}
                    className="flex items-center gap-3 border-t border-line py-3.5"
                  >
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 rounded-full ${d.dot}`}
                    />
                    <span className="text-[0.95rem] text-body">{d.label}</span>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Reveal
                variant="rise"
                className="lift rounded-2xl border border-pale/70 bg-[linear-gradient(150deg,#f4f9fd_0%,#e8f2fb_100%)] p-8"
              >
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-extralight leading-none tracking-tight text-blue">
                  $1.9B
                </p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-body">
                  CinCor Pharma&rsquo;s baxdrostat exit to AstraZeneca, led by
                  CinPressa&rsquo;s founding team.
                </p>
              </Reveal>
              <Reveal
                variant="rise"
                delay={100}
                className="lift rounded-2xl border border-indigo/25 bg-[linear-gradient(150deg,#f7f8fd_0%,#eceef8_100%)] p-8"
              >
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-extralight leading-none tracking-tight text-indigo">
                  $300M+
                </p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-body">
                  Deployed across multiple CinCos through the scalable
                  hub-and-spoke CinRx model.
                </p>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* Leadership */}
        <Section tone="sky">
          <SectionHeader
            eyebrow="Leadership"
            title="The people behind the program"
            subtitle="CinPressa's founding team led CinCor Pharma's baxdrostat program from discovery through its $1.9 billion exit to AstraZeneca."
          />
          <div className="mt-14">
            <TeamGrid />
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
