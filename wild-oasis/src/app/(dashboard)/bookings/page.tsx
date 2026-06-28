import { BookingsTable } from "@/components/bookings/BookingsTable";
import { getAllBookingsAction } from "@/server/actions/bookings";

export default async function BookingsPage() {
  const { success, bookings, message } = await getAllBookingsAction();

  return (
    <>
      <div className="row-horizontal">
        <h1>All Bookings</h1>
      </div>
      {success ? (
        <div className="row-vertical">
          <BookingsTable bookings={bookings} />
        </div>
      ) : (
        <p>
          Sorry, there was a problem listing the bookings. Please contact the
          admin:
          <pre>{message}</pre>
        </p>
      )}
    </>
  );
}
