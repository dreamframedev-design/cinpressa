import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

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
 * Display face for the home headline and the burden ticker.
 *
 * Stripe sets both of those in Söhne (Klim). That cut is licensed to them;
 * we cannot ship their file. Geist is the nearest licensed grotesque with
 * the same even lining figures, so B / M+ / % sit on the number's cap height
 * instead of shrinking into a superscript.
 */
export const display = GeistSans;
