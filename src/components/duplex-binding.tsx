import type { CSSProperties } from "react";
import { Reveal } from "@/components/reveal";

/**
 * CIN-111's guide strand base-pairing with AGT messenger RNA.
 *
 * NOTE ON ACCURACY: the brief asked for "an ASO binding to an mRNA", but
 * CIN-111 is an siRNA, not an antisense oligonucleotide. The duplex the brief
 * sketches is correct for both, so the geometry follows the reference (two
 * strands snuggled together with their bases interlocking) while the labels
 * describe what CinPressa actually has. Two further accuracy choices:
 *
 *  - The guide strand is short. An mRNA is thousands of nucleotides; a guide
 *    strand is ~21. Drawing them the same length (as the reference does) would
 *    read as wrong to anyone who works on this. So the mRNA runs the full
 *    width and the guide covers one complementary site on it.
 *  - Bases outside that site are drawn unpaired: shorter and fainter. Only the
 *    bases inside the duplex are full length.
 *
 * Colours are two from the logo spec sheet, per the brief: core blue for the
 * target, icon cyan for the therapeutic.
 */

const VB_W = 880;
/** Framed close to the duplex: content spans ~86 units plus even margins. */
const VB_H = 132;

const WAVELENGTH = 176;
const AMPLITUDE = 20;
const MRNA_Y = 46;
/** Centreline separation once bound. */
const DUPLEX_GAP = 40;

/** One tick per nucleotide. */
const PITCH = 15.4;
const PAIRED_TICK = 15;
const UNPAIRED_TICK = 8;

const GUIDE_NT = 21;
const GUIDE_X0 = 286;
const GUIDE_X1 = GUIDE_X0 + (GUIDE_NT - 1) * PITCH;

const TARGET = "#2261AD";
const THERAPEUTIC = "#1EAEE5";

const k = (2 * Math.PI) / WAVELENGTH;
const waveY = (x: number, centre: number) =>
  centre + AMPLITUDE * Math.sin(k * x);
const slope = (x: number) => AMPLITUDE * k * Math.cos(k * x);

function strandPath(x0: number, x1: number, centre: number) {
  const pts: string[] = [];
  for (let x = x0; x < x1; x += 4) {
    pts.push(`${x.toFixed(1)},${waveY(x, centre).toFixed(2)}`);
  }
  pts.push(`${x1.toFixed(1)},${waveY(x1, centre).toFixed(2)}`);
  return `M${pts.join("L")}`;
}

type Base = { x1: number; y1: number; x2: number; y2: number; paired: boolean };

/** dir: +1 draws the base downward off the strand, -1 upward. */
function bases(xs: number[], centre: number, dir: 1 | -1): Base[] {
  return xs.map((x) => {
    const paired = x >= GUIDE_X0 - 0.1 && x <= GUIDE_X1 + 0.1;
    const len = paired ? PAIRED_TICK : UNPAIRED_TICK;
    const m = slope(x);
    const n = Math.hypot(1, m);
    const y = waveY(x, centre);
    return {
      x1: x,
      y1: y,
      x2: x + (-m / n) * len * dir,
      y2: y + (1 / n) * len * dir,
      paired,
    };
  });
}

/** Bases on a shared pitch anchored to the duplex, so they interlock exactly. */
function pitchGrid(anchor: number, from: number, to: number) {
  const xs: number[] = [];
  let x = anchor;
  while (x - PITCH >= from) x -= PITCH;
  for (; x <= to; x += PITCH) xs.push(x);
  return xs;
}

const MRNA_PATH = strandPath(0, VB_W, MRNA_Y);
const GUIDE_PATH = strandPath(GUIDE_X0 - 7, GUIDE_X1 + 7, MRNA_Y + DUPLEX_GAP);
const MRNA_BASES = bases(pitchGrid(GUIDE_X0, 8, VB_W - 8), MRNA_Y, 1);
const GUIDE_BASES = bases(
  Array.from({ length: GUIDE_NT }, (_, i) => GUIDE_X0 + i * PITCH),
  MRNA_Y + DUPLEX_GAP,
  -1
);

const LEGEND = [
  { label: "AGT messenger RNA", color: TARGET },
  { label: "CIN-111 guide strand", color: THERAPEUTIC },
];

export function DuplexBinding() {
  return (
    <Reveal variant="fade" className="w-full">
      <div className="overflow-hidden rounded-3xl border border-line bg-white/80 px-5 py-8 sm:px-10 sm:py-11">
        {/* On a phone the full strand shrinks to hairlines, so the frame crops
            to the duplex instead: the SVG holds a minimum width and the
            container clips it evenly around the centred binding site. */}
        <div className="flex justify-center overflow-hidden">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-auto w-full min-w-[600px] max-w-none"
          role="img"
          aria-label="The CIN-111 guide strand base-pairs with a complementary site on AGT messenger RNA, forming a duplex."
        >
          <defs>
            <radialGradient id="duplex-halo-fill">
              <stop offset="0%" stopColor={THERAPEUTIC} stopOpacity="0.5" />
              <stop offset="100%" stopColor={THERAPEUTIC} stopOpacity="0" />
            </radialGradient>
            {/* The transcript runs far past the frame, so it dissolves at
                both ends rather than stopping at a hard cap. */}
            <linearGradient id="duplex-edge-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#000" />
              <stop offset="9%" stopColor="#fff" />
              <stop offset="91%" stopColor="#fff" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
            <mask id="duplex-edge-mask">
              <rect
                x="0"
                y="0"
                width={VB_W}
                height={VB_H}
                fill="url(#duplex-edge-grad)"
              />
            </mask>
          </defs>

          {/* Halo over the bound site: the silencing event */}
          <ellipse
            className="duplex-halo"
            cx={(GUIDE_X0 + GUIDE_X1) / 2}
            cy={MRNA_Y + DUPLEX_GAP / 2}
            rx={(GUIDE_X1 - GUIDE_X0) / 2 + 60}
            ry="70"
            fill="url(#duplex-halo-fill)"
          />

          {/* Target: AGT mRNA */}
          <g mask="url(#duplex-edge-mask)">
            {MRNA_BASES.map((b, i) => (
              <line
                key={`m${i}`}
                className="duplex-base"
                style={{ "--i": i } as CSSProperties}
                pathLength={1}
                x1={b.x1}
                y1={b.y1}
                x2={b.x2}
                y2={b.y2}
                stroke={TARGET}
                strokeOpacity={b.paired ? 0.95 : 0.3}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            ))}
            <path
              className="duplex-line"
              pathLength={1}
              d={MRNA_PATH}
              fill="none"
              stroke={TARGET}
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Therapeutic: the CIN-111 guide strand, docking from below */}
          <g className="duplex-guide">
            {GUIDE_BASES.map((b, i) => (
              <line
                key={`g${i}`}
                className="duplex-base"
                style={{ "--i": i } as CSSProperties}
                pathLength={1}
                x1={b.x1}
                y1={b.y1}
                x2={b.x2}
                y2={b.y2}
                stroke={THERAPEUTIC}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            ))}
            <path
              className="duplex-line"
              pathLength={1}
              d={GUIDE_PATH}
              fill="none"
              stroke={THERAPEUTIC}
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
          {LEGEND.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2.5 text-sm text-body"
            >
              <span
                aria-hidden
                className="h-2.5 w-7 rounded-full"
                style={{ background: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
