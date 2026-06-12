import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  organization?: string;
  inquiryType?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // The submission is captured here. Wire this up to an email provider
  // (e.g. Resend) or a datastore to actually deliver / persist inquiries.
  console.log("New CinPressa contact inquiry:", {
    name,
    email,
    organization: data.organization?.trim() || null,
    inquiryType: data.inquiryType?.trim() || null,
    message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
