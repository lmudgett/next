import type { DashboardStay } from "@/server/services/dashboard";

// Same buckets as the reference DurationChart, drawn as CSS bars instead of a
// recharts pie so no charting dependency is needed.
const BUCKETS: { label: string; color: string; match: (n: number) => boolean }[] =
  [
    { label: "1 night", color: "bg-blue-500", match: (n) => n === 1 },
    { label: "2 nights", color: "bg-teal-500", match: (n) => n === 2 },
    { label: "3 nights", color: "bg-green-500", match: (n) => n === 3 },
    { label: "4-5 nights", color: "bg-lime-500", match: (n) => n >= 4 && n <= 5 },
    { label: "6-7 nights", color: "bg-yellow-500", match: (n) => n >= 6 && n <= 7 },
    { label: "8-14 nights", color: "bg-orange-500", match: (n) => n >= 8 && n <= 14 },
    { label: "15-21 nights", color: "bg-amber-700", match: (n) => n >= 15 && n <= 21 },
    { label: "21+ nights", color: "bg-indigo-700", match: (n) => n > 21 },
  ];

type DurationChartProps = {
  stays: DashboardStay[];
};

export const DurationChart = ({ stays }: DurationChartProps) => {
  const total = stays.length;
  const rows = BUCKETS.map((b) => ({
    ...b,
    count: stays.filter((s) => b.match(s.numberOfNights)).length,
  })).filter((b) => b.count > 0);

  return (
    <div className="bg-white border border-gray-100 rounded-md p-[3.2rem] flex flex-col gap-[1.6rem]">
      <h2>Stay duration summary</h2>

      {total === 0 ? (
        <p className="text-gray-500">No confirmed stays in this period.</p>
      ) : (
        <ul className="flex flex-col gap-[1.2rem]">
          {rows.map((r) => {
            const pct = Math.round((r.count / total) * 100);
            return (
              <li key={r.label} className="flex items-center gap-[1.2rem]">
                <span className="w-[10rem] text-[1.3rem] text-gray-600 shrink-0">
                  {r.label}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-[1.2rem] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-[7rem] text-right text-[1.3rem] text-gray-500 shrink-0">
                  {r.count} ({pct}%)
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
