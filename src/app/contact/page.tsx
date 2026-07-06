import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
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
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-mist">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-12%] top-[-10%] h-[640px] w-[640px] rounded-full opacity-55"
            style={{
              background:
                "radial-gradient(circle, rgba(190,215,236,0.45) 0%, rgba(190,215,236,0) 65%)",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-6 pb-24 pt-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10 lg:pt-44">
            <div>
              <Reveal variant="draw">
                <span aria-hidden className="block h-px w-12 bg-orange" />
              </Reveal>
              <Reveal variant="fade" delay={80}>
                <p className="mt-6 text-[0.72rem] font-medium uppercase tracking-[0.26em] text-blue">
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
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                    Parent company
                  </p>
                  <p className="mt-2 text-sm text-body">
                    CinRx Pharma · Cincinnati, Ohio, USA
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal variant="rise" delay={200}>
              <div className="rounded-3xl border border-line bg-white p-7 shadow-[0_30px_60px_-40px_rgba(13,35,66,0.25)] sm:p-10">
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
