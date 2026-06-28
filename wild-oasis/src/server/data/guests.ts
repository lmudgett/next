import { Guests } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppPromise } from "@/types/app-promise";
import { convertToApplicationError, ErrorType } from "@/types/errors";

export async function getAllGuests(): Promise<Guests[]> {
  return prisma.guests.findMany({ orderBy: { fullName: "asc" } });
}

export async function addGuest(
  data: Omit<Guests, "id" | "updated">
): Promise<AppPromise> {
  try {
    await prisma.guests.create({ data });
    return { success: true };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, appError: appErr };
  }
}
