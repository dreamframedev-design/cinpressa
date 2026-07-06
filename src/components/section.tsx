import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  tone?: "white" | "mist" | "deep";
  children: ReactNode;
  className?: string;
  /** Vertical padding scale. */
  size?: "default" | "sm";
};

/** Consistent page section: max width, gutters, and vertical rhythm. */
export function Section({
  id,
  tone = "white",
  children,
  className = "",
  size = "default",
}: SectionProps) {
  const bg =
    tone === "mist"
      ? "bg-mist"
      : tone === "deep"
        ? "bg-deep text-white"
        : "bg-white";
  const pad =
    size === "sm"
      ? "py-14 lg:py-20"
      : "py-20 lg:py-28";

  return (
    <section id={id} className={bg}>
      <div className={`mx-auto max-w-7xl px-6 lg:px-10 ${pad} ${className}`}>
        {children}
      </div>
    </section>
  );
}
