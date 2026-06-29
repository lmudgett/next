"use client";
import { useTransition } from "react";
import toast from "react-hot-toast";
import type { TodayActivityItem } from "@/server/services/dashboard";
import { setBookingStatusAction } from "@/server/actions/bookings";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

const TAG_STYLES: Record<string, string> = {
  unconfirmed: "bg-green-100 text-green-700",
  "checked-in": "bg-blue-100 text-blue-700",
};

const ActivityRow = ({ item }: { item: TodayActivityItem }) => {
  const [isPending, startTransition] = useTransition();
  const arriving = item.status === "unconfirmed";

  const handleAction = () => {
    startTransition(async () => {
      const nextStatus = arriving ? "checked-in" : "checked-out";
      const res = await setBookingStatusAction(item.id, nextStatus);
      if (res.success) {
        toast.success(arriving ? "Guest checked in" : "Guest checked out");
      } else {
        toast.error(`Action failed: ${res.appError?.message ?? ""}`);
      }
    });
  };

  return (
    <li className="flex items-center gap-[1.6rem] py-[1.2rem] border-b border-gray-100 last:border-b-0">
      <Tag className={TAG_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}>
        {arriving ? "Arriving" : "Departing"}
      </Tag>
      <span>{item.guestCountryFlag}</span>
      <span className="font-medium flex-1">{item.guestName}</span>
      <span className="text-gray-500 text-[1.3rem]">
        {item.numberOfNights} night{item.numberOfNights === 1 ? "" : "s"}
      </span>
      <Button size="small" onClick={handleAction} disabled={isPending}>
        {isPending ? "…" : arriving ? "Check in" : "Check out"}
      </Button>
    </li>
  );
};

type TodayActivityProps = {
  activity: TodayActivityItem[];
};

export const TodayActivity = ({ activity }: TodayActivityProps) => (
  <div className="bg-white border border-gray-100 rounded-md p-[3.2rem] flex flex-col gap-[0.8rem]">
    <h2>Today</h2>
    {activity.length === 0 ? (
      <p className="text-gray-500">No activity today…</p>
    ) : (
      <ul className="flex flex-col">
        {activity.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}
      </ul>
    )}
  </div>
);
