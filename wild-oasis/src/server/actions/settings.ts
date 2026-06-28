"use server";
import { revalidatePath } from "next/cache";
import * as settingsUC from "@/server/services/settings";
import { SettingsFormData, settingsSchema } from "@/lib/validations/settings";
import { AppPromise } from "@/types/app-promise";
import { convertToApplicationError } from "@/types/errors";

export const getSettingsAction = async (): Promise<{
  success: boolean;
  settings?: SettingsFormData;
  message?: string;
}> => {
  const res = await settingsUC.getSettings();

  if (res) {
    if (res.settings) {
      return { success: true, settings: res.settings };
    }
    return { success: true };
  } else {
    return { success: false, message: "unable to get settings" };
  }
};

export const updateSettingsAction = async (
  data: SettingsFormData
): Promise<AppPromise> => {
  try {
    settingsSchema.parse(data);

    const {
      id,
      breakfastPrice,
      maxBookingLength,
      maxGuestNumberPerBooking,
      minBookingLength,
    } = data;

    const res = await settingsUC.updateSettings(
      id,
      minBookingLength,
      maxBookingLength,
      maxGuestNumberPerBooking,
      breakfastPrice
    );

    if (res.success) {
      revalidatePath("/settings");
      return res;
    } else {
      throw res.appError;
    }
  } catch (error) {
    const err = convertToApplicationError(error);
    return { success: false, appError: err };
  }
};
