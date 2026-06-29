import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardFilter } from "@/components/dashboard/DashboardFilter";
import { Stats } from "@/components/dashboard/Stats";
import { DurationChart } from "@/components/dashboard/DurationChart";
import { TodayActivity } from "@/components/dashboard/TodayActivity";
import { getDashboardDataAction } from "@/server/actions/dashboard";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Bookings, sales, check-ins and occupancy at The Wild Oasis.",
};

// Depends on the ?last filter, so render fresh on each request.
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["7", "30", "90"]);

async function DashboardContent({ numDays }: { numDays: number }) {
  const { success, data, message } = await getDashboardDataAction(numDays);

  if (!success || !data) {
    return <ErrorMessage resource="dashboard" message={message} />;
  }

  return (
    <div className="flex flex-col gap-[2.4rem]">
      <Stats data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2.4rem]">
        <TodayActivity activity={data.todayActivity} />
        <DurationChart stays={data.confirmedStays} />
      </div>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ last?: string }>;
}) {
  const { last } = await searchParams;
  const numDays = last && ALLOWED.has(last) ? Number(last) : 7;

  return (
    <>
      <div className="row-horizontal">
        <h1>Dashboard</h1>
        <DashboardFilter />
      </div>
      <Suspense
        key={numDays}
        fallback={<TableSkeleton rows={4} columns={4} />}
      >
        <DashboardContent numDays={numDays} />
      </Suspense>
    </>
  );
}
