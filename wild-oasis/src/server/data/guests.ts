import { Guests } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ApplicationError,
  convertToApplicationError,
  ErrorType,
} from "@/types/errors";

export async function getAllGuests(): Promise<Guests[]> {
  return prisma.guests.findMany({ orderBy: { fullName: "asc" } });
}

export async function addGuest(
  data: Omit<Guests, "id" | "updated">
): Promise<{ success: boolean; guest?: Guests; appError?: ApplicationError }> {
  try {
    const guest = await prisma.guests.create({ data });
    return { success: true, guest };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, appError: appErr };
  }
}
