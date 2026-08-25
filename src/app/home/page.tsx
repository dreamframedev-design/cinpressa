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
import { MilestoneStrip } from "@/components/milestone-strip";
import { MarkPreview } from "@/components/mark-preview";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";
import { PipelineField } from "@/components/pipeline-field";

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
            <div className="max-w-4xl">
              <Reveal variant="fade">
                <p className="max-w-3xl text-[clamp(1rem,1.25vw,1.12rem)] leading-[1.62] text-muted">
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
        <Section>
          <SectionHeader
            eyebrow="Our approach"
            title="Designed to create a backbone of control"
            deck="Long-acting AGT silencing"
          />
          {/* Held to the section's own measure. The card used to run the full
              container while the artwork inside it was half that wide, so the
              figure floated in a white field with dead margins on three sides.
              Same 3xl column as the heading above it and the paragraph below,
              which means the whole section now reads down one edge at one
              width. */}
          <div className="mt-14 max-w-3xl">
            <Reveal variant="rise">
              <DoseMigration />
            </Reveal>
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

        {/* Pipeline. NO ART, and that is the whole brief. The field that ran
            behind this section pinched its ribbons through a gate before
            releasing them, which is a picture of pressure — the one thing a
            hypertension brand must not draw. It went, and nothing replaced it,
            because a section whose job is to point at another page does not
            need a picture to do it. What it needed was to stop being three
            things arranged around one.

            So: one column, one edge, in the order you read it — label,
            headline, deck, the paragraph, the way through. The button used to
            float at the far right on the paragraph's last baseline, which put
            the only interactive thing in the section as far from the sentence
            that earned it as the container allowed. It sits under the copy now.

            The pipeline uses a cropped contact-page colour field: broad forms,
            deliberately asymmetric, with no radial logo construction. */}
        <Section tone="indigo" art={<PipelineField />}>
          <SectionHeader
            eyebrow="Pipeline"
            title="A focused program"
            deck="CIN-111 at the center"
          />
          <Reveal variant="fade" delay={120}>
            <p className="mt-10 max-w-3xl text-base leading-relaxed text-body">
              Our pipeline is centered on CIN-111, a long-acting AGT siRNA
              program for hypertension. In hypertensive non-human primate
              studies, CIN-111 has achieved near complete reductions in AGT and
              substantial, sustained reductions in systolic blood pressure, with
              effects maintained for more than three months. These data support a
              long-acting profile with infrequent administration.
            </p>
          </Reveal>
          <Reveal variant="fade" delay={180}>
            <Link href="/pipeline" className="btn-ghost group mt-10 inline-flex">
              Visit Pipeline
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </Section>

        {/* News is a forward calendar until the first announcement exists. The
            year anchors the composition; the two approved milestones remain a
            chronological list rather than pretending to be news cards. */}
        <Section id="news" tone="sky">
          <SectionHeader
            eyebrow="News"
            title="What’s ahead for CIN-111"
            subtitle="Two planned milestones mark the program’s transition into clinical development."
          />
          {/* The section was a heading and a button over nothing, because there are no
              announcements yet and inventing one is not an option. This previews the
              forward calendar already approved on /news instead. Swap for a real
              teaser when the first release lands. */}
          <MilestoneStrip />
          <Reveal variant="fade" delay={140} className="mt-8 flex justify-end">
            <Link
              href="/news"
              className="group inline-flex min-h-11 items-center gap-2 text-base font-medium text-blue transition-colors hover:text-ink"
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
