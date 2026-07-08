import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  tone?: "white" | "mist" | "deep";
  children: ReactNode;
  className?: string;
  /** Vertical padding scale. */
  size?: "default" | "sm";
  /** Optional decorative geometry layer, clipped to the section. */
  art?: ReactNode;
};

/** Consistent page section: max width, gutters, and vertical rhythm. */
export function Section({
  id,
  tone = "white",
  children,
  className = "",
  size = "default",
  art,
}: SectionProps) {
  const bg =
    tone === "mist"
      ? "bg-mist"
      : tone === "deep"
        ? "bg-deep text-white"
        : "bg-white";
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
