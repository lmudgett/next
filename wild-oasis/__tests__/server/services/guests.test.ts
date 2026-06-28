jest.mock("@prisma/client", () => {
  const guests = {
    findMany: jest.fn(),
    create: jest.fn(),
  };
  return { __esModule: true, PrismaClient: jest.fn(() => ({ guests })) };
});

import { PrismaClient } from "@prisma/client";
import { getAllGuests } from "@/server/services/guests";

const { guests } = new (PrismaClient as unknown as new () => {
  guests: { findMany: jest.Mock; create: jest.Mock };
})();

describe("getAllGuests (service)", () => {
  it("maps rows to guest options (id, name, flag)", async () => {
    guests.findMany.mockResolvedValue([
      {
        id: 1,
        fullName: "Jane Cooper",
        countryFlag: "🇺🇸",
        email: "j@x.com",
        nationality: "US",
        nationalId: "1",
        updated: new Date(),
      },
    ]);
    const res = await getAllGuests();
    expect(res.success).toBe(true);
    expect(res.guests).toEqual([
      { id: 1, fullName: "Jane Cooper", countryFlag: "🇺🇸" },
    ]);
  });

  it("returns a failure message when the data layer throws", async () => {
    guests.findMany.mockRejectedValue(new Error("db down"));
    const res = await getAllGuests();
    expect(res.success).toBe(false);
    expect(res.message).toBe("db down");
  });
});
