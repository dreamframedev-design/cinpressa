import { Reveal } from "@/components/reveal";

type Entry = {
  /** Dated, and dated in full — see the note below. */
  when: string;
  title: string;
  body: string;
};

/**
 * NewsFeed — the homepage news list.
 *
 * WHAT CHANGED AND WHY. This was a "forward calendar": a giant 2026 filling a
 * left panel with the two milestones stacked beside it. It looked considered,
 * and it was the wrong instrument — a partner or investor arriving at a News
 * heading is looking for the thing every biotech site puts there, which is a
 * dated list. Giving them a bespoke calendar instead makes them work out the
 * format before they can read the content, and on this site the note back was
 * exactly that: it is not what a news section looks like.
 *
 * So it is a dated list now. Date, headline, one line of detail, hairline
 * between entries — the standard idiom, because the standard idiom is standard
 * for a reason and a company with two entries is not the company that should be
 * reinventing it. The year went into the dates where a news list keeps it,
 * which is what let the calendar panel go.
 *
 * THESE ARE NOT ANNOUNCEMENTS AND DO NOT PRETEND TO BE. There are no press
 * releases yet and inventing one is not an option, so the entries are the two
 * planned milestones already approved on /news, in their own words — "plans to
 * submit", "is expected to commence". Future-dated and conditionally worded,
 * they cannot be mistaken for things that have happened. When the first real
 * release lands it drops into this list without a redesign, which the calendar
 * could never have done.
 *
 * No hover state: these rows are not links, and colour that answers a cursor is
 * a promise of somewhere to go.
 */
const ENTRIES: Entry[] = [
  {
    when: "Mid-2026",
    title: "U.S. IND submission",
    body: "CinPressa plans to submit a U.S. Investigational New Drug application for CIN-111.",
  },
  {
    when: "Fall 2026",
    title: "First-in-human study",
    body: "A U.S. single-dose, single ascending dose study in patients with mild-to-moderate hypertension is expected to commence.",
  },
];

export function NewsFeed({ className = "" }: { className?: string }) {
  return (
    <ol className={`news-feed ${className}`}>
      {ENTRIES.map((e, i) => (
        <Reveal key={e.when} as="li" variant="fade" delay={i * 120}>
          <article className="news-entry">
            <p className="news-when">{e.when}</p>
            <div>
              <h3 className="news-title">{e.title}</h3>
              <p className="news-body">{e.body}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}
