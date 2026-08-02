"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { Reveal } from "@/components/reveal";

/**
 * The core value proposition, told as a direct comparison: a full year of daily
 * doses against one to two provider-administered doses.
 *
 * Both panels render the same 365-cell grid at the same size, so the only thing
 * that differs is how many dots are filled. The count is the whole argument.
 * On scroll-in the daily doses cascade in calendar order, then the two annual
 * doses land as the payoff. Motion is gated on the Reveal system, so everything
 * is fully visible without JS and under reduced motion.
 *
 * The daily field is a physics simulation, not a hover effect: each dot is a
 * particle on a slightly underdamped spring. The pointer displaces nearby dots
 * like a hand through water (faster sweeps plow a wider, deeper wake), dots
 * the pointer passes catch light and cool back down (a comet trail from blue
 * through cyan to frost), and pressing anywhere drops a shockwave that rolls
 * through the whole year of doses. Layout never changes: displacement is
 * transform-only, so the 365-vs-2 comparison stays exact. The springs live on
 * an inner "core" element while the reveal cascade animates the grid cell, so
 * the two systems never fight over a property.
 */

const DAYS = 365;
const COLUMNS = 24;

/** Dead centre of the 24 × 16 field, straddling the vertical midline. */
const CENTRE_ROW = 7;
const YEARLY = [CENTRE_ROW * COLUMNS + 10, CENTRE_ROW * COLUMNS + 13];

/* White panels so the pair reads cleanly on whatever wash the section carries. */
const PANEL = "rounded-2xl border border-line bg-white/80 p-7 lg:p-9";
const TYPE = "text-[clamp(1.25rem,2vw,1.7rem)] leading-snug tracking-tight";
const LABEL = `${TYPE} font-medium text-ink`;
const CAPTION = `${TYPE} font-light text-body`;
const COUNT = "font-medium text-blue";
const FIELD = "grid gap-[3px] sm:gap-[5px] lg:gap-[6px]";

const fieldStyle: CSSProperties = {
  gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
};

/* ---- Field physics tuning ---- */
/** Spring stiffness / damping: ζ≈0.65, a fluid settle with a whisper of give. */
const STIFFNESS = 170;
const DAMPING = 17;
/** Pointer influence: reach and depth at rest, and how much speed adds. */
const REACH = 52;
const PUSH = 12;
const SPEED_REACH = 0.55;
const SPEED_PUSH = 0.8;
const SPEED_FULL = 1500; // px/s of pointer speed for maximum plow
/** Glow decay time constant, seconds. The comet trail's half-life. */
const GLOW_TAU = 0.45;
/** Shockwave: ring speed, gaussian band width, radial kick strength. */
const WAVE_SPEED = 640;
const WAVE_BAND = 34;
const WAVE_KICK = 950;

/* Trail colour ramp: brand blue -> cyan -> frost, all from the spec sheet. */
const C_BASE = [34, 97, 173];
const C_CYAN = [30, 174, 229];
const C_FROST = [149, 218, 248];

function trailColor(g: number): string {
  let from = C_BASE;
  let to = C_CYAN;
  let t = g / 0.55;
  if (g > 0.55) {
    from = C_CYAN;
    to = C_FROST;
    t = (g - 0.55) / 0.45;
  }
  if (t > 1) t = 1;
  const r = (from[0] + (to[0] - from[0]) * t) | 0;
  const gr = (from[1] + (to[1] - from[1]) * t) | 0;
  const b = (from[2] + (to[2] - from[2]) * t) | 0;
  return `rgb(${r},${gr},${b})`;
}

type Wave = { x: number; y: number; t0: number };

export function DosingCadence() {
  const fieldRef = useRef<HTMLDivElement>(null);

  /** All simulation state lives outside React: 365 dots never re-render.
      Dot elements are collected by measure() straight from the DOM rather
      than through ref callbacks: React 19 detaches/reattaches inline refs
      across re-renders, and a dot whose ref is momentarily null would be
      skipped by the loop and stranded mid-decay. The spans themselves are
      stable for the life of the grid. */
  const sim = useRef({
    ready: false,
    reduced: false,
    els: [] as HTMLElement[],
    cx: new Float32Array(DAYS),
    cy: new Float32Array(DAYS),
    px: new Float32Array(DAYS),
    py: new Float32Array(DAYS),
    vx: new Float32Array(DAYS),
    vy: new Float32Array(DAYS),
    glow: new Float32Array(DAYS),
    wroteGlow: new Float32Array(DAYS),
    styled: new Uint8Array(DAYS),
    styledCount: 0,
    cursor: { x: 0, y: 0, speed: 0, active: false, lastX: 0, lastY: 0, lastT: 0 },
    waves: [] as Wave[],
    diag: 800,
    raf: 0,
    lastT: 0,
    lastTickAt: 0,
  });

  useEffect(() => {
    sim.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const field = fieldRef.current;
    if (!field) return;
    const invalidate = () => {
      sim.current.ready = false;
    };
    const ro = new ResizeObserver(invalidate);
    ro.observe(field);
    const s = sim.current;
    // Watchdog: rAF loops can be killed from outside (dev-time effect
    // cleanup, suspended frames, ref re-attachment races). If any dot still
    // carries inline styles and the loop has gone quiet, revive it; it then
    // either resumes the decay or finishes the stylesheet handback. No-op
    // while the loop is healthy or the field is fully at rest.
    const watchdog = setInterval(() => {
      if (s.styledCount > 0) wake();
    }, 500);
    return () => {
      clearInterval(watchdog);
      ro.disconnect();
      cancelAnimationFrame(s.raf);
    };
  }, []);

  /** Cache every dot element and centre, field-relative. Cheap, so run per
      re-entry and on resize. */
  const measure = () => {
    const field = fieldRef.current;
    if (!field) return;
    const s = sim.current;
    const box = field.getBoundingClientRect();
    if (!box.width) return;
    s.els = Array.from(field.querySelectorAll<HTMLElement>(".dose-core"));
    for (let i = 0; i < DAYS && i < s.els.length; i++) {
      const r = s.els[i].getBoundingClientRect();
      s.cx[i] = r.left + r.width / 2 - box.left;
      s.cy[i] = r.top + r.height / 2 - box.top;
    }
    s.diag = Math.hypot(box.width, box.height);
    s.ready = true;
  };

  const tick = (now: number) => {
    const s = sim.current;
    // No timestamp dedupe here: consecutive frames can legitimately share a
    // coarsened timestamp under devtools-driven rendering, and bailing on a
    // "duplicate" orphans the loop. If wake()'s staleness rescue ever races
    // a suspended frame back to life, the doubled chain is harmless: both
    // integrate the same state (dt splits between them) and writes are
    // idempotent, and both exit through the same idle path.
    s.lastTickAt = performance.now();
    const dt = Math.min(40, now - (s.lastT || now)) / 1000;
    s.lastT = now;

    const boost = Math.min(1, s.cursor.speed / SPEED_FULL);
    const reach = REACH * (1 + SPEED_REACH * boost);
    const push = PUSH * (1 + SPEED_PUSH * boost);
    const twoSigma2 = 2 * reach * reach;
    const waveSigma2 = 2 * WAVE_BAND * WAVE_BAND;
    const glowKeep = Math.exp(-dt / GLOW_TAU);

    // Retire waves that have rolled past the far corner.
    for (let w = s.waves.length - 1; w >= 0; w--) {
      if (((now - s.waves[w].t0) / 1000) * WAVE_SPEED > s.diag + 140) s.waves.splice(w, 1);
    }

    let busy = s.cursor.active || s.waves.length > 0;

    for (let i = 0; i < DAYS; i++) {
      let tx = 0;
      let ty = 0;
      let cand = 0;

      if (s.cursor.active) {
        const ddx = s.cx[i] - s.cursor.x;
        const ddy = s.cy[i] - s.cursor.y;
        const d2 = ddx * ddx + ddy * ddy;
        const w = Math.exp(-d2 / twoSigma2);
        if (w > 0.012) {
          const d = Math.sqrt(d2);
          // Golden-angle fallback so a dot under the pointer still knows
          // which way to run, deterministically per dot.
          const ux = d > 0.6 ? ddx / d : Math.cos(i * 2.39996);
          const uy = d > 0.6 ? ddy / d : Math.sin(i * 2.39996);
          tx = ux * push * w;
          ty = uy * push * w;
          cand = Math.sqrt(w);
        }
      }

      for (let w = 0; w < s.waves.length; w++) {
        const wave = s.waves[w];
        const ringR = ((now - wave.t0) / 1000) * WAVE_SPEED;
        const ddx = s.cx[i] - wave.x;
        const ddy = s.cy[i] - wave.y;
        const d = Math.hypot(ddx, ddy);
        const off = d - ringR;
        const e = Math.exp(-(off * off) / waveSigma2);
        if (e > 0.02 && d > 0.6) {
          s.vx[i] += (ddx / d) * e * WAVE_KICK * dt;
          s.vy[i] += (ddy / d) * e * WAVE_KICK * dt;
          if (e > cand) cand = e;
        }
      }

      // Integrate the spring toward the (possibly zero) displacement target.
      s.vx[i] += (STIFFNESS * (tx - s.px[i]) - DAMPING * s.vx[i]) * dt;
      s.vy[i] += (STIFFNESS * (ty - s.py[i]) - DAMPING * s.vy[i]) * dt;
      s.px[i] += s.vx[i] * dt;
      s.py[i] += s.vy[i] * dt;

      let g = s.glow[i] * glowKeep;
      if (cand > g) g = cand;
      s.glow[i] = g;

      const moving =
        Math.abs(s.px[i]) > 0.05 ||
        Math.abs(s.py[i]) > 0.05 ||
        Math.abs(s.vx[i]) > 0.5 ||
        Math.abs(s.vy[i]) > 0.5;
      if (moving || g > 0.015) busy = true;

      const el = sim.current.els[i];
      if (!el) continue;
      if (moving || g > 0.015) {
        el.style.transform = `translate3d(${s.px[i].toFixed(1)}px,${s.py[i].toFixed(1)}px,0) scale(${(1 + 0.5 * g).toFixed(3)})`;
        if (Math.abs(g - s.wroteGlow[i]) > 0.012) {
          el.style.background = trailColor(g);
          s.wroteGlow[i] = g;
        }
        if (!s.styled[i]) {
          s.styled[i] = 1;
          s.styledCount++;
        }
      } else if (s.styled[i] || el.style.transform) {
        // Fully settled: hand the dot back to the stylesheet. The DOM check
        // matters: it also adopts and clears styles stranded by a previous
        // life of the loop (dev refresh, suspended tab), which the current
        // bookkeeping knows nothing about.
        el.style.transform = "";
        el.style.background = "";
        s.wroteGlow[i] = 0;
        s.px[i] = 0;
        s.py[i] = 0;
        s.vx[i] = 0;
        s.vy[i] = 0;
        s.glow[i] = 0;
        if (s.styled[i]) {
          s.styled[i] = 0;
          s.styledCount--;
        }
      }
    }

    // Cursor speed relaxes between events so the plow dies down smoothly.
    s.cursor.speed *= Math.exp(-dt / 0.25);

    if (busy) {
      s.raf = requestAnimationFrame(tick);
    } else {
      s.raf = 0;
      s.lastT = 0;
    }
  };

  const wake = () => {
    const s = sim.current;
    // A handle with no recent tick means the pending frame was suspended
    // (occluded window) or dropped; reschedule rather than trust it. The
    // timestamp dedupe in tick() makes the restart safe if both survive.
    if (s.raf && performance.now() - s.lastTickAt > 250) {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    }
    if (!s.raf) {
      s.lastT = 0;
      s.raf = requestAnimationFrame(tick);
    }
  };

  const toLocal = (e: ReactPointerEvent<HTMLDivElement>) => {
    const box = fieldRef.current!.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (s.reduced || !fieldRef.current) return;
    if (!s.ready) measure();
    const p = toLocal(e);
    const t = performance.now();
    if (s.cursor.lastT) {
      const dt = (t - s.cursor.lastT) / 1000;
      if (dt > 0.001) {
        const v = Math.hypot(p.x - s.cursor.lastX, p.y - s.cursor.lastY) / dt;
        s.cursor.speed = s.cursor.speed * 0.7 + v * 0.3;
      }
    }
    s.cursor.lastX = p.x;
    s.cursor.lastY = p.y;
    s.cursor.lastT = t;
    s.cursor.x = p.x;
    s.cursor.y = p.y;
    s.cursor.active = true;
    wake();
  };

  const onPointerLeave = () => {
    const s = sim.current;
    s.cursor.active = false;
    s.cursor.speed = 0;
    s.cursor.lastT = 0;
    wake();
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (s.reduced || !fieldRef.current) return;
    if (!s.ready) measure();
    const p = toLocal(e);
    if (s.waves.length < 6) s.waves.push({ x: p.x, y: p.y, t0: performance.now() });
    wake();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <Reveal variant="fade" className={PANEL}>
        <p className={LABEL}>Daily oral therapy</p>

        <div
          ref={fieldRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          className="relative my-7"
        >
          <div aria-hidden className={FIELD} style={fieldStyle}>
            {Array.from({ length: DAYS }).map((_, i) => (
              <span
                key={i}
                className="dose-dot aspect-square"
                style={{ "--i": i } as CSSProperties}
              >
                <span className="dose-core block h-full w-full rounded-full bg-blue" />
              </span>
            ))}
          </div>
        </div>

        <p className={CAPTION}>
          <span className={COUNT}>365 doses a year</span>, dependent on daily
          adherence.
        </p>
      </Reveal>

      <Reveal variant="fade" delay={120} className={PANEL}>
        <p className={LABEL}>CIN-111 &middot; long-acting AGT siRNA</p>

        {/* Same grid, same dots: only two of the 365 cells are filled. */}
        <div aria-hidden className={`my-7 ${FIELD}`} style={fieldStyle}>
          {Array.from({ length: DAYS }).map((_, i) => {
            const dose = YEARLY.indexOf(i);
            return dose === -1 ? (
              <span key={i} className="aspect-square" />
            ) : (
              <span
                key={i}
                className="year-dot aspect-square rounded-full bg-blue"
                style={{ "--i": dose } as CSSProperties}
              />
            );
          })}
        </div>

        <p className={CAPTION}>
          <span className={COUNT}>1 to 2 doses a year</span>, independent of
          daily adherence.
        </p>
      </Reveal>
    </div>
  );
}
