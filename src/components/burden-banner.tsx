"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * The figures band, with an etch that follows the cursor.
 *
 * The hairline above the figures carries a warm glow on hover. It used to be a
 * fixed gradient anchored at the left, which is not a hover state at all - it
 * lit the same inch of rule wherever the pointer was. The band writes the
 * pointer's horizontal position into --etch-x instead, and the rule's overlay
 * centres its glow there, so the warmth is under the cursor and travels with
 * it.
 *
 * WHY A RAF LATCH RATHER THAN SETTING THE VARIABLE ON EVERY EVENT. pointermove
 * fires far more often than the screen refreshes, and each write invalidates a
 * gradient the compositor then has to repaint. One write per frame is all that
 * can be seen, and it keeps a mousemove handler off the critical path.
 *
 * The glow fades rather than snapping: data-etch drives opacity, so entering
 * and leaving are transitions rather than an appearance. Under reduced motion
 * the transition is dropped in css, not the effect - the etch still answers the
 * cursor, it simply arrives immediately.
 */
export function BurdenBanner({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* A pointer that cannot hover cannot track: on touch this would latch the
       glow wherever the last tap landed and leave it there. */
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let frame = 0;
    let pending = -1;

    const flush = () => {
      frame = 0;
      if (pending < 0) return;
      el.style.setProperty("--etch-x", `${pending.toFixed(2)}%`);
      pending = -1;
    };

    /* MEASURED OFF THE RULE, NOT OFF THE BAND. The band is full-bleed and the
       rule sits inside the page container, so mapping the pointer to the band's
       width put the glow about forty pixels adrift of the cursor - visible, and
       exactly the kind of thing that makes a tracking effect feel broken. */
    const target = () =>
      (el.querySelector(".burden-rail") as HTMLElement | null) ?? el;

    const onMove = (e: PointerEvent) => {
      const rect = target().getBoundingClientRect();
      if (rect.width === 0) return;
      pending = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onEnter = (e: PointerEvent) => {
      onMove(e);
      flush();
      el.dataset.etch = "on";
    };

    const onLeave = () => {
      delete el.dataset.etch;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={ref} className={`burden-banner ${className}`}>
      {children}
    </section>
  );
}
