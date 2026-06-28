import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { getAllBookingsAction } from "@/server/actions/bookings";
import { TableSkeleton } from "@/components/ui/Skeleton";

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
  const { success, bookings, message } = await getBookings();

  if (!success) {
    return (
      <p>
        Sorry, there was a problem listing the bookings. Please contact the
        admin:
        <pre>{message}</pre>
      </p>
    );
  }

  return (
    <div className="row-vertical">
      <BookingsTable bookings={bookings} />
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
