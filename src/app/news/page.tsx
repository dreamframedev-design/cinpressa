import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";

export const metadata: Metadata = {
  title: "News",
  description:
    "Company news, financing milestones, clinical initiation, and study readouts as CinPressa's CIN-111 program advances from preclinical data into first-in-human studies.",
};

const coverage = [
  {
    title: "Financing milestones",
    body: "Series A progress and capital to advance CIN-111 through Phase 1.",
  },
  {
    title: "Clinical initiation",
    body: "IND submission and the start of the first-in-human study.",
  },
  {
    title: "Study readouts",
    body: "Serial safety, AGT knockdown, and blood pressure data as cohorts report.",
  },
  {
    title: "Company updates",
    body: "Team, partnerships, and program developments across the portfolio.",
  },
];

const horizon = [
  { marker: "Anticipated mid-2026", title: "U.S. IND submission for CIN-111" },
  { marker: "Anticipated fall 2026", title: "First-in-human study commences" },
];

export default function NewsPage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        <PageHero
          eyebrow="Updates"
          title="News from CinPressa"
          subtitle="Follow CinPressa's progress as CIN-111 advances through development."
        />

        {/* Newsroom in progress */}
        <Section>
          <Reveal
            variant="rise"
            className="relative overflow-hidden rounded-3xl border border-line bg-mist/60 px-7 py-14 sm:px-12 sm:py-20"
          >
            <div
              aria-hidden
              className="anim-orbit pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] opacity-70"
            >
              <svg viewBox="0 0 360 360" className="h-full w-full">
                <circle cx="180" cy="180" r="176" fill="none" stroke="#BED7EC" strokeWidth="1" strokeDasharray="1 8" />
                <circle cx="180" cy="180" r="132" fill="none" stroke="#DCE7F1" strokeWidth="1" />
              </svg>
            </div>
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
                Newsroom in progress
              </span>
              <h2 className="mt-6 text-[clamp(1.75rem,3.2vw,2.5rem)] font-light leading-[1.15] tracking-tight text-ink">
                The first announcements are on their way
              </h2>
              <p className="mt-6 text-base leading-relaxed text-body">
                This page will highlight company news, financing milestones,
                clinical initiation, study readouts, and other key developments
                as the CIN-111 program moves from preclinical data into
                first-in-human studies and beyond.
              </p>
              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-blue px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-ink hover:shadow-[0_18px_36px_-18px_rgba(34,97,173,0.6)] active:translate-y-px"
              >
                Get in touch to stay informed
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </Section>

        {/* What we'll cover + on the horizon */}
        <Section tone="mist" size="sm">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
            <div>
              <SectionHeader as="h2" eyebrow="What we'll cover" title="Follow the program" />
              <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {coverage.map((item, i) => (
                  <Reveal
                    key={item.title}
                    variant="fade"
                    delay={i * 70}
                    className="bg-white p-6"
                  >
                    <h3 className="text-base font-medium text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-body">{item.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader as="h2" eyebrow="On the horizon" title="Anticipated milestones" tone="sky" />
              <ol className="relative mt-10">
                <span aria-hidden className="absolute left-[5px] top-2 bottom-2 w-px bg-line" />
                {horizon.map((item, i) => (
                  <Reveal
                    key={item.title}
                    as="li"
                    variant="rise"
                    delay={i * 90}
                    className="relative flex gap-5 pb-8 last:pb-0"
                  >
                    <span aria-hidden className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border border-sky bg-white ring-4 ring-mist">
                      <span className="absolute inset-[3px] rounded-full bg-sky" />
                    </span>
                    <div className="-mt-0.5">
                      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-sky">
                        {item.marker}
                      </p>
                      <p className="mt-1.5 text-base font-light tracking-tight text-ink">
                        {item.title}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Forward-looking and subject to change as the program progresses.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
