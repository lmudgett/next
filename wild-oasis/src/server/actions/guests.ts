"use server";
import { revalidatePath } from "next/cache";
import * as guestsUC from "@/server/services/guests";
import type { GuestOption } from "@/server/services/guests";
import { guestSchema, GuestFormData } from "@/lib/validations/guests";
import { ApplicationError, convertToApplicationError } from "@/types/errors";

export const getAllGuestsAction = async (): Promise<{
  success: boolean;
  guests?: GuestOption[];
  message?: string;
}> => {
  try {
    const { guests } = await guestsUC.getAllGuests();
    return { success: true, guests: guests ?? [] };
  } catch (error) {
    return { success: false, message: `Unable to get guests ${error}` };
  }
};

export const createGuestAction = async (
  data: GuestFormData
): Promise<{
  success: boolean;
  guest?: GuestOption;
  appError?: ApplicationError;
}> => {
  try {
    guestSchema.parse(data);
    const res = await guestsUC.createGuest(data);
    if (res.success && res.guest) {
      revalidatePath("/bookings");
      return { success: true, guest: res.guest };
    }
    throw new ApplicationError(res.message ?? "Unable to create guest");
  } catch (error) {
    return { success: false, appError: convertToApplicationError(error) };
  }
};
