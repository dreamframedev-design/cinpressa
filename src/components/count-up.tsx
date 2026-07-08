"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric value up from zero when it scrolls into view. Preserves any
 * non-numeric prefix (e.g. "~") and decimal precision from the source string.
 *
 * SSR renders the final value, so the number is correct without JS and under
 * reduced motion; the count-up is a progressive enhancement only.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

    // Hidden off-screen: reset to zero without a visible flash.
    setDisplay(format(0));

    let raf = 0;
    let start = 0;
    const duration = 1400;

    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      // Exponential ease-out, matching --ease-brand.
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(format(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        raf = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
