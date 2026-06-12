import Image from "next/image";
import { ArrowIcon } from "@/components/arrow-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

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
              <h1 className="mt-6 text-sky">
                <span
                  className="anim-rise block text-[clamp(2.5rem,6.5vw,5.5rem)] font-light uppercase leading-none tracking-[0.04em]"
                  style={{ animationDelay: "0.1s" }}
                >
                  CinPressa
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
                  href="/contact"
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

        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
