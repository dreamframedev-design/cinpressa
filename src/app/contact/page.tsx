import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Caustics } from "@/components/caustics";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with the CinPressa team. Partnering, investment, and investigator inquiries into the CIN-111 AGT siRNA program are welcome.",
};

export default function ContactPage() {
  return (
    <div id="top">
      {/* The hero is on the deep ground, so the bar carries the dark treatment
          until the visitor scrolls past it. */}
      <SiteNav tone="dark" />

      <main>
        {/* The page inverts onto the deep ground. Not for drama: a frosted panel needs
            real luminance range behind it or it is a grey rectangle, and the caustic
            field only has range on dark. The artwork and the glass are one decision. */}
        <section className="relative overflow-hidden bg-deep">
          <Caustics className="pointer-events-none absolute inset-0" />
          {/* Two washes over the field. The first sinks the left column so the copy
              has a quiet ground to sit on; the second darkens the extremes so the
              caustics read as depth rather than as a busy edge-to-edge texture. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(8,25,47,0.94) 0%, rgba(8,25,47,0.86) 28%, rgba(8,25,47,0.5) 52%, rgba(8,25,47,0.34) 74%, rgba(8,25,47,0.62) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 62% 42%, rgba(8,25,47,0) 0%, rgba(8,25,47,0.35) 62%, rgba(8,25,47,0.85) 100%)",
            }}
          />

          <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-6 pb-24 pt-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10 lg:pt-44">
            <div>
              <Reveal variant="draw">
                <span
                  aria-hidden
                  className="block h-px w-12"
                  style={{ background: "var(--color-accent-dark, #95daf8)" }}
                />
              </Reveal>
              <Reveal variant="fade" delay={80}>
                <p className="mt-6 text-[0.84rem] font-semibold uppercase tracking-[0.22em] text-frost">
                  Connect
                </p>
              </Reveal>
              <Reveal variant="rise-blur" delay={140}>
                <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.06] tracking-tight text-white">
                  Contact CinPressa
                </h1>
              </Reveal>
              <Reveal variant="fade" delay={220}>
                <p className="mt-7 max-w-md text-lg leading-relaxed text-white/80">
                  Start a conversation with the team.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={300}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                  For business, partnering, or general inquiries, please reach
                  out through the contact form. CinPressa welcomes discussions
                  with partners interested in advancing a differentiated
                  AGT-targeting siRNA for hypertension.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={360}>
                <div className="mt-10 border-t border-white/15 pt-8">
                  <p className="text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-frost/80">
                    Parent company
                  </p>
                  <p className="mt-2 text-base text-white/80">
                    CinRx Pharma · Cincinnati, Ohio, USA
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal variant="rise" delay={200}>
              <div className="glass-panel p-7 sm:p-10">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
