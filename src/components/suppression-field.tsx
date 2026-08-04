"use client";

import { useEffect, useRef } from "react";

/**
 * Source: a field that goes quiet from one point outward.
 *
 * The Science page's argument is that ACE inhibitors and ARBs act downstream and let
 * the pathway rebound, while CIN-111 acts upstream, at the source. This states that as
 * an ABSENCE rather than as a diagram.
 *
 * A dense field of fine filaments fills the section - continuous, ambient, the default
 * state, standing in for angiotensinogen production. As the visitor scrolls, the field
 * goes quiet from a single origin outward: filaments SHORTEN to almost nothing,
 * spreading, leaving clean dark ground behind. Not fading - shortening. Fading would
 * read as a transition; shortening reads as production stopping.
 *
 * Every piece on the CinRx site adds light, energy or convergence. This one takes
 * texture away, and the negative space it leaves is the subject. Same medium as their
 * canvas fields, inverted gesture.
 *
 * Two honesty constraints shaped the details:
 *
 *   - The quiet front never reaches the far corners, and suppressed filaments keep a
 *     short stub rather than vanishing. Real knockdown is deep but not absolute
 *     (roughly 88-100% in the NHP data), and a field that went perfectly black would be
 *     claiming more than the science does.
 *   - The filaments are centred on a drifting mid-line rather than standing on a shared
 *     baseline. On a common baseline a dense row of vertical strokes reads as a bar
 *     chart or a spectrum analyser, which would imply data this piece is not showing.
 *
 * MOTION: scroll-driven only, and the motion IS the mechanism. Nothing loops, nothing
 * happens on hover, and it is fully reversible. Progress is derived from the section's
 * own position, so it plays without any interaction at all - the same push from
 * cursor-driven to scroll-driven that CinRx made repeatedly under client review.
 *
 * Determinism: all jitter comes from an integer hash, never Math.random, so the field
 * is identical across resizes and re-renders and cannot desync.
 */

const MAX_DPR = 1.5;
const MAX_BACKING_W = 1500;

/** Filament spacing in CSS pixels, before jitter. */
const SPACING = 8;

/** Deterministic 0..1 from an integer. The usual sin-fract hash - cheap, stable, and
 *  crucially not Math.random, which would reshuffle the field on every resize. */
function hash(i: number) {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(t: number) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/**
 * The mid-line the filaments hang from. A static sum of two sines - no time term. The
 * field should be still until the visitor moves it; a drifting field would be
 * decoration, and this is an argument.
 */
function midline(fx: number, h: number) {
  return (
    0.52 * h +
    0.055 * h * Math.sin(fx * 4.1 + 0.7) +
    0.022 * h * Math.sin(fx * 9.7 + 2.3)
  );
}

/**
 * Where suppression begins, as a fraction of the field.
 *
 * Left of centre on purpose, so the front expands RIGHTWARDS across the open part of
 * the section as the visitor scrolls. An origin on the right would quiet the visible
 * area almost immediately and then spend the rest of the scroll working through ground
 * that sits under the copy mask, where nobody can see it happen. Far enough in from the
 * edge that the origin mark clears the steep part of that mask.
 */
const ORIGIN_X = 0.34;
const ORIGIN_Y = 0.62;

/** Width of the transition band, relative to the field's diagonal. Tight enough that
 *  the front reads as an edge travelling through the field rather than a general fade. */
const FALLOFF = 0.12;

/** How far the quiet front travels at full progress. Tuned so the core of the field
 *  goes fully silent while the far corners keep partial filaments - suppression that is
 *  deep but not absolute, which is what the NHP data actually shows. */
const REACH = 0.5;

/** Length a suppressed filament retains. Not zero - see the honesty note above. */
const STUB = 0.08;

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
  scale: number,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = "round";

  const ox = ORIGIN_X * w;
  const oy = ORIGIN_Y * h;
  // Diagonal of the field, so the front's reach is resolution-independent.
  const diag = Math.hypot(w, h);
  const front = progress * REACH * diag;
  const band = FALLOFF * diag;

  const step = SPACING * scale;
  const count = Math.ceil(w / step);

  for (let i = 0; i <= count; i++) {
    const jx = (hash(i) - 0.5) * step * 0.7;
    const x = i * step + jx;
    if (x < 0 || x > w) continue;

    const fx = x / w;
    const cy = midline(fx, h) + (hash(i + 977) - 0.5) * 0.16 * h;

    // Full extent of this filament, half above and half below its centre.
    const full = (0.06 + hash(i + 311) * 0.15) * h;

    // How suppressed this filament is: 1 well inside the front, 0 well outside.
    const d = Math.hypot(x - ox, cy - oy);
    const suppressed = 1 - smoothstep((d - front) / band + 0.5);

    const len = full * (STUB + (1 - STUB) * (1 - suppressed));

    // Alpha rides the same curve, so a suppressed stub is faint as well as short.
    // Two rungs of the ladder, alternating, so the field has depth rather than
    // reading as one flat screen of lines.
    const bright = hash(i + 53) > 0.62;
    const baseAlpha = bright ? 0.72 : 0.5;
    const alpha = 0.12 + (baseAlpha - 0.12) * (1 - suppressed);

    ctx.strokeStyle = bright
      ? `rgba(149,218,248,${alpha.toFixed(3)})`
      : `rgba(30,174,229,${alpha.toFixed(3)})`;
    ctx.lineWidth = (bright ? 1.05 : 0.9) * scale;

    ctx.beginPath();
    ctx.moveTo(x, cy - len / 2);
    ctx.lineTo(x, cy + len / 2);
    ctx.stroke();
  }

  // The intervention: one mark at the origin, appearing as the front leaves it.
  // Frost rather than indigo - on the deep ground #6771B5 has too little separation
  // from the field to punctuate. Orange is reserved for dose semantics and quotations
  // of the mark's petals. See ART_STRATEGY.md section 4.
  const markIn = smoothstep(progress / 0.18);
  if (markIn > 0.01) {
    const r = 5 * scale;
    ctx.strokeStyle = `rgba(149,218,248,${(0.85 * markIn).toFixed(3)})`;
    ctx.lineWidth = 1.4 * scale;
    ctx.beginPath();
    ctx.moveTo(ox, oy - r * 2.4);
    ctx.lineTo(ox, oy + r * 2.4);
    ctx.stroke();
  }
}

export function SuppressionField({ className = "" }: { className?: string }) {
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
    let scale = 1;
    let progress = reduced ? 0.7 : 0;

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      scale = Math.min(
        Math.min(window.devicePixelRatio || 1, MAX_DPR),
        MAX_BACKING_W / rect.width,
      );
      w = Math.round(rect.width * scale);
      h = Math.round(rect.height * scale);
      canvas.width = w;
      canvas.height = h;
      return true;
    };

    /**
     * Section-scoped scroll progress, hand-rolled.
     *
     * This is the one place the build considered reaching for Framer Motion's
     * useScroll. It does not need it: the field is painted imperatively to a canvas and
     * never drives React render state, so there is no interop to buy - only a scroll
     * position, which is the arithmetic below. Adding a motion library for it would put
     * ~30KB into a project that currently ships three dependencies.
     *
     * Remapped so the suppression completes while the section is still comfortably in
     * view, rather than finishing as it leaves.
     */
    const readProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const travelled = vh - rect.top;
      const raw = travelled / (rect.height + vh);
      return clamp01((raw - 0.16) / (0.72 - 0.16));
    };

    const render = () => {
      if (w > 0) draw(ctx, w, h, progress, scale);
    };

    if (!measure()) return;
    if (!reduced) progress = readProgress();
    render();

    const ro = new ResizeObserver(() => {
      if (measure()) render();
    });
    ro.observe(wrap);

    if (reduced) {
      return () => ro.disconnect();
    }

    // rAF-coalesced scroll handling: the listener only flags, the frame does the work,
    // so a fast scroll cannot queue more draws than the display can show.
    let queued = false;
    let inView = true;

    const onScroll = () => {
      if (queued || !inView) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const next = readProgress();
        // Skip repaints the eye cannot resolve.
        if (Math.abs(next - progress) < 0.002) return;
        progress = next;
        render();
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) onScroll();
    });
    io.observe(wrap);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Same quiet-under-copy discipline as the rest of the pass, but gentler: this field
  // is the section's subject rather than its backdrop, so the left is damped enough to
  // keep white copy clean on the deep ground without erasing the sense that the
  // filaments are everywhere before they go quiet.
  const mask =
    "linear-gradient(90deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.28) 28%, rgba(0,0,0,0.66) 52%, black 72%, black 100%)";

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
