import { Reveal } from "@/components/reveal";

export type Finding = {
  label: string;
  value: string;
  /** The one differentiating claim, given the section's single accent. */
  accent?: boolean;
};

/**
 * ProgramSpec — the pipeline section's findings, stated as findings.
 *
 * WHY THIS EXISTS. The homepage pipeline section had a headline, a deck, one
 * paragraph and a decorative colour blob in the corner — a section named
 * "Pipeline" carrying nothing a reader could take away about the pipeline. The
 * blob was doing the work content should have been doing, which is why it read
 * as filler no matter how it was tuned.
 *
 * The substance was already there, buried mid-paragraph. The site map's own
 * body for this section runs: context, THEN three preclinical findings, THEN a
 * conclusion. Set as prose, the three findings are a subordinate clause nobody
 * stops on. Set as a list they are the reason to keep reading, so the paragraph
 * keeps its first and last sentences and hands the middle one to this. Not one
 * word is added or dropped — it is the same body, redistributed to the shape
 * each part of it wanted.
 *
 * NOT A CHART. There are no axes, no magnitudes and no plotted values, because
 * the map states these qualitatively ("near complete", "substantial, sustained")
 * and drawing a quantity the programme has not published here would be a claim
 * it has not made. The numbers live on /pipeline, where they belong.
 *
 * The source line is not decoration either — findings without their study
 * design are marketing, and one line of provenance is what makes this a spec
 * rather than a boast.
 */
export function ProgramSpec({
  source,
  findings,
  className = "",
}: {
  source: string;
  findings: Finding[];
  className?: string;
}) {
  return (
    <div className={className}>
      <Reveal variant="fade">
        <p className="program-spec-source">{source}</p>
      </Reveal>
      <dl className="program-spec">
        {findings.map((f, i) => (
          <Reveal key={f.label} as="div" variant="fade" delay={90 + i * 110}>
            <div className="program-spec-row">
              <dt className="program-spec-label">{f.label}</dt>
              <dd
                className={`program-spec-value${f.accent ? " program-spec-value-accent" : ""}`}
              >
                {f.value}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}
