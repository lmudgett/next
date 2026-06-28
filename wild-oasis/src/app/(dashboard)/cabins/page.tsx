import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { CabinTable } from "@/components/cabins/CabinTable";
import { getAllCabinsAction } from "@/server/actions/cabins";
import { TableSkeleton } from "@/components/ui/Skeleton";
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
  const { success, cabins, message } = await getCabins();

  if (!success) {
    return (
      <p>
        Sorry, there was a problem listing the cabins. Please contact the admin:
        <pre>{message}</pre>
      </p>
    );
  }

  return (
    <div className="row-vertical">
      <CabinTable cabins={cabins} />
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
