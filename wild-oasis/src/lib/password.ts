import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

// scrypt-based hashing (Node crypto, no native deps). Format: "salt:hash".
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const hash = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return keyBuffer.length === hash.length && timingSafeEqual(keyBuffer, hash);
}
