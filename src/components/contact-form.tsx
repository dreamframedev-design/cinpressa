"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/arrow-icon";

const inquiryTypes = [
  "Partnering",
  "Investment",
  "Investigator / clinical",
  "Media",
  "Other",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-mist px-8 py-12 text-center">
        <span aria-hidden className="mx-auto block h-px w-12 bg-orange" />
        <h2 className="mt-7 text-2xl font-light tracking-tight text-ink">
          Thank you, your message is on its way
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-body">
          We&apos;ve received your inquiry and will route it to the right team.
          Expect a reply at the email you provided.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm font-medium text-blue transition-colors hover:text-ink"
        >
          <span className="link-underline">Send another message</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="jane@company.com"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Organization" htmlFor="organization" optional>
          <input
            id="organization"
            name="organization"
            type="text"
            autoComplete="organization"
            className={inputClass}
            placeholder="Company or institution"
          />
        </Field>
        <Field label="Inquiry type" htmlFor="inquiryType">
          <select
            id="inquiryType"
            name="inquiryType"
            required
            defaultValue=""
            className={`${inputClass} appearance-none bg-[length:1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%235b6e83' stroke-width='1.5' d='M1 1.5 6 6.5 11 1.5'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" disabled>
              Select one
            </option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={`${inputClass} resize-y`}
          placeholder="Tell us about your inquiry."
        />
      </Field>

      {error ? (
        <p className="text-sm text-orange" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex items-center gap-2.5 rounded-full bg-blue px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-ink hover:shadow-[0_18px_36px_-18px_rgba(34,97,173,0.6)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-muted/60 focus:border-sky focus:ring-2 focus:ring-sky/30";

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
        {label}
        {optional ? <span className="ml-1 normal-case text-muted/60">(optional)</span> : null}
      </span>
      {children}
    </label>
  );
}
