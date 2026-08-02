"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/arrow-icon";

type Status = "idle" | "submitting" | "error";

export function AccessGate({ redirectTo = "/home" }: { redirectTo?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = inputRef.current?.value.trim() ?? "";
    if (!password) {
      setStatus("error");
      setError("Enter the access code to continue.");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong.");
      }
      // Land on the protected build; refresh so the server re-reads the cookie.
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
      inputRef.current?.focus();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm" noValidate>
      <label
        htmlFor="access-code"
        className="flex items-center gap-3 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-body"
      >
        <LockIcon className="h-3.5 w-3.5 text-blue" />
        Private preview
      </label>

      <div className="group mt-4 flex items-center gap-3 border-b border-line pb-2 transition-colors focus-within:border-sky">
        <input
          id="access-code"
          ref={inputRef}
          type="password"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Enter access code"
          aria-invalid={status === "error"}
          aria-describedby={error ? "access-error" : undefined}
          onInput={() => {
            if (status === "error") {
              setStatus("idle");
              setError(null);
            }
          }}
          className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted/55"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Unlock the site"
          className="group/btn inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue text-white transition-all duration-300 hover:bg-ink hover:shadow-[0_14px_28px_-14px_rgba(34,97,173,0.6)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ArrowIcon
            className={`h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 ${
              status === "submitting" ? "animate-pulse" : ""
            }`}
          />
        </button>
      </div>

      <p
        id="access-error"
        role="alert"
        className={`mt-3 text-sm text-orange transition-opacity duration-200 ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error ?? " "}
      </p>
    </form>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.25" y="7" width="9.5" height="6.5" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}
