"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/**
 * SiteAlleys — one hairline down each side of the page, lit where the cursor is.
 *
 * The same device the parent site runs, in CinPressa's own hues. Two 1px rules
 * anchored to the OUTER edge of the global content gutter, running the whole
 * document behind every section. A focal point slides along each line with the
 * pointer's vertical position; the rest of the stroke stays quiet, so what you
 * notice is a chip of colour tracking you down the page rather than a coloured
 * line.
 *
 * WHY THE HUES ARE WHAT THEY ARE. The spec sheet's cool ladder — blue #2261AD,
 * azure #1596D4, cyan #1EAEE5 — all sit between hue 196 and 213, which is a
 * narrow enough band that the whole stroke can live inside it and still shift
 * visibly. Nothing here is invented: the peak travels the brand's own ladder and
 * the flanks sit a few degrees off it. Two slow sinusoids on different periods
 * keep it from being a static gradient when the pointer is still.
 *
 * ANCHORING. `max(24px, calc(50% - 640px + 24px))` puts the line 24px in from
 * the viewport edge on narrow screens, and on the inner edge of the gutter once
 * the 1280px container starts centring itself. Hidden below `sm`, where a phone
 * has no cursor and no room.
 *
 * THE TERMINATOR. The footer is deep navy, and a cool hairline painted over it
 * reads as a scratch. Any section can opt out by carrying `data-alleys-end`;
 * the first one found in the document sets a mask that fades the alleys to
 * nothing over the 140px above it. Observers keep the cutoff honest as content
 * above it reflows.
 *
 * z-30 — over section backgrounds, under the sticky nav.
 */

/** Anchor hues, straight off the spec sheet's cool ladder. */
const CENTER_HUE = 200; // azure #1596D4
const EDGE_HUE = 212; // blue #2261AD
const FLANK_OFFSET = -6; // a few degrees toward cyan
const SAT = 68;
const LIGHT = 56;

/**
 * Alpha of the travelling etch. The flanks stay near-invisible so what reads is
 * the peak, not a coloured line.
 */
const FLANK_A = 0.3;
const PEAK_A = 0.85;
/** The always-there hairline the etch travels along. */
const BASE = "rgba(190, 215, 236, 0.6)";
const FADE_BAND = 140;

function Alley({ side }: { side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let targetPeak = 50;
    let peak = 50;
    let lastX = 0;
    let lastY = 0;
    let seen = false;
    let raf = 0;
    let last = performance.now();

    /** Project the cursor onto the line as a percentage of its height. */
    const recompute = (clientY: number) => {
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return;
      const pct = ((clientY - rect.top) / rect.height) * 100;
      targetPeak = Math.max(0, Math.min(100, pct));
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      seen = true;
      recompute(e.clientY);
    };
    // The line is document-height, so scrolling moves it under a stationary
    // cursor. Without this the focal point freezes until the pointer twitches.
    const onScroll = () => {
      if (seen) recompute(lastY);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // The lit band is sized off the VIEWPORT, not off the line. Expressed as
      // a percentage of a document-height element it would spread over a
      // thousand pixels and read as a haze; in viewport terms it stays a chip
      // of light about two thirds of a screen tall however long the page is.
      el.style.setProperty(
        "--al-band",
        `${Math.round(Math.min(360, window.innerHeight * 0.36))}px`,
      );
      // Frame-rate independent lerp — the highlight trails rather than snaps.
      peak += (targetPeak - peak) * (1 - Math.exp(-dt * 7));

      // Hue swings toward the edge anchor as the focal point leaves centre, so
      // the colour reports position as well as the position does.
      const posHue =
        CENTER_HUE - (Math.abs(50 - peak) / 50) * (CENTER_HUE - EDGE_HUE);
      const peakHue = posHue + Math.sin(now / 1800) * 5;
      const flankHue = peakHue + FLANK_OFFSET + Math.sin(now / 700 + 1.3) * 3;

      el.style.setProperty("--al-peak", `${peak}%`);
      el.style.setProperty("--al-hue-peak", String(peakHue));
      el.style.setProperty("--al-hue-flank", String(flankHue));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      void lastX;
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bottom-0 top-0 hidden w-px sm:block"
      style={
        {
          [side]: "max(24px, calc(50% - 640px + 24px))",
          "--al-peak": "50%",
          "--al-band": "280px",
          "--al-hue-peak": String(CENTER_HUE),
          "--al-hue-flank": String(CENTER_HUE + FLANK_OFFSET),
          /* Two layers: the etch on top, and under it a constant pale hairline
             so the alleys are architecture even where the cursor never goes. */
          background: `linear-gradient(180deg,
            transparent calc(var(--al-peak) - var(--al-band)),
            hsla(var(--al-hue-flank), ${SAT}%, ${LIGHT}%, ${FLANK_A}) calc(var(--al-peak) - var(--al-band) * 0.45),
            hsla(var(--al-hue-peak), ${SAT + 14}%, ${LIGHT + 4}%, ${PEAK_A}) var(--al-peak),
            hsla(var(--al-hue-flank), ${SAT}%, ${LIGHT}%, ${FLANK_A}) calc(var(--al-peak) + var(--al-band) * 0.45),
            transparent calc(var(--al-peak) + var(--al-band))
          ), linear-gradient(180deg, ${BASE}, ${BASE})`,
        } as CSSProperties
      }
    />
  );
}

export function SiteAlleys() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [maskEnd, setMaskEnd] = useState<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf: number | null = null;

    const compute = () => {
      const end = document.querySelector("[data-alleys-end]");
      if (!end) {
        setMaskEnd((prev) => (prev === null ? prev : null));
        return;
      }
      // Both rects are viewport-relative, so the difference is scroll-independent.
      setMaskEnd(
        end.getBoundingClientRect().top - wrap.getBoundingClientRect().top,
      );
    };

    // Consolidate bursts from several observers firing in one tick.
    const schedule = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        compute();
      });
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(wrap);
    const end = document.querySelector("[data-alleys-end]");
    if (end) ro.observe(end);
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", schedule);

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", schedule);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const mask =
    maskEnd !== null
      ? `linear-gradient(180deg, black 0px, black ${Math.max(
          0,
          maskEnd - FADE_BAND,
        )}px, transparent ${maskEnd}px, transparent 100%)`
      : undefined;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      style={
        mask ? ({ maskImage: mask, WebkitMaskImage: mask } as CSSProperties) : undefined
      }
    >
      <Alley side="left" />
      <Alley side="right" />
    </div>
  );
}
