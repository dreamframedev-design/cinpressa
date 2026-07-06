import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

export type TimelineItem = {
  marker: string;
  title: string;
  body: ReactNode;
};

/** Vertical milestone timeline on a hairline spine. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative">
      <span
        aria-hidden
        className="absolute left-[5px] top-2 bottom-2 w-px bg-line"
      />
      {items.map((item, i) => (
        <Reveal
          key={item.title}
          as="li"
          variant="rise"
          delay={i * 80}
          className="relative flex gap-6 pb-12 last:pb-0"
        >
          <span
            aria-hidden
            className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border border-blue bg-white ring-4 ring-white"
          >
            <span className="absolute inset-[3px] rounded-full bg-blue" />
          </span>
          <div className="-mt-1">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-sky">
              {item.marker}
            </p>
            <h3 className="mt-2 text-xl font-light tracking-tight text-ink">
              {item.title}
            </h3>
            <div className="mt-3 max-w-xl text-sm leading-relaxed text-body">
              {item.body}
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
