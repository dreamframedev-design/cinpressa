import { Reveal } from "@/components/reveal";

export type Stat = {
  value: string;
  unit?: string;
  label: string;
};

/**
 * Editorial statistics row — big light numerals divided by hairlines, never a
 * grid of identical cards. Used for the hypertension burden figures.
 */
export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
      {stats.map((stat, i) => (
        <Reveal
          key={stat.label}
          variant="rise"
          delay={i * 90}
          className="flex flex-col justify-between gap-6 bg-white px-7 py-9 lg:px-9 lg:py-11"
        >
          <dt className="order-2 text-sm leading-relaxed text-body">
            {stat.label}
          </dt>
          <dd className="order-1 flex items-baseline gap-1.5">
            <span className="text-[clamp(2.75rem,5vw,3.75rem)] font-extralight leading-none tracking-tight text-blue">
              {stat.value}
            </span>
            {stat.unit ? (
              <span className="text-lg font-light text-sky">{stat.unit}</span>
            ) : null}
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
