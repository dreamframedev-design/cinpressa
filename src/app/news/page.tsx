import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { HeroPart } from "@/components/hero-fields";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { Timeline } from "@/components/timeline";
import { MarkArt } from "@/components/geometry";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";

export const metadata: Metadata = {
  title: "News",
  description:
    "Follow CinPressa's progress as CIN-111 advances through development.",
};

type Announcement = {
  /** ISO date, drives both the <time> attribute and the displayed date. */
  date: string;
  category: string;
  title: string;
  summary: string;
  href?: string;
};

/**
 * No releases have been issued yet, so this is genuinely empty rather than
 * staged. The page renders an empty state until the first entry lands. Add
 * announcements here, newest first, and the list takes over automatically.
 */
const ANNOUNCEMENTS: Announcement[] = [];

/**
 * Both milestones are restated from the pipeline page, which is the approved
 * source. Nothing here is new information.
 */
const MILESTONES = [
  {
    marker: "Mid-2026",
    title: "U.S. IND submission",
    body: "CinPressa plans to submit a U.S. IND for CIN-111.",
  },
  {
    marker: "Fall 2026",
    title: "First-in-human study",
    body: "A U.S.-based first-in-human study is expected to commence: a single-dose, single ascending dose design in patients with mild-to-moderate hypertension.",
  },
];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function NewsPage() {
  const hasNews = ANNOUNCEMENTS.length > 0;

  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* Part: the field opens and closes, two bodies of colour drawing apart to leave a channel of clean paper and closing again. */}
        <PageHero
          field={<HeroPart className="absolute inset-0" />}
          eyebrow="Updates"
          title="News from CinPressa"
          subtitle="Follow CinPressa's progress as CIN-111 advances through development."
        />

        <Section>
          <SectionHeader
            eyebrow="Announcements"
            title="Company news and milestones"
            subtitle="Company news, financing milestones, clinical initiation, and study readouts will be posted here as the CIN-111 program advances."
          />

          <div className="mt-14">
            {hasNews ? (
              <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line">
                {ANNOUNCEMENTS.map((item, i) => (
                  <Reveal
                    key={item.date + item.title}
                    as="li"
                    variant="rise"
                    delay={i * 80}
                    className="bg-white px-7 py-9 transition-colors hover:bg-mist/60 sm:px-10"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <time
                        dateTime={item.date}
                        className="text-[0.84rem] font-semibold uppercase tracking-[0.15em] text-body"
                      >
                        {dateFormat.format(new Date(item.date))}
                      </time>
                      <span className="inline-flex rounded-full border border-pale/70 bg-pale/25 px-3 py-1 text-[0.82rem] font-semibold uppercase tracking-[0.11em] text-blue">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="mt-4 max-w-3xl text-[clamp(1.25rem,2.2vw,1.6rem)] font-light leading-snug tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-body">
                      {item.summary}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="group mt-5 inline-flex items-center gap-2 text-base font-medium text-blue transition-colors hover:text-ink"
                      >
                        <span className="link-underline">Read the release</span>
                        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </a>
                    ) : null}
                  </Reveal>
                ))}
              </ol>
            ) : (
              <Reveal
                variant="rise"
                className="rounded-3xl border border-line bg-white/70 px-7 py-16 text-center sm:py-20"
              >
                <MarkArt
                  variant="outline"
                  color="#BED7EC"
                  className="mx-auto h-14 w-auto"
                />
                <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-body">
                  CinPressa has not issued any announcements yet. The first
                  updates will appear here.
                </p>
                <Link
                  href="/contact"
                  className="btn-ghost group mt-9"
                >
                  Media enquiries
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            )}
          </div>
        </Section>

        <Section tone="sky">
          <SectionHeader
            eyebrow="What's ahead"
            title="The next milestones for CIN-111"
            subtitle="The program is moving from preclinical work into clinical development."
          />
          <div className="mt-14 max-w-3xl">
            <Timeline items={MILESTONES} />
          </div>
          <Reveal variant="fade" delay={140}>
            <Link
              href="/pipeline"
              className="btn-ghost group mt-12"
            >
              See the full pipeline
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
