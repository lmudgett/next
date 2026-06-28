import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  signSession,
  verifySession,
  type SessionPayload,
} from "@/lib/session";

// Server-only session helpers (use next/headers cookies()). Not imported by
// middleware — middleware uses verifySession from @/lib/session directly.

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySession(token) : null;
}

export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}
