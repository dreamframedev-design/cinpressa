"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { SiteLogo } from "@/components/site-logo";

const links = [
  { href: "/home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/science", label: "Science" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * The site header.
 *
 * `tone="dark"` adapts the bar to a page whose hero sits on the deep ground, the same
 * section-adaptive idea CinRx's nav uses. It only takes effect while the bar is
 * TRANSPARENT: scrolling past the hero, or opening the mobile menu, makes the bar solid
 * white, at which point the default ink treatment is correct again. So the dark state
 * is scoped to exactly the region that needs it and nothing else has to know about it.
 */
export function SiteNav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close the mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/home" && pathname.startsWith(`${href}/`));

  const solid = scrolled || menuOpen;
  // Dark treatment applies only over the hero. Once `solid` the bar is white again.
  const onDark = tone === "dark" && !solid;

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="absolute inset-x-0 top-0 h-px" />
      <header
        className={`anim-nav fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-line bg-white/88 shadow-[0_12px_32px_-24px_rgba(13,35,66,0.25)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Scrim: over the hero's colour field the lockup and links had nothing
            clean to sit on. Fades out once the solid bar takes over. Inverts with the
            tone so it still separates the bar from an inverted hero. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-[190%] bg-gradient-to-b transition-opacity duration-500 ${
            onDark
              ? "from-deep/95 via-deep/55 to-transparent"
              : "from-white/92 via-white/55 to-transparent"
          } ${solid ? "opacity-0" : "opacity-100"}`}
        />

        <div
          className={`relative mx-auto flex max-w-7xl items-center justify-between px-6 transition-[height] duration-500 ease-brand lg:px-10 ${
            scrolled ? "h-[66px]" : "h-[88px]"
          }`}
        >
          <Link href="/home" aria-label="CinPressa Pharma, home" className="shrink-0">
            <SiteLogo
              height={scrolled ? 36 : 46}
              mark="live"
              tone={onDark ? "light" : "dark"}
              className="transition-[font-size] duration-500 ease-brand"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex lg:gap-9">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${onDark ? "nav-link-dark" : ""}`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`btn-primary btn-sm group ${onDark ? "btn-on-dark" : ""}`}
            >
              Partner with us
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative z-10 flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-5 flex-col items-end gap-[5px]">
              <span
                className={`h-px w-5 origin-right transition-all duration-300 ${
                  onDark ? "bg-white" : "bg-ink"
                } ${menuOpen ? "translate-y-[3px] -rotate-45" : ""}`}
              />
              <span
                className={`h-px transition-all duration-300 ${
                  onDark ? "bg-white" : "bg-ink"
                } ${menuOpen ? "w-5 -translate-y-[3px] rotate-45" : "w-3.5"}`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile menu panel */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-deep/20 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <nav
          aria-label="Primary"
          className={`absolute inset-x-0 top-0 origin-top bg-white px-6 pb-8 pt-24 shadow-[0_24px_48px_-24px_rgba(13,35,66,0.35)] transition-all duration-[400ms] ease-brand ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <ul className="divide-y divide-line/70">
            {links.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between py-4 text-lg font-light tracking-tight text-ink"
                  aria-current={isActive(link.href) ? "page" : undefined}
                  style={{ transitionDelay: `${i * 20}ms` }}
                >
                  <span className={isActive(link.href) ? "text-blue" : ""}>
                    {link.label}
                  </span>
                  <ArrowIcon
                    className={`h-3.5 w-3.5 transition-opacity ${
                      isActive(link.href) ? "text-blue opacity-100" : "opacity-30"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="btn-primary mt-8 w-full justify-center"
          >
            Partner with us
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </div>
    </>
  );
}
