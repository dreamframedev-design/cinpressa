"use client";

import { useState } from "react";
import { ConvergenceMark, MARK_VARIANTS } from "@/components/convergence-mark";
import type { MarkVariant } from "@/components/convergence-mark";

/**
 * REVIEW SCAFFOLDING — temporary. Delete this file once an entrance is chosen,
 * and put `<ConvergenceMark variant="…" />` back on the hero directly.
 *
 * Candidate entrances switchable in place, so they can be compared on the real
 * hero at real size rather than in isolation. Selecting one remounts the mark,
 * so every switch plays from the first frame; the mark also replays on click.
 *
 * Kept deliberately quiet. It sits on a hero that is being judged, so it has
 * to be legible enough to use and faint enough to ignore: a hairline rule
 * instead of a panel, no fill, no backdrop blur, labels at the smallest size
 * the ramp goes to, and only the selected one carrying any colour.
 */
export function MarkPreview({ className = "" }: { className?: string }) {
  const [variant, setVariant] = useState<MarkVariant>("cascade");
  const [run, setRun] = useState(0);

  return (
    <div className={className}>
      <ConvergenceMark
        key={`${variant}-${run}`}
        className="w-full"
        variant={variant}
      />

      <div className="mt-6 border-t border-line/70 pt-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {MARK_VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setVariant(v.id);
                setRun((r) => r + 1);
              }}
              className={
                v.id === variant
                  ? "text-[0.68rem] font-semibold tracking-[0.04em] text-blue underline decoration-blue/40 underline-offset-4"
                  : "text-[0.68rem] tracking-[0.04em] text-stone transition-colors hover:text-body"
              }
            >
              {v.label}
            </button>
          ))}

          <span aria-hidden className="h-2.5 w-px bg-line" />

          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="text-[0.68rem] tracking-[0.04em] text-stone transition-colors hover:text-body"
          >
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}
