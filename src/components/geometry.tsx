/**
 * Abstract geometry derived from the CinPressa mark — a bloom of overlapping
 * lens/petal shapes radiating from a center. Rendered hairline-first (the line
 * is the brand) with optional faint translucent tint so overlaps accumulate
 * into a soft bloom, echoing the logo's layered petals without shouting.
 *
 * Purely decorative: always aria-hidden and non-interactive. Rotation is
 * unhurried and disabled under prefers-reduced-motion.
 */

type Spin = "none" | "slow" | "slow-rev";

export function PetalBloom({
  className = "",
  petals = 8,
  stroke = "#BED7EC",
  strokeOpacity = 1,
  tint,
  tintOpacity = 0.05,
  spin = "none",
  dash = false,
}: {
  className?: string;
  petals?: number;
  stroke?: string;
  strokeOpacity?: number;
  /** Faint fill colour; overlaps accumulate into a soft bloom. */
  tint?: string;
  tintOpacity?: number;
  spin?: Spin;
  dash?: boolean;
}) {
  const angles = Array.from({ length: petals }, (_, i) => (360 / petals) * i);
  const spinClass =
    spin === "slow" ? "spin-slow" : spin === "slow-rev" ? "spin-slow-rev" : "";

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      className={`${spinClass} ${className}`}
    >
      {tint
        ? angles.map((a) => (
            <ellipse
              key={`tint-${a}`}
              cx="100"
              cy="66"
              rx="27"
              ry="60"
              fill={tint}
              fillOpacity={tintOpacity}
              transform={`rotate(${a} 100 100)`}
            />
          ))
        : null}
      {angles.map((a) => (
        <ellipse
          key={`line-${a}`}
          cx="100"
          cy="66"
          rx="27"
          ry="60"
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth="1"
          strokeDasharray={dash ? "1 6" : undefined}
          vectorEffect="non-scaling-stroke"
          transform={`rotate(${a} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="1.6" fill={stroke} fillOpacity={strokeOpacity} />
    </svg>
  );
}
