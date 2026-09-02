import type { ReactNode } from "react";
import { HeroField } from "@/components/hero-field";
import { Reveal } from "@/components/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  /**
   * The site map's "subheadline": a short, emphatic deck line under the headline.
   * `subtitle` remains for pages whose subheadline is a full sentence in prose.
   */
  deck?: ReactNode;
  subtitle?: ReactNode;
  /** Optional element rendered to the right of the copy on large screens. */
  aside?: ReactNode;
  /**
   * Backdrop for this page's header. Omit it and the page keeps the original
   * treatment, which /about still uses deliberately. /science, /pipeline and /news each
   * pass their own; see hero-fields.tsx.
   */
  field?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  deck,
  subtitle,
  aside,
  field,
}: PageHeroProps) {
  /** An aside occupies the right column and needs the room to stand in. */
  const tall = Boolean(aside);

  return (
    <section className="relative overflow-hidden bg-white">
      {field ? (
        <>
          {field}
          {/* Feather into the section below, so the field is not cut off by the
              section boundary after all the work it does to avoid a visible edge. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 lg:h-44"
            style={{
              background:
                "linear-gradient(0deg, #ffffff 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </>
      ) : (
        /* An aside occupies the right column, so the mark would collide with it */
        <HeroField mark={!aside} />
      )}

      {/* Min-height so interior headers read at one consistent scale, and
          content-start keeps the eyebrow on the same baseline whether the
          headline runs one line or three.

          THE FLOOR IS A FLOOR, NOT A HEIGHT. 41rem was set for a header that
          carries a deck, a subtitle and an aside, and then every header was
          held to it. /pipeline lost its deck and sat on 307px of empty white;
          /news carries a two line subtitle and sat on 397px of it, which is
          most of a screen between the headline and the first announcement.

          A minimum only has to be tall enough that a lone headline does not
          look cramped - past that the content should set the height, and it
          does: /about's three line subtitle overruns this floor on its own and
          the header grows to fit. So the floor is one value now for everything
          except a header with an aside, where the right column genuinely needs
          the room to stand in. Consistency of scale is what the eyebrow, the
          type ramp and the top padding are for; it was never the job of a fixed
          box, and holding one stopped serving it at the point where it opened a
          hole under three pages out of four. */}
      <div
        /* w-full IS LOAD-BEARING. Without it a grid shrinks to fit its
           content, and mx-auto then centres that shrunken box - so on a wide
           screen a short headline drifts right of the gutter every other thing
           on the page starts at, including the logo directly above it. Every
           other container on the site pairs w-full with max-w-7xl; this one
           did not, which is why the interior heroes sat off-axis. */
        className={`relative mx-auto grid w-full max-w-7xl content-start gap-12 px-6 pt-32 lg:px-10 lg:pt-44 ${
          tall
            ? "min-h-[33rem] pb-16 lg:min-h-[41rem] lg:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16"
            : "min-h-[26rem] pb-12 lg:min-h-[30rem] lg:pb-16"
        }`}
      >
        <div className="max-w-3xl">
          {/* No rule above the eyebrow. It was the one orange accent per page and
              it was also a hairline floating over nothing, which is the exact
              mark this project has been asked to stop drawing. Interior heroes
              now open on the label itself. */}
          <Reveal variant="fade" delay={80}>
            <p className="text-[0.92rem] font-semibold uppercase tracking-[0.22em] text-blue">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal variant="rise-blur" delay={140}>
            {/* .hero-title, the same rule the home headline uses: an interior
                hero is the home hero at a smaller size, so it gets the face and
                the weight rather than a lighter approximation of them. */}
            <h1 className="hero-title mt-5 text-[clamp(2.25rem,5vw,3.85rem)] leading-[1.06] text-ink">
              {title}
            </h1>
          </Reveal>
          {deck ? (
            <Reveal variant="fade" delay={220}>
              <p className="type-display mt-7 max-w-2xl text-xl font-medium leading-snug text-ink md:text-2xl">
                {deck}
              </p>
            </Reveal>
          ) : null}

          {subtitle ? (
            <Reveal variant="fade" delay={deck ? 300 : 240}>
              <p
                className={`max-w-2xl text-lg leading-relaxed text-body md:text-xl ${
                  deck ? "mt-5" : "mt-7"
                }`}
              >
                {subtitle}
              </p>
            </Reveal>
          ) : null}
        </div>

        {aside ? (
          <Reveal variant="rise" delay={200} className="relative">
            {aside}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
