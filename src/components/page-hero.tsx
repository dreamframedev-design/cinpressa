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
  /** Nothing under the headline but the next section. */
  const bare = !deck && !subtitle && !aside;

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

          A HERO CARRYING NEITHER A DECK NOR A SUBTITLE SITS SHORTER. The tall
          value was sized for headers that carry one; /pipeline's lost its deck
          and the fixed height then held 307px of empty white under the headline
          before the next section's own 112px of padding even started. Holding
          every header to one height stops serving consistency at the point
          where it opens a hole - the amount of content is genuinely different,
          so the box is too. This is the only bare hero on the site today, so it
          is the only one that moves. */}
      <div
        /* w-full IS LOAD-BEARING. Without it a grid shrinks to fit its
           content, and mx-auto then centres that shrunken box - so on a wide
           screen a short headline drifts right of the gutter every other thing
           on the page starts at, including the logo directly above it. Every
           other container on the site pairs w-full with max-w-7xl; this one
           did not, which is why the interior heroes sat off-axis. */
        className={`relative mx-auto grid w-full max-w-7xl content-start gap-12 px-6 pt-32 lg:px-10 lg:pt-44 ${
          bare
            ? "min-h-[26rem] pb-12 lg:min-h-[30rem] lg:pb-16"
            : "min-h-[33rem] pb-16 lg:min-h-[41rem] lg:pb-24"
        } ${aside ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16" : ""}`}
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
            <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.85rem)] font-light leading-[1.06] tracking-tight text-ink">
              {title}
            </h1>
          </Reveal>
          {deck ? (
            <Reveal variant="fade" delay={220}>
              <p className="mt-7 max-w-2xl text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl">
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
