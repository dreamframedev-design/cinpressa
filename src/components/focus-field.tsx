"use client";

import { useEffect, useRef } from "react";

/**
 * FocusField — light gathering to a point.
 *
 * For the home pipeline section, whose headline is "A focused program. A clear path
 * forward." The brief was: round-edged, cohesive with the mark's language, but NOT
 * another copy of the mark — and explicitly not a preview of the pipeline, since a
 * one-programme pipeline previewed small says "we have one thing" rather than "we are
 * concentrated on one thing."
 *
 * So the subject is FOCUS itself. Capsules — stadium forms, round-ended, the roundness
 * the mark is built from — are scattered long and diffuse at the edges of the field and
 * grow shorter, tighter and more saturated as they approach a single point. Nothing
 * draws the focal point; it is simply where everything is heading, which is a more
 * confident way to say "focused" than putting a dot there.
 *
 * COHESION WITHOUT REPETITION. This shares its material with Bleed on the same page —
 * multiply compositing, the spec-sheet ladder, soft edges, long periods — but inverts
 * the gesture. Bleed is lateral: colour flowing across. This is radial: colour
 * gathering in. Same hand, different sentence. That is what stops a site reading as one
 * effect applied everywhere.
 *
 * Multiply is doing the real work again, as it does in the mark itself: where capsules
 * overlap near the focus, the colour compounds, so the densest point in the piece is
 * produced by convergence rather than painted in.
 *
 * Motion: each capsule drifts along its own axis toward and away from the focus on its
 * own long period, so the gather continuously tightens and loosens and never resolves
 * into a fixed arrangement. Nothing spins, nothing pulses, nothing tracks the cursor.
 */

const VW = 1000;
const VH = 700;

const MAX_DPR = 1.25;
const MAX_BACKING_W = 1000;
const FRAME_MS = 33;

const TAU = Math.PI * 2;

/** Where everything is heading. Off-centre so the composition has a direction. */
const FX = 0.62;
const FY = 0.46;

type Capsule = {
  /** Bearing from the focus, radians. */
  angle: number;
  /** Distance from the focus at rest, as a fraction of the field's short side. */
  dist: number;
  /** Length and thickness, in viewBox units. */
  len: number;
  girth: number;
  color: [number, number, number];
  alpha: number;
  blur: number;
  /** Drift along the bearing: amplitude in units, period in seconds. */
  swim: number;
  period: number;
  phase: number;
};

/**
 * Ordered outside-in. The far capsules are long, wide, pale and heavily blurred — they
 * read as atmosphere. The near ones are short, tight, saturated and sharp. That
 * gradient IS the focusing; no single element has to explain it.
 */
const CAPSULES: Capsule[] = [
  { angle: 3.34, dist: 0.86, len: 300, girth: 78, color: [175, 219, 188], alpha: 0.34, blur: 26, swim: 46, period: 74, phase: 0.0 },
  { angle: 2.42, dist: 0.78, len: 268, girth: 66, color: [190, 215, 236], alpha: 0.36, blur: 24, swim: 40, period: 61, phase: 1.1 },
  { angle: 4.19, dist: 0.72, len: 244, girth: 60, color: [126, 170, 219], alpha: 0.34, blur: 22, swim: 43, period: 88, phase: 2.4 },
  { angle: 1.27, dist: 0.63, len: 214, girth: 52, color: [4, 115, 187], alpha: 0.3, blur: 17, swim: 36, period: 55, phase: 3.6 },
  { angle: 5.31, dist: 0.55, len: 186, girth: 46, color: [7, 131, 198], alpha: 0.34, blur: 14, swim: 33, period: 69, phase: 4.7 },
  { angle: 0.42, dist: 0.47, len: 156, girth: 40, color: [21, 150, 212], alpha: 0.38, blur: 10, swim: 28, period: 47, phase: 5.9 },
  { angle: 3.86, dist: 0.38, len: 126, girth: 34, color: [30, 174, 229], alpha: 0.42, blur: 7, swim: 24, period: 63, phase: 1.8 },
  { angle: 2.05, dist: 0.29, len: 98, girth: 29, color: [103, 113, 181], alpha: 0.36, blur: 5, swim: 19, period: 51, phase: 3.1 },
  { angle: 5.86, dist: 0.21, len: 74, girth: 25, color: [21, 150, 212], alpha: 0.46, blur: 3, swim: 15, period: 79, phase: 0.7 },
  { angle: 1.02, dist: 0.14, len: 54, girth: 21, color: [4, 115, 187], alpha: 0.5, blur: 0, swim: 11, period: 43, phase: 4.2 },
];

/** A stadium: the round-ended form the mark's roundness is built from. */
function capsulePath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  len: number,
  girth: number,
  angle: number,
) {
  const r = girth / 2;
  const half = Math.max(len / 2 - r, 0);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-half, -r);
  ctx.lineTo(half, -r);
  ctx.arc(half, 0, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(-half, r);
  ctx.arc(-half, 0, r, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
  ctx.restore();
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.clearRect(0, 0, w, h);

  ctx.globalCompositeOperation = "multiply";

  const sx = w / VW;
  const sy = h / VH;
  const s = Math.min(sx, sy);
  const fx = FX * w;
  const fy = FY * h;
  const reach = Math.min(w, h);

  for (const c of CAPSULES) {
    // Drift along the bearing, so the gather tightens and loosens rather than
    // the capsules wandering off their own axes.
    const swim = c.swim * s * Math.sin((TAU * t) / c.period + c.phase);
    const d = c.dist * reach + swim;
    const cx = fx + Math.cos(c.angle) * d;
    const cy = fy + Math.sin(c.angle) * d;

    // Each capsule points at the focus - the whole field aims at one place.
    const aim = Math.atan2(fy - cy, fx - cx);

    const [r, g, b] = c.color;
    const grad = ctx.createLinearGradient(
      cx - Math.cos(aim) * c.len * s * 0.5,
      cy - Math.sin(aim) * c.len * s * 0.5,
      cx + Math.cos(aim) * c.len * s * 0.5,
      cy + Math.sin(aim) * c.len * s * 0.5,
    );
    // Denser at the end facing the focus, so each form leans inward.
    grad.addColorStop(0, `rgba(${r},${g},${b},${(c.alpha * 0.45).toFixed(3)})`);
    grad.addColorStop(0.55, `rgba(${r},${g},${b},${c.alpha.toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},${(c.alpha * 0.7).toFixed(3)})`);

    ctx.filter = c.blur > 0 ? `blur(${(c.blur * s).toFixed(1)}px)` : "none";
    ctx.fillStyle = grad;
    capsulePath(ctx, cx, cy, c.len * s, c.girth * s, aim);
    ctx.fill();
  }

  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";
}

export function FocusField({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        Math.min(window.devicePixelRatio || 1, MAX_DPR),
        MAX_BACKING_W / rect.width,
      );
      w = Math.round(rect.width * scale);
      h = Math.round(rect.height * scale);
      canvas.width = w;
      canvas.height = h;
      draw(ctx, w, h, reduced ? 23 : 0);
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
      if (inView && w > 0 && now - last > FRAME_MS) {
        last = now;
        draw(ctx, w, h, (now - start) / 1000);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
