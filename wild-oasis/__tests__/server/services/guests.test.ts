jest.mock("@prisma/client", () => {
  const guests = {
    findMany: jest.fn(),
    create: jest.fn(),
  };
  return { __esModule: true, PrismaClient: jest.fn(() => ({ guests })) };
});

import { PrismaClient } from "@prisma/client";
import { getAllGuests, createGuest } from "@/server/services/guests";

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

describe("createGuest (service)", () => {
  it("creates a guest and returns it as an option (default flag)", async () => {
    guests.create.mockResolvedValue({
      id: 5,
      fullName: "New Person",
      countryFlag: "🏳️",
      email: "new@example.com",
      nationality: "France",
      nationalId: "FR1",
      updated: new Date(),
    });
    const res = await createGuest({
      fullName: "New Person",
      email: "new@example.com",
      nationality: "France",
      nationalId: "FR1",
    });
    expect(res.success).toBe(true);
    expect(res.guest).toEqual({
      id: 5,
      fullName: "New Person",
      countryFlag: "🏳️",
    });
    // empty/absent flag is defaulted before persisting
    expect(guests.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ countryFlag: "🏳️" }),
      })
    );
  });
});
