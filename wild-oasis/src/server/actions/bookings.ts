import { BookingsFormData } from "@/lib/validations/bookings";
import * as bookingsUC from "@/server/services/bookings";

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
