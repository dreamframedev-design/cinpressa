import type { ReactNode } from "react";

/**
 * Scaffolding marker.
 *
 * Anything wearing this is staged, not real content, and must be replaced or
 * removed before the site goes public. It is deliberately styled OUTSIDE the
 * brand system (amber, dashed, uppercase) so it can never be mistaken for
 * finished design or quietly survive a review.
 *
 * `grep -rn "PlaceholderNote" src` lists everything still outstanding.
 */
export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <p
      role="note"
      className="inline-flex items-start gap-2 rounded border border-dashed border-[#b45309] bg-[#fffbeb] px-3 py-2 text-[0.82rem] font-semibold uppercase leading-relaxed tracking-[0.1em] text-[#92400e]"
    >
      <span aria-hidden>&#9650;</span>
      <span>{children}</span>
    </p>
  );
}
