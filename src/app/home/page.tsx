import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { StatBand } from "@/components/stat-band";
import { DoseMigration } from "@/components/dose-migration";
import { Bleed } from "@/components/bleed";
import { FocusField } from "@/components/focus-field";
import { MilestoneStrip } from "@/components/milestone-strip";
import { NewsHorizon } from "@/components/news-horizon";
import { MarkArt } from "@/components/geometry";
import { ConvergenceMark } from "@/components/convergence-mark";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";

export const metadata: Metadata = {
  title: "Advancing a best-in-class siRNA for hypertension",
  description:
    "CinPressa is advancing CIN-111, a best-in-class, long-acting AGT siRNA designed to establish a durable, adherence-independent backbone of blood pressure control.",
};

/**
 * Petal colours blooming behind the hero mark. Positions roughly mirror where
 * each colour sits inside the artwork, so the glow reads as the logo's own
 * light rather than decoration placed around it. Durations are mismatched so
 * the four breaths never sync up.
 */
const BLOOMS = [
  { color: "175,219,188", size: 74, x: 2, y: -6, low: 0.4, high: 0.75, dur: 15, delay: 0 },
  { color: "149,218,248", size: 68, x: 32, y: 4, low: 0.45, high: 0.8, dur: 19, delay: -5 },
  { color: "34,97,173", size: 54, x: -4, y: 28, low: 0.18, high: 0.34, dur: 17, delay: -9 },
  { color: "103,113,181", size: 62, x: 34, y: 36, low: 0.2, high: 0.4, dur: 23, delay: -13 },
];

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
                className="anim-rise flex items-center gap-3 text-[0.84rem] font-semibold uppercase tracking-[0.22em] text-blue"
                style={{ animationDelay: "0.02s" }}
              >
                <span aria-hidden className="h-px w-8 bg-blue/40" />
                A CinRx company
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
                CinPressa is advancing CIN-111, a best-in-class AGT siRNA for
                the treatment of hypertension, designed to prevent the formation
                of angiotensinogen and deliver long-acting blood pressure
                control.
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
            <div className="relative mx-auto flex aspect-square w-[300px] items-center justify-center sm:w-[390px] lg:w-[500px]">
              {/* No orbits. The mark's own petal colours bloom outward behind
                  it, each on its own long breath, so the light reads as coming
                  off the logo. Positions echo where those petals actually sit. */}
              <div aria-hidden className="bloom-layer pointer-events-none absolute inset-0">
                {BLOOMS.map((b) => (
                  <span
                    key={b.color}
                    className="bloom"
                    style={
                      {
                        width: `${b.size}%`,
                        aspectRatio: "1",
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        background: `radial-gradient(circle, rgba(${b.color},1) 0%, rgba(${b.color},0) 68%)`,
                        "--bloom-low": b.low,
                        "--bloom-high": b.high,
                        "--bloom-dur": `${b.dur}s`,
                        "--bloom-delay": `${b.delay}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>

              <div className="mark-lift relative w-[68%]">
                <ConvergenceMark className="w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Lead: the map's Home body, closing into the colour field.
            Bleed runs full-bleed rather than inside the container - it is a piece,
            not a figure, and gutters would make it read as an illustration sitting
            in a slot. */}
        {/* Padding is trimmed hard on both sides of the field. The lead keeps its top
            rhythm but hands off almost immediately, and the section below opens tighter
            than default, so the piece sits close to the copy it belongs to instead of
            costing a screen of scrolling to get past. */}
        <Section size="sm" className="pb-4! lg:pb-6!">
          <Reveal variant="fade">
            <p className="max-w-4xl text-xl leading-relaxed text-body md:text-2xl md:leading-relaxed">
              Daily oral therapy has been the backbone of hypertension care for
              decades, yet a large proportion of patients remain uncontrolled or
              untreated. The unmet need in hypertension is not efficacy. It is{" "}
              <span className="text-blue">persistence.</span>
            </p>
          </Reveal>
        </Section>
        <Bleed className="h-[190px] w-full sm:h-[250px] lg:h-[330px]" />

        {/* The challenge */}
        <Section tone="sky" className="pt-12! lg:pt-16!">
          <SectionHeader
            eyebrow="The challenge"
            title="Control that lasts remains elusive"
            deck="Global burden and treatment gap"
          />
          <div className="mt-14">
            <StatBand
              stats={[
                { value: "1.4", unit: "B", label: "people live with hypertension worldwide" },
                { value: "700", unit: "M+", label: "remain uncontrolled or untreated" },
                { value: "70", unit: "%", label: "of treated patients do not achieve target blood pressure levels" },
              ]}
            />
          </div>
          <Reveal variant="fade" delay={120}>
            <p className="mt-12 max-w-3xl text-base leading-relaxed text-body">
              1.4 billion people globally live with hypertension, and more than
              700 million remain uncontrolled or untreated. Seventy percent of
              treated patients do not achieve target blood pressure levels,
              despite numerous approved therapies. Medication non-adherence is
              the leading cause of poor blood pressure control, and hypertension
              is largely asymptomatic, resulting in poor long-term adherence and
              treatment persistence.
            </p>
          </Reveal>
        </Section>

        {/* Our approach */}
        <Section
          tone="green"
          art={
            <MarkArt
              variant="brand"
              light
              className="absolute -right-32 -top-40 h-[620px] w-auto rotate-[18deg] opacity-[0.13]"
            />
          }
        >
          <SectionHeader
            eyebrow="Our approach"
            title="Designed to create a backbone of control"
            deck="Long-acting AGT silencing"
          />
          {/* The year draining into two doses. Both of the pictures the note
              asked for — the box emptying, the dots becoming two — are this one
              event seen at its two ends; see dose-migration.tsx. */}
          <div className="mt-14">
            <DoseMigration />
          </div>
          <Reveal variant="fade" delay={120}>
            <p className="mt-12 max-w-3xl text-base leading-relaxed text-body">
              CinPressa is advancing a long-acting AGT siRNA designed to provide
              durable blood pressure reduction with one to two administrations
              per year. The goal is to establish a continuous backbone of blood
              pressure control independent of daily patient adherence. Meaningful
              baseline BP reduction may be sufficient for many patients to
              achieve treatment goals as monotherapy, with complementary
              antihypertensive agents layered onto an already controlled
              foundation for patients requiring additional control.
            </p>
          </Reveal>
        </Section>

        {/* Pipeline. The art is FOCUS itself rather than a preview of the pipeline:
            a one-programme pipeline shown small reads as "we have one thing" instead
            of "we are concentrated on one thing". Weighted to the right, where the
            copy is not. */}
        <Section
          tone="indigo"
          art={
            <FocusField className="absolute inset-y-0 right-0 hidden w-[62%] lg:block" />
          }
        >
          <SectionHeader
            eyebrow="Pipeline"
            title="A focused program"
            deck="CIN-111 at the center"
          />
          <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal variant="fade" delay={120}>
              <p className="max-w-3xl text-base leading-relaxed text-body">
                Our pipeline is centered on CIN-111, a long-acting AGT siRNA
                program for hypertension. In hypertensive non-human primate
                studies, CIN-111 has achieved near complete reductions in AGT and
                substantial, sustained reductions in systolic blood pressure,
                with effects maintained for more than three months. These data
                support a long-acting profile with infrequent administration.
              </p>
            </Reveal>
            <Reveal variant="fade" delay={160}>
              <Link
                href="/pipeline"
                className="btn-ghost group shrink-0"
              >
                Visit Pipeline
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </Section>

        {/* News. The page used to end on a white box. The backdrop extends the
            milestone axis's own logic — dated work near, the open calendar
            ahead — as a field rather than a figure, so it costs the section no
            height and asks to be read as atmosphere. See news-horizon.tsx. */}
        <Section art={<NewsHorizon className="absolute inset-0" />}>
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
          {/* The section was a heading and a button over nothing, because there are no
              announcements yet and inventing one is not an option. This previews the
              forward calendar already approved on /news instead. Swap for a real
              teaser when the first release lands. */}
          <MilestoneStrip />
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
