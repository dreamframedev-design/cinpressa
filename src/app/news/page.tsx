import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "News",
  description:
    "Follow CinPressa's progress as CIN-111 advances through development.",
};

export default function NewsPage() {
  return (
    <div id="top">
      <SiteNav />

      <main>
        <PageHero
          eyebrow="Updates"
          title="News from CinPressa"
          subtitle="Follow CinPressa's progress as CIN-111 advances through development."
        />

        <Section>
          <Reveal variant="fade">
            <p className="max-w-3xl text-lg leading-relaxed text-body">
              This page will highlight company news, financing milestones,
              clinical initiation, study readouts, and other key developments as
              the CIN-111 program moves from preclinical data into first-in-human
              studies and beyond.
            </p>
          </Reveal>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
