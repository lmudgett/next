import { settingsSchema } from "@/lib/validations/settings";

const validSettings = {
  id: 1,
  minBookingLength: 1,
  maxBookingLength: 90,
  maxGuestNumberPerBooking: 8,
  breakfastPrice: 15,
};

describe("settingsSchema", () => {
  it("accepts valid settings", () => {
    expect(settingsSchema.safeParse(validSettings).success).toBe(true);
  });

  it("coerces numeric strings to numbers (preprocess)", () => {
    const res = settingsSchema.safeParse({
      ...validSettings,
      minBookingLength: "3",
      breakfastPrice: "20",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.minBookingLength).toBe(3);
      expect(res.data.breakfastPrice).toBe(20);
    }
  });

  it("rejects values that are not greater than zero", () => {
    expect(
      settingsSchema.safeParse({ ...validSettings, minBookingLength: 0 }).success
    ).toBe(false);
    expect(
      settingsSchema.safeParse({ ...validSettings, breakfastPrice: -5 }).success
    ).toBe(false);
  });

  it("rejects non-numeric strings", () => {
    expect(
      settingsSchema.safeParse({ ...validSettings, maxBookingLength: "abc" })
        .success
    ).toBe(false);
  });
});
