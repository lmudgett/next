jest.mock("@prisma/client", () => {
  const bookings = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { __esModule: true, PrismaClient: jest.fn(() => ({ bookings })) };
});

import { PrismaClient } from "@prisma/client";
import {
  getAllBookings,
  updateCabin,
  createBooking,
} from "@/server/services/bookings";

const { bookings } = new (PrismaClient as unknown as new () => {
  bookings: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
})();

const row = {
  id: 1,
  startDate: new Date("2026-07-01"),
  endDate: new Date("2026-07-06"),
  numberOfNights: 5,
  numberOfGuests: 2,
  cabinPrice: 600,
  extraPrice: 60,
  totalPrice: 660,
  status: "confirmed",
  hasBreakfast: true,
  hasPaid: true,
  notes: "",
  cabinId: 10,
  guestId: 20,
  updated: new Date(),
  // relations included by the data layer's findMany
  cabin: { name: "001" },
  guest: { fullName: "Jane Cooper", countryFlag: "🇺🇸" },
};

describe("getAllBookings (service)", () => {
  it("maps rows to the booking DTO list", async () => {
    bookings.findMany.mockResolvedValue([row]);
    const res = await getAllBookings();
    expect(res.success).toBe(true);
    expect(res.bookings).toHaveLength(1);
    expect(res.bookings?.[0]).toMatchObject({
      id: 1,
      numberOfNights: 5,
      totalPrice: 660,
      status: "confirmed",
      hasPaid: true,
      cabinId: 10,
      guestId: 20,
      cabinName: "001",
      guestName: "Jane Cooper",
      guestCountryFlag: "🇺🇸",
    });
  });

  it("returns a failure message when the data layer throws", async () => {
    bookings.findMany.mockRejectedValue(new Error("db down"));
    const res = await getAllBookings();
    expect(res.success).toBe(false);
    expect(res.message).toBe("db down");
  });
});

describe("createBooking (service)", () => {
  it("creates a booking with its cabin/guest foreign keys", async () => {
    bookings.create.mockResolvedValue(row);
    const res = await createBooking({ ...row });
    expect(res.success).toBe(true);
    expect(bookings.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ cabinId: 10, guestId: 20 }),
      })
    );
  });
});

describe("updateCabin (booking upsert routing)", () => {
  it("updates when an id is present", async () => {
    bookings.update.mockResolvedValue(row);
    const res = await updateCabin({ ...row });
    expect(res.success).toBe(true);
    expect(bookings.update).toHaveBeenCalled();
    expect(bookings.create).not.toHaveBeenCalled();
  });

  it("creates when no id is present", async () => {
    bookings.create.mockResolvedValue(row);
    const { id: _omit, ...noId } = row;
    void _omit;
    const res = await updateCabin(noId as typeof row);
    expect(res.success).toBe(true);
    expect(bookings.create).toHaveBeenCalled();
    expect(bookings.update).not.toHaveBeenCalled();
  });
});
