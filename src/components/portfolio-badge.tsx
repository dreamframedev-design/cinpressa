/**
 * PortfolioBadge — "a CinRx portfolio company", as a thing rather than a line.
 *
 * WHAT IT REPLACES. A hairline rule and a run of tracked-out caps. That is the
 * eyebrow treatment every other page on the site uses for section labels, which
 * is precisely the problem: the sentence was set as decoration for the headline
 * under it, so the one piece of provenance on the page carried no more weight
 * than a kicker. A portfolio company's parent is an asset, not a garnish.
 *
 * BUILT TO BE LIFTED. Every company under the same parent needs this exact
 * component with one word changed, so nothing here is CinPressa's: the parent
 * name is a prop, the link is a prop, and the styling reads only from tokens
 * that any sibling site would already define. Drop the file in, pass a name,
 * done.
 *
 * IT IS TWO TEXT RUNS ON A PLATE, AND NOTHING ELSE. It carried a two-ring glyph
 * and a hairline divider between the zones; both are gone. The glyph was there
 * to say "part of a group" and the divider to separate the name from the
 * qualifier — but the name is already 14.72px semibold ink and the qualifier is
 * 10.88px tracked caps in grey, which is three differences doing that job
 * before any rule is drawn. A divider between two things that are already
 * unmistakably different is a line for its own sake, and the glyph was one more
 * object competing with a word that has to be read first.
 *
 * What is left is the phrase, the plate, and the edge. That is the whole badge,
 * and it is better for having less in it.
 *
 * THE FORM IS A PLATE IN TWO ZONES. Left is the parent, set in ink at the
 * weight a name deserves and in its own case - CinRx is elephant case, upper
 * and lower mixed, and no text-transform is allowed near it. Right is the
 * relationship, set small and tracked in the muted grey, which is where a
 * qualifier belongs. Reading it as "A CinRx  PORTFOLIO COMPANY" gives the name
 * first and the relation second, which is the order that matters; a flat
 * sentence buries the name mid-phrase.
 *
 * THE ARTICLE IS REQUIRED, NOT DECORATIVE. The approved phrasing is "a CinRx
 * portfolio company" and it has to survive being split across two zones, so the
 * "A" leads the left one. It is set smaller and in the muted grey rather than
 * at the name's weight: it belongs to the sentence, not to the company, and at
 * full weight it competes with the first letter of the name it introduces.
 *
 * Corners at 4px, matching the buttons and the form controls rather than the
 * pill this would have been six months ago.
 */

/**
 * How much colour the plate carries.
 *
 * "line"   — the hairline default. Neutral, and the only one that is safe
 *            anywhere, which is why it is the default for a component meant to
 *            be dropped into sites that have not been seen.
 * "accent" — the brand's warm accent on the edge and the relationship text,
 *            over a cream plate. The name stays in ink.
 * "solid"  — the plate IS the brand colour, #F9A81A at full strength and full
 *            opacity, with everything on it in ink. Not a tint of the orange
 *            and not a wash: the literal value off the brand sheet. See the
 *            stylesheet for why every mark on it goes dark rather than white.
 * "dark"   — for a dark ground: a footer, an inverted hero.
 */
type Tone = "line" | "accent" | "solid" | "dark";

export function PortfolioBadge({
  parent = "CinRx",
  article = "A",
  relation = "Portfolio company",
  tone = "line",
  href = "https://cinrx.com",
  className = "",
}: {
  /** The parent company's name, in its own casing. */
  parent?: string;
  /** The leading article. Pass "An" where the name needs it, "" to drop it. */
  article?: string;
  /** The relationship. Rendered in caps by the stylesheet, not by this string. */
  relation?: string;
  tone?: Tone;
  /** Omit for a plate that is not a link. */
  href?: string;
  className?: string;
}) {
  const classes = [
    "portfolio-badge",
    tone === "accent" ? "portfolio-badge-accent" : "",
    tone === "solid" ? "portfolio-badge-solid" : "",
    tone === "dark" ? "portfolio-badge-dark" : "",
    href ? "portfolio-badge-link" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="portfolio-badge-name">
        {article ? (
          <span className="portfolio-badge-lead">{article} </span>
        ) : null}
        {parent}
      </span>
      <span className="portfolio-badge-kind">{relation}</span>
    </>
  );

  if (!href) {
    return <span className={classes}>{inner}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {inner}
    </a>
  );
}
