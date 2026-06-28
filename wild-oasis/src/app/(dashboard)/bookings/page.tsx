import { Suspense } from "react";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { getAllBookingsAction } from "@/server/actions/bookings";
import { TableSkeleton } from "@/components/ui/Skeleton";

// Render dynamically so the data below actually streams on each request.
export const dynamic = "force-dynamic";

async function BookingsContent() {
  const { success, bookings, message } = await getAllBookingsAction();

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
