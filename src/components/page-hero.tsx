import type { ReactNode } from "react";
import { HeroField } from "@/components/hero-field";
import type { HeldLineVariant } from "@/components/held-line";
import { Reveal } from "@/components/reveal";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional element rendered to the right of the copy on large screens. */
  aside?: ReactNode;
  /**
   * Which HeldLine composition this page carries. Every interior page gets its own
   * arrangement rather than a recoloured copy of one geometry - see held-line.tsx.
   */
  variant: HeldLineVariant;
  /**
   * Invert onto the deep ground. Reserved for showpieces: at time of writing only
   * /pipeline uses it, as the lead-programme page. See ART_STRATEGY.md section 5.
   */
  tone?: "light" | "dark";
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  aside,
  variant,
  tone = "light",
}: PageHeroProps) {
  const dark = tone === "dark";

  return (
    <section
      className={`relative overflow-hidden ${dark ? "bg-deep" : "bg-white"}`}
    >
      {/* An aside occupies the right column, where the artwork's structure lives, so
          the two would collide. Those pages get the quietest variant instead. */}
      <HeroField variant={aside ? "open" : variant} tone={tone} />

      {/* Fixed min-height so every interior header is the same size and the artwork
          reads at one consistent scale across pages. content-start keeps the eyebrow on
          the same baseline whether the headline runs one line or three. */}
      <div
        className={`relative mx-auto grid min-h-[33rem] max-w-7xl content-start gap-12 px-6 pb-16 pt-32 lg:min-h-[41rem] lg:px-10 lg:pb-24 lg:pt-44 ${
          aside ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16" : ""
        }`}
      >
        <div className="max-w-3xl">
          <Reveal variant="draw">
            {/* The single accent per page: punctuation, never a surface. Indigo rather
                than orange - orange is reserved for dose semantics and for direct
                quotations of the mark's petals, and this is neither. See
                ART_STRATEGY.md section 4. */}
            <span
              aria-hidden
              className="block h-px w-12"
              style={{
                background: dark
                  ? "var(--color-accent-dark)"
                  : "var(--color-accent)",
              }}
            />
          </Reveal>
          <Reveal variant="fade" delay={80}>
            <p
              className={`mt-6 text-[0.8rem] font-semibold uppercase tracking-[0.22em] ${
                dark ? "text-frost" : "text-blue"
              }`}
            >
              {eyebrow}
            </p>
          </Reveal>
          <Reveal variant="rise-blur" delay={140}>
            <h1
              className={`mt-5 text-[clamp(2.25rem,5vw,3.85rem)] font-light leading-[1.06] tracking-tight ${
                dark ? "text-white" : "text-ink"
              }`}
            >
              {title}
            </h1>
          </Reveal>
          {subtitle ? (
            <Reveal variant="fade" delay={240}>
              <p
                className={`mt-7 max-w-2xl text-lg leading-relaxed md:text-xl ${
                  dark ? "text-white/75" : "text-body"
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
