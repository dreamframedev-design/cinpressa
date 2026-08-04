import { Reveal } from "@/components/reveal";

/**
 * The forward calendar for the homepage news section.
 *
 * FIRST VERSION WAS BROKEN. The spine was absolutely positioned at top:7px while the
 * date sat at the top of the same block, so the rule ran straight through the type. It
 * also had no construction to speak of: a line and two dots is not a design.
 *
 * This is drafted instead. The axis is a real measured rule with a minor-tick scale,
 * two stations marked as ring-and-core constructions, and a drop line from each station
 * down to its entry. Content hangs BELOW the axis, so nothing can collide with it. The
 * scale is not decoration: it gives the two dates a span to sit on, which is what makes
 * "Mid-2026" and "Fall 2026" read as points in a programme rather than as two headings.
 *
 * The axis runs past the last station and dissolves, because the programme continues
 * past the part we can currently put a date on. The ticks thin out as it goes for the
 * same reason.
 *
 * Content note: CinPressa has issued no announcements, so there is no news to preview
 * and inventing one is not an option. Both entries below restate copy already approved
 * on /news under "What's ahead", and both stay framed as plans. Swap this for a real
 * teaser when the first release lands.
 */

type Milestone = {
  when: string;
  title: string;
  body: string;
  /** Position along the axis, as a percentage. Matches the grid column starts. */
  at: number;
};

const MILESTONES: Milestone[] = [
  {
    at: 0,
    when: "Mid-2026",
    title: "U.S. IND submission",
    body: "CinPressa plans to submit a U.S. Investigational New Drug application for CIN-111.",
  },
  {
    at: 50,
    when: "Fall 2026",
    title: "First-in-human study",
    body: "A U.S. single-dose, single ascending dose study in patients with mild-to-moderate hypertension is expected to commence.",
  },
];

/** Minor divisions on the scale. Fine, evenly pitched, thinning toward the open end. */
const TICKS = Array.from({ length: 41 }, (_, i) => i);

export function MilestoneStrip() {
  return (
    <div className="mt-16">
      <Reveal variant="fade">
        <p className="text-[0.84rem] font-semibold uppercase tracking-[0.2em] text-blue">
          What&rsquo;s ahead
        </p>
      </Reveal>

      {/* ── The axis ─────────────────────────────────────────────────────────
          Its own band, so nothing below can ever intersect it. */}
      <Reveal variant="fade" delay={90}>
        <div className="relative mt-10 h-9">
          <svg
            aria-hidden
            viewBox="0 0 1000 36"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="ms-axis" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2261ad" />
                <stop offset="42%" stopColor="#1596d4" />
                <stop offset="68%" stopColor="#1eaee5" />
                <stop offset="100%" stopColor="#1eaee5" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Minor scale. Full height at the near end, shortening and fading toward
                the open end where the calendar stops being nameable. */}
            {TICKS.map((i) => {
              const f = i / (TICKS.length - 1);
              const major = i % 5 === 0;
              const len = (major ? 9 : 5) * (1 - f * 0.55);
              return (
                <line
                  key={i}
                  x1={f * 1000}
                  y1={18}
                  x2={f * 1000}
                  y2={18 + len}
                  stroke="#1596d4"
                  strokeOpacity={(major ? 0.5 : 0.28) * (1 - f * 0.8)}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            <line
              x1="0"
              y1="18"
              x2="1000"
              y2="18"
              stroke="url(#ms-axis)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Stations. Ring, core, and a drop line down to the entry below. */}
          {MILESTONES.map((m, i) => (
            <span
              key={m.when}
              aria-hidden
              className="absolute top-1/2 block"
              style={{ left: `${m.at}%`, transform: "translateY(-50%)" }}
            >
              <span
                className="relative block h-[17px] w-[17px] rounded-full border-[1.5px] bg-white"
                style={{ borderColor: i === 0 ? "#2261ad" : "#1596d4" }}
              >
                <span
                  className="absolute left-1/2 top-1/2 block h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: i === 0 ? "#2261ad" : "#1596d4" }}
                />
              </span>
              {/* Drop line to the entry. */}
              <span
                className="absolute left-1/2 top-[17px] block w-px"
                style={{
                  height: "34px",
                  background: `linear-gradient(180deg, ${
                    i === 0 ? "#2261ad" : "#1596d4"
                  } 0%, rgba(21,150,212,0) 100%)`,
                }}
              />
            </span>
          ))}
        </div>
      </Reveal>

      {/* ── The entries ──────────────────────────────────────────────────── */}
      <div className="mt-9 grid gap-12 sm:grid-cols-2 sm:gap-10">
        {MILESTONES.map((m, i) => (
          <Reveal key={m.when} variant="rise" delay={140 + i * 120}>
            <p className="text-[1.75rem] font-light leading-none tracking-tight text-ink sm:text-[2.1rem]">
              {m.when}
            </p>
            <p className="mt-4 text-[1.1rem] font-semibold leading-snug text-blue">
              {m.title}
            </p>
            <p className="mt-3 max-w-md text-base leading-relaxed text-body">
              {m.body}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
