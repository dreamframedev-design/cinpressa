import Link from "next/link";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/arrow-icon";

export const metadata: Metadata = {
  title: "About",
  description:
    "CinPressa is powered by CinRx Pharma's development engine and led by the founding team behind CinCor's baxdrostat program and its $1.9B exit to AstraZeneca.",
};

const disciplines = [
  "Clinical strategy",
  "Translational science",
  "Toxicology",
  "CMC",
  "Pharmacology",
  "Data management",
  "Finance",
  "Business development",
];

export default function AboutPage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        <PageHero
          eyebrow="CinPressa leadership"
          title="The team behind CIN-111"
          subtitle="CinPressa is powered by CinRx Pharma's proven development engine and led by the founding team behind CinCor Pharma's baxdrostat program and its $1.9 billion exit to AstraZeneca."
        />

        {/* Track record + team */}
        <Section>
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <SectionHeader
                as="h2"
                eyebrow="Track record"
                title="A team that has done this before"
              />
              <Reveal variant="fade" delay={120}>
                <p className="mt-7 text-base leading-relaxed text-body">
                  Our cross-functional team spans scientific, technical, and
                  clinical development expertise. The scalable hub-and-spoke
                  CinRx model has put more than $300 million to work across
                  multiple portfolio companies, with an embedded partnership from
                  Medpace CRO for operational efficiency and trial quality.
                </p>
              </Reveal>

              <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-px overflow-hidden">
                {disciplines.map((d, i) => (
                  <Reveal
                    key={d}
                    variant="fade"
                    delay={i * 50}
                    className="flex items-center gap-3 border-t border-line py-3.5"
                  >
                    <span aria-hidden className="h-1 w-1 rounded-full bg-sky" />
                    <span className="text-sm text-body">{d}</span>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Reveal
                variant="rise"
                className="rounded-2xl border border-line bg-mist/60 p-8"
              >
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-extralight leading-none tracking-tight text-blue">
                  $1.9B
                </p>
                <p className="mt-4 text-sm leading-relaxed text-body">
                  CinCor Pharma&rsquo;s baxdrostat exit to AstraZeneca, led by
                  CinPressa&rsquo;s founding team.
                </p>
              </Reveal>
              <Reveal
                variant="rise"
                delay={100}
                className="rounded-2xl border border-line bg-mist/60 p-8"
              >
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-extralight leading-none tracking-tight text-blue">
                  $300M+
                </p>
                <p className="mt-4 text-sm leading-relaxed text-body">
                  Deployed across multiple CinCos through the scalable
                  hub-and-spoke CinRx model.
                </p>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* How we operate */}
        <Section tone="mist">
          <SectionHeader
            eyebrow="How we operate"
            title="Focused program. Disciplined execution."
            subtitle="CinPressa is built to advance a single, high-potential therapeutic program with clarity and discipline."
          />
          <Reveal variant="fade" delay={120}>
            <p className="mt-10 max-w-3xl text-base leading-relaxed text-body">
              We are deliberate in how we design studies, interpret emerging
              data, and make decisions as CIN-111 progresses from preclinical
              work into clinical development. The goal is to translate a strong
              mechanistic rationale and promising non-human primate data into
              meaningful clinical outcomes for patients with hypertension.
            </p>
          </Reveal>
        </Section>

        {/* CinRx connection */}
        <Section>
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <div>
              <SectionHeader
                eyebrow="CinRx connection"
                title="A CinRx portfolio company"
                subtitle="CinPressa Pharma is a CinRx portfolio company, leveraging shared capital, expertise, and infrastructure."
              />
              <Reveal variant="fade" delay={120}>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-body">
                  This structure allows CinPressa to focus on the science and
                  development strategy for CIN-111 while drawing on CinRx&rsquo;s
                  broader operating capabilities and experience accelerating
                  high-impact medicines.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={160}>
                <a
                  href="https://cinrx.com"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-blue transition-colors hover:text-ink"
                >
                  <span className="link-underline">Visit CinRx Pharma</span>
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </Reveal>
            </div>

            <Reveal variant="rise" delay={160}>
              <CinRxModel />
            </Reveal>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Compact hub-and-spoke illustration of the CinRx portfolio model. */
function CinRxModel() {
  const nodes = [
    { x: 200, y: 46, label: "CinPressa", primary: true },
    { x: 309, y: 125, label: "CinCo" },
    { x: 268, y: 253, label: "CinCo" },
    { x: 132, y: 253, label: "CinCo" },
    { x: 91, y: 125, label: "CinCo" },
  ];

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <svg viewBox="0 0 400 300" className="h-auto w-full" role="img" aria-label="CinRx hub-and-spoke portfolio model with CinPressa as a portfolio company.">
        {/* Spokes */}
        {nodes.map((n) => (
          <line
            key={`spoke-${n.label}-${n.x}`}
            x1="200"
            y1="150"
            x2={n.x}
            y2={n.y}
            stroke={n.primary ? "#2261AD" : "#DCE7F1"}
            strokeWidth="1"
            strokeDasharray={n.primary ? undefined : "1 6"}
          />
        ))}

        {/* Outer nodes */}
        {nodes.map((n) => (
          <g key={`node-${n.label}-${n.x}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r="27"
              fill={n.primary ? "#2261AD" : "#ffffff"}
              stroke={n.primary ? "#2261AD" : "#DCE7F1"}
              strokeWidth="1"
            />
            <text
              x={n.x}
              y={n.y + 3.5}
              textAnchor="middle"
              fontSize={n.primary ? "10" : "9.5"}
              fontWeight={n.primary ? "600" : "400"}
              fill={n.primary ? "#ffffff" : "#5b6e83"}
            >
              {n.label}
            </text>
          </g>
        ))}

        {/* Hub */}
        <circle cx="200" cy="150" r="42" fill="#0d2342" />
        <text x="200" y="147" textAnchor="middle" fontSize="13" fontWeight="600" fill="#ffffff">
          CinRx
        </text>
        <text x="200" y="162" textAnchor="middle" fontSize="8.5" fill="#7EAADB" letterSpacing="0.5">
          SHARED ENGINE
        </text>
      </svg>
      <p className="mt-4 border-t border-line pt-4 text-center text-xs leading-relaxed text-muted">
        Shared capital, expertise, and infrastructure across the portfolio.
      </p>
    </div>
  );
}
