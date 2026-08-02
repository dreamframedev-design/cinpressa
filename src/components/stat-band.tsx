import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

export type Stat = {
  value: string;
  unit?: string;
  label: string;
};

/**
 * Rotating core-colour accents so a row of figures reads as three distinct
 * facts rather than one blue block. All three clear AA on white at body size,
 * which the numerals' units need.
 */
const ACCENTS = [
  { text: "text-blue", rule: "bg-blue" },
  { text: "text-cobalt", rule: "bg-cobalt" },
  { text: "text-indigo", rule: "bg-indigo" },
];

/**
 * Editorial statistics row: big light numerals divided by hairlines, never a
 * grid of identical cards. Used for the hypertension burden figures.
 */
export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
      {stats.map((stat, i) => {
        const accent = ACCENTS[i % ACCENTS.length];
        return (
          <Reveal
            key={stat.label}
            variant="rise"
            delay={i * 90}
            className="flex flex-col justify-between gap-6 bg-white px-7 py-9 lg:px-9 lg:py-11"
          >
            <dt className="order-2 text-sm leading-relaxed text-body">
              {stat.label}
            </dt>
            <dd className="order-1">
              <span
                aria-hidden
                className={`mb-6 block h-px w-10 ${accent.rule}`}
              />
              <span className="flex items-baseline gap-1.5">
                <span
                  className={`text-[clamp(2.75rem,5vw,3.75rem)] font-extralight leading-none tracking-tight ${accent.text}`}
                >
                  <CountUp value={stat.value} />
                </span>
                {stat.unit ? (
                  <span className={`text-lg font-light ${accent.text}`}>
                    {stat.unit}
                  </span>
                ) : null}
              </span>
            </dd>
          </Reveal>
        );
      })}
    </dl>
  );
}
