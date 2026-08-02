import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  /** Vertical padding scale. */
  size?: "default" | "sm";
  /** Optional decorative geometry layer, clipped to the section. */
  art?: ReactNode;
};

type Tone = keyof typeof TONES;

/**
 * Section washes, drawn from the spec sheet's core colours at roughly 6 to 10%.
 * Each is a vertical gradient rather than a flat fill so a long page reads as
 * light moving across it instead of a stack of grey boxes.
 */
const TONES = {
  white: "bg-white",
  mist: "bg-mist",
  sky: "bg-[linear-gradient(180deg,#ffffff_0%,#f1f7fd_45%,#e6f1fa_100%)]",
  green: "bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_45%,#e9f6ef_100%)]",
  indigo: "bg-[linear-gradient(180deg,#ffffff_0%,#f6f7fc_45%,#edeff9_100%)]",
  deep: "bg-deep text-white",
} as const;

/** Consistent page section: max width, gutters, and vertical rhythm. */
export function Section({
  id,
  tone = "white",
  children,
  className = "",
  size = "default",
  art,
}: SectionProps) {
  const bg = TONES[tone];
  const pad = size === "sm" ? "py-14 lg:py-20" : "py-20 lg:py-28";

  return (
    <section id={id} className={`relative ${art ? "overflow-hidden" : ""} ${bg}`}>
      {art ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {art}
        </div>
      ) : null}
      <div className={`relative mx-auto max-w-7xl px-6 lg:px-10 ${pad} ${className}`}>
        {children}
      </div>
    </section>
  );
}
