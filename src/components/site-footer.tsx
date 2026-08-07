import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { MarkArt } from "@/components/geometry";
import { Reveal } from "@/components/reveal";
import { SiteLogo } from "@/components/site-logo";

const columns = [
  {
    heading: "Company",
    /** /about is hidden from navigation. See the note in site-nav.tsx. */
    links: [
      { href: "/science", label: "Science" },
      { href: "/pipeline", label: "Pipeline" },
      { href: "/news", label: "News" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { href: "/home", label: "Home" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-deep text-white">
      {/* Brand ladder hairline across the top edge: the one place the whole
          palette appears at once, and it separates the footer from the page
          without a flat rule. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,#AFDBBC_0%,#1EAEE5_28%,#2261AD_58%,#6771B5_82%,#F9A81A_100%)] opacity-70"
      />

      {/* Colour glows, the dark-surface counterpart to the hero field */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-32 h-[560px] w-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34,97,173,0.5) 0%, rgba(34,97,173,0) 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 left-[42%] h-[460px] w-[460px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(103,113,181,0.3) 0%, rgba(103,113,181,0) 72%)",
        }}
      />

      {/* Hairline ring motif carried into the footer */}
      <div
        aria-hidden
        className="anim-orbit pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] opacity-60"
      >
        <svg viewBox="0 0 620 620" className="h-full w-full">
          <circle
            cx="310"
            cy="310"
            r="304"
            fill="none"
            stroke="rgba(58,174,216,0.28)"
            strokeWidth="1.3"
            strokeDasharray="2.5 9"
            strokeLinecap="round"
          />
          <circle
            cx="310"
            cy="310"
            r="228"
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* The mark itself, cropped off the right edge */}
      <MarkArt
        variant="brand"
        tight
        className="pointer-events-none absolute -bottom-[30%] -right-[9%] hidden h-[118%] w-auto opacity-[0.07] lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-10 lg:pt-24">
        {/* Partnering band: the site map's closing call to action */}
        <div className="flex flex-col gap-10 border-b border-white/10 pb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Reveal variant="draw">
              <span aria-hidden className="block h-px w-12 bg-orange" />
            </Reveal>
            <Reveal variant="rise-blur" delay={90}>
              <h2 className="mt-7 text-3xl font-light leading-[1.12] tracking-tight text-white md:text-[2.75rem]">
                Let&rsquo;s advance medicine, together.
              </h2>
            </Reveal>
            <Reveal variant="fade" delay={160}>
              <p className="mt-5 text-lg font-medium leading-snug tracking-tight text-white md:text-xl">
                Stay connected with CinPressa
              </p>
            </Reveal>
            <Reveal variant="fade" delay={220}>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
                For partnering, investment, or general inquiries, connect with
                the team through our{" "}
                <Link href="/contact" className="link-underline text-white">
                  Contact page
                </Link>
                .
              </p>
            </Reveal>
          </div>
          <Reveal variant="fade" delay={160}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-base font-medium text-deep transition-all duration-300 hover:bg-sky hover:text-white active:translate-y-px"
            >
              Contact the team
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* Link columns */}
        <Reveal
          variant="fade"
          delay={120}
          className="mt-16 grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]"
        >
          <div>
            {/* The real lockup, reversed for the dark surface */}
            <SiteLogo height={46} tone="light" />
            <p className="mt-6 max-w-xs text-base leading-relaxed text-white/80">
              Advancing a best-in-class, long-acting AGT siRNA (CIN-111) for a
              durable backbone of blood pressure control.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-white/70">
                {column.heading}
              </p>
              <ul className="mt-5 space-y-3.5 text-base">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-white/85 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-white/70">
              Parent company
            </p>
            <ul className="mt-5 space-y-3.5 text-base">
              <li>
                <a
                  href="https://cinrx.com"
                  className="link-underline text-white/85 transition-colors hover:text-white"
                >
                  CinRx Pharma
                </a>
              </li>
              <li className="text-white/75">Cincinnati, Ohio, USA</li>
            </ul>
          </div>
        </Reveal>

        {/* Legal */}
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-7 text-base text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 CinPressa Pharma. All rights reserved.</p>
          <p>A CinRx Pharma portfolio company</p>
        </div>
      </div>
    </footer>
  );
}
