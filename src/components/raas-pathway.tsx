import { Reveal } from "@/components/reveal";
import { CascadeFlow, type FlowTiming } from "@/components/cascade-flow";

type Node = {
  name: string;
  sub: string;
  /**
   * ONE COLOUR DOWN THE WHOLE CASCADE, and it is the signal's own gold. This
   * used to descend the logo ladder - amber, then deep blue, azure, a pale
   * blue, and violet at the outcome - which made the spine look like five
   * unrelated markers that happened to be strung together, and put the
   * travelling light in a colour none of the nodes it passed were drawn in.
   * Matching the CinRx pathway: gold dots on a gold line, lit by a gold signal.
   */
  accent: string;
  tag?: { label: string; tone: "primary" | "muted" };
  highlight?: boolean;
};

const cascade: Node[] = [
  {
    name: "Angiotensinogen (AGT)",
    sub: "The precursor of the entire RAAS cascade, synthesized in the liver.",
    tag: { label: "CIN-111 silences AGT here", tone: "primary" },
    accent: "#f9a81a",
    highlight: true,
  },
  {
    name: "Angiotensin I",
    sub: "Cleaved from AGT by renin.",
    accent: "#f9a81a",
  },
  {
    name: "Angiotensin II",
    sub: "Converted from angiotensin I by ACE; drives vasoconstriction.",
    tag: { label: "ACE inhibitors · ARBs act here", tone: "muted" },
    accent: "#f9a81a",
  },
  {
    name: "Aldosterone",
    sub: "Released in response to angiotensin II; retains sodium and water.",
    accent: "#f9a81a",
  },
  {
    name: "Elevated blood pressure",
    sub: "The downstream clinical consequence of RAAS activity.",
    accent: "#f9a81a",
  },
];

/**
 * One descent of the signal, in cycle fractions. Equal time per step (rather
 * than equal speed) is the point: the pathway is a sequence of five events, so
 * each one gets the same beat regardless of how many lines its copy runs to.
 * The tail of the cycle is deliberately empty — the diagram is allowed to sit
 * still and be read before the light comes round again.
 */
const FLOW: FlowTiming = { cycle: 8.4, lead: 0.05, travel: 0.76, dwell: 0.24 };

/**
 * CONSOLIDATED FOR A COLUMN. This ran the full measure as a single stack with
 * its prose above it, which made a five-step diagram the tallest thing on its
 * page - the note was simply that it was too large. It now sits in the right
 * column of the mechanism section with the paragraphs beside it, so every
 * dimension came down to suit a narrower, shorter box: padding, the gap under
 * the column heads, the step between nodes, the node heading, the tags, and the
 * footer panels. Nothing was removed. The five steps, both intervention tags
 * and both panels are all still here; they are set tighter.
 *
 * Card stays solid white rather than translucent. It was holding a violet
 * outcome heading that needed a known background to clear AA; that heading is
 * ink now, but the reason survives the change - the gold markers and the
 * travelling light are both tuned against white, and a wash under them shifts
 * every one of them.
 */
export function RaasPathway() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-[0_36px_72px_-52px_rgba(13,35,66,0.42)] sm:p-7">
      {/* Warmth pooled at the upstream end of the card, under the one node
          CIN-111 acts on. Far below the threshold of a visible shape — it only
          weights the top of the diagram toward the amber the tag and the
          signal are drawn in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-orange/[0.09] blur-3xl"
      />

      {/* Two column heads. The tags below sit at the far right of their rows,
          which only reads as a deliberate second column once something names
          it — and only at widths where the tag still fits beside its node, so
          the label is scoped to exactly the layout it describes. */}
      <div className="relative mb-7 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-blue/40" />
          <p className="text-[0.86rem] font-semibold uppercase tracking-[0.19em] text-blue">
            The RAAS cascade
          </p>
        </div>
        <p className="hidden text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-muted xl:block">
          Where therapy acts
        </p>
      </div>

      {/* The spine's own coordinate space. CascadeFlow measures the node
          markers inside this box and lays its light over them; the list below
          is complete without it. */}
      <div className="relative">
        <CascadeFlow {...FLOW} />

        <ol>
          {cascade.map((node, i) => {
            const isLast = i === cascade.length - 1;
            return (
              <Reveal
                key={node.name}
                as="li"
                variant="rise"
                delay={i * 90}
                className="relative grid grid-cols-[24px_1fr] gap-x-5 sm:gap-x-7"
              >
                {/* Spine + node marker */}
                <div className="relative flex flex-col items-center">
                  {/* Ignition halo. A sibling rather than a child of the
                      marker so it sits BEHIND the dot's white face: the light
                      spills around a crisp node instead of washing over it. */}
                  <span
                    data-cascade-flare
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1 -ml-3 h-6 w-6 rounded-full bg-[radial-gradient(circle,rgba(249,168,26,0.6)_0%,rgba(249,168,26,0.22)_45%,rgba(249,168,26,0)_72%)] opacity-0"
                  />
                  <span
                    data-cascade-node
                    aria-hidden
                    className={
                      node.highlight
                        ? "relative z-10 mt-1 flex h-6 w-6 items-center justify-center rounded-full"
                        : "relative z-10 mt-1 h-6 w-6 rounded-full ring-4 ring-white"
                    }
                    style={
                      node.highlight
                        ? undefined
                        : { background: "#fff", border: `1px solid ${node.accent}` }
                    }
                  >
                    {node.highlight ? (
                      <>
                        <span className="pulse-ring-el absolute inset-0 rounded-full border-2 border-orange" />
                        <span className="absolute inset-0 rounded-full border-2 border-orange" />
                        <span className="h-2 w-2 rounded-full bg-orange" />
                      </>
                    ) : (
                      <span
                        className="absolute inset-[7px] rounded-full"
                        style={{ background: node.accent }}
                      />
                    )}
                  </span>
                  {/* Held well back from the dots. At full strength a gold rule
                      running the height of the card competes with the markers it
                      is only there to connect, and the travelling light has
                      nothing left to stand out against. */}
                  {!isLast ? (
                    <span
                      aria-hidden
                      className="w-px flex-1"
                      style={{ background: "rgba(249,168,26,0.42)" }}
                    />
                  ) : null}
                </div>

                {/* Node content. The tag holds the far right of the row rather
                    than trailing the heading, so the two points of
                    intervention line up in a column of their own and the
                    single-column card reads across its full width. */}
                <div className={isLast ? "pb-0" : "pb-7"}>
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    {/* No colour override any more. This read violet to pair
                        with a violet dot; the dot is gold now, and gold is not
                        a text colour on white - 2.0:1, and the spec sheet
                        keeps orange off type. */}
                    <h3 className="text-lg font-normal tracking-tight text-ink">
                      {node.name}
                    </h3>
                    {node.tag ? (
                      <span
                        className={
                          node.tag.tone === "primary"
                            ? "inline-flex items-center gap-1.5 rounded-full border border-orange/35 bg-orange/10 px-3 py-1 text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-[#9a5f00]"
                            : "inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-body"
                        }
                      >
                        {node.tag.tone === "primary" ? (
                          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
                        ) : null}
                        {node.tag.label}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-body">
                    {node.sub}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      {/* The argument the diagram is making, stated plainly. Two panels rather
          than two ticked lines: upstream carries the amber it is marked with
          in the cascade above, downstream stays neutral. */}
      <div className="relative mt-8 grid gap-3 border-t border-line pt-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-orange/25 bg-orange/[0.07] p-4">
          <p className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[#9a5f00]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
            Upstream
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-body">
            CIN-111 suppresses AGT production in the liver, shutting the cascade
            off at its source.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-mist p-4">
          <p className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-muted">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-periwinkle" />
            Downstream
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-body">
            ACE inhibitors and ARBs act late in the pathway and do not
            completely suppress it, leaving residual activity.
          </p>
        </div>
      </div>
    </div>
  );
}
