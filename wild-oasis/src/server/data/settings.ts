import { Settings } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ApplicationError,
  convertToApplicationError,
  ErrorType,
} from "@/types/errors";

export async function getSettings(): Promise<Settings | null> {
  const results = await prisma.settings.findFirst();
  return results;
}

export async function updateSettings(
  id: number,
  data: Omit<Settings, "id" | "updated" | "bookingId">
): Promise<{ success: boolean; appError?: ApplicationError }> {
  try {
    await prisma.settings.update({
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
