import { Reveal } from "@/components/reveal";

/**
 * The homepage news section was empty. Not sparse: empty. A heading, a sentence and a
 * button, over nothing.
 *
 * The reason is legitimate. CinPressa has issued no announcements yet, so the news
 * archive is an empty state by design and there was nothing to preview. Inventing a
 * headline to fill the hole is not an option on a pharma site.
 *
 * What DOES exist is a forward calendar, already written and already approved on
 * /news under "What's ahead". So the section previews that instead: not what has been
 * said, but what is about to be. Every line below is a restatement of copy already on
 * that page, and both are framed as plans because that is what they are.
 *
 * When the first release lands, this is the component to swap for a real teaser.
 *
 * The design carries the section on structure rather than decoration: a spine, two
 * marked stations, and dates set large enough to be the thing you see first. The spine
 * runs past the last station and dissolves, because the programme continues past the
 * part we can currently name.
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
    <div className="mt-14">
      <Reveal variant="fade">
        <p className="text-[0.84rem] font-semibold uppercase tracking-[0.2em] text-blue">
          What&rsquo;s ahead
        </p>
      </Reveal>

      <div className="relative mt-9">
        {/* The spine. Solid through the named stations, then dissolving: the programme
            continues past the part we can currently put a date on. */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[7px] h-px"
          style={{
            background:
              "linear-gradient(90deg, #2261ad 0%, #1596d4 38%, #1eaee5 62%, rgba(30,174,229,0) 100%)",
          }}
        />

        <div className="grid gap-12 sm:grid-cols-2 sm:gap-10">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.when} variant="rise" delay={i * 120} className="relative">
              {/* Station. Ring plus core, so it reads as a marked point on a line
                  rather than a bullet. */}
              <span
                aria-hidden
                className="absolute left-0 top-0 block h-[15px] w-[15px] rounded-full border-2 bg-white"
                style={{ borderColor: i === 0 ? "#2261ad" : "#1596d4" }}
              />
              <span
                aria-hidden
                className="absolute left-[4.5px] top-[4.5px] block h-1.5 w-1.5 rounded-full"
                style={{ background: i === 0 ? "#2261ad" : "#1596d4" }}
              />

              <div className="pl-8">
                <p className="text-[1.6rem] font-light leading-none tracking-tight text-ink sm:text-[1.9rem]">
                  {m.when}
                </p>
                <p className="mt-3 text-[1.1rem] font-semibold leading-snug text-blue">
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
    </div>
  );
}
