"use client";

import { useEffect, useRef, useState } from "react";

/**
 * How CIN-111 silences AGT — the actual RNAi mechanism.
 *
 * REBUILT after the client flagged the previous diagram as scientifically inaccurate.
 * It showed a naked guide strand drifting up from below and zipping uniformly against
 * an mRNA, then stopping. Five things were wrong or missing:
 *
 *   1. NO RISC. The guide strand never floats free in the cytoplasm. It is loaded into
 *      Argonaute-2 and stays there. Drawing it unaccompanied is the biggest error in
 *      the old figure, and anyone in the field sees it immediately.
 *   2. WRONG ZIP. Pairing does not run uniformly end to end. Cryo-EM of the human
 *      AGO2–siRNA–mRNA complex shows guide nucleotides 2–8 held as a pre-organised
 *      SEED helix that nucleates the duplex, which then propagates outward. The
 *      literature calls it the "seed zipper" — which is exactly the note we got.
 *   3. NO CLEAVAGE. The copy says the transcript is cleaved. AGO2 cuts the
 *      phosphodiester bond across from guide nucleotides 10 and 11. The old figure
 *      bound and then simply held.
 *   4. NO TURNOVER. RISC is catalytic — it releases and cleaves again, many times.
 *      This is *why* an siRNA is long-acting, so omitting it dropped the single most
 *      on-message fact in the mechanism.
 *   5. NO DIRECTIONALITY. The strands are antiparallel; the guide's 5' end sits over
 *      the mRNA's 3' side.
 *
 * All five are now drawn. The animation loops, and the loop is not decorative: RISC
 * genuinely does this over and over on transcript after transcript, which is the
 * durability argument. The caption names the beat as it happens, so the figure teaches
 * rather than just moves.
 *
 * Choreography is driven by one rAF over a normalised cycle, writing straight to SVG
 * attributes. React state changes only when the beat label changes — six times per
 * cycle, not sixty times a second. Under prefers-reduced-motion it holds a single frame
 * at the cleavage beat, which is the most informative moment.
 */

const VW = 900;
const VH = 300;

/* ── Strand geometry ─────────────────────────────────────────────────────── */

const WAVELENGTH = 190;
const AMPLITUDE = 14;
const MRNA_Y = 104;
const GUIDE_Y = 176;

const GUIDE_NT = 21;
const PITCH = 15.2;
/** 5' end of the guide. The strands are ANTIPARALLEL, so the guide runs 3'→5' left
 *  to right while the mRNA runs 5'→3'. Nucleotide n therefore sits to the LEFT of
 *  nucleotide n−1. */
const GUIDE_5P_X = 560;
const ntX = (n: number) => GUIDE_5P_X - (n - 1) * PITCH;

/** Seed: guide nucleotides 2–8. Nucleates the duplex. */
const SEED_FROM = 2;
const SEED_TO = 8;
const SEED_MID = (SEED_FROM + SEED_TO) / 2;
/** AGO2 cuts across from guide nucleotides 10 and 11. */
const CLEAVE_X = ntX(10.5);

const TARGET = "#2261ad";
const GUIDE = "#1eaee5";
const RISC_FILL = "#e9f1fa";
const RISC_EDGE = "#7eaadb";

const k = (2 * Math.PI) / WAVELENGTH;
const waveY = (x: number, centre: number) => centre + AMPLITUDE * Math.sin(k * x);
const slope = (x: number) => AMPLITUDE * k * Math.cos(k * x);

function strandPath(x0: number, x1: number, centre: number) {
  const pts: string[] = [];
  for (let x = x0; x < x1; x += 5) pts.push(`${x.toFixed(1)},${waveY(x, centre).toFixed(2)}`);
  pts.push(`${x1.toFixed(1)},${waveY(x1, centre).toFixed(2)}`);
  return `M${pts.join("L")}`;
}

/** A base tick standing off the strand, normal to it. */
function tick(x: number, centre: number, dir: 1 | -1, len: number) {
  const m = slope(x);
  const n = Math.hypot(1, m);
  const y = waveY(x, centre);
  return { x1: x, y1: y, x2: x + (-m / n) * len * dir, y2: y + (1 / n) * len * dir };
}

const NTS = Array.from({ length: GUIDE_NT }, (_, i) => i + 1);

/* ── Timeline ────────────────────────────────────────────────────────────────
   One normalised cycle. Fractions rather than seconds so the tempo is a single
   constant, and the beats stay in proportion if it is ever retuned. */

const CYCLE_S = 11;

const T = {
  scanIn: [0.0, 0.14],
  seed: [0.15, 0.23],
  zip: [0.23, 0.4],
  cleave: [0.44, 0.5],
  release: [0.52, 0.68],
  recycle: [0.7, 0.84],
  reset: [0.86, 1.0],
} as const;

const BEATS: Array<{ at: number; text: string }> = [
  { at: 0.0, text: "Guide-loaded RISC scans the transcript" },
  { at: 0.15, text: "Seed region nucleates — guide nucleotides 2–8" },
  { at: 0.23, text: "The duplex zips outward from the seed" },
  { at: 0.44, text: "AGO2 cleaves across from nucleotides 10 and 11" },
  { at: 0.52, text: "The cleaved transcript is released and degraded" },
  { at: 0.7, text: "RISC is recycled — one guide silences many transcripts" },
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ramp = (t: number, [a, b]: readonly [number, number]) => clamp01((t - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);

/** Where RISC sits at cycle position t, as an x offset from the docked position. */
function riscOffset(t: number) {
  if (t < T.scanIn[1]) return -520 * (1 - ease(ramp(t, T.scanIn)));
  if (t < T.recycle[0]) return 0;
  if (t < T.reset[0]) return 620 * ease(ramp(t, T.recycle));
  return -520; // parked off-frame left, ready for the next transcript
}

/** 0 → unpaired, 1 → fully paired, for guide nucleotide n at cycle position t. */
function pairing(n: number, t: number) {
  const inSeed = n >= SEED_FROM && n <= SEED_TO;
  if (inSeed) return ramp(t, T.seed);
  // Everything else follows, ordered by distance from the seed — the zipper.
  const reach = Math.max(SEED_FROM - 1, GUIDE_NT - SEED_TO);
  const d = n < SEED_FROM ? SEED_FROM - n : n - SEED_TO;
  const span = T.zip[1] - T.zip[0];
  const start = T.zip[0] + (span * 0.72 * (d - 1)) / reach;
  return ramp(t, [start, start + span * 0.28] as const);
}

export function DuplexBinding() {
  const rootRef = useRef<SVGSVGElement | null>(null);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const svg = rootRef.current;
    if (!svg) return;

    const risc = svg.querySelector<SVGGElement>("[data-risc]");
    const bonds = Array.from(svg.querySelectorAll<SVGLineElement>("[data-bond]"));
    const left = svg.querySelector<SVGGElement>("[data-frag='left']");
    const right = svg.querySelector<SVGGElement>("[data-frag='right']");
    const cut = svg.querySelector<SVGGElement>("[data-cut]");
    if (!risc || !left || !right || !cut) return;

    const apply = (t: number) => {
      risc.setAttribute("transform", `translate(${riscOffset(t).toFixed(1)} 0)`);

      for (const el of bonds) {
        const n = Number(el.dataset.bond);
        const p = pairing(n, t);
        // Bonds fade with the transcript once it is released.
        const gone = ramp(t, T.release);
        el.setAttribute("opacity", (p * (1 - gone)).toFixed(3));
      }

      const cutP = ramp(t, T.cleave);
      cut.setAttribute("opacity", (cutP * (1 - ramp(t, T.release))).toFixed(3));

      // The two halves of the transcript draw apart and fade.
      const part = ease(ramp(t, T.release));
      const fade = (1 - part * 0.85).toFixed(3);
      left.setAttribute("transform", `translate(${(-90 * part).toFixed(1)} ${(10 * part).toFixed(1)})`);
      left.setAttribute("opacity", fade);
      right.setAttribute("transform", `translate(${(90 * part).toFixed(1)} ${(-8 * part).toFixed(1)})`);
      right.setAttribute("opacity", fade);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Hold the most informative frame: bound, zipped, and cut.
      apply(0.47);
      setBeat(3);
      return;
    }

    let rafId = 0;
    let inView = true;
    const start = performance.now();
    let lastBeat = -1;

    const loop = (now: number) => {
      if (inView) {
        const t = (((now - start) / 1000) % CYCLE_S) / CYCLE_S;
        apply(t);
        let b = 0;
        for (let i = 0; i < BEATS.length; i++) if (t >= BEATS[i].at) b = i;
        if (b !== lastBeat) {
          lastBeat = b;
          setBeat(b);
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    });
    io.observe(svg);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, []);

  const guideX0 = ntX(GUIDE_NT) - 10;
  const guideX1 = ntX(1) + 10;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white/80 px-5 py-8 sm:px-10 sm:py-11">
      <div className="flex justify-center overflow-hidden">
        <svg
          ref={rootRef}
          viewBox={`0 0 ${VW} ${VH}`}
          className="h-auto w-full min-w-[620px] max-w-none"
          role="img"
          aria-label="RNA interference: guide-loaded RISC binds AGT messenger RNA at the seed region, the duplex zips outward, Argonaute-2 cleaves the transcript between nucleotides 10 and 11, the fragments are released, and RISC is recycled to silence further transcripts."
        >
          <defs>
            {/* The transcript runs far past the frame, so it dissolves at both ends
                rather than stopping at a hard cap. */}
            <linearGradient id="dx-edge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000" />
              <stop offset="8%" stopColor="#fff" />
              <stop offset="92%" stopColor="#fff" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
            <mask id="dx-edge-mask">
              <rect width={VW} height={VH} fill="url(#dx-edge)" />
            </mask>
          </defs>

          {/* ── AGT messenger RNA, in two halves so it can be cut ── */}
          <g mask="url(#dx-edge-mask)">
            <g data-frag="left">
              <path
                d={strandPath(-40, CLEAVE_X, MRNA_Y)}
                fill="none"
                stroke={TARGET}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
            <g data-frag="right">
              <path
                d={strandPath(CLEAVE_X, VW + 40, MRNA_Y)}
                fill="none"
                stroke={TARGET}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* 5' / 3' — the transcript's direction. */}
          <text x={16} y={MRNA_Y - 26} fontSize={15} fontWeight={600} fill="#5b6e83">5&prime;</text>
          <text x={VW - 34} y={MRNA_Y - 26} fontSize={15} fontWeight={600} fill="#5b6e83">3&prime;</text>

          {/* ── The cut: AGO2's scissile position ── */}
          <g data-cut opacity="0">
            <line
              x1={CLEAVE_X}
              y1={MRNA_Y - 30}
              x2={CLEAVE_X}
              y2={MRNA_Y + 16}
              stroke="#f9a81a"
              strokeWidth="2.2"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            <text
              x={CLEAVE_X}
              y={MRNA_Y - 38}
              fontSize={13}
              fontWeight={600}
              textAnchor="middle"
              fill="#b9770c"
            >
              cleavage
            </text>
          </g>

          {/* ── RISC: the guide strand, and everything that carries it ── */}
          <g data-risc>
            {/* Argonaute-2. A soft rounded body enclosing the guide — the guide is
                never outside it, which is the correction this figure exists to make. */}
            <path
              d={`M ${guideX0 - 44} ${GUIDE_Y + 4}
                  C ${guideX0 - 54} ${GUIDE_Y - 54}, ${guideX0 + 30} ${GUIDE_Y - 74}, ${(guideX0 + guideX1) / 2} ${GUIDE_Y - 70}
                  C ${guideX1 - 20} ${GUIDE_Y - 66}, ${guideX1 + 52} ${GUIDE_Y - 44}, ${guideX1 + 42} ${GUIDE_Y + 8}
                  C ${guideX1 + 34} ${GUIDE_Y + 60}, ${guideX1 - 60} ${GUIDE_Y + 74}, ${(guideX0 + guideX1) / 2} ${GUIDE_Y + 72}
                  C ${guideX0 + 40} ${GUIDE_Y + 70}, ${guideX0 - 36} ${GUIDE_Y + 56}, ${guideX0 - 44} ${GUIDE_Y + 4} Z`}
              fill={RISC_FILL}
              stroke={RISC_EDGE}
              strokeOpacity="0.55"
              strokeWidth="1.4"
            />
            <text
              x={(guideX0 + guideX1) / 2}
              y={GUIDE_Y + 60}
              fontSize={14}
              fontWeight={600}
              letterSpacing={1.4}
              textAnchor="middle"
              fill="#46586b"
            >
              RISC · AGO2
            </text>

            {/* The guide strand itself. */}
            <path
              d={strandPath(guideX0, guideX1, GUIDE_Y)}
              fill="none"
              stroke={GUIDE}
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Antiparallel: the guide's 5' end sits over the transcript's 3' side. */}
            <text x={guideX1 + 8} y={GUIDE_Y + 26} fontSize={15} fontWeight={600} fill="#5b6e83">5&prime;</text>
            <text x={guideX0 - 24} y={GUIDE_Y + 26} fontSize={15} fontWeight={600} fill="#5b6e83">3&prime;</text>

            {/* Seed bracket — where the duplex nucleates. */}
            <path
              d={`M ${ntX(SEED_TO) - 5} ${GUIDE_Y + 34} L ${ntX(SEED_TO) - 5} ${GUIDE_Y + 40} L ${ntX(SEED_FROM) + 5} ${GUIDE_Y + 40} L ${ntX(SEED_FROM) + 5} ${GUIDE_Y + 34}`}
              fill="none"
              stroke={GUIDE}
              strokeOpacity="0.8"
              strokeWidth="1.6"
            />
            <text
              x={ntX(SEED_MID)}
              y={GUIDE_Y + 54}
              fontSize={13}
              fontWeight={600}
              textAnchor="middle"
              fill="#0783c6"
            >
              seed
            </text>
          </g>

          {/* ── Base pairs. Drawn between the two strands, opacity driven per
                 nucleotide so the zipper propagates out of the seed. ── */}
          {NTS.map((n) => {
            const x = ntX(n);
            const a = tick(x, MRNA_Y, 1, 8);
            const b = tick(x, GUIDE_Y, -1, 8);
            const inSeed = n >= SEED_FROM && n <= SEED_TO;
            return (
              <line
                key={n}
                data-bond={n}
                opacity="0"
                x1={a.x2}
                y1={a.y2}
                x2={b.x2}
                y2={b.y2}
                stroke={inSeed ? GUIDE : "#7eaadb"}
                strokeWidth={inSeed ? 2.6 : 2}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>

      {/* The beat, named as it happens. A mechanism figure that does not say what it
          is doing is decoration. */}
      <div className="mt-7 border-t border-line pt-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-[0.78rem] font-semibold tabular-nums tracking-[0.14em] text-azure">
            {String(beat + 1).padStart(2, "0")}
          </span>
          <p className="text-[0.98rem] leading-relaxed text-body">{BEATS[beat].text}</p>
        </div>
        <div className="mt-4 flex gap-1.5" aria-hidden>
          {BEATS.map((b, i) => (
            <span
              key={b.at}
              className="h-0.5 flex-1 rounded-full transition-colors duration-500"
              style={{ background: i <= beat ? GUIDE : "#dce7f1" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
