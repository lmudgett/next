import type { Metadata } from "next";
import { FormBooking } from "@/components/bookings/FormBooking";
import { getAllCabinsAction } from "@/server/actions/cabins";
import { getAllGuestsAction } from "@/server/actions/guests";
import { getSettingsAction } from "@/server/actions/settings";
import { getAllBookingsAction } from "@/server/actions/bookings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New Booking" };

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ cabinId?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;

  const [cabinsRes, guestsRes, settingsRes, bookingsRes] = await Promise.all([
    getAllCabinsAction(),
    getAllGuestsAction(),
    getSettingsAction(),
    getAllBookingsAction(),
  ]);

  const existingBookings = (bookingsRes.bookings ?? []).map((b) => ({
    cabinId: b.cabinId,
    startDate: b.startDate,
    endDate: b.endDate,
  }));

  return (
    <>
      <div className="row-horizontal">
        <h1>New Booking</h1>
      </div>
      <FormBooking
        cabins={cabinsRes.cabins ?? []}
        guests={guestsRes.guests ?? []}
        breakfastPrice={settingsRes.settings?.breakfastPrice ?? 0}
        existingBookings={existingBookings}
        defaults={{
          cabinId: sp.cabinId,
          startDate: sp.from,
          endDate: sp.to,
        }}
      />
    </>
  );
}
