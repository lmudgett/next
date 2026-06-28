"use client";
import { BookingsFormData } from "@/lib/validations/bookings";
import Table from "@/components/ui/Table";
import { BookingTableRow, bookingColumns } from "./BookingTableRow";

type BookingsTableProps = {
  bookings?: BookingsFormData[];
};

export const BookingsTable: React.FC<BookingsTableProps> = ({ bookings }) => {
  return (
    <Table>
      <Table.Header className={bookingColumns}>
        <Table.Cell>Dates</Table.Cell>
        <Table.Cell>Guests</Table.Cell>
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
  );
};
