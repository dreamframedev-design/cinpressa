"use client";

import { useEffect, useRef } from "react";

/**
 * The shared scaffold behind the canvas hero fields.
 *
 * By the fourth of these the boilerplate was being copied verbatim: DPR cap, backing
 * store cap, ResizeObserver, IntersectionObserver pause, reduced-motion still frame,
 * frame throttle. Copying it is how a fix lands in three places and not the fourth,
 * which is exactly what happened with the negative-elapsed-time bug: a rAF callback can
 * receive a timestamp from BEFORE the performance.now() captured while that frame's
 * script was running, and one of the four loops turned that into a NaN and died. The
 * clamp now exists once, here.
 *
 * A field supplies only its `render`. Everything about how it is sized, throttled,
 * paused and stilled is decided in this file.
 */

export type HeroRender = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
) => void;

export function HeroCanvas({
  render,
  className = "",
  /** Backing-store ceiling. Soft fields can afford to be small and upscaled. */
  maxWidth = 1200,
  maxDpr = 1.25,
  /** ~30fps. These are atmospheres, not interactions. */
  frameMs = 33,
  /** The moment to hold under prefers-reduced-motion. Never zero: at zero every
   *  system in a field sits at its start phase, which is rarely the composed one. */
  stillAt = 17,
  /** Render above device resolution and let the browser downscale-average. On
   *  standard-density displays this is the only way a near-horizontal hairline
   *  escapes single-pixel stair-stepping; soft fields leave it at 1. */
  superSample = 1,
  /** Fraction of the canvas that must be visible before frames run. Ambient
   *  fields leave this at 0; a narrative piece that re-anchors its story to
   *  visibility raises it, so the story cannot start while the piece is still
   *  a sliver at the fold. */
  ioThreshold = 0,
}: {
  render: HeroRender;
  className?: string;
  maxWidth?: number;
  maxDpr?: number;
  frameMs?: number;
  stillAt?: number;
  superSample?: number;
  ioThreshold?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Kept in a ref so a re-render with a new closure cannot restart the effect.
  const renderRef = useRef(render);
  renderRef.current = render;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const scale = Math.min(
        Math.min((window.devicePixelRatio || 1) * superSample, maxDpr),
        maxWidth / rect.width,
      );
      w = Math.round(rect.width * scale);
      h = Math.round(rect.height * scale);
      canvas.width = w;
      canvas.height = h;
      renderRef.current(ctx, w, h, reduced ? stillAt : 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    if (reduced) return () => ro.disconnect();

    let rafId = 0;
    let inView = true;
    let last = 0;
    const start = performance.now();

    const loop = (now: number) => {
      if (inView && w > 0 && h > 0 && now - last > frameMs) {
        last = now;
        // Clamped at zero. See the note at the top of this file.
        renderRef.current(ctx, w, h, Math.max(0, now - start) / 1000);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
      },
      { threshold: ioThreshold },
    );
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [maxWidth, maxDpr, frameMs, stillAt, superSample, ioThreshold]);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

/* ── Shared helpers ────────────────────────────────────────────────────── */

export const TAU = Math.PI * 2;
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (v: number) => {
  const c = clamp01(v);
  return c * c * (3 - 2 * c);
};

/**
 * Quiet under the copy column.
 *
 * Every interior hero puts its headline in the left half, so every field is damped
 * there and runs at full strength on the right. It is the rule that lets these be bold
 * at all: the art can be strong precisely because it is absent where anyone is reading.
 */
export const copyFade = (fx: number) =>
  0.06 + 0.94 * smooth((fx - 0.06) / 0.46);

/**
 * The standard washes for a hairline field, composited over the finished ink.
 * White over ink equals alpha falloff toward a white page, but perfectly
 * continuous — no per-chunk alpha steps, which read as dashes on a hairline.
 *
 * Three layers: a horizontal fade under the copy column, an elliptical guard
 * centred on the headline block (the horizontal fade alone leaves the right
 * edge of a three-line title sitting against mid-strength ink), and a short
 * top strip so the field never fights the nav.
 */
export function drawHeroWashes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fade: (fx: number) => number,
  /**
   * Set when the canvas is transparent so a coloured surface shows through it.
   * White would blot that surface out with an opaque band, so the washes erase
   * ink with destination-out instead of painting over it. The visible result
   * is identical on white and correct everywhere else.
   */
  transparent = false,
) {
  ctx.globalCompositeOperation = transparent ? "destination-out" : "source-over";
  const ink = transparent ? "0,0,0" : "255,255,255";

  const wash = ctx.createLinearGradient(0, 0, w, 0);
  for (let s = 0; s <= 8; s++) {
    const fx = (0.72 * s) / 8;
    wash.addColorStop(fx, `rgba(${ink},${(1 - fade(fx)).toFixed(3)})`);
  }
  wash.addColorStop(1, `rgba(${ink},0)`);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);

  const gx = 0.23 * w;
  const gy = 0.4 * h;
  const squash = 0.72;
  ctx.save();
  ctx.translate(gx, gy);
  ctx.scale(1, squash);
  const guard = ctx.createRadialGradient(0, 0, 0, 0, 0, 0.46 * w);
  guard.addColorStop(0, `rgba(${ink},0.72)`);
  guard.addColorStop(0.55, `rgba(${ink},0.38)`);
  guard.addColorStop(1, `rgba(${ink},0)`);
  ctx.fillStyle = guard;
  ctx.fillRect(-gx, -gy / squash, w, h / squash);
  ctx.restore();

  const top = ctx.createLinearGradient(0, 0, 0, h * 0.14);
  top.addColorStop(0, `rgba(${ink},0.45)`);
  top.addColorStop(1, `rgba(${ink},0)`);
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, w, h * 0.14);

  ctx.globalCompositeOperation = "source-over";
}
