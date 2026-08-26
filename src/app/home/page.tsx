import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { BurdenRail } from "@/components/burden-rail";
import { DoseMigration } from "@/components/dose-migration";
import { Bleed } from "@/components/bleed";
import { NewsFeed } from "@/components/news-feed";
import { MarkPreview } from "@/components/mark-preview";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";
import { ProgramSpec } from "@/components/program-spec";

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
        <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-gradient-to-b from-white via-white to-mist lg:min-h-[76vh]">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-1/2 h-[680px] w-[680px] -translate-y-1/2 rounded-full opacity-55"
            style={{
              background:
                "radial-gradient(circle, rgba(190,215,236,0.5) 0%, rgba(190,215,236,0) 65%)",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-10 lg:pb-16 lg:pt-32">
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

              {/* REVIEW SCAFFOLDING: the entrance picker. Swap back to a plain
                  <ConvergenceMark variant="…" className="w-full" /> once one is
                  chosen, and delete mark-preview.tsx. */}
              <div className="mark-lift relative w-[68%]">
                <MarkPreview className="w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* THE VERDICT — the homepage sibling of the science page's crescendo,
            so the two most important statements on the site speak one language.

            History, because this block has now been through four shapes: a
            plain grey paragraph (skimmed past), a two-column split (never
            aligned), and a strikethrough on "efficacy" (read wrong — the copy
            already says NOT efficacy, so a strike on top of it negates twice,
            and with the word broken onto its own line the eye met a crossed-out
            word before it had the sentence that frames it). All dead.

            What replaced them: the sentence set at its own weights — the turn
            at reading scale, the answer at display scale — and the COLOUR now
            tells the story the strike was reaching for, without the double
            negative. After both lines land, "efficacy." visibly loses its ink
            and dims to grey while "persistence." takes the blue: emphasis
            migrating from the wrong answer to the right one. Discarded by
            fading, not by crossing out. */}
        <section className="bg-[linear-gradient(180deg,var(--color-mist)_0%,rgba(255,255,255,0.96)_38%,#fff_100%)]">
          <div className="relative mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
            {/* Widened. At a 3xl premise and a 3.9rem answer this block stopped
                two thirds of the way across a frame its neighbours fill, and
                a hinge that short reads as a stub rather than as a pause. */}
            <div className="max-w-5xl">
              <Reveal variant="fade">
                <p className="max-w-4xl text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.62] text-muted">
                  Daily oral therapy has been the backbone of hypertension care for
                  decades, yet a large proportion of patients remain uncontrolled or
                  untreated.
                </p>
              </Reveal>

              {/* One sentence pair to a screen reader; two scales to an eye.
                  "not efficacy." stays whole on the turn line — the break that
                  stranded the word below its "not" is what made every earlier
                  cut of this read wrong. */}
              <Reveal variant="fade" delay={110} className="mt-9 lg:mt-11">
                <p className="verdict">
                  <span className="verdict-turn">
                    The unmet need in hypertension is{" "}
                    {/* Bound: if the line has to wrap on a phone, "not" and
                        "efficacy." travel together — the split between them is
                        what made every earlier cut read wrong. */}
                    <span className="whitespace-nowrap">
                      not <span className="verdict-set">efficacy.</span>
                    </span>
                  </span>{" "}
                  <span className="verdict-answer">
                    It is <span className="verdict-key">persistence.</span>
                  </span>
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        {/* Bleed runs full-bleed rather than inside the container - it is a piece,
            not a figure, and gutters would make it read as an illustration sitting
            in a slot. It lands directly under the answer, which is the point. */}
        <Bleed className="h-[190px] w-full sm:h-[250px] lg:h-[330px]" />

        {/* The challenge. Stripped twice over. The eyebrow went because the
            headline already says what this section is; the first half of the
            paragraph went because it read the stat rail's numbers back to the
            reader in prose, which is where the redundancy actually lived. What
            is left is the sentence those numbers were building toward, and it
            now leads the section instead of trailing it.

            Copy first, figure second: the rail is a helper, and helpers come
            after the thing they help. */}
        <Section tone="sky" className="pt-12! lg:pt-16!">
          <SectionHeader title="Control that lasts remains elusive" />
          <Reveal variant="fade" delay={120}>
            <p className="mt-8 max-w-3xl text-lg font-medium leading-snug tracking-tight text-ink md:text-xl">
              Medication non-adherence is the leading cause of poor blood
              pressure control, and hypertension is largely asymptomatic,
              resulting in poor long-term adherence and treatment persistence.
            </p>
          </Reveal>
          <BurdenRail
            className="mt-14 lg:mt-16"
            figures={[
              {
                value: "1.4",
                unit: "B",
                label: "people live with hypertension worldwide",
                share: 1,
              },
              {
                value: "700",
                unit: "M+",
                label: "remain uncontrolled or untreated",
                share: 0.5,
              },
              {
                value: "70",
                unit: "%",
                label:
                  "of treated patients do not achieve target blood pressure levels, despite numerous approved therapies",
                share: 0.7,
              },
            ]}
          />
        </Section>

        {/* Our approach. White ground, no wash, no watermark: the note on the
            old treatment was that the dots floated in space over a green field.
            The year-draining-into-two-doses flight now runs inside a framed
            instrument card — the card IS the container — and it wants clean
            paper behind it, not atmosphere. See dose-migration.tsx. */}
        {/* NO SECTION HEADER, per review: the only headline above this animation
            is the one inside the card. The eyebrow, headline and deck that used
            to sit here were three lines of build-up in front of a figure that
            states its case in five words. (Those are site-map lines — removing
            them is a deliberate call, not an oversight.)

            THE CARD IS PAIRED, NOT STACKED. Held to its own measure the card
            stopped three quarters of the way across the frame while the
            sections either side of it ran the full width, and that mismatch is
            what read as the page listing to the left. The paragraph that used
            to sit under it now sits beside it, so the section fills its frame
            with content it already had. The card cannot simply be widened —
            its grid divides the width, so a wider card means coarser dots, not
            more of them. */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
            <Reveal variant="rise">
              <DoseMigration />
            </Reveal>
            <Reveal variant="fade" delay={120}>
              <p className="text-base leading-relaxed text-body">
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
          </div>
        </Section>

        {/* Pipeline.

            The section was a headline, a deck, one paragraph and a decorative
            colour field in the corner — a section called "Pipeline" that told a
            reader nothing about the pipeline. The field kept getting tuned, and
            tuning was never going to fix it: art was standing in for content
            that had gone missing.

            It had not gone missing, it was buried. The map's body for this
            section is context, then three preclinical findings, then a
            conclusion — and set as one paragraph the findings are a subordinate
            clause nobody stops on. The paragraph keeps its first sentence and
            its last; the middle one becomes the spec beside it. Same body, same
            words, redistributed into the shape each part wanted.

            A spread rather than a stack, because that is what the width is for:
            the argument reads down the left, the evidence stands on the right,
            and both start on the same line. See program-spec.tsx. */}
        <Section tone="indigo">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="Pipeline"
                title="A focused program"
                className="max-w-none"
              />
              <Reveal variant="fade" delay={120}>
                <p className="mt-9 text-base leading-relaxed text-body">
                  Our pipeline is centered on CIN-111, a long-acting AGT siRNA
                  program for hypertension.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={180}>
                <p className="mt-5 text-base leading-relaxed text-body">
                  These data support a long-acting profile with infrequent
                  administration.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={240}>
                <Link href="/pipeline" className="btn-ghost group mt-10 inline-flex">
                  Visit Pipeline
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>

            <ProgramSpec
              className="lg:pt-2"
              source="In hypertensive non-human primate studies"
              findings={[
                { label: "AGT reduction", value: "Near complete" },
                {
                  label: "Systolic blood pressure",
                  value: "Substantial, sustained",
                },
                {
                  label: "Effect maintained",
                  value: "More than three months",
                  accent: true,
                },
              ]}
            />
          </div>
        </Section>

        {/* News. Back to the map's own heading and subhead, and back to the
            format a News heading promises: a dated list. What was here was a
            bespoke forward calendar — good-looking, and it made a reader work
            out the layout before they could read it. See news-feed.tsx. */}
        <Section id="news" tone="sky">
          <SectionHeader
            eyebrow="News"
            title="What’s new at CinPressa"
          />
          <NewsFeed className="mt-12" />
          <Reveal variant="fade" delay={260}>
            <Link
              href="/news"
              className="group mt-10 inline-flex min-h-11 items-center gap-2 text-base font-medium text-blue transition-colors hover:text-ink"
            >
              <span className="link-underline">Read the latest</span>
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
