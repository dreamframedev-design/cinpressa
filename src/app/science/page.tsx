import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { ControlModel } from "@/components/control-model";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Science",
  description:
    "CIN-111 targets angiotensinogen (AGT) synthesis in the liver via RNA interference, blocking the RAAS cascade upstream for durable, adherence-independent blood pressure control.",
};

export default function SciencePage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        {/* Open flow, stated in mass before a word is read. What was here before
            pinched the ribbons through a gate and released them — a good picture
            of pressure, which is precisely why it was wrong: a hypertension
            brand cannot open on a bundle being squeezed. Nothing in this field
            narrows anywhere. See open-flow.tsx. */}
        <PageHero
          eyebrow="Unmet need"
          title="Blood pressure control still depends on daily adherence"
          deck="The challenge is persistence"
        />

        {/* The burden.

            THE PROBLEM WAS THAT IT WAS A WALL. Set as one four-line block of
            display type, the statement had no shape — every line the same size,
            the same weight, the same colour, so there was nothing to read except
            length. Two rounds of moving it around the page did not help, because
            the arrangement was never the fault.

            SO IT IS NOT A BLOCK ANY MORE, IT IS A CRESCENDO. The sentence
            already has three parts and they are not equal, so they are not set
            equal: the qualifier is small and grey, the turn is mid-sized and
            ink, and the point is large and arrives in blue. The type does what
            the sentence does. That is the whole idea and it needs no picture,
            no rule and no box to carry it — which is also why this section can
            stay on white without reading as empty: the colour event IS the
            argument landing.

            The three beats arrive in order with a held pause between them, and
            the blue on the last one does not simply appear — it sweeps in over
            a second and a half. The section is about whether control lasts over
            time; the line that says so takes time to say it. */}
        <Section>
          <Reveal variant="fade">
            {/* One sentence pair to a screen reader; three sizes to an eye. */}
            <p className="crescendo max-w-5xl">
              <span className="crescendo-lede">
                In hypertension, the challenge is not simply whether blood
                pressure can be lowered.
              </span>
              <span className="crescendo-turn">
                The challenge is whether it can remain{" "}
              </span>
              <span className="crescendo-point">
                <span className="crescendo-key">controlled over time.</span>
              </span>
            </p>
          </Reveal>

          {/* ONE COLUMN, TIGHT.

              This section has been cut six ways. The complications were tags,
              then a four-across grid, then a band justified edge to edge, then
              a two-column register - and every cut after the first was the same
              instinct: the section looked empty on the right, so something got
              widened to fill it. All of them read worse than the tags did.

              The emptiness had one cause and it was upstream. The statement
              above was capped at 46ch, so the section opened at under half the
              frame and everything below inherited that. It runs to about 80%
              now, which is where this section's width comes from. Nothing down
              here has to stretch to earn it, so the tags are just tags again.

              The lead-in stays welded to them. It ends in a colon and its only
              job is to introduce the seven terms, so it can never sit in a
              column of its own - which is what broke two of the six cuts.

              Reading order is the argument's order: the statement, the cause,
              then the consequence and what it costs. */}
          <Reveal variant="fade" delay={120}>
            {/* BALANCE, NOT PRETTY. Measured at this measure: auto breaks
                665/738/95, pretty breaks 665/651/182 - pretty only prevents a
                one-WORD last line and "treatment persistence." is two, so it
                leaves the stub. Balance breaks 492/477/529. */}
            <p className="mt-10 max-w-3xl text-balance text-base leading-relaxed text-body">
              Medication non-adherence is the leading cause of poor blood
              pressure control, and hypertension is largely asymptomatic,
              resulting in poor long-term adherence and treatment persistence.
            </p>
          </Reveal>

        </Section>

        {/* CinPressa solution. NO BACKDROP. This section had a wash, then a
            better wash, and both were the wrong instrument: its argument is
            structural â€” a foundation with optional courses laid on it â€” and a
            wash cannot state a structure. It carries a figure instead. See
            control-model.tsx.

            COPY PROVENANCE, since it was asked: every word in this section is
            verbatim from the approved site map (Google Doc, "Science" â†’
            "CinPressa solution"). Eyebrow, headline and subheadline are exact;
            the body is the map's single Section body paragraph, split at its
            sentence boundary into the two columns. Nothing here is written. The
            PDFs checked into this repo are an OLDER revision of that map and
            disagree â€” the doc is the source. */}
        <Section tone="green">
          <SectionHeader
            eyebrow="CinPressa solution"
            title="A new treatment paradigm"
          />
          {/* The deck sits ON its paragraph rather than under the headline. It
              was reading as a third heading stacked on the first two; a
              subheadline introduces the body, so the gap above it is wider than
              the gap below and the pair reads as one block. */}
          <Reveal variant="fade" delay={80}>
            <p className="mt-11 max-w-3xl text-lg font-medium leading-snug tracking-tight text-ink md:text-xl">
              Long-acting control with infrequent dosing
            </p>
          </Reveal>
          {/* ONE paragraph, because that is what it is. The map carries this as a
              single Section body and it was being split at its sentence
              boundary into two columns â€” which left three lines beside six and
              a hole under the short one. A two-column set only works when both
              columns fill; this one never could. */}
          <Reveal variant="fade" delay={140}>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-body">
              CinPressa is developing a treatment model that shifts hypertension
              management from daily patient behavior to infrequent
              provider-administered therapy. Rather than relying on daily oral
              dosing, the aim is to deliver durable blood pressure control with
              long-acting AGT silencing, while still allowing complementary
              antihypertensive agents to be layered onto an already controlled
              foundation for patients who require additional reduction.
            </p>
          </Reveal>

          {/* Wider than the prose, deliberately. Held to the copy's measure the
              figure stopped three quarters of the way across a frame the
              sections either side of it fill, which is what made the page read
              as listing to the left. Unlike the dose card this one scales
              cleanly â€” the foundation is a bar and the year line is a rule, so
              width costs it nothing. */}
          <Reveal variant="rise" delay={200} className="mt-14 max-w-5xl">
            <ControlModel />
          </Reveal>
        </Section>

      </main>

      <SiteFooter />
    </div>
  );
}
