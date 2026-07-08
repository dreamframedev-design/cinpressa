import type { CSSProperties } from "react";

type StageStatus = "complete" | "current" | "upcoming";

export type Stage = {
  name: string;
  detail?: string;
  status: StageStatus;
};

const defaultStages: Stage[] = [
  { name: "Discovery", detail: "AGT siRNA design", status: "complete" },
  { name: "Preclinical", detail: "NHP efficacy · GLP tox", status: "complete" },
  { name: "IND-enabling", detail: "U.S. IND ~mid-2026", status: "current" },
  { name: "Phase 1", detail: "First-in-human, fall 2026", status: "upcoming" },
  { name: "Phase 2", detail: "Planned", status: "upcoming" },
];

export function PipelineTracker({ stages = defaultStages }: { stages?: Stage[] }) {
  const currentIndex = Math.max(
    0,
    stages.findIndex((s) => s.status === "current")
  );
  const n = stages.length;
  const inset = 100 / (2 * n);
  const progress = (currentIndex / n) * 100;

  return (
    <div>
      {/* Desktop: horizontal track */}
      <ol className="relative hidden md:flex">
        <span
          aria-hidden
          className="absolute top-[10px] h-px bg-line"
          style={{ left: `${inset}%`, right: `${inset}%` }}
        />
        <span
          aria-hidden
          className="track-progress absolute top-[10px] block h-px origin-left bg-blue"
          style={{ left: `${inset}%`, width: `${progress}%` }}
        />
        {stages.map((stage, i) => (
          <li
            key={stage.name}
            className="relative flex flex-1 flex-col items-center px-2 text-center"
          >
            <StageDot status={stage.status} index={i} />
            <StageLabel stage={stage} className="mt-5" />
          </li>
        ))}
      </ol>

      {/* Mobile: vertical timeline */}
      <ol className="relative space-y-7 md:hidden">
        <span
          aria-hidden
          className="absolute left-[10px] top-2 bottom-2 w-px bg-line"
        />
        {stages.map((stage, i) => (
          <li key={stage.name} className="relative flex items-start gap-4">
            <StageDot status={stage.status} index={i} />
            <StageLabel stage={stage} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function StageDot({ status, index }: { status: StageStatus; index: number }) {
  const nodeStyle = { "--i": index } as CSSProperties;

  if (status === "complete") {
    return (
      <span
        className="track-node relative z-10 flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full bg-blue ring-4 ring-white"
        style={nodeStyle}
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
          <path
            d="M2.5 6.2 5 8.5 9.5 3.5"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (status === "current") {
    return (
      <span
        className="track-node relative z-10 flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-white"
        style={nodeStyle}
      >
        <span className="pulse-ring-el absolute inset-0 rounded-full border-2 border-orange" />
        <span className="absolute inset-0 rounded-full border-2 border-orange" />
        <span className="h-2 w-2 rounded-full bg-orange" />
      </span>
    );
  }
  return (
    <span
      className="track-node relative z-10 h-[21px] w-[21px] shrink-0 rounded-full border border-line bg-white ring-4 ring-white"
      style={nodeStyle}
    />
  );
}

function StageLabel({
  stage,
  className = "",
}: {
  stage: Stage;
  className?: string;
}) {
  const emphasized = stage.status !== "upcoming";
  return (
    <div className={className}>
      <p
        className={`text-sm font-medium ${
          stage.status === "current"
            ? "text-ink"
            : emphasized
              ? "text-blue"
              : "text-muted"
        }`}
      >
        {stage.name}
      </p>
      {stage.detail ? (
        <p className="mt-1 text-xs leading-relaxed text-muted">{stage.detail}</p>
      ) : null}
    </div>
  );
}
