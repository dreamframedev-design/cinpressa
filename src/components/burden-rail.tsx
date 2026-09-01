import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

export type Figure = {
  value: string;
  unit?: string;
  label: string;
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
 * THE COLOUR. Each figure carries a brand gradient clipped to its own glyphs
 * and travelling: it holds dark, turns blue, holds blue, turns back. Hovering a
 * cell swaps that ramp for one that is blue throughout, so the pointer raises
 * the figure rather than starting anything. Every stop clears AA at this size;
 * the lighter half of the ladder is deliberately absent.
 *
 * NOTHING RIDES ON THE RULES. Each cell used to draw a proportion bar along the
 * baseline — its share of its own stated whole. It was a real measure, and it
 * was also the single thing stopping the bottom rule from matching the
 * reference, which bounds its figures with two plain hairlines and puts nothing
 * whatever on them. Three coloured lengths of three different widths under
 * three numbers read as a chart someone had started and abandoned. The captions
 * carry the denominators; they always did.
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
        {/* ONE RULE UNDER THE WHOLE ROW, on every rail. Each cell used to draw
            its own stub, so at the grid width there were three short lines with
            3rem of nothing between them. Continuous, it frames the figures the
            way the reference does - and now that nothing rides on it, there is
            no reason for /pipeline to go without. */}
        <span aria-hidden className="burden-baseline" />
        {figures.map((f, i) => (
          <div
            key={f.label}
            className="burden-cell"
            style={{ "--i": i } as CSSProperties}
          >
            <dd className="burden-value">
              <CountUp value={f.value} />
              {f.unit ? <span className="burden-unit">{f.unit}</span> : null}
            </dd>
            <dt className="burden-label">{f.label}</dt>
            {/* Pure spacing: it pins every cell's foot to a common line so the
                long third caption cannot drop the rule below its neighbours'. */}
            <div aria-hidden className="burden-track" />
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
