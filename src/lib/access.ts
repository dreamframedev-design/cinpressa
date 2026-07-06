/**
 * Soft access gate for the pre-launch full build.
 *
 * The public splash lives at `/`. Everything else is held behind a shared
 * password until the site goes live. This is a "coming soon" lock, not a
 * security boundary — it keeps the in-progress build private without standing
 * up real auth.
 *
 * The typed password is never stored in the browser. On success we set an
 * httpOnly cookie to an opaque token derived from the password (SHA-256), and
 * both the unlock route and the middleware compare against the same derived
 * token. Rotating SITE_PASSWORD invalidates every existing session.
 */

export const ACCESS_COOKIE = "cin_access";

/** 30 days, in seconds. */
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 30;

const encoder = new TextEncoder();

function sitePassword(): string {
  return process.env.SITE_PASSWORD ?? "cinpressa2026";
}

/** Opaque cookie value derived from the current password. Edge + Node safe. */
export async function accessToken(): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`cinpressa::${sitePassword()}`)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function verifyPassword(input: string): boolean {
  return input === sitePassword();
}

export async function hasValidAccess(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  return token === (await accessToken());
}
