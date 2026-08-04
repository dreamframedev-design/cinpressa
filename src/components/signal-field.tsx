"use client";

import { useEffect, useRef } from "react";

/**
 * SignalField — something sent, propagating outward.
 *
 * The contact page had no artwork at all. CinRx solves the same page with concentric
 * hairline wavefronts expanding from where a message lands, which is the right idea and
 * the wrong execution to borrow wholesale: hairline rings are their vocabulary, and
 * copying it closes exactly the gap the two brands need.
 *
 * So: the same idea in this site's material. Soft elliptical bands of colour, multiply
 * composited, emitted slowly from a point behind the form card and travelling outward
 * until they dissolve. Painted rather than drawn.
 *
 * This completes a set of three gestures built from one material across the site, which
 * is what makes it read as a system rather than as three effects:
 *
 *   Bleed        colour flowing laterally      (home lead)
 *   FocusField   colour gathering radially     (home pipeline)
 *   SignalField  colour emitting radially      (contact)
 *
 * Same hand, three different sentences.
 *
 * The origin sits behind the form card on purpose. The card is opaque, so nothing is
 * lost behind it and the visible artwork is entirely in the margins around it — the
 * signal appears to originate from where the visitor is actually typing.
 *
 * Anti-radar measures, since concentric rings are one bad decision away from a sonar
 * cliché: the bands are ellipses rather than circles, each is tilted differently and
 * rotates slowly, they emit on an interval that does not divide evenly into their
 * lifetime, and each is thick and soft rather than a stroke. Nothing pings.
 */

const MAX_DPR = 1.25;
const MAX_BACKING_W = 1100;
const FRAME_MS = 33;

const TAU = Math.PI * 2;

/** Behind the form card. */
const OX = 0.72;
const OY = 0.44;

/** Seconds for one band to travel from the origin to full dissolve. Long: this should
 *  be something you notice on second glance, not an effect that performs. */
const LIFE = 21;

type Ring = {
  /** Phase offset within the lifetime, 0–1. Deliberately not evenly spaced. */
  offset: number;
  color: [number, number, number];
  alpha: number;
  /** Vertical squash, so these are never circles. */
  squash: number;
  /** Resting tilt, radians, plus how far it rotates across its life. */
  tilt: number;
  spin: number;
  /** Band thickness as a fraction of the field's short side. */
  girth: number;
};

const RINGS: Ring[] = [
  { offset: 0.0, color: [4, 115, 187], alpha: 0.3, squash: 0.72, tilt: -0.16, spin: 0.1, girth: 0.055 },
  { offset: 0.23, color: [21, 150, 212], alpha: 0.28, squash: 0.8, tilt: 0.21, spin: -0.13, girth: 0.048 },
  { offset: 0.41, color: [30, 174, 229], alpha: 0.3, squash: 0.68, tilt: -0.3, spin: 0.09, girth: 0.062 },
  { offset: 0.62, color: [126, 170, 219], alpha: 0.26, squash: 0.85, tilt: 0.12, spin: -0.08, girth: 0.05 },
  { offset: 0.79, color: [149, 218, 248], alpha: 0.34, squash: 0.75, tilt: -0.24, spin: 0.11, girth: 0.044 },
  { offset: 0.91, color: [175, 219, 188], alpha: 0.26, squash: 0.78, tilt: 0.28, spin: -0.1, girth: 0.058 },
];

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "multiply";

  const ox = OX * w;
  const oy = OY * h;
  // Far enough that bands are still travelling when they reach the frame's corner.
  const maxR = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) * 1.15;
  const short = Math.min(w, h);

  for (const r of RINGS) {
    const p = ((t / LIFE) + r.offset) % 1;
    const radius = p * maxR;
    if (radius < 4) continue;

    // In quickly, out slowly — an emission, not a pulse.
    const fade = p < 0.12 ? p / 0.12 : 1 - (p - 0.12) / 0.88;
    const alpha = r.alpha * Math.max(fade, 0);
    if (alpha <= 0.004) continue;

    const girth = r.girth * short;
    const [cr, cg, cb] = r.color;

    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(r.tilt + r.spin * p);
    ctx.scale(1, r.squash);

    // A band, not a stroke: a radial gradient tight around the current radius, so the
    // edge is soft on both sides and the colour has mass.
    const inner = Math.max(radius - girth, 0);
    const outer = radius + girth;
    const grad = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
    grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
    grad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`);
    grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, outer, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  ctx.globalCompositeOperation = "source-over";
}

export function SignalField({ className = "" }: { className?: string }) {
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
      // A moment mid-cycle, so the still frame has bands at several radii.
      draw(ctx, w, h, reduced ? LIFE * 0.42 : 0);
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
