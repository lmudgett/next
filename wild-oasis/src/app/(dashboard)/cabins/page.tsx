import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { CabinTable } from "@/components/cabins/CabinTable";
import { getAllCabinsAction } from "@/server/actions/cabins";
import { getAllBookingsAction } from "@/server/actions/bookings";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import "./style.css";

// Render dynamically so the data below actually streams on each request.
export const dynamic = "force-dynamic";

// Cached per request so generateMetadata and the page share a single query.
const getCabins = cache(getAllCabinsAction);

export async function generateMetadata(): Promise<Metadata> {
  const { cabins } = await getCabins();
  const count = cabins?.length ?? 0;
  return {
    title: `Cabins (${count})`,
    description: `Manage the ${count} cabins at The Wild Oasis.`,
  };
}

async function CabinsContent() {
  const [{ success, cabins, message }, bookingsRes] = await Promise.all([
    getCabins(),
    getAllBookingsAction(),
  ]);

  if (!success) {
    return <ErrorMessage resource="cabins" message={message} />;
  }

  const bookings = (bookingsRes.bookings ?? []).map((b) => ({
    cabinId: b.cabinId,
    startDate: b.startDate,
    endDate: b.endDate,
  }));

  return (
    <div className="row-vertical">
      <CabinTable cabins={cabins} bookings={bookings} />
    </div>
  );
}

export default function CabinsPage() {
  return (
    <>
      <div className="row-horizontal">
        <h1>All Cabins</h1>
      </div>
      <Suspense fallback={<TableSkeleton rows={6} columns={6} />}>
        <CabinsContent />
      </Suspense>
    </>
  );
}
