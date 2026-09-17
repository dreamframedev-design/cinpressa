import { OpenFlow } from "@/components/open-flow";
import { PortfolioBadge } from "@/components/portfolio-badge";

/** The approved homepage hero: the open field with its golden thread (option C). */
export function HomeHero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-gradient-to-b from-white via-white to-mist lg:min-h-[76vh]">
      <OpenFlow key="flow" className="absolute inset-0" />
      {/* Match the mist below so the field fades without a visible seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 lg:h-44"
        style={{
          background:
            "linear-gradient(0deg, var(--color-mist) 0%, rgba(244,248,252,0) 100%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-24 pt-28 lg:gap-10 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="max-w-2xl pl-4 lg:pl-6">
          <div className="anim-rise" style={{ animationDelay: "0.02s" }}>
            <PortfolioBadge parent="CinRx" />
          </div>
          <h1
            className="hero-title anim-rise mt-7 text-[clamp(2.4rem,5.4vw,4.25rem)] leading-[1.04] tracking-tight text-ink"
            style={{ animationDelay: "0.1s" }}
          >
            Advancing a best-in-class siRNA for{" "}
            <span className="hero-key">hypertension</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
