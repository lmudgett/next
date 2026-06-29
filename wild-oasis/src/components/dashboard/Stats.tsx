import {
  HiOutlineBriefcase,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import type { DashboardData } from "@/server/services/dashboard";
import { formatCurrency } from "@/lib/utils";

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
};

const StatCard = ({ icon, title, value, color }: StatCardProps) => (
  <div className="bg-white border border-gray-100 rounded-md p-[1.6rem] flex items-center gap-[1.6rem]">
    <span
      className={`flex items-center justify-center h-[5.2rem] w-[5.2rem] rounded-full ${color}`}
    >
      {icon}
    </span>
    <div className="flex flex-col">
      <span className="text-[1.2rem] uppercase tracking-wide font-semibold text-gray-500">
        {title}
      </span>
      <span className="text-[2.4rem] font-medium">{value}</span>
    </div>
  </div>
);

type StatsProps = {
  data: DashboardData;
};

export const Stats = ({ data }: StatsProps) => {
  const { bookings, confirmedStays, cabinCount, numDays } = data;

  const numBookings = bookings.length;
  const sales = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const checkins = confirmedStays.length;
  const totalNights = confirmedStays.reduce(
    (acc, s) => acc + s.numberOfNights,
    0
  );
  const occupancy =
    cabinCount > 0
      ? Math.round((totalNights / (numDays * cabinCount)) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[1.6rem]">
      <StatCard
        icon={<HiOutlineBriefcase size={26} className="text-blue-600" />}
        title="Bookings"
        value={String(numBookings)}
        color="bg-blue-100"
      />
      <StatCard
        icon={<HiOutlineBanknotes size={26} className="text-green-600" />}
        title="Sales"
        value={formatCurrency(sales)}
        color="bg-green-100"
      />
      <StatCard
        icon={<HiOutlineCalendarDays size={26} className="text-indigo-600" />}
        title="Check ins"
        value={String(checkins)}
        color="bg-indigo-100"
      />
      <StatCard
        icon={<HiOutlineChartBar size={26} className="text-yellow-600" />}
        title="Occupancy rate"
        value={`${occupancy}%`}
        color="bg-yellow-100"
      />
    </div>
  );
};
