import { Sono } from "next/font/google";
import { BookingsFormData } from "@/lib/validations/bookings";
import { formatCurrency, formatDate } from "@/lib/utils";
import Table from "@/components/ui/Table";

const sono = Sono({ subsets: ["latin"], weight: "600" });

const STATUS_STYLES: Record<string, string> = {
  unconfirmed: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  "checked-in": "bg-green-100 text-green-700",
  "checked-out": "bg-gray-200 text-gray-600",
};

const BOOKING_COLS = "grid-cols-[2.4fr_1fr_1.2fr_1fr_0.8fr]";
export const bookingColumns = BOOKING_COLS;

type BookingTableRowProps = {
  booking: BookingsFormData;
};

export const BookingTableRow = ({ booking }: BookingTableRowProps) => {
  const {
    startDate,
    endDate,
    numberOfNights,
    numberOfGuests,
    totalPrice,
    status,
    hasBreakfast,
    hasPaid,
  } = booking;

  const badge = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";

  return (
    <Table.Row className={BOOKING_COLS}>
      <div>
        <div className={`font-semibold ${sono.className}`}>
          {formatDate(startDate)} &rarr; {formatDate(endDate)}
        </div>
        <div className="text-gray-500 text-[1.3rem]">
          {numberOfNights} night{numberOfNights === 1 ? "" : "s"}
        </div>
      </div>

      <div>
        {numberOfGuests} guest{numberOfGuests === 1 ? "" : "s"}
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
        className={hasPaid ? "text-green-700 font-medium" : "text-red-600 font-medium"}
      >
        {hasPaid ? "Paid" : "Unpaid"}
      </div>
    </Table.Row>
  );
};
