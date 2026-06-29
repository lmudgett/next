"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { buttonClasses } from "@/components/ui/Button";

const OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

export const DashboardFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("last") ?? "7";

  const setLast = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("last", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 bg-white border border-gray-100 rounded-md p-[0.4rem] shadow-sm">
      {OPTIONS.map((o) => {
        const active = o.value === current;
        return (
          <button
            key={o.value}
            onClick={() => setLast(o.value)}
            className={
              active
                ? buttonClasses("primary", "small", "rounded")
                : "size-small-button rounded bg-white text-gray-600 hover:bg-indigo-600 hover:text-indigo-50"
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};
