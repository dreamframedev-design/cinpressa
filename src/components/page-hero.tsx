import type { ReactNode } from "react";
import { HeroField } from "@/components/hero-field";
import { Reveal } from "@/components/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional element rendered to the right of the copy on large screens. */
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, subtitle, aside }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* An aside occupies the right column, so the mark would collide with it */}
      <HeroField mark={!aside} />

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
            <p className="mt-6 text-[0.72rem] font-medium uppercase tracking-[0.26em] text-blue">
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
