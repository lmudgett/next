import * as bookingsDao from "@/server/data/bookings";
import { AppPromise } from "@/types/app-promise";
import { BookingsFormData } from "@/lib/validations/bookings";
import { convertToApplicationError, ErrorType } from "@/types/errors";

export async function createBooking(b: BookingsFormData): Promise<AppPromise> {
  return bookingsDao.addBookings({
    startDate: b.startDate,
    endDate: b.endDate,
    numberOfNights: b.numberOfNights,
    numberOfGuests: b.numberOfGuests,
    cabinPrice: b.cabinPrice,
    extraPrice: b.extraPrice,
    totalPrice: b.totalPrice,
    status: b.status,
    hasBreakfast: b.hasBreakfast,
    hasPaid: b.hasPaid,
    notes: b.notes,
    cabinId: b.cabinId,
    guestId: b.guestId,
  });
}

export async function getAllBookings(): Promise<{
  success: boolean;
  bookings?: BookingsFormData[];
  message?: string;
}> {
  try {
    const result = await bookingsDao.getAllBookings();
    const list: BookingsFormData[] = result.map((b) => {
      return {
        id: b.id,
        startDate: b.startDate,
        endDate: b.endDate,
        numberOfNights: b.numberOfNights,
        numberOfGuests: b.numberOfGuests,
        cabinPrice: b.cabinPrice,
        extraPrice: b.extraPrice,
        totalPrice: b.totalPrice,
        status: b.status,
        hasBreakfast: b.hasBreakfast,
        hasPaid: b.hasPaid,
        notes: b.notes,
        cabinId: b.cabinId,
        guestId: b.guestId,
        cabinName: b.cabin.name,
        guestName: b.guest.fullName,
        guestCountryFlag: b.guest.countryFlag,
      };
    });
    return { success: true, bookings: list };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, message: appErr.message };
  }
}

export async function updateCabin(b: BookingsFormData): Promise<AppPromise> {
  let res: AppPromise;
  if (b.id) {
    res = await bookingsDao.updateBookings(b.id, {
      startDate: b.startDate,
      endDate: b.endDate,
      numberOfNights: b.numberOfNights,
      numberOfGuests: b.numberOfGuests,
      cabinPrice: b.cabinPrice,
      extraPrice: b.extraPrice,
      totalPrice: b.totalPrice,
      status: b.status,
      hasBreakfast: b.hasBreakfast,
      hasPaid: b.hasPaid,
      notes: b.notes,
      cabinId: b.cabinId,
      guestId: b.guestId,
    });
  } else {
    res = await bookingsDao.addBookings({
      startDate: b.startDate,
      endDate: b.endDate,
      numberOfNights: b.numberOfNights,
      numberOfGuests: b.numberOfGuests,
      cabinPrice: b.cabinPrice,
      extraPrice: b.extraPrice,
      totalPrice: b.totalPrice,
      status: b.status,
      hasBreakfast: b.hasBreakfast,
      hasPaid: b.hasPaid,
      notes: b.notes,
      cabinId: b.cabinId,
      guestId: b.guestId,
    });
  }
  return res;
}
