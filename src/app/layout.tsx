import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cinpressa.com"),
  title: "CinPressa Pharma",
  description:
    "CinPressa Pharma is advancing a differentiated cardiometabolic therapeutic toward the clinic, powered by CinRx Pharma's centralized development engine.",
  openGraph: {
    title: "CinPressa Pharma",
    description:
      "Advancing a differentiated cardiometabolic therapeutic toward the clinic. A CinRx Pharma portfolio company.",
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
      <body className={`${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
