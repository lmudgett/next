import * as guestsUC from "@/server/services/guests";
import type { GuestOption } from "@/server/services/guests";

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
