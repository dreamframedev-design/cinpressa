import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";

/**
 * The core value proposition, told as a direct comparison: a full year of daily
 * doses against one to two provider-administered doses.
 *
 * Both panels render the same 365-cell grid at the same size, so the only thing
 * that differs is how many dots are filled. The count is the whole argument.
 * On scroll-in the daily doses cascade in calendar order, then the two annual
 * doses land as the payoff. Motion is gated on the Reveal system, so everything
 * is fully visible without JS and under reduced motion.
 */

const DAYS = 365;
const COLUMNS = 24;

/** Dead centre of the 24 × 16 field, straddling the vertical midline. */
const CENTRE_ROW = 7;
const YEARLY = [CENTRE_ROW * COLUMNS + 10, CENTRE_ROW * COLUMNS + 13];

/* White panels so the pair reads cleanly on whatever wash the section carries. */
const PANEL = "rounded-2xl border border-line bg-white/80 p-7 lg:p-9";
const TYPE = "text-[clamp(1.25rem,2vw,1.7rem)] leading-snug tracking-tight";
const LABEL = `${TYPE} font-medium text-ink`;
const CAPTION = `${TYPE} font-light text-body`;
const COUNT = "font-medium text-blue";
const FIELD = "my-7 grid gap-[3px] sm:gap-[5px] lg:gap-[6px]";

const fieldStyle: CSSProperties = {
  gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
};

export function DosingCadence() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <Reveal variant="fade" className={PANEL}>
        <p className={LABEL}>Daily oral therapy</p>

        <div aria-hidden className={FIELD} style={fieldStyle}>
          {Array.from({ length: DAYS }).map((_, i) => (
            <span
              key={i}
              className="dose-dot aspect-square rounded-full bg-blue"
              style={{ "--i": i } as CSSProperties}
            />
          ))}
        </div>

        <p className={CAPTION}>
          <span className={COUNT}>365 doses a year</span>, dependent on daily
          adherence.
        </p>
      </Reveal>

      <Reveal variant="fade" delay={120} className={PANEL}>
        <p className={LABEL}>CIN-111 &middot; long-acting AGT siRNA</p>

        {/* Same grid, same dots: only two of the 365 cells are filled. */}
        <div aria-hidden className={FIELD} style={fieldStyle}>
          {Array.from({ length: DAYS }).map((_, i) => {
            const dose = YEARLY.indexOf(i);
            return dose === -1 ? (
              <span key={i} className="aspect-square" />
            ) : (
              <span
                key={i}
                className="year-dot aspect-square rounded-full bg-blue"
                style={{ "--i": dose } as CSSProperties}
              />
            );
          })}
        </div>

        <p className={CAPTION}>
          <span className={COUNT}>1 to 2 doses a year</span>, independent of
          daily adherence.
        </p>
      </Reveal>
    </div>
  );
}
