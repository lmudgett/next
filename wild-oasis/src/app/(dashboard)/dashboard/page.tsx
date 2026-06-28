import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-[3rem] font-semibold">dash</h1>
    </div>
  );
}
