import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

export type Figure = {
  value: string;
  unit?: string;
  label: string;
  /**
   * The figure's share of its OWN stated whole, 0–1, drawn along the track
   * under it. Prevalence is the whole and runs full; 700 M is half of 1.4 B;
   * 70 % is seven tenths of the treated. Each cell is its own gauge, which is
   * why the label carries the denominator rather than the cells sharing one
   * axis.
   */
  /** Omit on a rail whose figures are not proportions of anything. */
  share?: number;
};

/**
 * BurdenRail — the hypertension figures as a masthead rail.
 *
 * WHAT THIS REPLACES. This was three bordered cards, each with a decorative
 * hairline dash floating above the numeral and a thin, near-invisible numeral
 * under it. The cards were mass where the brand is line, the dashes decorated
 * nothing, and the figures — the loudest thing on the page in principle — were
 * the quietest thing on it in practice.
 *
 * THE FIGURES ARE THE POINT, SO THEY ARE HEAVY. Everything else on this site is
 * set light; these are set at 600 and in ink. That contrast is deliberate and it
 * is the reason the rail reads before the paragraph above it does. It is also
 * why they start MONOCHROME: a number that is already the boldest mark on the
 * page does not need colour to be seen, and holding the colour back means there
 * is something left to give on hover.
 *
 * THE HOVER. Each figure carries a brand gradient clipped to its own glyphs,
 * hidden under an ink fill. Hovering the cell fades the ink out and slides the
 * gradient across, so the colour appears to be revealed from inside the number
 * rather than painted onto it — and the measure under it turns from grey to the
 * same ramp at the same moment. Every stop in that ramp clears AA at this size;
 * the lighter half of the ladder is deliberately absent.
 *
 * The redundancy that used to make this section grating was not solved here. It
 * was solved in the copy above, by deleting the sentences that read these
 * numbers back to the reader in prose. The labels are free to be plain
 * descriptions again because nothing else on the screen says the same thing.
 */
export function BurdenRail({
  figures,
  className = "",
}: {
  figures: Figure[];
  className?: string;
}) {
  return (
    <Reveal variant="fade" className={className}>
      <dl className="burden-rail">
        {figures.map((f, i) => (
          <div
            key={f.label}
            className="burden-cell"
            style={
              {
                "--share":
                  f.share === undefined
                    ? undefined
                    : `${Math.round(f.share * 1000) / 10}%`,
                "--i": i,
              } as CSSProperties
            }
          >
            <dd className="burden-value">
              <CountUp value={f.value} />
              {f.unit ? <span className="burden-unit">{f.unit}</span> : null}
            </dd>
            <dt className="burden-label">{f.label}</dt>
            {/* THE TRACK IS THE PROPORTION, so a figure that is not a
                proportion of anything does not get one. /pipeline reuses this
                rail for three findings - a therapeutic window, a reduction
                sustained to a day, an expiry year - and a progress bar under
                any of those would be inventing a scale. */}
            {f.share === undefined ? null : (
              <div aria-hidden className="burden-track">
                <span className="burden-share" />
              </div>
            )}
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
