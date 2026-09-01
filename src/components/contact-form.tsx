"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/arrow-icon";

const inquiryTypes = [
  "Partnering",
  "Investment",
  "Business",
  "General inquiry",
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
      <div className="rounded-[5px] border border-line bg-white/70 px-8 py-12 text-center backdrop-blur-sm">
        <span aria-hidden className="mx-auto block h-px w-12 bg-sky" />
        <h2 className="mt-7 text-2xl font-light tracking-tight text-ink">
          Thank you, your message is on its way
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-body">
          We&apos;ve received your inquiry and will route it to the right team.
          Expect a reply at the email you provided.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-base font-medium text-blue transition-colors hover:text-ink"
        >
          <span className="link-underline">Send another message</span>
        </button>
      </div>
    );
  }

  return (
    /* GROUPED, NOT A STACK OF SIX. The fields divide the way the inquiry does -
       who is writing, then what about - and each group is titled and ruled off.
       Six identical rows in one column is what "not detailed" describes: there
       is nothing in it for the eye to hold on to, so the panel reads as a
       template rather than as a considered thing. Two named groups and a footer
       bar give it a structure that matches the form's own logic. */
    <form onSubmit={handleSubmit} noValidate>
      <Group title="Your details">
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
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

      </Group>

      <Group title="Your inquiry">
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
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

      <div className="mt-4">
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
      </div>
      </Group>

      {error ? (
        <p
          className="mt-5 rounded-[4px] border border-orange/40 bg-orange/10 px-3.5 py-2.5 text-[0.95rem] font-medium text-[#9a5f00]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {/* THE FOOTER BAR. The submit sits on a ruled row beside the one thing a
          person wants to know before they press it, rather than floating under
          the last field on its own. */}
      <div className="mt-7 flex flex-col gap-4 border-t border-line/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[0.9rem] leading-relaxed text-muted">
          Your details are used only to answer this inquiry.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary group shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}

/**
 * A titled, ruled section of the form. The title is set small and quiet: it is
 * a signpost between groups, not a second heading competing with the panel's
 * own.
 */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 first:mt-0">
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {title}
        </h3>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      {children}
    </section>
  );
}

/* THE REFERENCE'S CONTROL, NOT A PILL. Twelve pixels of radius on a fifty pixel
   input is most of the way to a lozenge; at five, the field reads as a field.
   The rest follows from the same place: a hairline that is actually visible, a
   one pixel inner shadow so the control sits IN the panel rather than on it,
   tighter padding, and a focus state that is a crisp two pixel halo rather than
   a soft glow. The transition drops from 300ms to 160 - a form control should
   answer immediately, and 300 on a border colour reads as lag, not as polish. */
const inputClass =
  "w-full rounded-[5px] border border-line bg-white/80 px-3.5 py-2.5 text-base text-ink shadow-[inset_0_1px_2px_rgba(20,48,79,0.05)] outline-none backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-muted/70 hover:border-periwinkle hover:bg-white focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/20";

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
    /* SENTENCE CASE, AND SMALLER. The labels were set in the eyebrow treatment -
       15px, semibold, uppercase, tracked out an eighth of an em - which shouts
       FULL NAME over every field and takes as much attention as the heading
       does. A field label is meant to be read once and then ignored. */
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 flex items-baseline gap-1.5 text-[0.83rem] font-medium text-body">
        {label}
        {optional ? <span className="text-[0.78rem] text-muted/80">Optional</span> : null}
      </span>
      {children}
    </label>
  );
}
