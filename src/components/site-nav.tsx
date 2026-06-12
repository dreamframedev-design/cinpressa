"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/arrow-icon";

export function SiteNav() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "24px 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="absolute inset-x-0 top-0 h-px" />
      <header
        className={`anim-nav fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-white/85 shadow-[0_12px_32px_-24px_rgba(13,35,66,0.25)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[height] duration-500 ease-brand lg:px-10 ${
            scrolled ? "h-[60px]" : "h-[76px]"
          }`}
        >
          <a href="#top" aria-label="CinPressa Pharma, back to top" className="shrink-0">
            <Image
              src="/cinpressa-logo.png"
              alt="CinPressa Pharma"
              width={768}
              height={160}
              priority
              className={`w-auto transition-all duration-500 ease-brand ${
                scrolled ? "h-6 md:h-7" : "h-7 md:h-8"
              }`}
            />
          </a>
          <nav aria-label="Primary" className="flex items-center gap-6 lg:gap-8">
            <a href="https://cinrx.com" className="nav-link hidden sm:block">
              CinRx
            </a>
            <a
              href="https://cinrx.com/contact#partnering"
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-blue px-5 py-2.5 text-[0.8rem] font-medium text-white transition-all duration-300 hover:bg-ink hover:shadow-[0_14px_28px_-14px_rgba(34,97,173,0.55)] active:translate-y-px"
            >
              Partner with us
              <ArrowIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
