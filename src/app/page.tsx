import Image from "next/image";

const facts = [
  { label: "Therapeutic area", value: "Cardiometabolic" },
  { label: "Development stage", value: "IND-enabling" },
  { label: "Operating model", value: "Asset-focused CinCo" },
];

export default function Home() {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
          <Image
            src="/cinpressa-logo.png"
            alt="CinPressa Pharma"
            width={768}
            height={160}
            priority
            className="h-8 w-auto md:h-9"
          />
          <p className="hidden text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted sm:block">
            A CinRx Portfolio Company
          </p>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-gradient-to-b from-white via-white to-mist">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-20">
            <div>
              <h1
                className="anim-rise text-[2.5rem] font-light leading-[1.08] tracking-[-0.02em] text-ink md:text-6xl"
                style={{ animationDelay: "0.05s" }}
              >
                Singular focus, from molecule to clinic
                <span className="text-orange">.</span>
              </h1>
              <p
                className="anim-rise mt-7 max-w-xl text-base leading-relaxed text-body md:text-lg"
                style={{ animationDelay: "0.18s" }}
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
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </a>
              </div>
            </div>

            <div
              className="anim-rise relative mx-auto flex aspect-square w-[280px] items-center justify-center sm:w-[360px] lg:w-[440px]"
              style={{ animationDelay: "0.22s" }}
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
        <section className="border-t border-line bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:grid-cols-3 sm:gap-8 lg:px-10">
            {facts.map((fact) => (
              <div key={fact.label} className="border-l border-pale pl-6">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                  {fact.label}
                </p>
                <p className="mt-3 text-xl font-light tracking-tight text-ink md:text-2xl">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The model */}
        <section className="bg-mist">
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
            <div className="max-w-3xl">
              <span aria-hidden className="block h-px w-12 bg-orange" />
              <h2 className="mt-8 text-3xl font-light tracking-tight text-ink md:text-[2.6rem] md:leading-[1.15]">
                Built to move one medicine forward, fast
              </h2>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-body">
                <p>
                  CinPressa Pharma is a CinCo, an asset-focused company within
                  the CinRx Pharma portfolio. CinRx provides the capital and a
                  centralized, cross-functional team spanning translational
                  science, regulatory strategy, clinical operations, and CMC,
                  so the program team stays focused on one thing: the asset.
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
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-deep text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-light uppercase tracking-[0.3em] text-white">
              CinPressa <span className="text-sky">Pharma</span>
            </p>
            <a
              href="https://cinrx.com"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              cinrx.com
            </a>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 CinPressa Pharma. All rights reserved.</p>
            <p>A CinRx Pharma portfolio company</p>
          </div>
        </div>
      </footer>
    </>
  );
}
