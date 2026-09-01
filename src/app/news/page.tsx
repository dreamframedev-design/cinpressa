import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
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

        {/* THE SECTION HEADER IS GONE, and the section closes up behind it. It
            ran an eyebrow, "Company news and milestones", and a sentence saying
            that news would be posted here as the program advances - directly
            under a page hero already titled "News from CinPressa" and
            subtitled with the same promise. It was the third statement of one
            fact, and the list beneath it needs no introduction: a dated,
            categorised entry announces itself.

            With it removed the padding is the whole spacing fix. The section
            was pulled to pt-10 to sit close under the hero, then the header
            added its own stack and the list added mt-14 on top of that. Now
            there is one gap between the hero and the first entry, and it is
            this one. */}
        <Section className="pt-2! lg:pt-6!">
          <div>
            {hasNews ? (
              <ol className="grid gap-px overflow-hidden rounded-[6px] border border-line bg-line">
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
                className="rounded-[6px] border border-line bg-white/70 px-7 py-16 text-center sm:py-20"
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
