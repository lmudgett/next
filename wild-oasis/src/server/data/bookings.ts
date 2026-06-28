import { Bookings } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppPromise } from "@/types/app-promise";
import {
  ApplicationError,
  convertToApplicationError,
  ErrorType,
} from "@/types/errors";

export async function getAllBookings(): Promise<Bookings[]> {
  const bookings = await prisma.bookings.findMany();
  return bookings;
}

export async function deleteBookings(id: number): Promise<AppPromise> {
  try {
    const exists = await prisma.bookings.findUnique({
      where: { id: id },
    });

    if (!exists) {
      throw new ApplicationError("can't delete a booking that doesn't exist");
    }

    await prisma.bookings.delete({
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

export async function addBookings(
  data: Omit<Bookings, "id" | "updated">
): Promise<AppPromise> {
  try {
    await prisma.bookings.create({ data });
    return { success: true };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, appError: appErr };
  }
}

export async function updateBookings(
  id: number,
  data: Omit<Bookings, "id" | "updated">
): Promise<AppPromise> {
  try {
    await prisma.bookings.update({
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
