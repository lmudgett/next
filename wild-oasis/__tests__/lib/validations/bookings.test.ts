import { bookingsSchema } from "@/lib/validations/bookings";

const validBooking = {
  id: 1,
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-01-05"),
  numberOfNights: 4,
  numberOfGuests: 2,
  cabinPrice: 1200,
  extraPrice: 60,
  totalPrice: 1260,
  status: "confirmed",
  hasBreakfast: true,
  hasPaid: false,
  notes: "late check-in",
  cabinId: 3,
  guestId: 7,
};

describe("bookingsSchema", () => {
  it("accepts a valid booking", () => {
    expect(bookingsSchema.safeParse(validBooking).success).toBe(true);
  });

  it("rejects when dates are not Date instances", () => {
    expect(
      bookingsSchema.safeParse({ ...validBooking, startDate: "2026-01-01" })
        .success
    ).toBe(false);
  });

  it("rejects when numeric fields are wrong types", () => {
    expect(
      bookingsSchema.safeParse({ ...validBooking, totalPrice: "1260" }).success
    ).toBe(false);
  });

  it("rejects when boolean flags are wrong types", () => {
    expect(
      bookingsSchema.safeParse({ ...validBooking, hasPaid: "no" }).success
    ).toBe(false);
  });
});
