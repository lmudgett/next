import * as settingsDao from "@/server/data/settings";
import { ApplicationError } from "@/types/errors";
import { SettingsFormData } from "@/lib/validations/settings";
/**
 * get all setting
 * @returns - true if successful or false with a message
 */
export async function getSettings(): Promise<{
  success: boolean;
  settings?: SettingsFormData;
  message?: string;
}> {
  const s = await settingsDao.getSettings();
  if (s) {
    return {
      success: true,
      settings: {
        id: s.id,
        breakfastPrice: s.breakfastPrice,
        maxBookingLength: s.maxBookingLength,
        minBookingLength: s.minBookingLength,
        maxGuestNumberPerBooking: s.maxGuestNumberPerBooking,
      },
    };
  } else {
    return { success: false, message: "unable to get settings" };
  }
}

/**
 *
 * @param id
 * @param minBookingLength
 * @param maxBookingLength
 * @param maxGuestNumberPerBooking
 * @param breakfastPrice
 * @returns
 */
export async function updateSettings(
  id: number,
  minBookingLength: number,
  maxBookingLength: number,
  maxGuestNumberPerBooking: number,
  breakfastPrice: number
): Promise<{
  success: boolean;
  appError?: ApplicationError;
}> {
  const res = await settingsDao.updateSettings(id, {
    minBookingLength,
    maxBookingLength,
    maxGuestNumberPerBooking,
    breakfastPrice,
  });
  if (res.success) {
    return { success: true };
  } else {
    return { success: false, appError: res.appError };
  }
}
