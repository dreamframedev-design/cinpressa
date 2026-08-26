import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";
import {
  ANNOUNCEMENTS,
  formatAnnouncementDate,
} from "@/lib/news";

/**
 * NewsFeed — the homepage newsroom teaser.
 *
 * THE THING THAT KEPT GETTING KICKED BACK WAS NOT THE STYLING. This section has
 * now been a "what's ahead" teaser, a forward calendar, and a dated list, and
 * every version was rejected for looking like something other than a press
 * release section. It was: all three were the two planned MILESTONES dressed in
 * news clothing. Milestones dated "Mid-2026" and "Fall 2026" are things that
 * have not happened, and no amount of formatting makes an unhappened thing read
 * as a release. /news had this right the whole time — it keeps announcements and
 * milestones in separate sections, and its announcement list is empty because
 * there are no announcements.
 *
 * So this is an announcements list now, sharing /news's data and date format
 * (see lib/news.ts). It renders real releases when there are real releases:
 * full date, kind, wire-style headline, summary, and a link to the release
 * itself. Until then it says so plainly, because a newsroom with nothing in it
 * is a normal thing for a company at this stage and pretending otherwise is
 * what has been failing review.
 *
 * The milestones did not go anywhere — they live on /news under "What's ahead",
 * which is where forward-looking items belong.
 */
export function NewsFeed({ className = "" }: { className?: string }) {
  if (ANNOUNCEMENTS.length === 0) {
    return (
      <div className={`news-feed ${className}`}>
        <Reveal variant="fade">
          <div className="news-empty">
            <p className="news-empty-body">
              CinPressa has not issued any announcements yet. Company news,
              financing milestones, clinical initiation and study readouts will
              be posted here as the CIN-111 program advances.
            </p>
            <Link href="/news" className="news-empty-link group">
              <span className="link-underline">Visit the newsroom</span>
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <ol className={`news-feed ${className}`}>
      {ANNOUNCEMENTS.slice(0, 3).map((item, i) => (
        <Reveal key={item.date + item.title} as="li" variant="fade" delay={i * 120}>
          <article className="news-entry">
            <div className="news-meta">
              <time dateTime={item.date} className="news-when">
                {formatAnnouncementDate(item.date)}
              </time>
              <span className="news-kind">{item.category}</span>
            </div>
            <div>
              <h3 className="news-title">{item.title}</h3>
              <p className="news-body">{item.summary}</p>
              {item.href ? (
                <a href={item.href} className="news-link group">
                  <span className="link-underline">Read the release</span>
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              ) : null}
            </div>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}
