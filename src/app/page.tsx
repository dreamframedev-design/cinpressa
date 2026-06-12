import Image from "next/image";
import { ArrowIcon } from "@/components/arrow-icon";
import { Reveal } from "@/components/reveal";
import { SiteNav } from "@/components/site-nav";

const facts = [
  {
    label: "Therapeutic area",
    value: "Cardiometabolic",
    note: "Targeting high-burden cardiovascular and metabolic disease.",
  },
  {
    label: "Development stage",
    value: "IND-enabling",
    note: "Toxicology, pharmacology, and CMC packages complete.",
  },
  {
    label: "Operating model",
    value: "Asset-focused CinCo",
    note: "One program, with CinRx's full team behind it.",
  },
];

const capabilities = [
  "Translational science",
  "Regulatory strategy",
  "Clinical operations",
  "CMC",
  "Toxicology",
];

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
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-28 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-24">
            <div>
              <p
                className="anim-rise flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-blue"
                style={{ animationDelay: "0.02s" }}
              >
                <span aria-hidden className="h-px w-8 bg-blue/40" />
                A CinRx Portfolio Company
              </p>
              <h1 className="mt-6 text-ink">
                <span
                  className="anim-rise block text-[clamp(2.5rem,6.5vw,5.5rem)] font-light uppercase leading-none tracking-[0.04em]"
                  style={{ animationDelay: "0.1s" }}
                >
                  CinPressa
                  <span className="anim-pop text-orange" style={{ animationDelay: "1.05s" }}>
                    .
                  </span>
                </span>
                <span
                  className="anim-rise mt-4 block text-[1.3rem] font-light leading-snug tracking-[-0.01em] text-blue md:text-[1.65rem]"
                  style={{ animationDelay: "0.2s" }}
                >
                  Singular focus, from molecule to clinic
                </span>
              </h1>
              <p
                className="anim-rise mt-6 max-w-xl text-base leading-relaxed text-body md:text-lg"
                style={{ animationDelay: "0.3s" }}
              >
                Advancing a differentiated cardiometabolic therapeutic toward
                first-in-human studies, powered by CinRx&apos;s centralized
                development engine.
              </p>
              <div className="anim-rise mt-10" style={{ animationDelay: "0.4s" }}>
                <a
                  href="https://cinrx.com/contact#partnering"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-blue px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-ink hover:shadow-[0_18px_36px_-18px_rgba(34,97,173,0.6)] active:translate-y-px"
                >
                  Partner with us
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            <div
              className="anim-rise relative mx-auto flex aspect-square w-[280px] items-center justify-center sm:w-[360px] lg:w-[440px]"
              style={{ animationDelay: "0.24s" }}
            >
              {/* Hairline orbit rings, the line is the brand */}
              <div aria-hidden className="anim-orbit pointer-events-none absolute inset-0">
                <svg viewBox="0 0 440 440" className="h-full w-full">
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
              </div>
              {/* The brand's punctuation, in orbit */}
              <div aria-hidden className="anim-orbit-dot pointer-events-none absolute inset-0">
                <span className="absolute left-1/2 top-[0.2%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange shadow-[0_0_12px_rgba(249,168,26,0.55)]" />
              </div>
              <div className="anim-float relative w-[58%]">
                <Image
                  src="/cinpressa-mark.svg"
                  alt=""
                  width={258}
                  height={242}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>

          <a
            href="#overview"
            aria-label="Scroll to overview"
            className="anim-rise absolute bottom-6 left-1/2 hidden -translate-x-1/2 px-4 py-2 [@media(min-height:680px)]:block"
            style={{ animationDelay: "1.1s" }}
          >
            <span className="scroll-cue block" />
          </a>
        </section>

        {/* Snapshot */}
        <section id="overview" className="scroll-mt-20 border-t border-line bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:grid-cols-3 sm:gap-8 lg:px-10 lg:py-24">
            {facts.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 110} className="border-l border-pale pl-6">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                  {fact.label}
                </p>
                <p className="mt-3 text-xl font-light tracking-tight text-ink md:text-[1.65rem]">
                  {fact.value}
                </p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-body">
                  {fact.note}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* The model */}
        <section id="model" className="scroll-mt-20 bg-mist">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24 lg:px-10">
            <div>
              <Reveal variant="draw">
                <span aria-hidden className="block h-px w-12 bg-orange" />
              </Reveal>
              <Reveal variant="rise-blur" delay={90}>
                <h2 className="mt-8 text-3xl font-light tracking-tight text-ink md:text-[2.6rem] md:leading-[1.15]">
                  Built to move one medicine forward, fast
                </h2>
              </Reveal>
              <Reveal variant="fade" delay={200}>
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
              </Reveal>
              <Reveal variant="fade" delay={300}>
                <a
                  href="https://cinrx.com"
                  className="group mt-9 inline-flex items-center gap-2 text-sm font-medium text-blue transition-colors hover:text-ink"
                >
                  <span className="link-underline">Discover CinRx</span>
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </Reveal>
            </div>

            <div className="lg:pt-2">
              <Reveal variant="fade">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                  Centralized by CinRx
                </p>
              </Reveal>
              <ul className="mt-4">
                {capabilities.map((capability, i) => (
                  <Reveal
                    as="li"
                    key={capability}
                    delay={120 + i * 80}
                    className="group flex items-baseline justify-between border-b border-pale py-4 last:border-b-0"
                  >
                    <span className="text-lg font-light tracking-tight text-ink md:text-xl">
                      {capability}
                    </span>
                    <span
                      aria-hidden
                      className="h-px w-5 bg-pale transition-all duration-500 group-hover:w-9 group-hover:bg-sky"
                    />
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

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
                  Partnering, investor, and investigator inquiries
                </h2>
              </Reveal>
              <Reveal variant="fade" delay={200}>
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  Messages are routed to the right team at CinRx.
                </p>
              </Reveal>
            </div>
            <Reveal variant="fade" delay={260} className="shrink-0 self-start md:self-auto">
              <a
                href="https://cinrx.com/contact#partnering"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-medium text-deep transition-all duration-300 hover:bg-pale hover:shadow-[0_18px_36px_-18px_rgba(0,0,0,0.45)] active:translate-y-px"
              >
                Partner with us
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
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
                An asset-focused CinCo advancing cardiometabolic medicine
                within the CinRx Pharma portfolio.
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/50">
                Explore
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href="#overview"
                    className="link-underline text-white/70 transition-colors hover:text-white"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#model"
                    className="link-underline text-white/70 transition-colors hover:text-white"
                  >
                    The model
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
    </div>
  );
}
