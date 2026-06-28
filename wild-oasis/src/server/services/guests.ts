import * as guestsDao from "@/server/data/guests";
import { convertToApplicationError, ErrorType } from "@/types/errors";
import { GuestFormData } from "@/lib/validations/guests";

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

export async function createGuest(data: GuestFormData): Promise<{
  success: boolean;
  guest?: GuestOption;
  message?: string;
}> {
  const res = await guestsDao.addGuest({
    fullName: data.fullName,
    email: data.email,
    nationality: data.nationality,
    nationalId: data.nationalId,
    countryFlag: data.countryFlag || "🏳️",
  });

  if (!res.success || !res.guest) {
    return { success: false, message: res.appError?.message };
  }
  return {
    success: true,
    guest: {
      id: res.guest.id,
      fullName: res.guest.fullName,
      countryFlag: res.guest.countryFlag,
    },
  };
}
