import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { PetalBloom } from "@/components/geometry";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional element rendered to the right of the copy on large screens. */
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, subtitle, aside }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-mist">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-14%] top-[-20%] h-[620px] w-[620px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(190,215,236,0.45) 0%, rgba(190,215,236,0) 65%)",
        }}
      />
      {/* Logo-derived petal bloom, cropped off the top-right corner */}
      <PetalBloom
        petals={9}
        stroke="#BED7EC"
        tint="#3AAED8"
        tintOpacity={0.045}
        spin="slow"
        className="pointer-events-none absolute -right-40 -top-44 hidden h-[560px] w-[560px] opacity-80 lg:block"
      />
      <PetalBloom
        petals={6}
        stroke="#DCE7F1"
        dash
        spin="slow-rev"
        className="pointer-events-none absolute -left-28 bottom-[-120px] hidden h-[320px] w-[320px] opacity-70 md:block"
      />

      <div
        className={`relative mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-32 lg:px-10 lg:pb-24 lg:pt-44 ${
          aside ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16" : ""
        }`}
      >
        <div className="max-w-3xl">
          <Reveal variant="draw">
            {/* The single orange accent per page — punctuation, never a surface. */}
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
