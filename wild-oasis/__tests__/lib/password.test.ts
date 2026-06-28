import { hashPassword, verifyPassword } from "@/lib/password";

describe("password hashing", () => {
  it("verifies a correct password", () => {
    const stored = hashPassword("secret123");
    expect(verifyPassword("secret123", stored)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const stored = hashPassword("secret123");
    expect(verifyPassword("wrong-password", stored)).toBe(false);
  });

  it("uses a random salt, so hashes differ each time", () => {
    expect(hashPassword("same")).not.toBe(hashPassword("same"));
  });

  it("rejects a malformed stored value", () => {
    expect(verifyPassword("anything", "not-a-valid-hash")).toBe(false);
  });
});
