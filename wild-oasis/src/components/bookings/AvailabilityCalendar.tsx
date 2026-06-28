"use client";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { utcToLocalDay } from "@/lib/utils";

export type BookedRange = {
  startDate: Date | string;
  endDate: Date | string;
};

type AvailabilityCalendarProps = {
  bookings: BookedRange[];
  selected?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  numberOfMonths?: number;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const AvailabilityCalendar = ({
  bookings,
  selected,
  onSelect,
  numberOfMonths = 1,
}: AvailabilityCalendarProps) => {
  const today = startOfToday();
  const bookedRanges = bookings.map((b) => ({
    from: utcToLocalDay(b.startDate),
    to: utcToLocalDay(b.endDate),
  }));

  return (
    <div>
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={onSelect}
        // Past days and already-booked ranges can't be selected.
        disabled={[{ before: today }, ...bookedRanges]}
        modifiers={{ booked: bookedRanges }}
        modifiersStyles={{
          booked: { color: "#dc2626", textDecoration: "line-through" },
        }}
        numberOfMonths={numberOfMonths}
        defaultMonth={selected?.from ?? today}
      />
      <p className="text-[1.3rem] text-gray-500 mt-2">
        <span className="text-red-600 line-through">Struck-through</span> dates
        are already booked.
      </p>
    </div>
  );
};
