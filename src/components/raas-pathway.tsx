import { Reveal } from "@/components/reveal";

type Node = {
  name: string;
  sub: string;
  tag?: { label: string; tone: "primary" | "muted" };
  highlight?: boolean;
  outcome?: boolean;
};

const cascade: Node[] = [
  {
    name: "Angiotensinogen (AGT)",
    sub: "The precursor of the entire RAAS cascade, synthesized in the liver.",
    tag: { label: "CIN-111 silences AGT here", tone: "primary" },
    highlight: true,
  },
  {
    name: "Angiotensin I",
    sub: "Cleaved from AGT by renin.",
  },
  {
    name: "Angiotensin II",
    sub: "Converted from angiotensin I by ACE; drives vasoconstriction.",
    tag: { label: "ACE inhibitors · ARBs act here", tone: "muted" },
  },
  {
    name: "Aldosterone",
    sub: "Released in response to angiotensin II; retains sodium and water.",
  },
  {
    name: "Elevated blood pressure",
    sub: "The downstream clinical consequence of RAAS activity.",
    outcome: true,
  },
];

export function RaasPathway() {
  return (
    <div className="rounded-3xl border border-line bg-white/60 p-6 sm:p-9">
      <div className="mb-8 flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-blue/40" />
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-blue">
          The RAAS cascade
        </p>
      </div>

      <ol>
        {cascade.map((node, i) => {
          const isLast = i === cascade.length - 1;
          return (
            <Reveal
              key={node.name}
              as="li"
              variant="rise"
              delay={i * 90}
              className="relative grid grid-cols-[22px_1fr] gap-x-4 sm:gap-x-5"
            >
              {/* Spine + node marker */}
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className={
                    node.highlight
                      ? "relative z-10 mt-1 flex h-[22px] w-[22px] items-center justify-center rounded-full"
                      : node.outcome
                        ? "relative z-10 mt-1 h-[22px] w-[22px] rounded-full bg-blue ring-4 ring-white"
                        : "relative z-10 mt-1 h-[22px] w-[22px] rounded-full border border-blue/50 bg-white ring-4 ring-white"
                  }
                >
                  {node.highlight ? (
                    <>
                      <span className="absolute inset-0 rounded-full border-2 border-orange" />
                      <span className="absolute -inset-1 rounded-full bg-orange/10" />
                      <span className="h-2 w-2 rounded-full bg-orange" />
                    </>
                  ) : node.outcome ? null : (
                    <span className="absolute inset-[6px] rounded-full bg-blue/60" />
                  )}
                </span>
                {!isLast ? (
                  <span
                    aria-hidden
                    className="w-px flex-1 bg-gradient-to-b from-blue/50 to-sky/40"
                  />
                ) : null}
              </div>

              {/* Node content */}
              <div className={isLast ? "pb-0" : "pb-9"}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3
                    className={`text-lg font-normal tracking-tight ${
                      node.outcome ? "text-blue" : "text-ink"
                    }`}
                  >
                    {node.name}
                  </h3>
                  {node.tag ? (
                    <span
                      className={
                        node.tag.tone === "primary"
                          ? "inline-flex items-center gap-1.5 rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#b06f00]"
                          : "inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted"
                      }
                    >
                      {node.tag.tone === "primary" ? (
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange" />
                      ) : null}
                      {node.tag.label}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-body">
                  {node.sub}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>

      <div className="mt-4 grid gap-4 border-t border-line pt-7 sm:grid-cols-2">
        <div className="flex gap-3">
          <span aria-hidden className="mt-1 h-4 w-1 shrink-0 rounded-full bg-orange" />
          <p className="text-sm leading-relaxed text-body">
            <span className="font-medium text-ink">Upstream.</span> CIN-111
            suppresses AGT production in the liver, shutting the cascade off at
            its source.
          </p>
        </div>
        <div className="flex gap-3">
          <span aria-hidden className="mt-1 h-4 w-1 shrink-0 rounded-full bg-line" />
          <p className="text-sm leading-relaxed text-body">
            <span className="font-medium text-ink">Downstream.</span> ACE
            inhibitors and ARBs act late in the pathway, leaving residual
            activity and rebound over time.
          </p>
        </div>
      </div>
    </div>
  );
}
