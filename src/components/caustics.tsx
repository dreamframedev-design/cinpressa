"use client";

import { useEffect, useRef } from "react";

/**
 * Caustics — light refracted through moving glass.
 *
 * The previous contact artwork was concentric wavefronts, and the note on it was
 * correct: rings expanding from a point are a hypnosis spiral, and no amount of tuning
 * fixes the shape's associations. This is a different technique entirely, not the same
 * idea softened.
 *
 * Caustics are what you get when light passes through something with a varying surface
 * and focuses onto what is behind it: the bright wandering filigree at the bottom of a
 * pool. It is the right subject twice over. CinPressa's mark is four overlapping
 * LENSES, so refraction is the brand's own physics rather than a borrowed effect. And a
 * contact page is where something is sent through and arrives somewhere else.
 *
 * HOW IT IS MADE. Every pixel gets a value from a domain-warped interference field:
 * two sine warps displace the sample point, four more sines sum at that displaced
 * position, and the result is raised to a steep power so that only the near-zero
 * crossings survive. Those crossings are thin, bright, continuously moving curves,
 * which is what a caustic is. Nothing here is a blurred blob or a gradient; the
 * structure is filament, and it is generated rather than drawn.
 *
 * WHY IT LOOKS DEEP. It runs on a dark ground with genuinely bright cores, so there is
 * real luminance range in the image rather than a pale wash. That range is also what
 * makes the frosted panel in front of it work: glass needs something with contrast
 * behind it or it is just a grey rectangle.
 *
 * PERFORMANCE. Per-pixel work is expensive, so the backing store is tiny — a few tens
 * of thousands of pixels — and the browser scales it up. Caustics are soft and
 * continuous, so upsampling costs nothing visually and in fact helps; the bilinear
 * smoothing is doing the same job an expensive blur would. A sine lookup table replaces
 * Math.sin in the hot loop. Off-screen it stops entirely, and under reduced motion it
 * paints one frame and never runs again.
 */

/** Backing resolution. Deliberately small: this is upscaled and the softness is wanted. */
const CW = 240;
const CH = 170;

const FRAME_MS = 42; // ~24fps. Water does not need 60.

const TAU = Math.PI * 2;

/* Sine lookup. The inner loop calls this six times per pixel, which is a few hundred
   thousand calls a frame — enough that Math.sin becomes the bottleneck. */
const SIN_N = 4096;
const SIN_MASK = SIN_N - 1;
const SIN_K = SIN_N / TAU;
const SIN = new Float32Array(SIN_N);
for (let i = 0; i < SIN_N; i++) SIN[i] = Math.sin((i / SIN_N) * TAU);
/** Bitwise AND on the int32 index wraps negatives correctly, so no branch is needed. */
const fsin = (x: number) => SIN[((x * SIN_K) | 0) & SIN_MASK];

/** How thin the filaments are. Higher is tighter and more caustic-like. */
const SHARPNESS = 9;

function render(img: ImageData, t: number) {
  const d = img.data;
  let i = 0;

  for (let y = 0; y < CH; y++) {
    // Vertical falloff, so the field has a horizon and does not read as wallpaper.
    const fy = y / CH;
    const depth = 0.45 + 0.55 * (1 - Math.abs(fy - 0.62) * 1.7);

    for (let x = 0; x < CW; x++) {
      // Domain warp: displace the sample before reading the interference. This is
      // what turns a regular lattice into wandering organic curves.
      const wx = x * 0.026 + fsin(y * 0.030 + t * 0.62) * 5.4;
      const wy = y * 0.034 + fsin(x * 0.023 - t * 0.48) * 5.4;

      let n =
        fsin(wx + t * 0.40) +
        fsin(wy - t * 0.31) +
        fsin((wx + wy) * 0.68 + t * 0.19) +
        fsin((wx - wy) * 0.52 - t * 0.15);
      n *= 0.25;

      // Only the zero crossings survive, and they survive as thin ridges.
      let c = 1 - (n < 0 ? -n : n);
      c = c * c;
      c = c * c;
      c = c * c * c; // ≈ pow(c, SHARPNESS) without the call
      c *= depth;

      const g1 = c > 0.625 ? 1 : c * 1.6;
      const g2 = c > 0.55 ? (c - 0.55) * 2.222 : 0;

      d[i++] = 8 + g1 * 38 + g2 * 152;
      d[i++] = 25 + g1 * 148 + g2 * 92;
      d[i++] = 47 + g1 * 198 + g2 * 56;
      d[i++] = 255;
    }
  }
}

export function Caustics({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CW;
    canvas.height = CH;
    const img = ctx.createImageData(CW, CH);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(img, 11);
      ctx.putImageData(img, 0, 0);
      return;
    }

    let rafId = 0;
    let inView = true;
    let last = 0;
    const start = performance.now();

    const loop = (now: number) => {
      if (inView && now - last > FRAME_MS) {
        last = now;
        render(img, (now - start) / 1000);
        ctx.putImageData(img, 0, 0);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, []);

  return (
    <div aria-hidden className={`overflow-hidden ${className}`}>
      {/* Stretched from a small backing store. The browser's bilinear filtering is
          doing the softening that an expensive blur would otherwise cost. */}
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
