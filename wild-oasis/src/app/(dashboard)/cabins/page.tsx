import { Suspense } from "react";
import { CabinTable } from "@/components/cabins/CabinTable";
import { getAllCabinsAction } from "@/server/actions/cabins";
import { TableSkeleton } from "@/components/ui/Skeleton";
import "./style.css";

// Render dynamically so the data below actually streams on each request.
export const dynamic = "force-dynamic";

async function CabinsContent() {
  const { success, cabins, message } = await getAllCabinsAction();

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
