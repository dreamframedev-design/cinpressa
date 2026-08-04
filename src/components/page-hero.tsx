import type { ReactNode } from "react";
import { HeroField } from "@/components/hero-field";
import { Reveal } from "@/components/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional element rendered to the right of the copy on large screens. */
  aside?: ReactNode;
  /**
   * The backdrop for this page's header.
   *
   * Omit it and the page keeps the original treatment: the pale wash with the mark
   * cropped into the lower right. /about still uses that and is deliberately left
   * alone. /science, /pipeline and /news each pass their own field instead, because
   * one backdrop repeated across every interior page was the note that started all of
   * this. See hero-fields.tsx for how the three are kept distinct.
   */
  field?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  aside,
  field,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      {field ? (
        <>
          {field}
          {/* Feather into the section below. The canvas fields run to their own edge,
              and a hard horizontal cut at the section boundary would undo the work
              every one of them does to avoid a visible frame. */}
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

      {/* Fixed min-height so every interior header is the same size and the
          mark reads at one consistent scale across pages. content-start keeps
          the eyebrow on the same baseline whether the headline runs one line
          or three. */}
      <div
        className={`relative mx-auto grid min-h-[33rem] max-w-7xl content-start gap-12 px-6 pb-16 pt-32 lg:min-h-[41rem] lg:px-10 lg:pb-24 lg:pt-44 ${
          aside ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16" : ""
        }`}
      >
        <div className="max-w-3xl">
          <Reveal variant="draw">
            {/* The single orange accent per page: punctuation, never a surface. */}
            <span aria-hidden className="block h-px w-12 bg-orange" />
          </Reveal>
          <Reveal variant="fade" delay={80}>
            <p className="mt-6 text-[0.84rem] font-semibold uppercase tracking-[0.22em] text-blue">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal variant="rise-blur" delay={140}>
            <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.85rem)] font-light leading-[1.06] tracking-tight text-ink">
              {title}
            </h1>
          </Reveal>
          {subtitle ? (
            <Reveal variant="fade" delay={240}>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-body md:text-xl">
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
