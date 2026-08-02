import { cookies } from "next/headers";
import { ACCESS_COOKIE, hasValidAccess } from "@/lib/access";
import { AccessGate } from "@/components/access-gate";
import { ArrowIcon } from "@/components/arrow-icon";
import { MarkArt } from "@/components/geometry";
import { SiteLogo } from "@/components/site-logo";

export default async function SplashPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; locked?: string }>;
}) {
  const [{ from, locked }, cookieStore] = await Promise.all([
    searchParams,
    cookies(),
  ]);
  const unlocked = await hasValidAccess(cookieStore.get(ACCESS_COOKIE)?.value);
  const redirectTo = from && from.startsWith("/") ? from : "/home";
  const bounced = locked === "1" && !unlocked;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-white via-white to-mist">
      {/* Minimal splash header: the full nav lives behind the gate */}
      <header className="anim-nav relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <SiteLogo height={46} />
          <span className="hidden items-center gap-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-body sm:flex">
            <span aria-hidden className="h-px w-6 bg-line" />
            Site in progress
          </span>
        </div>
      </header>

      <main className="relative flex flex-1 items-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-12%] top-1/2 h-[680px] w-[680px] -translate-y-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(190,215,236,0.5) 0%, rgba(190,215,236,0) 65%)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-20">
          <div>
            <p
              className="anim-rise flex items-center gap-3 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-blue"
              style={{ animationDelay: "0.02s" }}
            >
              <span aria-hidden className="h-px w-8 bg-blue/40" />
              A CinRx Portfolio Company
            </p>

            <h1 className="mt-6 text-sky">
              <span
                className="anim-rise block text-[clamp(2.5rem,6.5vw,5.5rem)] font-light uppercase leading-none tracking-[0.04em]"
                style={{ animationDelay: "0.1s" }}
              >
                CinPressa
              </span>
            </h1>

            <p
              className="anim-rise mt-6 max-w-xl text-base leading-relaxed text-body md:text-lg"
              style={{ animationDelay: "0.3s" }}
            >
              A CinRx portfolio company advancing a best-in-class siRNA
              (CIN-111) preventing the formation of angiotensinogen (AGT) for
              the treatment of hypertension.
            </p>

            {bounced ? (
              <p
                className="anim-rise mt-6 max-w-sm text-base leading-relaxed text-body"
                style={{ animationDelay: "0.38s" }}
              >
                That area is part of the private preview. Enter the access code
                below to continue.
              </p>
            ) : null}

            <div className="anim-rise mt-10" style={{ animationDelay: "0.42s" }}>
              {unlocked ? (
                <a
                  href={redirectTo}
                  className="btn-primary group"
                >
                  Enter the site
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <AccessGate redirectTo={redirectTo} />
              )}
            </div>
          </div>

          <div
            className="anim-rise relative mx-auto flex aspect-square w-[280px] items-center justify-center sm:w-[360px] lg:w-[440px]"
            style={{ animationDelay: "0.24s" }}
          >
            <div aria-hidden className="anim-orbit pointer-events-none absolute inset-0">
              <svg viewBox="0 0 440 440" className="h-full w-full">
                <circle
                  cx="220"
                  cy="220"
                  r="216"
                  fill="none"
                  stroke="#6BB2E2"
                  strokeWidth="1.4"
                  strokeDasharray="2.5 9"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </svg>
            </div>
            <div aria-hidden className="anim-orbit-slow pointer-events-none absolute inset-[10%]">
              <svg viewBox="0 0 352 352" className="h-full w-full">
                <circle
                  cx="176"
                  cy="176"
                  r="174"
                  fill="none"
                  stroke="#AFDBBC"
                  strokeWidth="1.6"
                  strokeDasharray="32 280"
                  strokeLinecap="round"
                />
                <circle
                  cx="176"
                  cy="176"
                  r="174"
                  fill="none"
                  stroke="#BED7EC"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
            <div aria-hidden className="anim-orbit-dot pointer-events-none absolute inset-0">
              <span className="absolute left-1/2 top-[-0.5%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-orange shadow-[0_0_18px_rgba(249,168,26,0.8)]" />
            </div>
            <div aria-hidden className="anim-orbit-counter pointer-events-none absolute inset-[10%]">
              <span className="absolute left-1/2 top-[-1%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-indigo/70" />
            </div>
            <div className="anim-float mark-lift relative w-[58%]">
              <MarkArt variant="brand" animate className="h-auto w-full" />
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-line/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-body sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>&copy; 2026 CinPressa Pharma. All rights reserved.</p>
          <p>A CinRx Pharma portfolio company</p>
        </div>
      </footer>
    </div>
  );
}
