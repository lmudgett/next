import { NextResponse, NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/login";

  if (!session) {
    // Unauthenticated: allow the login page, redirect everything else there.
    if (isLogin) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Authenticated: keep users out of /login and send "/" to the dashboard.
  if (isLogin || pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img|.*\\.png$).*)"],
};
