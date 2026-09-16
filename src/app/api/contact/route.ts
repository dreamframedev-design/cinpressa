import { NextResponse } from "next/server";

/**
 * Contact inquiries are forwarded to Formspree from the server, never from the
 * browser. The visitor's fetch only ever talks to this route, so a submission
 * cannot navigate them off to a Formspree-hosted page: our own success and
 * error states are the only thing they ever see.
 */
const FORMSPREE_ENDPOINT =
  process.env.FORMSPREE_ENDPOINT ?? "https://formspree.io/f/xdeknled";

/** Give up on Formspree rather than leaving the visitor watching a spinner. */
const FORWARD_TIMEOUT_MS = 10_000;

type ContactPayload = {
  name?: string;
  email?: string;
  organization?: string;
  inquiryType?: string;
  message?: string;
  /** Honeypot. Real people leave it empty; bots fill everything in. */
  _gotcha?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENERIC_FAILURE =
  "We couldn't send that just now. Please try again, or email us directly.";

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = data.name?.trim();
  const email = data.email?.trim();
  const message = data.message?.trim();
  const organization = data.organization?.trim() || "";
  const inquiryType = data.inquiryType?.trim() || "General inquiry";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 422 }
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  // A filled honeypot is a bot. Answer exactly like a success so it learns
  // nothing, and forward nothing.
  if (data._gotcha) {
    return NextResponse.json({ ok: true });
  }

  let response: Response;
  try {
    response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Formspree returns JSON instead of an HTML redirect when we ask for it.
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        organization,
        inquiryType,
        message,
        _subject: `CinPressa inquiry - ${inquiryType} - ${name}`,
      }),
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Contact forward to Formspree failed:", error);
    return NextResponse.json({ error: GENERIC_FAILURE }, { status: 502 });
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    console.error("Formspree rejected a submission:", response.status, body);

    // Formspree reports field-level problems as { errors: [{ message }] }.
    const detail = Array.isArray(body?.errors)
      ? body.errors
          .map((item: { message?: string }) => item?.message)
          .filter(Boolean)
          .join(" ")
      : null;

    return NextResponse.json(
      { error: detail || GENERIC_FAILURE },
      { status: response.status === 422 ? 422 : 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
