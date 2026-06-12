import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Contact — CinPressa Pharma",
  description:
    "Get in touch with CinPressa Pharma for partnering, investment, and investigator inquiries.",
};

export default function ContactPage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-mist">
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-0 h-[640px] w-[640px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(190,215,236,0.45) 0%, rgba(190,215,236,0) 65%)",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-6 pb-24 pt-36 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10">
            <div>
              <Reveal variant="draw">
                <span aria-hidden className="block h-px w-12 bg-orange" />
              </Reveal>
              <Reveal variant="rise-blur" delay={90}>
                <h1 className="mt-8 text-4xl font-light leading-[1.1] tracking-tight text-ink md:text-5xl">
                  Get in touch
                </h1>
              </Reveal>
              <Reveal variant="fade" delay={200}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-body">
                  Partnering, investor, and investigator inquiries are welcome.
                  Share a few details and your message will be routed to the
                  right team.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={300}>
                <div className="mt-10 space-y-6 border-t border-line pt-10">
                  <div>
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                      Parent company
                    </p>
                    <p className="mt-2 text-sm text-body">
                      CinRx Pharma · Cincinnati, Ohio, USA
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal variant="rise" delay={160}>
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
