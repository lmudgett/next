import { Cabin } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Option, FilterType, PrismaFilter } from "./filters";
import { AppPromise } from "@/types/app-promise";
import {
  ApplicationError,
  convertToApplicationError,
  ErrorType,
} from "@/types/errors";

export async function getAllCabins(options?: Option[]): Promise<Cabin[]> {
  if (options) {
    const whereClause = options.reduce((acc, { field, value, filterType }) => {
      if (filterType === FilterType.NOT_NULL) {
        acc[field] = { not: null };
      } else {
        acc[field] = { [filterType]: value };
      }
      return acc;
    }, {} as PrismaFilter);

    return await prisma.cabin.findMany({ where: whereClause });
  }
  const results = await prisma.cabin.findMany();
  return results;
}

export async function deleteCabin(id: number): Promise<AppPromise> {
  try {
    const exists = await prisma.cabin.findUnique({
      where: { id: id },
    });

    if (!exists) {
      throw new ApplicationError("can't delete a cabin that doesn't exist");
    }

    await prisma.cabin.delete({
      where: {
        id,
      },
    });
    return { success: true };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, appError: appErr };
  }
}

export async function addCabin(
  data: Omit<Cabin, "id" | "updated" | "bookingId">
): Promise<AppPromise> {
  try {
    const existingCabin = await prisma.cabin.findUnique({
      where: { name: data.name },
    });

    if (existingCabin) {
      throw new ApplicationError(
        `cabin name ${data.name} already exists, please use a different name`
      );
    }

    await prisma.cabin.create({ data });
    return { success: true };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, appError: appErr };
  }
}

export async function updateCabin(
  id: number,
  data: Omit<Cabin, "id" | "updated" | "bookingId">
): Promise<AppPromise> {
  try {
    await prisma.cabin.update({
      where: {
        id,
      },
      data,
    });

    return { success: true };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, appError: appErr };
  }
}
