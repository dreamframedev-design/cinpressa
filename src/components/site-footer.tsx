import { Reveal } from "@/components/reveal";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-deep text-white">
      {/* Hairline ring motif carried into the footer */}
      <div
        aria-hidden
        className="anim-orbit pointer-events-none absolute -right-36 -top-36 h-[560px] w-[560px] opacity-60"
      >
        <svg viewBox="0 0 560 560" className="h-full w-full">
          <circle
            cx="280"
            cy="280"
            r="274"
            fill="none"
            stroke="rgba(58,174,216,0.25)"
            strokeWidth="1"
            strokeDasharray="1 8"
          />
          <circle
            cx="280"
            cy="280"
            r="206"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-10">
        {/* Partnering band */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Reveal variant="draw">
              <span aria-hidden className="block h-px w-12 bg-orange" />
            </Reveal>
            <Reveal variant="rise-blur" delay={90}>
              <h2 className="mt-7 text-3xl font-light leading-[1.15] tracking-tight text-white md:text-4xl">
                Partnering, investor, and investigator inquiries welcome
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Link columns */}
        <Reveal
          variant="fade"
          delay={120}
          className="mt-16 grid gap-12 border-t border-white/10 pt-14 md:grid-cols-[1.4fr_1fr_1fr]"
        >
          <div>
            <p className="text-sm font-light uppercase tracking-[0.3em] text-white">
              CinPressa <span className="text-sky">Pharma</span>
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Advancing cardiometabolic medicine within the CinRx Pharma
              portfolio.
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/50">
              Get in touch
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="/"
                  className="link-underline text-white/70 transition-colors hover:text-white"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="link-underline text-white/70 transition-colors hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/50">
              Parent company
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="https://cinrx.com"
                  className="link-underline text-white/70 transition-colors hover:text-white"
                >
                  CinRx Pharma
                </a>
              </li>
              <li className="text-white/55">Cincinnati, Ohio, USA</li>
            </ul>
          </div>
        </Reveal>

        {/* Legal */}
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-7 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 CinPressa Pharma. All rights reserved.</p>
          <p>A CinRx Pharma portfolio company</p>
        </div>
      </div>
    </footer>
  );
}
