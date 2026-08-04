"use client";

import { useEffect, useRef } from "react";

/**
 * FocusField — light gathering to a point.
 *
 * For the home pipeline section, whose headline is "A focused program. A clear path
 * forward." Round-ended forms, cohesive with the mark's geometry, deliberately not
 * another copy of it, and deliberately not a preview of the pipeline: a one-programme
 * pipeline shown small says "we have one thing" rather than "we are concentrated on
 * one thing." So the subject is focus itself.
 *
 * THE FIRST VERSION DID NOT MOVE, and the reason is worth recording because it is the
 * second time the same mistake was made on this site. Each capsule bobbed along its own
 * bearing by about 40px over a 74-second period, which is roughly ONE PIXEL PER SECOND,
 * on a form that is also heavily blurred. Blur and slowness compound: a soft shape
 * shifting a pixel a second is indistinguishable from a still image. Sub-perceptual
 * motion is not subtle motion, it is a static picture with a CPU cost.
 *
 * More importantly, bobbing in place was the wrong IDEA. Focus is not an arrangement,
 * it is a process. So the capsules now stream continuously inward: each is born far
 * out, long, pale and out of focus, and travels toward the focal point getting shorter,
 * tighter, more saturated and sharper as it converges, then dissolves as it arrives.
 * Phases are staggered so the stream never breaks. That is the concept and the motion
 * being the same thing, which is what the earlier version was missing.
 *
 * REACTIVITY. The focal point eases toward the cursor, so the entire field reorients
 * around wherever the visitor is pointing. Every capsule aims at it, so one small input
 * turns the whole composition. It is heavily damped and travel is capped well inside
 * the frame, so it reads as the field noticing you rather than as something following
 * the mouse. Ignored entirely on touch, where there is no cursor to notice.
 */

const VW = 1000;
const VH = 700;

const MAX_DPR = 1.25;
const MAX_BACKING_W = 1000;
const FRAME_MS = 33;

const TAU = Math.PI * 2;

/** Where the stream converges, at rest. Off-centre so the composition has a direction. */
const FX = 0.62;
const FY = 0.46;

/** How far the focal point may be pulled by the cursor, as a fraction of the field. */
const PULL = 0.1;

type Capsule = {
  /** Bearing it arrives along. */
  angle: number;
  /** Slow rotation of that bearing over the capsule's life, radians. */
  sweep: number;
  /** Seconds from spawn to dissolve. */
  life: number;
  /** Start phase, so the stream is continuous rather than pulsing. */
  offset: number;
  color: [number, number, number];
  alpha: number;
  /** Length and thickness far out, and at the focus. */
  lenFar: number;
  lenNear: number;
  girthFar: number;
  girthNear: number;
  /** Blur far out. Resolves to zero as it converges. */
  blurFar: number;
};

/**
 * Fourteen capsules on unrelated lifetimes. Bearings are spread around the circle but
 * not evenly, and lifetimes are all coprime-ish, so the stream never falls into a
 * visible rotation or a pulse.
 */
const CAPSULES: Capsule[] = [
  { angle: 3.34, sweep: 0.16, life: 21, offset: 0.00, color: [175, 219, 188], alpha: 0.40, lenFar: 300, lenNear: 62, girthFar: 78, girthNear: 24, blurFar: 26 },
  { angle: 2.42, sweep: -0.13, life: 26, offset: 0.13, color: [190, 215, 236], alpha: 0.42, lenFar: 268, lenNear: 56, girthFar: 66, girthNear: 22, blurFar: 24 },
  { angle: 4.19, sweep: 0.11, life: 18, offset: 0.27, color: [126, 170, 219], alpha: 0.40, lenFar: 244, lenNear: 54, girthFar: 60, girthNear: 21, blurFar: 22 },
  { angle: 1.27, sweep: -0.18, life: 23, offset: 0.41, color: [4, 115, 187], alpha: 0.36, lenFar: 214, lenNear: 50, girthFar: 52, girthNear: 20, blurFar: 19 },
  { angle: 5.31, sweep: 0.14, life: 17, offset: 0.55, color: [7, 131, 198], alpha: 0.40, lenFar: 186, lenNear: 46, girthFar: 46, girthNear: 19, blurFar: 16 },
  { angle: 0.42, sweep: -0.1, life: 24, offset: 0.68, color: [21, 150, 212], alpha: 0.44, lenFar: 232, lenNear: 48, girthFar: 50, girthNear: 19, blurFar: 20 },
  { angle: 3.86, sweep: 0.19, life: 19, offset: 0.82, color: [30, 174, 229], alpha: 0.46, lenFar: 198, lenNear: 44, girthFar: 44, girthNear: 18, blurFar: 15 },
  { angle: 2.05, sweep: -0.15, life: 22, offset: 0.07, color: [103, 113, 181], alpha: 0.38, lenFar: 256, lenNear: 52, girthFar: 56, girthNear: 20, blurFar: 21 },
  { angle: 5.86, sweep: 0.12, life: 27, offset: 0.34, color: [21, 150, 212], alpha: 0.42, lenFar: 280, lenNear: 58, girthFar: 64, girthNear: 22, blurFar: 23 },
  { angle: 1.02, sweep: -0.17, life: 16, offset: 0.48, color: [4, 115, 187], alpha: 0.44, lenFar: 172, lenNear: 42, girthFar: 42, girthNear: 18, blurFar: 14 },
  { angle: 4.72, sweep: 0.09, life: 25, offset: 0.61, color: [149, 218, 248], alpha: 0.48, lenFar: 220, lenNear: 46, girthFar: 48, girthNear: 18, blurFar: 17 },
  { angle: 0.88, sweep: -0.12, life: 20, offset: 0.75, color: [30, 174, 229], alpha: 0.42, lenFar: 206, lenNear: 44, girthFar: 46, girthNear: 18, blurFar: 16 },
  { angle: 2.94, sweep: 0.15, life: 28, offset: 0.2, color: [190, 215, 236], alpha: 0.38, lenFar: 292, lenNear: 60, girthFar: 70, girthNear: 23, blurFar: 25 },
  { angle: 5.02, sweep: -0.11, life: 15, offset: 0.9, color: [7, 131, 198], alpha: 0.46, lenFar: 160, lenNear: 40, girthFar: 40, girthNear: 17, blurFar: 12 },
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => { const c = clamp01(v); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  fx: number,
  fy: number,
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";

  const s = Math.min(w / VW, h / VH);
  const ox = fx * w;
  const oy = fy * h;
  const reach = Math.hypot(w, h) * 0.62;

  for (const c of CAPSULES) {
    const p = ((t / c.life) + c.offset) % 1;

    // Distance closes with an accelerating profile: unhurried out at the edge, drawn
    // in faster as it converges. The field reads as pulled toward the point rather
    // than sliding toward it.
    const dist = (1 - Math.pow(p, 1.5)) * reach;

    // In over the first eighth, out over the last quarter, so nothing piles up at
    // the centre and nothing pops.
    const alpha = c.alpha * smooth(p / 0.12) * (1 - smooth((p - 0.74) / 0.26));
    if (alpha <= 0.004) continue;

    const angle = c.angle + c.sweep * p;
    const cx = ox + Math.cos(angle) * dist;
    const cy = oy + Math.sin(angle) * dist;

    // Every capsule points at the focus, so the whole field aims at one place.
    const aim = Math.atan2(oy - cy, ox - cx);

    const len = lerp(c.lenFar, c.lenNear, p) * s;
    const girth = lerp(c.girthFar, c.girthNear, p) * s;
    const blur = lerp(c.blurFar, 0, smooth(p)) * s;

    const [r, g, b] = c.color;
    const grad = ctx.createLinearGradient(
      cx - Math.cos(aim) * len * 0.5,
      cy - Math.sin(aim) * len * 0.5,
      cx + Math.cos(aim) * len * 0.5,
      cy + Math.sin(aim) * len * 0.5,
    );
    // Denser at the leading end, so each form leans into its own direction of travel.
    grad.addColorStop(0, `rgba(${r},${g},${b},${(alpha * 0.42).toFixed(3)})`);
    grad.addColorStop(0.58, `rgba(${r},${g},${b},${alpha.toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},${(alpha * 0.72).toFixed(3)})`);

    ctx.filter = blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : "none";
    ctx.fillStyle = grad;
    capsulePath(ctx, cx, cy, len, girth, aim);
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
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    let w = 0;
    let h = 0;
    // Focal point: where it is now, and where the cursor is asking it to be.
    let fx = FX;
    let fy = FY;
    let targetX = FX;
    let targetY = FY;

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
      draw(ctx, w, h, reduced ? 9 : 0, fx, fy);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    if (reduced) return () => ro.disconnect();

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0) return;
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      // Only respond to a cursor that is near the field, and cap how far it can pull.
      if (mx < -0.4 || mx > 1.4 || my < -0.6 || my > 1.6) {
        targetX = FX;
        targetY = FY;
        return;
      }
      targetX = FX + (clamp01(mx) - 0.5) * PULL * 2;
      targetY = FY + (clamp01(my) - 0.5) * PULL * 2;
    };
    const onLeave = () => {
      targetX = FX;
      targetY = FY;
    };

    let rafId = 0;
    let inView = true;
    let last = 0;
    const start = performance.now();

    const loop = (now: number) => {
      if (inView && w > 0 && now - last > FRAME_MS) {
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        // Heavily damped, frame-rate independent. The field takes about a second to
        // finish turning, so it reads as noticing rather than tracking.
        const k = 1 - Math.exp(-dt * 2.4);
        fx += (targetX - fx) * k;
        fy += (targetY - fy) * k;
        draw(ctx, w, h, (now - start) / 1000, fx, fy);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    });
    io.observe(wrap);

    if (!coarse) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
