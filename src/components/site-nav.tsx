"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-white/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#top" aria-label="CinPressa Pharma, back to top">
            <Image
              src="/cinpressa-logo.png"
              alt="CinPressa Pharma"
              width={768}
              height={160}
              priority
              className="h-7 w-auto md:h-8"
            />
          </a>
          <nav className="flex items-center gap-8">
            <a
              href="#overview"
              className="hidden text-[0.82rem] font-medium text-body transition-colors hover:text-blue md:block"
            >
              Overview
            </a>
            <a
              href="#model"
              className="hidden text-[0.82rem] font-medium text-body transition-colors hover:text-blue md:block"
            >
              The model
            </a>
            <a
              href="https://cinrx.com"
              className="hidden text-[0.82rem] font-medium text-body transition-colors hover:text-blue sm:block"
            >
              CinRx
            </a>
            <a
              href="https://cinrx.com/contact#partnering"
              className="inline-flex items-center rounded-full bg-blue px-5 py-2.5 text-[0.8rem] font-medium text-white transition-all duration-300 hover:bg-ink active:translate-y-px"
            >
              Partner with us
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
