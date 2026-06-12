"use client";

import { createElement, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /**
   * rise: lift + fade · rise-blur: lift + focus pull (section headings)
   * fade: opacity only · draw: hairlines grow from the left
   */
  variant?: "rise" | "rise-blur" | "fade" | "draw";
  /** Stagger offset in ms */
  delay?: number;
  as?: "div" | "li" | "span";
  className?: string;
};

export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  as = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only elements still below the fold get hidden; without JS (or before
    // hydration) everything stays visible.
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    el.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("reveal-in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      "data-reveal": variant,
      className,
      style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
    },
    children
  );
}
