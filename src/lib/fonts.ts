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
 * Google Sans — home headline and ticker.
 *
 * The variable file lives in the project zip; this is the woff2 cut of it.
 * Stripe's ticker is Söhne. This is the face we were given to match that
 * stance: even lining figures so B / M+ / % sit at the numeral's cap height.
 */
export const display = localFont({
  src: "../fonts/google-sans.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});
