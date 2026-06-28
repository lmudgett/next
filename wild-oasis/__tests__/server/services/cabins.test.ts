jest.mock("@prisma/client", () => {
  const cabin = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return { __esModule: true, PrismaClient: jest.fn(() => ({ cabin })) };
});

import { PrismaClient } from "@prisma/client";
import { getAllCabins, updateCabin, addCabin } from "@/server/services/cabins";

const { cabin } = new (PrismaClient as unknown as new () => {
  cabin: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
})();

const baseRow = {
  id: 1,
  name: "001",
  maxCapacity: 4,
  regularPrice: 300,
  discount: 50,
  description: "desc",
  bookingId: null,
  updated: new Date(),
};

describe("getAllCabins (use-case)", () => {
  it("converts a non-empty image buffer to a base64 data URL", async () => {
    cabin.findMany.mockResolvedValue([
      { ...baseRow, image: Buffer.from("imgbytes") },
    ]);
    const res = await getAllCabins();
    expect(res.success).toBe(true);
    expect(res.cabins?.[0].imageBase64).toBe(
      `data:image/jpeg;base64,${Buffer.from("imgbytes").toString("base64")}`
    );
  });

  it("maps an empty image buffer to an empty string", async () => {
    cabin.findMany.mockResolvedValue([{ ...baseRow, image: Buffer.alloc(0) }]);
    const res = await getAllCabins();
    expect(res.cabins?.[0].imageBase64).toBe("");
  });

  it("returns a failure message when the data layer throws", async () => {
    cabin.findMany.mockRejectedValue(new Error("boom"));
    const res = await getAllCabins();
    expect(res.success).toBe(false);
    expect(res.message).toBe("boom");
  });
});

describe("updateCabin (use-case) routing", () => {
  it("updates when an id is supplied", async () => {
    cabin.update.mockResolvedValue(baseRow);
    const res = await updateCabin("001", 4, 300, 50, "desc", Buffer.alloc(0), 1);
    expect(res.success).toBe(true);
    expect(cabin.update).toHaveBeenCalled();
    expect(cabin.create).not.toHaveBeenCalled();
  });

  it("adds when no id is supplied", async () => {
    cabin.findUnique.mockResolvedValue(null);
    cabin.create.mockResolvedValue(baseRow);
    const res = await updateCabin("002", 4, 300, 50, "desc", Buffer.alloc(0));
    expect(res.success).toBe(true);
    expect(cabin.create).toHaveBeenCalled();
    expect(cabin.update).not.toHaveBeenCalled();
  });
});

describe("addCabin (use-case)", () => {
  it("creates a cabin via the data layer", async () => {
    cabin.findUnique.mockResolvedValue(null);
    cabin.create.mockResolvedValue(baseRow);
    const res = await addCabin("003", 2, 200, 0, "desc", Buffer.alloc(0));
    expect(res.success).toBe(true);
    expect(cabin.create).toHaveBeenCalled();
  });
});
