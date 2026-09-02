import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  /**
   * The site map's "section subheadline": a short, emphatic deck line that sits
   * between the headline and the body. Distinct from `subtitle`, which carries a
   * full sentence in prose weight.
   */
  deck?: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  /** Tone of the eyebrow hairline + label. */
  tone?: "blue" | "sky";
  className?: string;
  /** Render the title as an <h2> (default) or a plain heading level. */
  as?: "h2" | "h3";
};

export function SectionHeader({
  eyebrow,
  title,
  deck,
  subtitle,
  align = "left",
  tone = "blue",
  className = "",
  as = "h2",
}: SectionHeaderProps) {
  const Heading = as;
  const labelColor = tone === "sky" ? "text-sky" : "text-blue";
  const lineColor = tone === "sky" ? "bg-sky/40" : "bg-blue/40";

  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow ? (
        <Reveal variant="fade">
          <p
            className={`flex items-center gap-3 text-[0.92rem] font-semibold uppercase tracking-[0.2em] ${labelColor} ${
              align === "center" ? "justify-center" : ""
            }`}
          >
            <span aria-hidden className={`h-px w-8 ${lineColor}`} />
            {eyebrow}
          </p>
        </Reveal>
      ) : null}

      <Reveal variant="rise-blur" delay={eyebrow ? 90 : 0}>
        <Heading className="type-display mt-6 text-[clamp(1.9rem,3.6vw,2.85rem)] font-light leading-[1.12] text-ink">
          {title}
        </Heading>
      </Reveal>

      {deck ? (
        <Reveal variant="fade" delay={160}>
          <p className="mt-5 text-lg font-medium leading-snug tracking-tight text-ink md:text-xl">
            {deck}
          </p>
        </Reveal>
      ) : null}

      {subtitle ? (
        <Reveal variant="fade" delay={deck ? 220 : 180}>
          <p className={`text-lg leading-relaxed text-body ${deck ? "mt-4" : "mt-6"}`}>
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
