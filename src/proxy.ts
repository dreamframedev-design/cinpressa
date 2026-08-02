import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, hasValidAccess } from "@/lib/access";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;

  if (await hasValidAccess(token)) {
    return NextResponse.next();
  }

  // Not unlocked: send back to the splash, remembering where they were headed.
  const url = request.nextUrl.clone();
  const target = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/";
  url.search = "";
  url.searchParams.set("locked", "1");
  if (target && target !== "/") {
    url.searchParams.set("from", target);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/home/:path*",
    "/about/:path*",
    "/brand/:path*",
    "/science/:path*",
    "/pipeline/:path*",
    "/news/:path*",
    "/contact/:path*",
  ],
};
