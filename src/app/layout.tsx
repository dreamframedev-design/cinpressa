import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { display, stem } from "@/lib/fonts";
import { SiteAlleys } from "@/components/site-alleys";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cinpressa.com"),
  title: {
    default: "CinPressa Pharma · A best-in-class siRNA for hypertension",
    template: "%s · CinPressa Pharma",
  },
  description:
    "CinPressa Pharma is advancing CIN-111, a best-in-class, long-acting AGT siRNA designed to establish a durable backbone of blood pressure control. A CinRx portfolio company.",
  openGraph: {
    title: "CinPressa Pharma",
    description:
      "Advancing CIN-111, a best-in-class, long-acting AGT siRNA for hypertension. A CinRx portfolio company.",
    images: ["/cinpressa-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${stem.variable} ${display.variable} antialiased`}
      >
        {/* Positioned wrapper so the alleys can span the whole document rather
            than the viewport — they run behind every section and stop at the
            first element carrying data-alleys-end (the dark footer). */}
        <div className="relative">
          <SiteAlleys />
          {children}
        </div>
      </body>
    </html>
  );
}
