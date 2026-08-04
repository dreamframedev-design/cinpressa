import type { Metadata } from "next";
import { SiteLogo } from "@/components/site-logo";
import { MarkArt } from "@/components/geometry";

export const metadata: Metadata = {
  title: "Brand reference",
  description: "Internal brand reference for CinPressa Pharma.",
  robots: { index: false, follow: false },
};

/** Heights the lockup is actually used at, in px. */
const SIZES = [
  { h: 46, label: "46px, nav at top of page" },
  { h: 36, label: "36px, nav when scrolled" },
  { h: 80, label: "80px" },
  { h: 160, label: "160px" },
];

/** In MARK_PATHS order, so this doubles as a key to the artwork. */
const PETALS = [
  "#b0dbbc", "#faa81a", "#2162ae", "#97dbf8", "#1884c6",
  "#bed9ef", "#1b96d3", "#6bb2e2", "#abddf7", "#1dade4",
  "#0374bb", "#7ca9db", "#6772b6",
];

const PALETTE = [
  {
    group: "Core",
    note: "The spec sheet defines four. Green and indigo went unused for a long time.",
    swatches: [
      { hex: "#2261AD", name: "blue", use: "Body text safe, 6.6:1" },
      { hex: "#F9A81A", name: "orange", use: "Punctuation only, never a surface" },
      { hex: "#AFDBBC", name: "green", use: "Surface only, 1.5:1" },
      { hex: "#6771B5", name: "indigo", use: "Body text safe, 4.6:1" },
    ],
  },
  {
    group: "Named support",
    note: "",
    swatches: [
      { hex: "#3AAED8", name: "sky", use: "Surface only, 2.6:1" },
      { hex: "#BED7EC", name: "pale", use: "Surface only" },
      { hex: "#A3ABAE", name: "stone", use: "Neutral, comparator series" },
    ],
  },
  {
    group: "Icon and supporting ladder",
    note: "What the mark's petals are drawn from.",
    swatches: [
      { hex: "#0473BB", name: "cobalt", use: "Body text safe, 5.0:1" },
      { hex: "#0783C6", name: "ocean", use: "Large text only, 4.1:1" },
      { hex: "#1596D4", name: "azure", use: "Large text only, 3.3:1" },
      { hex: "#1EAEE5", name: "cyan", use: "Surface only" },
      { hex: "#7EAADB", name: "periwinkle", use: "Surface only" },
      { hex: "#95DAF8", name: "frost", use: "Surface only" },
      { hex: "#AADBF6", name: "cloud", use: "Surface only" },
    ],
  },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-body">
      {children}
    </p>
  );
}

export default function BrandPage() {
  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <header className="border-b border-line pb-10">
          <p className="text-[0.84rem] font-semibold uppercase tracking-[0.2em] text-blue">
            Internal reference
          </p>
          <h1 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-light leading-tight tracking-tight text-ink">
            Brand reference
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">
            Not linked from the nav and excluded from search.
          </p>
        </header>

        {/* ---- Lockup ---- */}
        <section className="border-b border-line py-14">
          <h2 className="text-2xl font-light tracking-tight text-ink">Lockup</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-body">
            Live vector lockup: the mark artwork plus Stem Extra Light. Measured
            against the original raster at a 768&times;160 reference: mark 152px
            tall, 28px gap, wordmark 597px wide with an 83px cap height,
            &ldquo;pharma&rdquo; 136px and right-aligned to the wordmark.
          </p>

          <div className="mt-10 space-y-10">
            {SIZES.map((size) => (
              <div key={size.h}>
                <Label>{size.label}</Label>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
                  <div className="w-max min-w-full p-8">
                    <SiteLogo height={size.h} />
                  </div>
                </div>
              </div>
            ))}

            <div>
              <Label>On deep navy</Label>
              <div className="mt-4 overflow-x-auto rounded-2xl bg-deep">
                <div className="w-max min-w-full p-8">
                  <SiteLogo height={80} />
                </div>
              </div>
              <p className="mt-3 text-base leading-relaxed text-body">
                The &ldquo;pharma&rdquo; line is ink, so it disappears on dark.
                The footer uses type rather than the lockup for that reason. A
                reversed variant is worth adding if the lockup is ever needed on
                a dark surface.
              </p>
            </div>
          </div>
        </section>

        {/* ---- Type ---- */}
        <section className="border-b border-line py-14">
          <h2 className="text-2xl font-light tracking-tight text-ink">
            Typefaces
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            <div className="bg-white p-8">
              <Label>Wordmark</Label>
              <p className="mt-4 text-xl font-medium text-ink">
                Stem Extra Light
              </p>
              <p className="mt-3 text-base leading-relaxed text-body">
                ParaType. Self-hosted from{" "}
                <code className="rounded bg-mist px-1.5 py-0.5 text-[0.85em]">
                  src/fonts/stem-extralight.woff2
                </code>
                . Only the 200 weight is in the repo, so the
                &ldquo;pharma&rdquo; line renders at 200. Adding Stem Light or
                Regular would allow real weight there.
              </p>
            </div>
            <div className="bg-white p-8">
              <Label>Everything else</Label>
              <p className="mt-4 text-xl font-medium text-ink">Montserrat</p>
              <p className="mt-3 text-base leading-relaxed text-body">
                Stand-in for Gotham, which the spec sheet names as the brand
                face. Headings, body copy and UI. Stem is used for the lockup
                and nothing else.
              </p>
            </div>
          </div>
        </section>

        {/* ---- Mark ---- */}
        <section className="border-b border-line py-14">
          <h2 className="text-2xl font-light tracking-tight text-ink">The mark</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-body">
            Four overlapping ovals, supplied already flattened into thirteen
            boolean fragments. Because the ovals no longer exist as objects, the
            mark animates as one rigid body rather than per-shape. Animating the
            ovals independently needs the layered source file.
          </p>
          <div className="mt-10 grid gap-8 rounded-2xl border border-line bg-white p-8 lg:grid-cols-[260px_1fr] lg:items-center">
            <MarkArt variant="brand" animate tight className="h-auto w-full" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {PETALS.map((hex, i) => (
                <div key={`${hex}-${i}`} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-6 w-6 shrink-0 rounded-md border border-line"
                    style={{ background: hex }}
                  />
                  <span className="font-mono text-base text-body">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Palette ---- */}
        <section className="py-14">
          <h2 className="text-2xl font-light tracking-tight text-ink">Palette</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-body">
            Transcribed from the official logo spec sheet. Contrast ratios are
            against white; anything marked surface-only must never be set as
            text on a light background.
          </p>

          <div className="mt-10 space-y-12">
            {PALETTE.map((group) => (
              <div key={group.group}>
                <Label>{group.group}</Label>
                {group.note ? (
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-body">
                    {group.note}
                  </p>
                ) : null}
                <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                  {group.swatches.map((s) => (
                    <div key={s.hex} className="bg-white p-6">
                      <span
                        aria-hidden
                        className="block h-16 w-full rounded-lg border border-line"
                        style={{ background: s.hex }}
                      />
                      <p className="mt-4 text-base font-medium text-ink">
                        {s.name}
                      </p>
                      <p className="mt-1 font-mono text-base text-body">
                        {s.hex}
                      </p>
                      <p className="mt-2 text-base leading-relaxed text-body">
                        {s.use}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
