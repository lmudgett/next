"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import {
  AvailabilityCalendar,
  BookedRange,
} from "@/components/bookings/AvailabilityCalendar";
import { toDateInput } from "@/lib/utils";

type CabinAvailabilityProps = {
  cabinId: number;
  cabinName: string;
  bookings: BookedRange[];
  onClose?: () => void;
};

export const CabinAvailability = ({
  cabinId,
  cabinName,
  bookings,
  onClose,
}: CabinAvailabilityProps) => {
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>();

  const goToAdd = () => {
    const params = new URLSearchParams({ cabinId: String(cabinId) });
    if (range?.from) params.set("from", toDateInput(range.from));
    if (range?.to) params.set("to", toDateInput(range.to));
    onClose?.();
    router.push(`/bookings/create?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[2rem] font-semibold">
        Availability — Cabin {cabinName}
      </h2>
      <AvailabilityCalendar
        bookings={bookings}
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
      />
      <div className="form-row">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="button-type-secondary size-medium-button"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={goToAdd}
          disabled={!range?.from || !range?.to}
          className="button-type-primary size-medium-button"
        >
          Add Booking
        </button>
      </div>
    </div>
  );
};
