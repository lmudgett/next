import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { getAllBookingsAction } from "@/server/actions/bookings";
import { getAllCabinsAction } from "@/server/actions/cabins";
import { getAllGuestsAction } from "@/server/actions/guests";
import { getSettingsAction } from "@/server/actions/settings";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

// Render dynamically so the data below actually streams on each request.
export const dynamic = "force-dynamic";

// Cached per request so generateMetadata and the page share a single query.
const getBookings = cache(getAllBookingsAction);

export async function generateMetadata(): Promise<Metadata> {
  const { bookings } = await getBookings();
  const count = bookings?.length ?? 0;
  const unpaid = bookings?.filter((b) => !b.hasPaid).length ?? 0;
  return {
    title: `Bookings (${count})`,
    description: `${count} bookings at The Wild Oasis${
      unpaid ? `, ${unpaid} awaiting payment` : ""
    }.`,
  };
}

async function BookingsContent() {
  // Bookings plus the reference data the edit form needs.
  const [bookingsRes, cabinsRes, guestsRes, settingsRes] = await Promise.all([
    getBookings(),
    getAllCabinsAction(),
    getAllGuestsAction(),
    getSettingsAction(),
  ]);

  if (!bookingsRes.success) {
    return <ErrorMessage resource="bookings" message={bookingsRes.message} />;
  }

  return (
    <div className="row-vertical">
      <BookingsTable
        bookings={bookingsRes.bookings}
        cabins={cabinsRes.cabins ?? []}
        guests={guestsRes.guests ?? []}
        breakfastPrice={settingsRes.settings?.breakfastPrice ?? 0}
      />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <>
      <div className="row-horizontal">
        <h1>All Bookings</h1>
      </div>
      <Suspense fallback={<TableSkeleton rows={4} columns={6} />}>
        <BookingsContent />
      </Suspense>
    </>
  );
}
