"use client";

import { useState } from "react";
import Link from "next/link";
import { CabinFormData } from "@/lib/validations/cabins";
import { CabinTableRow } from "./CabinTableRow";
import Table from "@/components/ui/Table";
import { Sort } from "@/components/ui/Sort";
import { buttonClasses } from "@/components/ui/Button";

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
      <Link
        href="/cabins/create"
        className={buttonClasses("primary", "medium", "text-center")}
      >
        Add Cabin
      </Link>
    </>
  );
};
