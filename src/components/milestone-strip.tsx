import { Reveal } from "@/components/reveal";

/**
 * The forward calendar for the homepage news section.
 *
 * DELIBERATELY PLAIN. Two earlier cuts got this wrong in opposite directions:
 * the first was a line and two dots, which is not a design, and the second
 * overcorrected into a measured axis with forty-one minor ticks, ring-and-core
 * stations and drop lines — a surveying instrument built to carry two dates.
 * It also put the section back in the hairline language the brand direction had
 * just moved away from.
 *
 * What is actually here is two dated entries, so that is what it draws: a rule,
 * a date, what happens, and one sentence. The hierarchy does the work — the
 * date is the headline because the date is the news — and the rules line the
 * two columns up so the pair reads as a schedule rather than as two headings.
 * Nothing is invented, so nothing has to be decoded.
 *
 * Content note: CinPressa has issued no announcements, so there is no news to
 * preview and inventing one is not an option. Both entries restate copy already
 * approved on /news under "What's ahead", and both stay framed as plans. Swap
 * this for a real teaser when the first release lands.
 */

type Milestone = {
  when: string;
  title: string;
  body: string;
};

const MILESTONES: Milestone[] = [
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

export function MilestoneStrip() {
  return (
    <div className="mt-16">
      <Reveal variant="fade">
        <p className="text-[0.84rem] font-semibold uppercase tracking-[0.2em] text-blue">
          What&rsquo;s ahead
        </p>
      </Reveal>

      <div className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-14">
        {MILESTONES.map((m, i) => (
          <Reveal key={m.when} variant="rise" delay={i * 110}>
            <div className="border-t border-line pt-7">
              <p className="text-[1.75rem] font-light leading-none tracking-tight text-ink sm:text-[2.1rem]">
                {m.when}
              </p>
              <p className="mt-4 text-[1.1rem] font-semibold leading-snug text-blue">
                {m.title}
              </p>
              <p className="mt-3 max-w-md text-base leading-relaxed text-body">
                {m.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
