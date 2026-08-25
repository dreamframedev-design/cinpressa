import type { CSSProperties } from "react";

type Form = {
  color: string;
  alpha: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  dx: number;
  dy: number;
  driftRotation: number;
  scale: number;
  duration: number;
  delay: number;
};

/**
 * An architectural crop of the contact-page colour language. These three
 * oversized forms overlap as a field, not as a radial mark, and most of each
 * ellipse remains outside the section edge.
 */
const FORMS: Form[] = [
  {
    color: "#AFDBBC",
    alpha: 0.46,
    cx: 560,
    cy: 705,
    rx: 540,
    ry: 230,
    rotation: -10,
    dx: 18,
    dy: -10,
    driftRotation: 0.7,
    scale: 1.018,
    duration: 34,
    delay: -14,
  },
  {
    color: "#95DAF8",
    alpha: 0.48,
    cx: 850,
    cy: 390,
    rx: 300,
    ry: 350,
    rotation: 14,
    dx: -16,
    dy: 14,
    driftRotation: -0.65,
    scale: 0.99,
    duration: 41,
    delay: -27,
  },
  {
    color: "#2261AD",
    alpha: 0.2,
    cx: 745,
    cy: 690,
    rx: 455,
    ry: 145,
    rotation: 7,
    dx: -13,
    dy: -8,
    driftRotation: 0.8,
    scale: 1.015,
    duration: 37,
    delay: -21,
  },
];

export function PipelineField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pipeline-field-shell pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 1000 760"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {FORMS.map((form) => (
          <g
            key={form.color}
            className="pipeline-field-drift"
            style={
              {
                "--pipeline-field-dx": `${form.dx}px`,
                "--pipeline-field-dy": `${form.dy}px`,
                "--pipeline-field-dr": `${form.driftRotation}deg`,
                "--pipeline-field-scale": form.scale,
                "--pipeline-field-duration": `${form.duration}s`,
                "--pipeline-field-delay": `${form.delay}s`,
              } as CSSProperties
            }
          >
            <ellipse
              cx={form.cx}
              cy={form.cy}
              rx={form.rx}
              ry={form.ry}
              transform={`rotate(${form.rotation} ${form.cx} ${form.cy})`}
              fill={form.color}
              fillOpacity={form.alpha}
              style={{ mixBlendMode: "multiply" }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
