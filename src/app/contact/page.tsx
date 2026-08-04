import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { WaveLines } from "@/components/wave-lines";
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
        {/* Daylight, as the brand asks for. The previous pass took this page dark to
            make the glass work, which fixed the panel and broke everything else: bright
            filigree on deep navy is a swimming pool. The field is line-work now, so it
            needs white under it rather than black behind it. */}
        <section className="relative overflow-hidden bg-white">
          <WaveLines className="absolute inset-0" />
          {/* One wash, weighted left. The copy column gets clean paper; the field is
              left alone on the right where it can be seen properly. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 26%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.2) 72%, rgba(255,255,255,0.45) 100%)",
            }}
          />
          {/* Feather the top and bottom edges so the field arrives and leaves rather
              than being cropped by the section boundary. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
            style={{
              background:
                "linear-gradient(0deg, #ffffff 0%, rgba(255,255,255,0) 100%)",
            }}
          />

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
                <p className="mt-6 text-[0.84rem] font-semibold uppercase tracking-[0.22em] text-blue">
                  Connect
                </p>
              </Reveal>
              <Reveal variant="rise-blur" delay={140}>
                <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.06] tracking-tight text-ink">
                  Contact CinPressa
                </h1>
              </Reveal>
              <Reveal variant="fade" delay={220}>
                <p className="mt-7 max-w-md text-lg leading-relaxed text-body">
                  Start a conversation with the team.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={300}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-body">
                  For business, partnering, or general inquiries, please reach
                  out through the contact form. CinPressa welcomes discussions
                  with partners interested in advancing a differentiated
                  AGT-targeting siRNA for hypertension.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={360}>
                <div className="mt-10 border-t border-line pt-8">
                  <p className="text-[0.84rem] font-semibold uppercase tracking-[0.16em] text-body">
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
