import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { Horizon } from "@/components/horizon";
import { Reveal } from "@/components/reveal";
import { SiteLogo } from "@/components/site-logo";

const columns = [
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
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

      {/* Piece 3, The Horizon. What used to be here: an orbiting hairline ring, two
          large radial glows, and a crop of the mark at 0.07 opacity - the site's only
          dark surface spent on things not actually visible, and one more repetition of
          the logo. All of it is gone.

          What replaces it is one line, held, and a great deal of empty ground. The
          glows went with the rest because a soft radial bloom is the same
          gradient-as-bandage move this pass is removing everywhere else; the field
          should be flat and the line should be the only event in it. */}
      <Horizon className="absolute inset-x-0 bottom-[6.5rem] hidden h-16 lg:block" />

      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-10 lg:pt-24">
        {/* Partnering band: the site map's closing call to action */}
        <div className="flex flex-col gap-10 border-b border-white/10 pb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Reveal variant="draw">
              {/* Frost, not orange: ambient chrome on the deep ground. Orange is
                  reserved for dose semantics and quotations of the mark's petals.
                  See ART_STRATEGY.md section 4. */}
              <span
                aria-hidden
                className="block h-px w-12"
                style={{ background: "var(--color-accent-dark)" }}
              />
            </Reveal>
            <Reveal variant="rise-blur" delay={90}>
              <h2 className="mt-7 text-3xl font-light leading-[1.12] tracking-tight text-white md:text-[2.75rem]">
                Let&rsquo;s advance medicine, together.
              </h2>
            </Reveal>
            <Reveal variant="fade" delay={180}>
              <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/80">
                Partner with CinPressa to help move a differentiated AGT siRNA
                program forward. For partnering, investment, or general
                inquiries, connect with the team.
              </p>
            </Reveal>
          </div>
          <Reveal variant="fade" delay={160}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-deep transition-all duration-300 hover:bg-sky hover:text-white active:translate-y-px"
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
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-white/80">
              Advancing a best-in-class, long-acting AGT siRNA (CIN-111) for a
              durable backbone of blood pressure control.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white/70">
                {column.heading}
              </p>
              <ul className="mt-5 space-y-3.5 text-[0.95rem]">
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
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white/70">
              Parent company
            </p>
            <ul className="mt-5 space-y-3.5 text-[0.95rem]">
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
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-7 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 CinPressa Pharma. All rights reserved.</p>
          <p>A CinRx Pharma portfolio company</p>
        </div>
      </div>
    </footer>
  );
}
