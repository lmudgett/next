"use client";
import Link from "next/link";
import { BookingsFormData } from "@/lib/validations/bookings";
import Table from "@/components/ui/Table";
import { BookingTableRow, bookingColumns } from "./BookingTableRow";

type BookingsTableProps = {
  bookings?: BookingsFormData[];
};

export const BookingsTable: React.FC<BookingsTableProps> = ({ bookings }) => {
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
        </Table.Header>
        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingTableRow booking={booking} key={booking.id} />
          )}
        />
      </Table>
      <Link
        href="/bookings/new"
        className="button-type-primary size-medium-button"
      >
        Add Booking
      </Link>
    </>
  );
};
