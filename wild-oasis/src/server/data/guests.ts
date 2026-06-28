import { Guests } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppPromise } from "@/types/app-promise";
import { convertToApplicationError, ErrorType } from "@/types/errors";

export async function getAllBookings(): Promise<Guests[]> {
  const results = await prisma.guests.findMany();
  return results;
}

export async function addCabin(
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
