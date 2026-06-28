// Mock Prisma before importing the module under test. The `cabin` delegate
// lives inside the factory closure so every `new PrismaClient()` shares it.
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
import {
  getAllCabins,
  addCabin,
  deleteCabin,
  updateCabin,
} from "@/server/data/cabins";
import { FilterType } from "@/server/data/filters";

// Shared mock delegate (same reference the module uses internally).
const { cabin } = new (PrismaClient as unknown as new () => {
  cabin: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
})();

const sampleCabin = {
  id: 1,
  name: "001",
  maxCapacity: 4,
  regularPrice: 300,
  discount: 50,
  description: null,
  image: null,
  bookingId: null,
  updated: new Date(),
};

describe("getAllCabins", () => {
  it("returns all cabins when no options are provided", async () => {
    cabin.findMany.mockResolvedValue([sampleCabin]);
    const result = await getAllCabins();
    expect(result).toEqual([sampleCabin]);
    expect(cabin.findMany).toHaveBeenCalledWith();
  });

  it("builds a NOT_NULL where clause", async () => {
    cabin.findMany.mockResolvedValue([]);
    await getAllCabins([
      { field: "discount", value: "", filterType: FilterType.NOT_NULL },
    ]);
    expect(cabin.findMany).toHaveBeenCalledWith({
      where: { discount: { not: null } },
    });
  });

  it("builds an operator-based where clause", async () => {
    cabin.findMany.mockResolvedValue([]);
    await getAllCabins([
      { field: "name", value: "001", filterType: FilterType.EQUALS },
    ]);
    expect(cabin.findMany).toHaveBeenCalledWith({
      where: { name: { equals: "001" } },
    });
  });
});

describe("addCabin", () => {
  const newCabin = {
    name: "002",
    maxCapacity: 2,
    regularPrice: 250,
    discount: 0,
    description: "",
    image: Buffer.alloc(0),
  };

  it("rejects a duplicate name without creating", async () => {
    cabin.findUnique.mockResolvedValue(sampleCabin);
    const res = await addCabin(newCabin);
    expect(res.success).toBe(false);
    expect(res.appError?.message).toMatch(/already exists/i);
    expect(cabin.create).not.toHaveBeenCalled();
  });

  it("creates when the name is unique", async () => {
    cabin.findUnique.mockResolvedValue(null);
    cabin.create.mockResolvedValue(sampleCabin);
    const res = await addCabin(newCabin);
    expect(res.success).toBe(true);
    expect(cabin.create).toHaveBeenCalledWith({ data: newCabin });
  });
});

describe("deleteCabin", () => {
  it("refuses to delete a cabin that does not exist", async () => {
    cabin.findUnique.mockResolvedValue(null);
    const res = await deleteCabin(99);
    expect(res.success).toBe(false);
    expect(res.appError?.message).toMatch(/doesn't exist/i);
    expect(cabin.delete).not.toHaveBeenCalled();
  });

  it("deletes an existing cabin", async () => {
    cabin.findUnique.mockResolvedValue(sampleCabin);
    cabin.delete.mockResolvedValue(sampleCabin);
    const res = await deleteCabin(1);
    expect(res.success).toBe(true);
    expect(cabin.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});

describe("updateCabin", () => {
  const data = {
    name: "001",
    maxCapacity: 4,
    regularPrice: 300,
    discount: 50,
    description: "",
    image: Buffer.alloc(0),
  };

  it("updates and reports success", async () => {
    cabin.update.mockResolvedValue(sampleCabin);
    const res = await updateCabin(1, data);
    expect(res.success).toBe(true);
    expect(cabin.update).toHaveBeenCalledWith({ where: { id: 1 }, data });
  });

  it("wraps a thrown error as an ApplicationError result", async () => {
    cabin.update.mockRejectedValue(new Error("db exploded"));
    const res = await updateCabin(1, data);
    expect(res.success).toBe(false);
    expect(res.appError?.message).toBe("db exploded");
  });
});
