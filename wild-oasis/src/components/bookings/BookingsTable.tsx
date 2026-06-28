"use client";
import { BookingsFormData } from "@/lib/validations/bookings";
import { CabinFormData } from "@/lib/validations/cabins";
import type { GuestOption } from "@/server/services/guests";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { BookingTableRow, bookingColumns } from "./BookingTableRow";
import { FormBooking } from "./FormBooking";

type BookingsTableProps = {
  bookings?: BookingsFormData[];
  cabins: CabinFormData[];
  guests: GuestOption[];
  breakfastPrice: number;
};

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
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
        </Table.Header>
        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingTableRow booking={booking} key={booking.id} />
          )}
        />
      </Table>
      <Modal>
        <Modal.ButtonOpen className="button-type-primary size-medium-button">
          Add Booking
        </Modal.ButtonOpen>
        <Modal.Window>
          <FormBooking
            cabins={cabins}
            guests={guests}
            breakfastPrice={breakfastPrice}
          />
        </Modal.Window>
      </Modal>
    </>
  );
};
