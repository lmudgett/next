"use client";

import { useState } from "react";
import { CabinFormData } from "@/lib/validations/cabins";
import { CabinTableRow } from "./CabinTableRow";
import { FormCabin } from "./FormCabin";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { Sort } from "@/components/ui/Sort";
import Filter from "@/components/ui/Filter";

type CabinBooking = {
  cabinId: number;
  startDate: Date | string;
  endDate: Date | string;
};

type CabinTableProps = {
  cabins?: CabinFormData[];
  bookings?: CabinBooking[];
};

export const CabinTable: React.FC<CabinTableProps> = ({
  cabins,
  bookings = [],
}) => {
  const [sortedCabins, setSortedCabins] = useState<CabinFormData[] | undefined>(
    cabins
  );
  const [activeSort, setActiveSort] = useState<string | null>(null);

  // Re-sync the local (sortable) copy when the server-provided cabins change.
  // Adjusting state during render avoids an effect's cascading re-render.
  const [prevCabins, setPrevCabins] = useState(cabins);
  if (cabins !== prevCabins) {
    setPrevCabins(cabins);
    setSortedCabins(cabins);
  }

  return (
    <>
      <Filter
        name="cabinFilter"
        label="Filter"
        className="flex justify-end space-x-4 items-center"
      >
        <Filter.Option name="All" value="all" />
        <Filter.Option name="Discount" value="discount" />
        <Filter.Option name="No Discount" value="no_discount" />
      </Filter>
      <Table>
        <Table.Header className="table-cols-6">
          <div></div>
          <Table.Cell>
            <Sort
              columnName="name"
              data={sortedCabins}
              setData={setSortedCabins}
              setActiveSort={setActiveSort}
              activeSort={activeSort}
            >
              Name
            </Sort>
          </Table.Cell>
          <Table.Cell>
            <Sort
              columnName="maxCapacity"
              data={sortedCabins}
              setData={setSortedCabins}
              setActiveSort={setActiveSort}
              activeSort={activeSort}
            >
              Capacity
            </Sort>
          </Table.Cell>
          <Table.Cell>
            <Sort
              columnName="regularPrice"
              data={sortedCabins}
              setData={setSortedCabins}
              setActiveSort={setActiveSort}
              activeSort={activeSort}
            >
              Price
            </Sort>
          </Table.Cell>
          <Table.Cell>
            <Sort
              columnName="discount"
              data={sortedCabins}
              setData={setSortedCabins}
              setActiveSort={setActiveSort}
              activeSort={activeSort}
            >
              Discount
            </Sort>
          </Table.Cell>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => (
            <CabinTableRow
              cabin={cabin}
              bookings={bookings.filter((b) => b.cabinId === cabin.id)}
              key={cabin.id}
            />
          )}
        />
      </Table>
      <Modal>
        <Modal.ButtonOpen className="button-type-primary size-medium-button">
          Add Cabin
        </Modal.ButtonOpen>
        <Modal.Window>
          <FormCabin isEdit={false} />
        </Modal.Window>
      </Modal>
    </>
  );
};
