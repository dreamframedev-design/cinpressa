"use client";

/**
 * The hero convergence: the CinPressa mark assembling itself from its four
 * parent ovals, then letting the visitor pull it apart.
 *
 * The supplied artwork is thirteen boolean fragments, so it can only ever move
 * as a rigid body (see MarkArt). This component instead renders the layered
 * source those fragments were flattened from: MARK_OVALS in geometry.tsx, the
 * four ellipses recovered numerically from the fragment boundary arcs.
 *
 * Entrance (all CSS, see "Convergence" in globals.css):
 *   1. The four whole ovals spiral in on counter-rotating orbits, each in its
 *      own petal colour with `multiply` blending, so every interior colour is
 *      created optically, live, by the overlaps as they form.
 *   2. Inside the final settle the authored thirteen-colour artwork ignites
 *      from the core outward, resolving the ink blends into the vivid icon
 *      ladder of the actual logo.
 *   3. The orange dose, the one fragment no blend of blues can produce,
 *      stamps down last, ringed by one hairline pulse.
 *
 * Hover (after the entrance settles; mouse only): the pointer's oval is found
 * by exact point-in-rotated-ellipse tests, the artwork de-ignites back into
 * the physical rig, and that oval flees the cursor like a like-poled magnet,
 * updated through a critically-damped rAF follow. The remaining three stay
 * interlocked, their overlap colours re-blending live as the lifted oval
 * leaves the stack; the dose vanishes with the artwork, because the
 * punctuation only exists in the finished sentence. On leave the oval glides
 * home and the mark re-ignites.
 *
 * Division of labour: CSS animations own the entrance; after it settles,
 * class-driven transitions own the layer crossfades and JS owns only the
 * lifted oval's transform (a group of its own, so nothing ever fights an
 * animation's fill). Clicking replays the entrance. Reduced motion shows the
 * finished mark immediately, static, with hover disabled.
 */

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { MARK_OVALS, MARK_PATHS, MARK_PETALS } from "@/components/geometry";

/** Same tight crop MarkArt uses: the artwork without the file's padding. */
const VIEW_BOX = "37.26 18.61 186.08 205.04";

/** The orange fragment: excluded from the wipe, it gets its own final beat. */
const DOSE_TILE = 1;

/** Centroid of the four oval centres; the orbital pivot and radial origin. */
const CENTER = { x: 125.16, y: 121.73 };

/** Entrance choreography and lift behaviour, keyed to MARK_OVALS order. */
const FLIGHTS = [
  { orb: "-32deg", dx: "-46px", dy: "-30px", rot: "-26deg", delay: "0.12s", spin: -1 },
  { orb: "28deg", dx: "30px", dy: "-58px", rot: "22deg", delay: "0.24s", spin: 1 },
  { orb: "24deg", dx: "-40px", dy: "48px", rot: "19deg", delay: "0.36s", spin: 1 },
  { orb: "-28deg", dx: "50px", dy: "36px", rot: "-24deg", delay: "0.48s", spin: -1 },
];

/** Entrance duration before hover unlocks (the ring finishes on its own at
    3s; the mark is lit and at rest from ~2.45s). */
const SETTLE_MS = 2450;

/** How deep inside an oval the pointer sits: <1 means contained. */
function normRadius(o: (typeof MARK_OVALS)[number], px: number, py: number) {
  const a = (o.angle * Math.PI) / 180;
  const dx = px - o.cx;
  const dy = py - o.cy;
  const lx = dx * Math.cos(a) + dy * Math.sin(a);
  const ly = -dx * Math.sin(a) + dy * Math.cos(a);
  return Math.hypot(lx / o.rx, ly / o.ry);
}

type Lift = { x: number; y: number; r: number; s: number };
const LIFT_ZERO: Lift = { x: 0, y: 0, r: 0, s: 1 };

export function ConvergenceMark({ className = "" }: { className?: string }) {
  const [run, setRun] = useState(0);
  const [settled, setSettled] = useState(false);
  const [lifted, setLifted] = useState<number | null>(null);

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const maskId = `cvg-m${uid}`;
  const softId = `cvg-s${uid}`;
  const shadowId = `cvg-sh${uid}`;

  const rigRef = useRef<SVGSVGElement | null>(null);
  const liftEls = useRef<Array<SVGGElement | null>>([]);
  const cur = useRef<Lift[]>(MARK_OVALS.map(() => ({ ...LIFT_ZERO })));
  const target = useRef<Lift[]>(MARK_OVALS.map(() => ({ ...LIFT_ZERO })));
  const liftedRef = useRef<number | null>(null);
  const settledRef = useRef(false);
  const reduced = useRef(false);
  const raf = useRef(0);
  const lastT = useRef(0);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setSettled(false);
    settledRef.current = false;
    const t = setTimeout(
      () => {
        setSettled(true);
        settledRef.current = true;
      },
      reduced.current ? 0 : SETTLE_MS
    );
    return () => clearTimeout(t);
  }, [run]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /** Critically-damped follow: each frame closes ~63% of the gap per 110ms. */
  const tick = (now: number) => {
    const dt = Math.min(64, now - (lastT.current || now));
    lastT.current = now;
    const k = 1 - Math.exp(-dt / 110);
    let busy = liftedRef.current !== null;
    cur.current.forEach((c, i) => {
      const t = target.current[i];
      c.x += (t.x - c.x) * k;
      c.y += (t.y - c.y) * k;
      c.r += (t.r - c.r) * k;
      c.s += (t.s - c.s) * k;
      if (
        Math.abs(t.x - c.x) + Math.abs(t.y - c.y) + Math.abs(t.r - c.r) > 0.05 ||
        Math.abs(t.s - c.s) > 0.001
      ) {
        busy = true;
      }
      const el = liftEls.current[i];
      if (el) {
        el.style.transform = `translate(${c.x}px, ${c.y}px) rotate(${c.r}deg) scale(${c.s})`;
      }
    });
    if (busy) {
      raf.current = requestAnimationFrame(tick);
    } else {
      lastT.current = 0;
      cur.current.forEach((c, i) => {
        Object.assign(c, LIFT_ZERO);
        liftEls.current[i]?.style.removeProperty("transform");
      });
    }
  };

  const ensureRaf = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };

  const releaseAll = () => {
    target.current.forEach((t) => Object.assign(t, LIFT_ZERO));
    liftedRef.current = null;
    setLifted(null);
    ensureRaf();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!settledRef.current || reduced.current || e.pointerType !== "mouse") return;
    const svg = rigRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const px = ((e.clientX - box.left) / box.width) * 186.08 + 37.26;
    const py = ((e.clientY - box.top) / box.height) * 205.04 + 18.61;

    const rn = MARK_OVALS.map((o) => normRadius(o, px, py));
    const prev = liftedRef.current;
    let best = -1;
    for (let i = 0; i < rn.length; i++) {
      if (rn[i] < 1 && (best === -1 || rn[i] < rn[best])) best = i;
    }
    // Hysteresis: keep the current oval while the pointer is still inside it,
    // unless another oval is clearly deeper. Prevents flicker on seams.
    let next: number | null = best === -1 ? null : best;
    if (prev !== null && rn[prev] < 1 && best !== -1 && rn[best] + 0.12 > rn[prev]) {
      next = prev;
    }

    if (next !== prev) {
      liftedRef.current = next;
      setLifted(next);
    }
    target.current.forEach((t, i) => {
      if (i !== next) {
        Object.assign(t, LIFT_ZERO);
        return;
      }
      const o = MARK_OVALS[i];
      // Flee the cursor, biased outward so an oval grabbed by its outer tip
      // never dives into the stack.
      let fx = o.cx - px;
      let fy = o.cy - py;
      const fl = Math.hypot(fx, fy);
      if (fl > 0.5) {
        fx /= fl;
        fy /= fl;
      } else {
        fx = 0;
        fy = 0;
      }
      let bx = o.cx - CENTER.x;
      let by = o.cy - CENTER.y;
      const bl = Math.hypot(bx, by);
      bx /= bl;
      by /= bl;
      let dx = fx * 0.5 + bx * 0.5;
      let dy = fy * 0.5 + by * 0.5;
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl;
      dy /= dl;
      const depth = 1 - rn[i];
      const mag = 24 + 26 * depth;
      t.x = dx * mag;
      t.y = dy * mag;
      t.r = FLIGHTS[i].spin * (3.5 + 4.5 * depth);
      t.s = 1 + 0.05 * depth;
    });
    ensureRaf();
  };

  const replay = () => {
    cancelAnimationFrame(raf.current);
    lastT.current = 0;
    liftedRef.current = null;
    setLifted(null);
    cur.current.forEach((c) => Object.assign(c, LIFT_ZERO));
    target.current.forEach((t) => Object.assign(t, LIFT_ZERO));
    liftEls.current.forEach((el) => el?.style.removeProperty("transform"));
    setRun((r) => r + 1);
  };

  return (
    <div
      key={run}
      aria-hidden
      onClick={replay}
      onPointerMove={onPointerMove}
      onPointerLeave={releaseAll}
      className={`cvg mark-suspend mark-suspend-late relative ${
        settled ? "cvg-settled" : ""
      } ${lifted !== null ? "cvg-open" : ""} ${className}`}
    >
      {/* The physical rig: four whole ovals, multiplying as they cross.
          isolation keeps the blends inside the mark, off the page washes.
          After the entrance the layer div fades out under the artwork; hover
          brings it straight back. */}
      <div className="cvg-rig-layer">
        <svg
          ref={rigRef}
          viewBox={VIEW_BOX}
          className="cvg-rig block h-auto w-full overflow-visible"
          style={{ isolation: "isolate" }}
        >
          <defs>
            <filter id={shadowId} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
          </defs>
          {MARK_OVALS.map((o, i) => (
            <g
              key={o.name}
              className="cvg-orbit"
              style={
                {
                  "--orb": FLIGHTS[i].orb,
                  "--dx": FLIGHTS[i].dx,
                  "--dy": FLIGHTS[i].dy,
                  "--rot": FLIGHTS[i].rot,
                  "--cvg-delay": FLIGHTS[i].delay,
                } as CSSProperties
              }
            >
              <g className="cvg-petal">
                {/* The lift group is JS-transformed only, so the magnetic
                    follow never fights an entrance animation's fill. */}
                <g
                  ref={(el) => {
                    liftEls.current[i] = el;
                  }}
                  className={`cvg-lift ${lifted === i ? "is-lifted" : ""}`}
                >
                  {/* Contact shadow, revealed only while this oval floats.
                      Blur lives here, never on a group: a filtered ancestor
                      would isolate the ink and break the multiply. */}
                  <path
                    className="cvg-lift-shadow"
                    d={o.path}
                    transform="translate(0 6)"
                    fill="#0d2342"
                    filter={`url(#${shadowId})`}
                  />
                  <path d={o.path} fill={o.fill} className="cvg-ink" />
                </g>
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* The authored artwork, ignited from the core outward once the ovals
          settle. Geometry is continuous with the rig (the fragment boundaries
          ARE the fitted ellipse arcs), so only the colour resolves. The layer
          div owns the hover de-ignite so the entrance animation keeps its
          fill untouched. */}
      <div className="cvg-art-layer pointer-events-none absolute inset-0">
        <svg viewBox={VIEW_BOX} className="cvg-art h-full w-full overflow-visible">
          <defs>
            {/* A wide gradient feather instead of a blur filter: the soft band
                is 40% of the wipe radius, so the front never reads as an edge,
                and nothing re-convolves per frame. */}
            <radialGradient id={softId}>
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.6" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="258.82" height="242.26">
              <rect x="0" y="0" width="258.82" height="242.26" fill="#000" />
              <circle className="cvg-wipe" cx="125.2" cy="121.7" r="0" fill={`url(#${softId})`} />
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}>
            {MARK_PATHS.map((d, i) =>
              i === DOSE_TILE ? null : <path key={i} d={d} fill={MARK_PETALS[i]} />
            )}
            <path className="cvg-dose" d={MARK_PATHS[DOSE_TILE]} fill={MARK_PETALS[DOSE_TILE]} />
          </g>
          {/* One hairline pulse as the dose lands: the accent moment. */}
          <circle
            className="cvg-ring"
            cx="104"
            cy="84"
            r="44"
            fill="none"
            stroke="#2261AD"
            strokeWidth="0.6"
          />
        </svg>
      </div>
    </div>
  );
}
