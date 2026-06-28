"use client";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Sono } from "next/font/google";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { BookingsFormData } from "@/lib/validations/bookings";
import { CabinFormData } from "@/lib/validations/cabins";
import type { GuestOption } from "@/server/services/guests";
import {
  formatCurrency,
  formatDate,
  toDateInput,
  utcToLocalDay,
} from "@/lib/utils";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Menu from "@/components/ui/Menu";
import { ToastConfirmation } from "@/components/ui/ToastConfirmation";
import { FormBooking } from "./FormBooking";
import { cancelBookingAction } from "@/server/actions/bookings";

const sono = Sono({ subsets: ["latin"], weight: "600" });

const STATUS_STYLES: Record<string, string> = {
  unconfirmed: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  "checked-in": "bg-green-100 text-green-700",
  "checked-out": "bg-gray-200 text-gray-600",
};

const BOOKING_COLS = "grid-cols-[1fr_1.6fr_2fr_1.1fr_1fr_0.8fr_auto]";
export const bookingColumns = BOOKING_COLS;

type BookingTableRowProps = {
  booking: BookingsFormData;
  cabins: CabinFormData[];
  guests: GuestOption[];
  breakfastPrice: number;
  // All bookings, used to show cabin availability in the edit form.
  allBookings: BookingsFormData[];
};

export const BookingTableRow = ({
  booking,
  cabins,
  guests,
  breakfastPrice,
  allBookings,
}: BookingTableRowProps) => {
  const [isCancelPending, startCancelTransition] = useTransition();
  const {
    id,
    startDate,
    endDate,
    numberOfNights,
    numberOfGuests,
    totalPrice,
    status,
    hasBreakfast,
    hasPaid,
    cabinName,
    guestName,
    guestCountryFlag,
  } = booking;

  const badge = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";

  const handleCancel = () => {
    startCancelTransition(async () => {
      if (!id) return;
      const res = await cancelBookingAction(id);
      if (res.success) {
        toast.success("Booking cancelled");
      } else {
        toast.error(`Unable to cancel booking: ${res.appError?.message ?? ""}`);
      }
    });
  };

  // Availability for the edit form excludes the booking being edited.
  const otherBookings = allBookings.filter((b) => b.id !== id);

  return (
    <Table.Row className={BOOKING_COLS}>
      <div className={`font-semibold ${sono.className}`}>{cabinName}</div>

      <div className="flex items-center gap-2">
        {guestCountryFlag && <span>{guestCountryFlag}</span>}
        <span>{guestName}</span>
      </div>

      <div>
        <div className={`font-semibold ${sono.className}`}>
          {formatDate(startDate)} &rarr; {formatDate(endDate)}
        </div>
        <div className="text-gray-500 text-[1.3rem]">
          {numberOfNights} night{numberOfNights === 1 ? "" : "s"} &middot;{" "}
          {numberOfGuests} guest{numberOfGuests === 1 ? "" : "s"}
        </div>
      </div>

      <div>
        <span
          className={`inline-block uppercase text-[1.1rem] font-semibold px-3 py-1 rounded-full ${badge}`}
        >
          {status}
        </span>
      </div>

      <div className={`font-semibold ${sono.className}`}>
        {formatCurrency(totalPrice)}
        {hasBreakfast && (
          <div className="text-gray-500 text-[1.3rem] font-normal">
            + breakfast
          </div>
        )}
      </div>

      <div
        className={
          hasPaid ? "text-green-700 font-medium" : "text-red-600 font-medium"
        }
      >
        {hasPaid ? "Paid" : "Unpaid"}
      </div>

      <div className="text-center">
        {id && (
          <Menu>
            <Menu.ToggleButton id={id}>
              {(closeMenu) => (
                <>
                  <Modal>
                    <Modal.ButtonOpen>
                      <Menu.Button icon={<HiPencil />}>Edit</Menu.Button>
                    </Modal.ButtonOpen>
                    <Modal.Window>
                      <FormBooking
                        cabins={cabins}
                        guests={guests}
                        breakfastPrice={breakfastPrice}
                        existingBookings={otherBookings}
                        bookingId={id}
                        onFormEvent={closeMenu}
                        defaults={{
                          cabinId: String(booking.cabinId),
                          guestId: String(booking.guestId),
                          startDate: toDateInput(utcToLocalDay(startDate)),
                          endDate: toDateInput(utcToLocalDay(endDate)),
                          numberOfGuests,
                          status,
                          hasBreakfast,
                          hasPaid,
                          notes: booking.notes,
                        }}
                      />
                    </Modal.Window>
                  </Modal>
                  <ToastConfirmation
                    buttonName="Confirm Cancel"
                    messageBody={`Cancel the booking for ${guestName}?`}
                    handleConfirm={handleCancel}
                    isPending={isCancelPending}
                  >
                    <Menu.Button icon={<HiTrash />}>Cancel</Menu.Button>
                  </ToastConfirmation>
                </>
              )}
            </Menu.ToggleButton>
          </Menu>
        )}
      </div>
    </Table.Row>
  );
};
