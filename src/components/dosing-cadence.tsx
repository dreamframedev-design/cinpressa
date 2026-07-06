import { Reveal } from "@/components/reveal";

/**
 * The core value proposition, told visually: a full year of daily doses (a
 * dense field of faint dots, each one a decision that has to be made) against
 * one to two provider-administered doses. Dots are the brand's punctuation.
 */
export function DosingCadence() {
  const dailyDoses = Array.from({ length: 365 });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
      <Reveal
        variant="rise"
        className="rounded-2xl border border-line bg-mist/70 p-7 lg:p-9"
      >
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted">
          Today — daily oral therapy
        </p>
        <div
          aria-hidden
          className="mt-6 grid gap-[6px]"
          style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
        >
          {dailyDoses.map((_, i) => (
            <span
              key={i}
              className="aspect-square rounded-full bg-pale"
            />
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-body">
          <span className="font-medium text-ink">~365 doses a year.</span>{" "}
          Control that depends on remembering every single one.
        </p>
      </Reveal>

      <Reveal
        variant="rise"
        delay={140}
        className="flex flex-col justify-between rounded-2xl border border-blue/20 bg-blue/[0.035] p-7 lg:p-9"
      >
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-blue">
          CIN-111 — long-acting siRNA
        </p>
        <div aria-hidden className="my-8 flex items-center gap-6">
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-blue/10" />
            <span className="h-6 w-6 rounded-full bg-blue shadow-[0_8px_20px_-6px_rgba(34,97,173,0.6)]" />
          </span>
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-sky/10" />
            <span className="h-6 w-6 rounded-full bg-sky shadow-[0_8px_20px_-6px_rgba(58,174,216,0.55)]" />
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <p className="text-sm leading-relaxed text-body">
          <span className="font-medium text-ink">1&ndash;2 administrations a year.</span>{" "}
          A continuous backbone of control, independent of daily adherence.
        </p>
      </Reveal>
    </div>
  );
}
