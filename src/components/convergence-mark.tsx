"use client";

/**
 * The hero convergence: the CinPressa mark assembling itself from its four
 * parent ovals, then letting the visitor lift it apart.
 *
 * The supplied artwork is thirteen boolean fragments, so it can only ever move
 * as a rigid body (see MarkArt). This component instead renders the layered
 * source those fragments were flattened from: MARK_OVALS in geometry.tsx, the
 * four ellipses recovered numerically from the fragment boundary arcs.
 *
 * Entrance (all CSS, see "Convergence" in globals.css):
 *   1. The four whole ovals wheel in on ONE shared spin — large same-direction
 *      arcs, later petals chasing the leaders, each unwinding its own
 *      counter-rotation as it locks — every oval in its own petal colour with
 *      `multiply` blending, so every interior colour is created optically,
 *      live, by the overlaps as they sweep across one another.
 *   2. Inside the final settle the authored thirteen-colour artwork ignites
 *      from the core outward, resolving the ink blends into the vivid icon
 *      ladder of the actual logo.
 *   3. The orange dose, the one fragment no blend of blues can produce,
 *      stamps down last, ringed by one hairline pulse.
 *
 * Hover (after the entrance settles; mouse only): UNSCREW, HOLD, SCREW SHUT.
 * Two earlier cuts failed in opposite directions — one oval fleeing the
 * cursor read as a fidget, and a continuously revolving wheel read as
 * aimless circling. A third failed by de-lighting: reverting to the four
 * flat parent pastels AND separating them removed both of the mark's
 * colour sources (the vivid artwork, the multiply overlaps) at exactly the
 * moment of interaction, so the open pose read as drab. The open state must
 * be RICHER than the closed mark, not poorer. So, on hover:
 *
 *   – the mark unscrews counter-clockwise (the reverse of its clockwise
 *     assembly), all four ovals lifting off the page in a quick ripple
 *     (0/45/90/135ms), separating radially, fanning to graded angles over
 *     their contact shadows;
 *   – AS each petal lifts it SATURATES: a radial gradient — a deep
 *     spec-sheet heart glowing toward the mark's core, the oval's own
 *     pastel at the rim — crossfades in over the flat ink, so the pose
 *     holds as four lit-glass petals, not four films;
 *   – the orange dose does NOT vanish: as the petals part it stays exactly
 *     where it lives, revealed floating in the opening inside a dashed
 *     hairline halo — open the mark and what remains at the centre is the
 *     point of the whole company;
 *   – four dashed hairline leaders draw from the centroid to each departing
 *     petal, tracking them live: an exploded technical diagram in the
 *     site's own drafted register, not a scatter.
 *
 * It holds there for as long as the pointer stays anywhere on the
 * component — open is a LATCH, not a per-move containment test, so moving
 * around inside the exploded pose can never retract it; only leaving the
 * component closes it. On leave all four screw back SIMULTANEOUSLY and
 * faster than they opened — the clean snap — the glass dims back to
 * blendable ink as the overlaps re-form, and the artwork re-ignites over
 * the exact same dose, so the crossfade is seamless.
 *
 * Division of labour: CSS animations own the entrance; after it settles,
 * class-driven transitions own the layer crossfades and JS owns only the
 * per-oval bloom values — critically-damped springs, velocity building from
 * rest so the open breathes into motion, a stiffer constant on the close so
 * the snap stays a snap — written as one rigid transform per oval on the
 * lift groups, so nothing ever fights an animation's fill. The loop stops
 * while the pose holds — a held mark costs no frames. Clicking replays the
 * entrance. Reduced motion shows the finished mark immediately, static,
 * with hover disabled.
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

/** Entrance choreography, keyed to MARK_OVALS order.
 *
 * ONE SHARED SPIN (see the Convergence note in globals.css): every orbit
 * sweeps the same direction on a large arc, later petals sweeping farther in
 * the same duration so they visibly chase the leaders; each petal carries a
 * counter-rotation (~0.35 of its sweep) that unwinds as it locks, and the
 * radial offsets are pushed well out so the whirl is a spiral, not a pivot.
 * Delays compress toward the last arrival: an accelerating drumroll of
 * locks, with the ignition landing on the downbeat. */
const FLIGHTS = [
  { orb: "-122deg", dx: "-88px", dy: "-58px", rot: "43deg", delay: "0.08s" },
  { orb: "-142deg", dx: "57px", dy: "-110px", rot: "50deg", delay: "0.24s" },
  { orb: "-158deg", dx: "-76px", dy: "91px", rot: "55deg", delay: "0.36s" },
  { orb: "-172deg", dx: "95px", dy: "68px", rot: "60deg", delay: "0.44s" },
];

/**
 * THE FOUR REPLACEMENT ENTRANCES.
 *
 * The orbit above was called dated, and the diagnosis is right: objects that
 * fly and spin into formation is Flash-era grammar. These are built on the
 * opposite instinct — three of them barely move the ovals at all, and the
 * mark is revealed or resolved rather than assembled. The keyframes live in
 * globals.css under "Convergence: alternative entrances"; what is here is the
 * per-oval data each one needs and how long it runs before hover unlocks.
 *
 *   bloom     ink wicking into wet paper; nothing travels
 *   register  a press closing the last millimetres onto true
 *   aperture  an iris opening on a mark that is already whole
 *   depth     four sheets of glass settling into one plane
 *   orbit     the original, kept only so the two can be compared
 *
 * Every one ends in an identical state, so the hover explode, the idle float
 * and the artwork crossfade are untouched by the choice.
 */
export type MarkVariant =
  | "unfurl"
  | "splay"
  | "cascade"
  | "riffle"
  | "seat"
  | "fan"
  | "counter"
  | "sweep"
  | "bloom"
  | "register"
  | "aperture"
  | "depth"
  | "orbit";

export const MARK_VARIANTS: { id: MarkVariant; label: string }[] = [
  /* Review order, set by hand: the three under active consideration lead and
     everything else trails as reference. Not grouped — a flat list keeps the
     control small, which is the point of a control that sits on the hero. */
  { id: "cascade", label: "Cascade" },
  { id: "bloom", label: "Bloom" },
  { id: "orbit", label: "Orbit (original)" },
  { id: "splay", label: "Splay" },
  { id: "unfurl", label: "Unfurl" },
  { id: "riffle", label: "Riffle" },
  { id: "seat", label: "Seat" },
  { id: "fan", label: "Fan" },
  { id: "counter", label: "Counter" },
  { id: "sweep", label: "Sweep" },
  { id: "register", label: "Register" },
  { id: "aperture", label: "Aperture" },
  { id: "depth", label: "Depth" },
];

type Entrance = {
  /** Time before hover unlocks: the last downstream beat, plus a breath. */
  settle: number;
  /** Per-oval stagger, keyed to MARK_OVALS order. */
  delays: string[];
  /** Per-oval custom properties the variant's keyframes read. */
  vars?: Array<Record<string, string>>;
};

const ENTRANCES: Record<MarkVariant, Entrance> = {
  /**
   * Unfurl. Derived from the mark's own geometry rather than picked by eye.
   *
   * Each oval centre's bearing from the centroid, measured off the artwork:
   *
   *     green   -62.7deg   the bottom card, the anchor
   *     indigo   35.9deg   +98.6 round from green
   *     pale    128.7deg   +191.4
   *     blue    209.9deg   +272.6, the top card
   *
   * Starting offsets are 30% of each card's distance round the fan, so the
   * hand opens from ~70% of its true spread, plus a shared 12deg so even the
   * anchor turns. Delays follow the fan's order — green, indigo, pale, blue —
   * which is NOT the array order, so they are set per index by hand.
   */
  /* Compressed toward the MIDDLE of the fan: both ends travel, so the hand
     opens from 45% of true spread — the widest opening here — on a smaller
     maximum turn than the anchored versions manage. No stagger; a two-handed
     spread happens all at once. */
  splay: {
    settle: 1940,
    delays: ["0s", "0s", "0s", "0s"],
    vars: [
      { "--orb": "-72.6deg" },
      { "--orb": "77.4deg" },
      { "--orb": "-27.9deg" },
      { "--orb": "23.1deg" },
    ],
  },
  /* Anchored, long stagger, biggest travel on the top card: cards are dealt
     off the hand one at a time rather than spreading as one motion. */
  cascade: {
    settle: 2190,
    delays: ["0.48s", "0s", "0.32s", "0.16s"],
    vars: [
      { "--orb": "-102.7deg" },
      { "--orb": "-10deg" },
      { "--orb": "-75.1deg" },
      { "--orb": "-43.5deg" },
    ],
  },
  /* Symmetric and quick, tight stagger — the hand riffles open in under a
     second and the colour is already filling in. */
  riffle: {
    settle: 1710,
    delays: ["0.15s", "0s", "0.1s", "0.05s"],
    vars: [
      { "--orb": "-59.4deg" },
      { "--orb": "63.3deg" },
      { "--orb": "-22.8deg" },
      { "--orb": "18.9deg" },
    ],
  },
  unfurl: {
    settle: 2140,
    /* indices are [blue, green, pale, indigo] */
    delays: ["0.15s", "0s", "0.1s", "0.05s"],
    vars: [
      { "--orb": "-93.8deg" },
      { "--orb": "-12deg" },
      { "--orb": "-69.4deg" },
      { "--orb": "-41.6deg" },
    ],
  },
  /* ── The refined orbits. Every one of these rotates about the centroid and
     does nothing else; --orb is the only variable any of them reads. Angles
     are small enough to be an alignment rather than a journey — except
     Sweep, which is deliberately large to prove the size was never the
     problem. None of them stagger: these are assemblies closing, and a
     stagger would turn a mechanism back into a drumroll. */
  seat: {
    settle: 1800,
    delays: ["0s", "0s", "0s", "0s"],
    vars: [
      { "--orb": "-16deg" },
      { "--orb": "-16deg" },
      { "--orb": "-16deg" },
      { "--orb": "-16deg" },
    ],
  },
  fan: {
    settle: 2160,
    delays: ["0s", "0s", "0s", "0s"],
    vars: [
      { "--orb": "-26deg" },
      { "--orb": "-19deg" },
      { "--orb": "-12deg" },
      { "--orb": "-5deg" },
    ],
  },
  counter: {
    settle: 2100,
    delays: ["0s", "0s", "0s", "0s"],
    vars: [
      { "--orb": "-18deg" },
      { "--orb": "18deg" },
      { "--orb": "18deg" },
      { "--orb": "-18deg" },
    ],
  },
  sweep: {
    settle: 2280,
    delays: ["0s", "0s", "0s", "0s"],
    vars: [
      { "--orb": "-55deg" },
      { "--orb": "-55deg" },
      { "--orb": "-55deg" },
      { "--orb": "-55deg" },
    ],
  },

  /* Staggered widely: the whole point is watching four overlaps form one at
     a time, which needs the arrivals separated enough to read as separate. */
  bloom: {
    settle: 2480,
    delays: ["0s", "0.13s", "0.26s", "0.39s"],
  },
  /* Tight, because a press is not a drumroll: the plates land almost
     together and the eye reads one correction, not four. Offsets are in
     viewBox units on a 186-unit crop — about 5%, far enough to be
     unmistakably out of true and near enough to be a registration error
     rather than a journey. Directions are deliberately unalike. */
  register: {
    settle: 1570,
    delays: ["0s", "0.05s", "0.1s", "0.15s"],
    vars: [
      { "--rx": "-11px", "--ry": "7px" },
      { "--rx": "9px", "--ry": "-12px" },
      { "--rx": "13px", "--ry": "8px" },
      { "--rx": "-8px", "--ry": "-11px" },
    ],
  },
  /* No stagger at all. The iris is one event and the mark is behind it
     whole; delaying the ovals against each other would betray that. */
  aperture: {
    settle: 1980,
    delays: ["0s", "0s", "0s", "0s"],
  },
  /* Alternating far/near so the stack has real depth either side of the
     plane rather than all arriving from behind, and blur in proportion to
     how far out of plane each sheet starts. */
  depth: {
    settle: 2040,
    delays: ["0s", "0.1s", "0.2s", "0.3s"],
    vars: [
      { "--z": "1.45", "--zb": "18px" },
      { "--z": "0.7", "--zb": "14px" },
      { "--z": "1.28", "--zb": "11px" },
      { "--z": "0.82", "--zb": "8px" },
    ],
  },
  /* The original: the ring finishes on its own at ~3.25s, the mark is lit
     and at rest from ~2.75s. */
  orbit: {
    settle: 2750,
    delays: FLIGHTS.map((f) => f.delay),
    vars: FLIGHTS.map((f) => ({
      "--orb": f.orb,
      "--dx": f.dx,
      "--dy": f.dy,
      "--rot": f.rot,
    })),
  },
};

/** The exploded hold. Opening ripples through the ovals on these delays;
 *  closing ignores them and returns everyone at once. The group unscrews
 *  counter-clockwise — the reverse of the entrance's clockwise assembly —
 *  and each oval fans a few degrees further than the last, so the held pose
 *  reads as a drawn diagram, not a uniform scatter. Asymmetric time
 *  constants: the open eases, the close snaps. */
const OPEN_DELAYS = [0, 45, 90, 135];
const GROUP_ROT = -26;
const EXTRA_ROT = [-8, -13, -18, -23];
const LIFT = 40;
const RISE = 6;
const SWELL = 0.05;

/** Spring stiffness (rad/s), critically damped. A spring, not an
 *  exponential: velocity builds from zero, so the open breathes into
 *  motion instead of jerking. The close is stiffer — the snap. */
const W_OPEN = 11;
const W_CLOSE = 18;

/** The lit-glass petals: a deep spec-sheet heart glowing toward the mark's
 *  core, the oval's own pastel at the rim. Keyed to MARK_OVALS order
 *  (blue, green, pale, indigo); every stop is a spec-sheet colour. The
 *  focus fractions lean each gradient's heart toward the mark centre. */
const VIVID = [
  { heart: "#0473BB", rim: "#7EAADB", fx: 0.62, fy: 0.58 },
  { heart: "#3AAED8", rim: "#AFDBBC", fx: 0.4, fy: 0.62 },
  { heart: "#1EAEE5", rim: "#AADBF6", fx: 0.58, fy: 0.38 },
  { heart: "#2261AD", rim: "#6771B5", fx: 0.42, fy: 0.4 },
];

/** How deep inside an oval the pointer sits: <1 means contained. */
function normRadius(
  o: { cx: number; cy: number; rx: number; ry: number; angle: number },
  px: number,
  py: number,
) {
  const a = (o.angle * Math.PI) / 180;
  const dx = px - o.cx;
  const dy = py - o.cy;
  const lx = dx * Math.cos(a) + dy * Math.sin(a);
  const ly = -dx * Math.sin(a) + dy * Math.cos(a);
  return Math.hypot(lx / o.rx, ly / o.ry);
}

export function ConvergenceMark({
  className = "",
  variant = "cascade",
}: {
  className?: string;
  variant?: MarkVariant;
}) {
  const entrance = ENTRANCES[variant];
  const [run, setRun] = useState(0);
  const [settled, setSettled] = useState(false);
  const [open, setOpen] = useState(false);

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const maskId = `cvg-m${uid}`;
  const softId = `cvg-s${uid}`;
  const shadowId = `cvg-sh${uid}`;
  const irisId = `cvg-i${uid}`;
  const irisSoftId = `cvg-is${uid}`;

  const rigRef = useRef<SVGSVGElement | null>(null);
  const liftEls = useRef<Array<SVGGElement | null>>([]);
  const vividEls = useRef<Array<SVGPathElement | null>>([]);
  const leaderEls = useRef<Array<SVGLineElement | null>>([]);
  const coreEl = useRef<SVGGElement | null>(null);
  const blooms = useRef<number[]>(MARK_OVALS.map(() => 0));
  const vels = useRef<number[]>(MARK_OVALS.map(() => 0));
  const openAt = useRef(0);
  const openRef = useRef(false);
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
      reduced.current ? 0 : entrance.settle
    );
    return () => clearTimeout(t);
  }, [run, entrance.settle]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /**
   * The bloom loop. Each oval carries its own bloom value, damped toward its
   * target: 1 once the open ripple reaches it, 0 the instant the pointer
   * leaves — no stagger on the way shut, and a shorter time constant, so the
   * close is one clean simultaneous snap. Every transform is derived from
   * bloom alone: the group unscrew, the radial lift, the per-oval fan, the
   * rise and the swell all arrive and leave together. Once every bloom
   * reaches its target the loop stops — the held pose costs no frames.
   */
  const tick = (now: number) => {
    const dtMs = Math.min(64, now - (lastT.current || now));
    lastT.current = now;
    const isOpen = openRef.current;
    let busy = false;

    const dt = dtMs / 1000;
    let bloomSum = 0;
    for (let i = 0; i < MARK_OVALS.length; i++) {
      const target =
        isOpen && now - openAt.current >= OPEN_DELAYS[i] ? 1 : 0;
      // Critically damped spring toward the target: smooth acceleration from
      // rest on the way open, a stiff decisive settle on the way shut.
      const w = target === 1 ? W_OPEN : W_CLOSE;
      let v = vels.current[i];
      let b = blooms.current[i];
      v += (w * w * (target - b) - 2 * w * v) * dt;
      b += v * dt;
      vels.current[i] = v;
      blooms.current[i] = b;
      bloomSum += b;
      // Still waiting on the ripple, or still travelling: keep the loop hot.
      if (
        Math.abs(target - b) > 0.0008 ||
        Math.abs(v) > 0.002 ||
        (isOpen && target === 0)
      ) {
        busy = true;
      }

      const el = liftEls.current[i];
      if (!el) continue;
      const o = MARK_OVALS[i];
      const theta = GROUP_ROT * b;
      const rad = (theta * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const hx = o.cx - CENTER.x;
      const hy = o.cy - CENTER.y;
      const len = Math.hypot(hx, hy) || 1;
      const bx = hx + (hx / len) * LIFT * b;
      const by = hy + (hy / len) * LIFT * b;
      const tx = bx * cos - by * sin - hx;
      const ty = bx * sin + by * cos - hy - RISE * b;
      el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${(theta + EXTRA_ROT[i] * b).toFixed(2)}deg) scale(${(1 + SWELL * b).toFixed(4)})`;

      // The petal saturates as it lifts: flat blendable ink into lit glass.
      const vivid = vividEls.current[i];
      if (vivid) vivid.style.opacity = (0.94 * b).toFixed(3);

      // Its leader tracks the moving centre from the centroid.
      const leader = leaderEls.current[i];
      if (leader) {
        leader.setAttribute("x2", (o.cx + tx).toFixed(2));
        leader.setAttribute("y2", (o.cy + ty).toFixed(2));
        leader.style.opacity = (0.32 * b).toFixed(3);
      }
    }

    // The nucleus: the dose revealed as the petals part.
    const mean = bloomSum / MARK_OVALS.length;
    const core = coreEl.current;
    if (core) {
      core.style.opacity = mean.toFixed(3);
      core.style.transform = `scale(${(0.7 + 0.3 * mean).toFixed(4)})`;
    }

    if (busy) {
      raf.current = requestAnimationFrame(tick);
    } else {
      lastT.current = 0;
      if (!isOpen) {
        blooms.current = MARK_OVALS.map(() => 0);
        vels.current = MARK_OVALS.map(() => 0);
        liftEls.current.forEach((el) => el?.style.removeProperty("transform"));
        vividEls.current.forEach((el) => el?.style.removeProperty("opacity"));
        leaderEls.current.forEach((el) => el?.style.removeProperty("opacity"));
        if (core) {
          core.style.removeProperty("opacity");
          core.style.removeProperty("transform");
        }
      }
    }
  };

  const ensureRaf = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };

  const setExploded = (next: boolean) => {
    if (next === openRef.current) return;
    if (next) openAt.current = performance.now();
    openRef.current = next;
    setOpen(next);
    ensureRaf();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!settledRef.current || reduced.current || e.pointerType !== "mouse") return;
    // THE LATCH. An earlier cut re-tested containment on every move, against
    // petal footprints that had rotated and parted — so the centre gap, and
    // any petal's fanned tip, read as "outside" and retracted the pose under
    // a pointer that was plainly on the mark. Open is a state, not a test:
    // entering the ink opens it, and the ONLY thing that closes it is the
    // pointer leaving the component. Moving around inside can never retract.
    if (openRef.current) return;
    const svg = rigRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const px = ((e.clientX - box.left) / box.width) * 186.08 + 37.26;
    const py = ((e.clientY - box.top) / box.height) * 205.04 + 18.61;

    // Over the mark's actual ink, not the container's empty corners.
    let minR = Infinity;
    for (const o of MARK_OVALS) minR = Math.min(minR, normRadius(o, px, py));
    if (minR < 1.06) setExploded(true);
  };

  const replay = () => {
    cancelAnimationFrame(raf.current);
    lastT.current = 0;
    openRef.current = false;
    setOpen(false);
    blooms.current = MARK_OVALS.map(() => 0);
    vels.current = MARK_OVALS.map(() => 0);
    liftEls.current.forEach((el) => el?.style.removeProperty("transform"));
    vividEls.current.forEach((el) => el?.style.removeProperty("opacity"));
    leaderEls.current.forEach((el) => el?.style.removeProperty("opacity"));
    coreEl.current?.style.removeProperty("opacity");
    coreEl.current?.style.removeProperty("transform");
    setRun((r) => r + 1);
  };

  return (
    <div
      key={run}
      aria-hidden
      onClick={replay}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setExploded(false)}
      className={`cvg cvg-v-${variant} mark-suspend mark-suspend-late relative ${
        settled ? "cvg-settled" : ""
      } ${open ? "cvg-open" : ""} ${className}`}
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
            {/* The lit-glass fills, one per petal: deep heart leaning toward
                the mark centre, the oval's own pastel at the rim. */}
            {/* The aperture's iris. Feathered by the same gradient trick the
                ignition uses — a soft band 40% of the radius — so the opening
                front is never an edge and nothing re-convolves per frame. */}
            {variant === "aperture" ? (
              <>
                <radialGradient id={irisSoftId}>
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="0.6" stopColor="#fff" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                <mask
                  id={irisId}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="258.82"
                  height="242.26"
                >
                  <rect x="0" y="0" width="258.82" height="242.26" fill="#000" />
                  <circle
                    className="cvg-iris"
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r="0"
                    fill={`url(#${irisSoftId})`}
                  />
                </mask>
              </>
            ) : null}
            {VIVID.map((v, i) => (
              <radialGradient
                key={i}
                id={`cvgv${uid}${i}`}
                cx="0.5"
                cy="0.5"
                r="0.72"
                fx={v.fx}
                fy={v.fy}
              >
                <stop offset="0" stopColor={v.heart} />
                <stop offset="1" stopColor={v.rim} />
              </radialGradient>
            ))}
          </defs>

          {/* Exploded-diagram leaders, under the petals: dashed hairlines
              from the centroid, tracking each petal's centre live. */}
          {MARK_OVALS.map((o, i) => (
            <line
              key={`leader-${o.name}`}
              ref={(el) => {
                leaderEls.current[i] = el;
              }}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={o.cx}
              y2={o.cy}
              stroke="#2261AD"
              strokeWidth="0.8"
              strokeDasharray="2 5"
              strokeLinecap="round"
              opacity={0}
            />
          ))}

          {/* The masked body. All four ovals sit inside one group so the iris
              uncovers them together and their multiply still resolves against
              each other; the leaders and the nucleus stay outside it, since
              those belong to the hover pose, not the entrance. */}
          <g mask={variant === "aperture" ? `url(#${irisId})` : undefined}>
          {MARK_OVALS.map((o, i) => (
            <g
              key={o.name}
              className="cvg-orbit"
              style={
                {
                  ...(entrance.vars?.[i] ?? {}),
                  "--cvg-delay": entrance.delays[i],
                } as CSSProperties
              }
            >
              <g className="cvg-petal">
                {/* The lift group is JS-transformed only, so the bloom never
                    fights an entrance animation's fill. All four float while
                    the pose is open. */}
                <g
                  ref={(el) => {
                    liftEls.current[i] = el;
                  }}
                  className={`cvg-lift ${open ? "is-lifted" : ""}`}
                >
                  {/* Contact shadow, revealed only while the wheel floats.
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
                  {/* The glass layer: normal blend over the multiply ink,
                      faded in by bloom, so the petal saturates as it lifts
                      and returns to blendable ink as the overlaps re-form. */}
                  <path
                    ref={(el) => {
                      vividEls.current[i] = el;
                    }}
                    d={o.path}
                    fill={`url(#cvgv${uid}${i})`}
                    opacity={0}
                  />
                </g>
              </g>
            </g>
          ))}
          </g>

          {/* The nucleus: the dose revealed as the petals part, exactly where
              the artwork keeps it, inside a dashed hairline halo. The art
              layer re-ignites over the same geometry, so the crossfade on
              close is seamless. */}
          <g
            ref={coreEl}
            opacity={0}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            {/* The halo turns once every three minutes: the one quiet living
                detail in the held pose. anim-orbit is already neutralised
                under reduced motion; fill-box keeps it about its own centre. */}
            <circle
              className="anim-orbit"
              cx="104"
              cy="84"
              r="26"
              fill="none"
              stroke="#2261AD"
              strokeOpacity="0.45"
              strokeWidth="0.8"
              strokeDasharray="2 5.5"
              strokeLinecap="round"
              style={{ transformBox: "fill-box" }}
            />
            <path d={MARK_PATHS[DOSE_TILE]} fill={MARK_PETALS[DOSE_TILE]} />
          </g>
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
