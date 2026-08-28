import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { MarkArt } from "@/components/geometry";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";
import { ANNOUNCEMENTS, formatAnnouncementDate } from "@/lib/news";

export const metadata: Metadata = {
  title: "News",
  description:
    "Follow CinPressa's progress as CIN-111 advances through development.",
};


export default function NewsPage() {
  const hasNews = ANNOUNCEMENTS.length > 0;

  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* Uses the default header treatment, the same one /about carries. */}
        <PageHero
          eyebrow="Updates"
          title="News from CinPressa"
          subtitle="Follow CinPressa's progress as CIN-111 advances through development."
        />

        {/* Pulled up. The hero above carries a subtitle so it runs its full
            41rem, and this section's own py-28 sat under that - about two
            hundred pixels of white between the headline and the first thing
            the page is actually for. */}
        <Section className="pt-10! lg:pt-14!">
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
                        className="text-[0.92rem] font-semibold uppercase tracking-[0.15em] text-body"
                      >
                        {formatAnnouncementDate(item.date)}
                      </time>
                      <span className="inline-flex rounded-full border border-pale/70 bg-pale/25 px-3 py-1 text-[0.9rem] font-semibold uppercase tracking-[0.11em] text-blue">
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

      </main>

      <SiteFooter />
    </div>
  );
}
