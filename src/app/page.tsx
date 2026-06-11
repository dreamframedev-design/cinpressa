import Image from "next/image";
import { SiteNav } from "@/components/site-nav";

const facts = [
  { label: "Therapeutic area", value: "Cardiometabolic" },
  { label: "Development stage", value: "IND-enabling" },
  { label: "Operating model", value: "Asset-focused CinCo" },
];

const capabilities = [
  "Translational science",
  "Regulatory strategy",
  "Clinical operations",
  "CMC",
  "Toxicology",
];

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export default function Home() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-gradient-to-b from-white via-white to-mist">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(190,215,236,0.45) 0%, rgba(190,215,236,0) 65%)",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-20">
            <div>
              <p
                className="anim-rise flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-blue"
                style={{ animationDelay: "0.02s" }}
              >
                <span aria-hidden className="h-px w-8 bg-blue/40" />
                A CinRx Portfolio Company
              </p>
              <h1
                className="anim-rise mt-6 text-[2.5rem] font-light leading-[1.08] tracking-[-0.02em] text-ink md:text-6xl"
                style={{ animationDelay: "0.1s" }}
              >
                Singular focus, from molecule to clinic
                <span className="text-orange">.</span>
              </h1>
              <p
                className="anim-rise mt-7 max-w-xl text-base leading-relaxed text-body md:text-lg"
                style={{ animationDelay: "0.2s" }}
              >
                CinPressa Pharma is advancing a differentiated cardiometabolic
                therapeutic toward first-in-human studies, powered by
                CinRx&apos;s centralized development engine.
              </p>
              <div className="anim-rise mt-10" style={{ animationDelay: "0.3s" }}>
                <a
                  href="https://cinrx.com/contact#partnering"
                  className="inline-flex items-center gap-2.5 rounded-full bg-blue px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-ink hover:shadow-[0_18px_36px_-18px_rgba(34,97,173,0.6)] active:translate-y-px"
                >
                  Partner with us
                  <ArrowIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div
              className="anim-rise relative mx-auto flex aspect-square w-[280px] items-center justify-center sm:w-[360px] lg:w-[440px]"
              style={{ animationDelay: "0.24s" }}
            >
              {/* Hairline orbit rings, the line is the brand */}
              <svg
                aria-hidden
                viewBox="0 0 440 440"
                className="anim-orbit pointer-events-none absolute inset-0 h-full w-full"
              >
                <circle
                  cx="220"
                  cy="220"
                  r="216"
                  fill="none"
                  stroke="#BED7EC"
                  strokeWidth="1"
                  strokeDasharray="1 7"
                />
                <circle
                  cx="220"
                  cy="220"
                  r="172"
                  fill="none"
                  stroke="#DCE7F1"
                  strokeWidth="1"
                />
              </svg>
              <Image
                src="/cinpressa-mark.svg"
                alt=""
                width={258}
                height={242}
                priority
                className="relative w-[58%]"
              />
            </div>
          </div>
        </section>

        {/* Snapshot */}
        <section id="overview" className="scroll-mt-20 border-t border-line bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:grid-cols-3 sm:gap-8 lg:px-10 lg:py-24">
            {facts.map((fact) => (
              <div key={fact.label} className="border-l border-pale pl-6">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                  {fact.label}
                </p>
                <p className="mt-3 text-xl font-light tracking-tight text-ink md:text-[1.65rem]">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The model */}
        <section id="model" className="scroll-mt-20 bg-mist">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:px-10">
            <div>
              <span aria-hidden className="block h-px w-12 bg-orange" />
              <h2 className="mt-8 text-3xl font-light tracking-tight text-ink md:text-[2.6rem] md:leading-[1.15]">
                Built to move one medicine forward, fast
              </h2>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-body">
                <p>
                  CinPressa Pharma is a CinCo, an asset-focused company within
                  the CinRx Pharma portfolio. CinRx provides the capital and a
                  centralized, cross-functional team, so the program team stays
                  focused on one thing: the asset.
                </p>
                <p>
                  Key preclinical packages in toxicology, pharmacology, and CMC
                  are complete, supporting an anticipated IND submission and
                  further updates on the clinical development plan in the
                  coming quarters.
                </p>
              </div>
              <a
                href="https://cinrx.com"
                className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-blue transition-colors hover:text-ink"
              >
                Discover CinRx
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="lg:pt-2">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                Centralized by CinRx
              </p>
              <ul className="mt-4">
                {capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="group flex items-baseline justify-between border-b border-pale py-4 last:border-b-0"
                  >
                    <span className="text-lg font-light tracking-tight text-ink md:text-xl">
                      {capability}
                    </span>
                    <span
                      aria-hidden
                      className="h-px w-5 bg-pale transition-all duration-500 group-hover:w-9 group-hover:bg-sky"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-deep text-white">
        {/* Hairline ring motif carried into the footer */}
        <svg
          aria-hidden
          viewBox="0 0 560 560"
          className="anim-orbit pointer-events-none absolute -right-36 -top-36 h-[560px] w-[560px] opacity-60"
        >
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

        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-10">
          {/* Partnering band */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span aria-hidden className="block h-px w-12 bg-orange" />
              <h2 className="mt-7 text-3xl font-light leading-[1.15] tracking-tight text-white md:text-4xl">
                Partnering, investor, and investigator inquiries
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/55">
                Messages are routed to the right team at CinRx.
              </p>
            </div>
            <a
              href="https://cinrx.com/contact#partnering"
              className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-white px-8 py-4 text-sm font-medium text-deep transition-all duration-300 hover:bg-pale active:translate-y-px md:self-auto"
            >
              Partner with us
              <ArrowIcon className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Link columns */}
          <div className="mt-16 grid gap-12 border-t border-white/10 pt-14 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="text-sm font-light uppercase tracking-[0.3em] text-white">
                CinPressa <span className="text-sky">Pharma</span>
              </p>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
                An asset-focused CinCo advancing cardiometabolic medicine
                within the CinRx Pharma portfolio.
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/40">
                Explore
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a href="#overview" className="text-white/65 transition-colors hover:text-white">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#model" className="text-white/65 transition-colors hover:text-white">
                    The model
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/40">
                Parent company
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href="https://cinrx.com"
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    CinRx Pharma
                  </a>
                </li>
                <li className="text-white/45">Cincinnati, Ohio, USA</li>
              </ul>
            </div>
          </div>

          {/* Legal */}
          <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 CinPressa Pharma. All rights reserved.</p>
            <p>A CinRx Pharma portfolio company</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
