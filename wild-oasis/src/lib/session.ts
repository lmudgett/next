import { SignJWT, jwtVerify } from "jose";

// Edge-safe session helpers (jose only — no next/headers here, so middleware
// can import it). A real deployment must set AUTH_SECRET.
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-only-insecure-secret-change-in-production"
);

export const SESSION_COOKIE = "session";

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}
