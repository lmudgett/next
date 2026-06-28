import { cabinSchema } from "@/lib/validations/cabins";

const validCabin = {
  name: "Cabin 001",
  maxCapacity: 4,
  regularPrice: 300,
  discount: 50,
  description: "A nice cabin",
};

describe("cabinSchema", () => {
  it("accepts a valid cabin", () => {
    expect(cabinSchema.safeParse(validCabin).success).toBe(true);
  });

  it("accepts a cabin with no discount (null/undefined optional)", () => {
    expect(
      cabinSchema.safeParse({ ...validCabin, discount: null }).success
    ).toBe(true);
    const { discount, ...noDiscount } = validCabin;
    void discount;
    expect(cabinSchema.safeParse(noDiscount).success).toBe(true);
  });

  it("rejects a name shorter than 3 characters", () => {
    const res = cabinSchema.safeParse({ ...validCabin, name: "ab" });
    expect(res.success).toBe(false);
  });

  it("rejects maxCapacity below 1", () => {
    expect(
      cabinSchema.safeParse({ ...validCabin, maxCapacity: 0 }).success
    ).toBe(false);
  });

  it("rejects regularPrice below 50", () => {
    expect(
      cabinSchema.safeParse({ ...validCabin, regularPrice: 49 }).success
    ).toBe(false);
  });

  it("rejects a discount greater than or equal to the regular price", () => {
    const res = cabinSchema.safeParse({
      ...validCabin,
      regularPrice: 100,
      discount: 100,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].path).toContain("discount");
    }
  });

  it("rejects non-numeric maxCapacity", () => {
    expect(
      cabinSchema.safeParse({ ...validCabin, maxCapacity: "four" }).success
    ).toBe(false);
  });
});
