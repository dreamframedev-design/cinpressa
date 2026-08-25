import { Reveal } from "@/components/reveal";

/** The homepage's compact forward calendar. It carries only the two milestones
 * already approved on /news; the large year supplies the visual anchor that a
 * conventional news card cannot provide while the announcement list is empty. */

type Milestone = {
  when: string;
  title: string;
  body: string;
};

const MILESTONES: Milestone[] = [
  {
    when: "Mid-year",
    title: "U.S. IND submission",
    body: "CinPressa plans to submit a U.S. Investigational New Drug application for CIN-111.",
  },
  {
    when: "Fall",
    title: "First-in-human study",
    body: "A U.S. single-dose, single ascending dose study in patients with mild-to-moderate hypertension is expected to commence.",
  },
];

export function MilestoneStrip() {
  return (
    <section
      aria-label="2026 forward calendar"
      className="mt-14 border-y border-line/80"
    >
      <div className="grid lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.6fr)]">
        <Reveal
          variant="fade"
          className="flex min-h-44 flex-col justify-between border-b border-line/80 py-7 lg:min-h-[22rem] lg:border-b-0 lg:border-r lg:py-9 lg:pr-10"
        >
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-blue">
            Forward calendar
          </p>
          <p
            aria-hidden
            className="mt-10 text-[clamp(5rem,10vw,8.5rem)] font-light leading-[0.78] tracking-[-0.04em] text-blue"
          >
            2026
          </p>
        </Reveal>

        <ol className="divide-y divide-line/80">
          {MILESTONES.map((m, i) => (
            <Reveal
              key={m.when}
              as="li"
              variant="rise"
              delay={i * 100}
              className="grid gap-4 py-7 lg:min-h-44 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:items-start lg:px-10 lg:py-9"
            >
              <p className="pt-1 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-blue">
                {m.when}
              </p>
              <div>
                <h3 className="text-[1.2rem] font-medium leading-snug tracking-tight text-ink md:text-[1.35rem]">
                  {m.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-body">
                  {m.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
