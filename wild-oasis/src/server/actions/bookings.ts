"use server";
import { revalidatePath } from "next/cache";
import * as bookingsUC from "@/server/services/bookings";
import { bookingsSchema, BookingsFormData } from "@/lib/validations/bookings";
import { AppPromise } from "@/types/app-promise";
import { convertToApplicationError } from "@/types/errors";

export const getAllBookingsAction = async (): Promise<{
  success: boolean;
  bookings?: BookingsFormData[];
  message?: string;
}> => {
  try {
    const { bookings } = await bookingsUC.getAllBookings();
    if (!bookings) {
      return { success: true, message: "No bookings found" };
    }
    return { success: true, bookings: bookings };
  } catch (error) {
    return { success: false, message: `Unable to get bookings ${error}` };
  }
};

export const createBookingAction = async (
  data: BookingsFormData
): Promise<AppPromise> => {
  try {
    bookingsSchema.parse(data);
    const res = await bookingsUC.createBooking(data);
    if (res.success) {
      revalidatePath("/bookings");
      return { success: true };
    }
    throw res.appError;
  } catch (error) {
    return { success: false, appError: convertToApplicationError(error) };
  }
};

export const updateBookingAction = async (
  data: BookingsFormData
): Promise<AppPromise> => {
  try {
    bookingsSchema.parse(data);
    const res = await bookingsUC.updateBooking(data);
    if (res.success) {
      revalidatePath("/bookings");
      return { success: true };
    }
    throw res.appError;
  } catch (error) {
    return { success: false, appError: convertToApplicationError(error) };
  }
};

export const cancelBookingAction = async (id: number): Promise<AppPromise> => {
  const res = await bookingsUC.deleteBooking(id);
  if (res.success) {
    revalidatePath("/bookings");
  }
  return res;
};

export const setBookingStatusAction = async (
  id: number,
  status: string
): Promise<AppPromise> => {
  const res = await bookingsUC.setBookingStatus(id, status);
  if (res.success) {
    revalidatePath("/dashboard");
    revalidatePath("/bookings");
  }
  return res;
};
