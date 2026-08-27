import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Science",
  description:
    "CIN-111 targets angiotensinogen (AGT) synthesis in the liver via RNA interference, blocking the RAAS cascade upstream for durable, adherence-independent blood pressure control.",
};

const complications = [
  "Stroke",
  "Myocardial infarction",
  "Heart failure",
  "Chronic kidney disease",
  "End-stage renal disease",
  "Peripheral arterial disease",
  "Vascular dementia",
];

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

          {/* ONE COLUMN, TIGHT, WITH THE TAGS BACK.

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

          <Reveal variant="fade" delay={180}>
            {/* Balanced too, since the type scale went up: at 17px this no
                longer fits one line and pretty leaves it 614/189. Balance gives
                442/360. Widening to 52rem would hold it on one line, but the
                tags below break 5+2 at that measure instead of 4+3. */}
            <p className="mt-8 max-w-3xl text-balance text-base leading-relaxed text-body">
              Persistent uncontrolled blood pressure substantially increases the
              risk of serious complications:
            </p>
          </Reveal>

          {/* At the prose measure, where the seven break four and three. Wider
              and they break six and one, which strands a tag on its own line. */}
          <ul className="mt-5 flex max-w-3xl flex-wrap gap-2">
            {complications.map((c, i) => (
              <Reveal
                key={c}
                as="li"
                variant="fade"
                /* The stagger is where their life comes from: 90ms apart, so the
                   list visibly ACCUMULATES as it arrives. The sentence above
                   says risk increases; the list should look like it is. */
                delay={240 + i * 90}
              >
                <span className="risk-tag">
                  <span aria-hidden className="risk-dot" />
                  {c}
                </span>
              </Reveal>
            ))}
          </ul>
        </Section>

      </main>

      <SiteFooter />
    </div>
  );
}
