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
 * THE FORM IS A PLATE IN TWO ZONES, divided by a hairline. Left is the parent,
 * set in ink at the weight a name deserves and in its own case - CinRx is
 * elephant case, upper and lower mixed, and no text-transform is allowed near
 * it. Right is the relationship, set small and tracked in the muted grey, which
 * is where a qualifier belongs. Reading it as "CinRx | PORTFOLIO COMPANY" gives
 * the name first and the relation second, which is the order that matters; the
 * old sentence buried the name in the middle of a lowercase phrase.
 *
 * THE GLYPH IS TWO OVERLAPPING RINGS, and it is deliberately not a logo. CinRx
 * has its own mark and inventing one would be worse than having none; two rings
 * meeting is the plainest possible statement of "part of a group", and it
 * happens to be the same construction the CinPressa mark itself is built from,
 * so it sits in the family without pretending to be anyone's identity.
 *
 * Corners at 4px, matching the buttons and the form controls rather than the
 * pill this would have been six months ago.
 */
export function PortfolioBadge({
  parent = "CinRx",
  href = "https://cinrx.com",
  className = "",
}: {
  /** The parent company's name, in its own casing. */
  parent?: string;
  /** Omit for a plate that is not a link. */
  href?: string;
  className?: string;
}) {
  const inner = (
    <>
      <svg
        aria-hidden
        viewBox="0 0 26 16"
        className="portfolio-badge-glyph"
        fill="none"
      >
        <circle cx="9" cy="8" r="6.1" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="17" cy="8" r="6.1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      <span className="portfolio-badge-name">{parent}</span>
      <span aria-hidden className="portfolio-badge-rule" />
      <span className="portfolio-badge-kind">Portfolio company</span>
    </>
  );

  if (!href) {
    return <span className={`portfolio-badge ${className}`}>{inner}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`portfolio-badge portfolio-badge-link ${className}`}
    >
      {inner}
    </a>
  );
}
