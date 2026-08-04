import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { StatBand } from "@/components/stat-band";
import { DosingCadence } from "@/components/dosing-cadence";
import { FourLenses } from "@/components/four-lenses";
import { ConvergenceMark } from "@/components/convergence-mark";
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
        {/* The large pale radial that used to sit off the right edge is gone with the
            blooms: it was the same soft-wash move, just bigger. The lens field is the
            only thing behind the mark now. */}
        <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-gradient-to-b from-white via-white to-mist">
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-10 lg:pb-24 lg:pt-40">
            <div>
              <p
                className="anim-rise flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-blue"
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
                <Link href="/science" className="btn-primary group">
                  Explore the science
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                {/* A bordered ghost button, not a text link: the secondary CTA
                    was reading as body copy. */}
                <Link href="/pipeline" className="btn-ghost group">
                  View the pipeline
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* No entrance rise here: the convergence IS the mark's entrance. */}
            <div className="relative mx-auto flex aspect-square w-[280px] items-center justify-center sm:w-[360px] lg:w-[460px]">
              {/* Piece 2, Four Lenses. The mark's own four parent ovals at 3.2x, so the
                  logo reads as the core of a larger optical system rather than as a
                  logo on a wash. The inset matches the component's SCALE; changing one
                  without the other breaks the alignment with the mark. Static by
                  design - the convergence is already the motion in this column. */}
              <FourLenses className="lens-layer absolute inset-[-110%]" />

              <div className="mark-lift relative w-[66%]">
                <ConvergenceMark className="w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Lead: the map's Home body */}
        <Section size="sm">
          <Reveal variant="fade">
            <p className="max-w-4xl text-xl leading-relaxed text-body md:text-2xl md:leading-relaxed">
              Daily oral therapy has been the backbone of hypertension care for
              decades, yet a large proportion of patients remain uncontrolled or
              untreated. CinPressa is developing a long-acting AGT siRNA designed
              to provide durable blood pressure reduction and establish a
              continuous backbone of blood pressure control independent of daily
              adherence.
            </p>
          </Reveal>
        </Section>

        {/* The challenge */}
        <Section tone="sky">
          <SectionHeader
            eyebrow="The challenge"
            title="Control that lasts remains elusive"
            subtitle="Hypertension affects approximately 1.4 billion people worldwide, with more than 700 million still uncontrolled or untreated. Around 70 percent of treated patients do not achieve target blood pressure levels, despite numerous approved therapies."
          />
          <div className="mt-14">
            <StatBand
              stats={[
                { value: "1.4", unit: "B", label: "people live with hypertension worldwide" },
                { value: "700", unit: "M+", label: "remain uncontrolled or untreated" },
                { value: "~70", unit: "%", label: "of treated patients do not achieve target blood pressure levels" },
              ]}
            />
          </div>
          <Reveal variant="fade" delay={120}>
            <p className="mt-12 max-w-3xl text-base leading-relaxed text-body">
              Medication non-adherence remains the leading cause of poor blood
              pressure control, and hypertension&rsquo;s asymptomatic nature makes
              long-term persistence difficult to sustain. CinPressa is focused on
              a different model of care, one designed to reduce reliance on daily
              adherence and support durable control over time.
            </p>
          </Reveal>
        </Section>

        {/* Our approach — the last of the nine background logo crops, a 620px mark at
            0.13 opacity, removed with no replacement. DosingCadence carries this
            section already: a full year of daily doses against one or two, at the same
            scale, where the count IS the argument. It is the strongest thing on the
            site and it does not need a watermark behind it. */}
        <Section tone="green">
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
        <Section tone="indigo">
          <SectionHeader
            eyebrow="Pipeline"
            title="A focused program. A clear path forward."
            subtitle="Our pipeline is centered on CIN-111, a long-acting AGT siRNA program for hypertension."
          />
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
                className="btn-ghost group shrink-0"
              >
                Visit the pipeline
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </Section>

        {/* News */}
        <Section>
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
                className="btn-ghost group shrink-0"
              >
                Read the latest
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
