import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { StatBand } from "@/components/stat-band";
import { DosingCadence } from "@/components/dosing-cadence";
import { PipelineTracker } from "@/components/pipeline-tracker";
import { PetalBloom } from "@/components/geometry";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";

export const metadata: Metadata = {
  title: "Advancing a best-in-class siRNA for hypertension",
  description:
    "CinPressa is advancing CIN-111, a best-in-class, long-acting AGT siRNA designed to establish a durable, adherence-independent backbone of blood pressure control.",
};

export default function HomePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-gradient-to-b from-white via-white to-mist">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-1/2 h-[680px] w-[680px] -translate-y-1/2 rounded-full opacity-55"
            style={{
              background:
                "radial-gradient(circle, rgba(190,215,236,0.5) 0%, rgba(190,215,236,0) 65%)",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-10 lg:pb-24 lg:pt-40">
            <div>
              <p
                className="anim-rise flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-blue"
                style={{ animationDelay: "0.02s" }}
              >
                <span aria-hidden className="h-px w-8 bg-blue/40" />
                A CinRx Company
              </p>
              <h1
                className="anim-rise mt-7 text-[clamp(2.4rem,5.4vw,4.25rem)] font-light leading-[1.04] tracking-tight text-ink"
                style={{ animationDelay: "0.1s" }}
              >
                Advancing a best-in-class{" "}
                <span className="text-blue">siRNA</span> for hypertension
              </h1>
              <p
                className="anim-rise mt-7 max-w-xl text-lg leading-relaxed text-body"
                style={{ animationDelay: "0.28s" }}
              >
                CinPressa is advancing a best-in-class siRNA (CIN-111) preventing
                the formation of angiotensinogen (AGT) for the treatment of
                hypertension.
              </p>
              <div
                className="anim-rise mt-10 flex flex-wrap items-center gap-4"
                style={{ animationDelay: "0.4s" }}
              >
                <Link
                  href="/science"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-blue px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-ink hover:shadow-[0_18px_36px_-18px_rgba(34,97,173,0.6)] active:translate-y-px"
                >
                  Explore the science
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/pipeline"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-blue"
                >
                  <span className="link-underline">View the pipeline</span>
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div
              className="anim-rise relative mx-auto flex aspect-square w-[280px] items-center justify-center sm:w-[360px] lg:w-[460px]"
              style={{ animationDelay: "0.22s" }}
            >
              <div aria-hidden className="anim-orbit pointer-events-none absolute inset-0">
                <svg viewBox="0 0 460 460" className="h-full w-full">
                  <circle cx="230" cy="230" r="226" fill="none" stroke="#BED7EC" strokeWidth="1" strokeDasharray="1 7" />
                  <circle cx="230" cy="230" r="180" fill="none" stroke="#DCE7F1" strokeWidth="1" />
                </svg>
              </div>
              <div aria-hidden className="anim-orbit-dot pointer-events-none absolute inset-0">
                <span className="absolute left-1/2 top-[0.2%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange shadow-[0_0_12px_rgba(249,168,26,0.55)]" />
              </div>
              <div className="anim-float relative w-[56%]">
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

        {/* The challenge */}
        <Section tone="mist">
          <SectionHeader
            eyebrow="The challenge"
            title="Control that lasts remains elusive"
            subtitle="Hypertension affects approximately 1.4 billion people worldwide, with more than 700 million still uncontrolled or untreated — and around 70 percent of treated patients never reach target blood pressure, despite numerous approved therapies."
          />
          <div className="mt-14">
            <StatBand
              stats={[
                { value: "1.4", unit: "B", label: "people live with hypertension worldwide" },
                { value: "700", unit: "M+", label: "remain uncontrolled or untreated" },
                { value: "~70", unit: "%", label: "of treated patients never reach target blood pressure" },
              ]}
            />
          </div>
          <Reveal variant="fade" delay={120}>
            <p className="mt-12 max-w-3xl text-base leading-relaxed text-body">
              Medication non-adherence remains the leading cause of poor blood
              pressure control, and hypertension&rsquo;s asymptomatic nature makes
              long-term persistence difficult to sustain. CinPressa is focused on
              a different model of care — one designed to reduce reliance on daily
              adherence and support durable control over time.
            </p>
          </Reveal>
        </Section>

        {/* Our approach */}
        <Section>
          <SectionHeader
            eyebrow="Our approach"
            title="Designed to create a backbone of control"
            subtitle="CinPressa is advancing a long-acting AGT siRNA designed to provide durable blood pressure reduction with one to two administrations per year."
          />
          <div className="mt-14">
            <DosingCadence />
          </div>
          <Reveal variant="fade" delay={120}>
            <p className="mt-12 max-w-3xl text-base leading-relaxed text-body">
              The goal is a continuous backbone of blood pressure control,
              independent of daily adherence. Meaningful baseline reduction may be
              sufficient for many patients as monotherapy, while additional
              antihypertensive agents can be layered onto an already-controlled
              foundation when needed.
            </p>
          </Reveal>
        </Section>

        {/* Pipeline */}
        <Section tone="mist">
          <SectionHeader
            eyebrow="Pipeline"
            title="A focused program. A clear path forward."
            subtitle="Our pipeline is centered on CIN-111, a long-acting AGT siRNA program for hypertension."
          />
          <Reveal variant="rise" delay={80} className="mt-14 rounded-3xl border border-line bg-white p-7 sm:p-10">
            <PipelineTracker />
          </Reveal>
          <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal variant="fade" delay={120}>
              <p className="max-w-3xl text-base leading-relaxed text-body">
                In hypertensive non-human primate studies, CIN-111 achieved
                near-complete reductions in AGT and substantial, sustained
                reductions in systolic blood pressure, with effects maintained for
                more than three months. These data support the potential for
                dosing intervals of six months or longer.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={160}>
              <Link
                href="/pipeline"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-blue transition-colors hover:text-ink"
              >
                <span className="link-underline">Visit the pipeline</span>
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </Section>

        {/* News */}
        <Section
          art={
            <PetalBloom
              petals={9}
              stroke="#BED7EC"
              tint="#3AAED8"
              tintOpacity={0.04}
              spin="slow"
              className="absolute -right-40 top-1/2 h-[480px] w-[480px] -translate-y-1/2 opacity-70"
            />
          }
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="News"
              title="What's new at CinPressa"
              subtitle="Recent updates, key milestones, and the latest news from the company."
              className="lg:mb-0"
            />
            <Reveal variant="fade" delay={140}>
              <Link
                href="/news"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-all duration-300 hover:border-blue hover:text-blue"
              >
                Read the latest
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
