import localFont from "next/font/local";

/**
 * Stem Extra Light (ParaType) — the logo wordmark face.
 *
 * CinPressa holds the licence for this family. Self-hosted rather than served
 * from a third party so the lockup never depends on an external host being up.
 *
 * Used only for the wordmark in SiteLogo. Body copy stays on Montserrat.
 */
export const stem = localFont({
  src: "../fonts/stem-extralight.woff2",
  weight: "200",
  style: "normal",
  variable: "--font-stem",
  display: "swap",
  // Keeps the lockup from reflowing when the face swaps in.
  adjustFontFallback: false,
});

/**
 * Google Sans — every headline on the site, plus the ticker.
 *
 * The variable file lives in the project zip; this is the woff2 cut of it.
 * Stripe's ticker is Söhne. This is the face we were given to match that
 * stance: even lining figures so B / M+ / % sit at the numeral's cap height.
 *
 * It arrived for the home hero alone, which left every interior page a size
 * and a weight adrift of the one page anybody had looked at. It now carries
 * all display type — see .hero-title and .type-display in globals.css for
 * where the line between "display" and "body" is drawn, and why.
 */
export const display = localFont({
  src: "../fonts/google-sans.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});
