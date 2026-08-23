"use client";

import { useState } from "react";
import { ConvergenceMark, MARK_VARIANTS } from "@/components/convergence-mark";
import type { MarkVariant } from "@/components/convergence-mark";

/**
 * REVIEW SCAFFOLDING — temporary. Delete this file once an entrance is chosen,
 * and put `<ConvergenceMark variant="…" />` back on the hero directly.
 *
 * Four candidate entrances plus the original, switchable in place so they can
 * be compared against each other on the real hero at real size rather than in
 * isolation. Selecting one remounts the mark, so every switch plays the
 * entrance from its first frame; the mark itself also replays on click, which
 * is how to watch the same one twice.
 *
 * The picker is deliberately plain and slightly apart from the composition —
 * it is a control panel, not a design element, and it should be obvious that
 * it is not part of the page.
 */
export function MarkPreview({ className = "" }: { className?: string }) {
  const [variant, setVariant] = useState<MarkVariant>("splay");
  const [run, setRun] = useState(0);

  const active = MARK_VARIANTS.find((v) => v.id === variant);

  return (
    <div className={className}>
      <ConvergenceMark key={`${variant}-${run}`} className="w-full" variant={variant} />

      <div className="mt-8 rounded-2xl border border-line bg-white/85 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
            Entrance preview
          </p>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="rounded-full border border-line px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-body transition-colors hover:border-blue hover:text-blue"
          >
            Replay
          </button>
        </div>

        {/* Grouped, because nine unlabelled pills is a wall. The orbital set
            leads: that is the family under review. */}
        {(["orbital", "still"] as const).map((g) => (
          <div key={g} className="mt-3">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-stone">
              {g === "orbital" ? "Rotational" : "No rotation"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {MARK_VARIANTS.filter((v) => v.group === g).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVariant(v.id);
                    setRun((r) => r + 1);
                  }}
                  className={
                    v.id === variant
                      ? "rounded-full border border-blue bg-blue px-3.5 py-1.5 text-[0.78rem] font-semibold text-white"
                      : "rounded-full border border-line px-3.5 py-1.5 text-[0.78rem] font-medium text-body transition-colors hover:border-blue hover:text-blue"
                  }
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <p className="mt-3 text-[0.82rem] leading-relaxed text-muted">
          {active?.note}
          <span className="text-stone"> · click the mark to replay</span>
        </p>
      </div>
    </div>
  );
}
