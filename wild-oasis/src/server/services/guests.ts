import * as guestsDao from "@/server/data/guests";
import { convertToApplicationError, ErrorType } from "@/types/errors";

export type GuestOption = {
  id: number;
  fullName: string;
  countryFlag: string;
};

export async function getAllGuests(): Promise<{
  success: boolean;
  guests?: GuestOption[];
  message?: string;
}> {
  try {
    const guests = await guestsDao.getAllGuests();
    return {
      success: true,
      guests: guests.map((g) => ({
        id: g.id,
        fullName: g.fullName,
        countryFlag: g.countryFlag,
      })),
    };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, message: appErr.message };
  }
}
