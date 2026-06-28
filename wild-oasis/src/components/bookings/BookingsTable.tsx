"use client";
import Link from "next/link";
import { BookingsFormData } from "@/lib/validations/bookings";
import { CabinFormData } from "@/lib/validations/cabins";
import type { GuestOption } from "@/server/services/guests";
import Table from "@/components/ui/Table";
import { BookingTableRow, bookingColumns } from "./BookingTableRow";

type BookingsTableProps = {
  bookings?: BookingsFormData[];
  cabins: CabinFormData[];
  guests: GuestOption[];
  breakfastPrice: number;
};

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings = [],
  cabins,
  guests,
  breakfastPrice,
}) => {
  return (
    <>
      <Table>
        <Table.Header className={bookingColumns}>
          <Table.Cell>Cabin</Table.Cell>
          <Table.Cell>Guest</Table.Cell>
          <Table.Cell>Dates</Table.Cell>
          <Table.Cell>Status</Table.Cell>
          <Table.Cell>Amount</Table.Cell>
          <Table.Cell>Paid</Table.Cell>
          <div></div>
        </Table.Header>
        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingTableRow
              booking={booking}
              cabins={cabins}
              guests={guests}
              breakfastPrice={breakfastPrice}
              allBookings={bookings}
              key={booking.id}
            />
          )}
        />
      </Table>
      <Link
        href="/bookings/create"
        className="button-type-primary size-medium-button text-center"
      >
        Add Booking
      </Link>
    </>
  );
};
