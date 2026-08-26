import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ContactBloom } from "@/components/contact-bloom";
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
      <SiteNav />

      <main>
        {/* Two hairline fields in a row died on this page: drafted restraint
            reads as a blank page here. This is the opposite pole of the same
            brand — the mark's own ovals at architectural scale, multiply
            overlaps pooling into new colour the way the logo makes every
            interior colour it has. Bold ink, no washes over it: the white
            veils that quieted the old fields are exactly what made them
            invisible, so the colour runs to every edge. See contact-bloom.tsx. */}
        <section className="relative overflow-hidden bg-white">
          <ContactBloom className="absolute inset-0" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-6 pb-24 pt-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10 lg:pt-44">
            <div>
              <Reveal variant="draw">
                <span
                  aria-hidden
                  className="block h-px w-12"
                  style={{ background: "var(--color-accent, #6771b5)" }}
                />
              </Reveal>
              <Reveal variant="fade" delay={80}>
                <p className="mt-6 text-[0.92rem] font-semibold uppercase tracking-[0.22em] text-blue">
                  Connect
                </p>
              </Reveal>
              <Reveal variant="rise-blur" delay={140}>
                <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.06] tracking-tight text-ink">
                  Start a conversation
                </h1>
              </Reveal>
              <Reveal variant="fade" delay={220}>
                <p className="mt-7 max-w-md text-lg leading-relaxed text-body">
                  For business, partnering, or general inquiries, please reach
                  out through the contact form. CinPressa welcomes discussions
                  with partners interested in advancing a differentiated
                  AGT-targeting siRNA for hypertension.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={360}>
                <div className="mt-10 border-t border-line pt-8">
                  <p className="text-[0.92rem] font-semibold uppercase tracking-[0.16em] text-body">
                    Parent company
                  </p>
                  <p className="mt-2 text-base text-body">
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
