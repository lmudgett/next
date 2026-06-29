"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DateRange } from "react-day-picker";
import { MdImportContacts } from "react-icons/md";
import {
  bookingFormSchema,
  BookingFormInput,
  BookingsFormData,
} from "@/lib/validations/bookings";
import { CabinFormData } from "@/lib/validations/cabins";
import type { GuestOption } from "@/server/services/guests";
import {
  createBookingAction,
  updateBookingAction,
} from "@/server/actions/bookings";
import { formatDate, toDateInput, parseDateInput } from "@/lib/utils";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { GuestPicker } from "./GuestPicker";
import Modal from "@/components/ui/Modal";
import { Button, buttonClasses } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";

export type ExistingBooking = {
  cabinId: number;
  startDate: Date | string;
  endDate: Date | string;
};

type FormBookingDefaults = {
  cabinId?: string;
  guestId?: string;
  startDate?: string;
  endDate?: string;
  numberOfGuests?: number;
  status?: string;
  hasBreakfast?: boolean;
  hasPaid?: boolean;
  notes?: string;
};

type FormBookingProps = {
  cabins: CabinFormData[];
  guests: GuestOption[];
  breakfastPrice: number;
  existingBookings: ExistingBooking[];
  // Present => editing that booking; absent => creating.
  bookingId?: number;
  // Provided => rendered in a modal (close on done); absent => page (redirect).
  onClose?: () => void;
  // Optional extra cleanup when used inside a row menu (e.g. close the menu).
  onFormEvent?: () => void;
  defaults?: FormBookingDefaults;
};

const STATUSES = ["unconfirmed", "confirmed", "checked-in", "checked-out"];

// Consistent label + control row (avoids the modal-oriented .form-row grid,
// which right-aligns any row containing a button).
const Row = ({
  label,
  htmlFor,
  align = "center",
  children,
}: {
  label: string;
  htmlFor?: string;
  align?: "center" | "start";
  children: React.ReactNode;
}) => (
  <div
    className={`grid grid-cols-[10rem_1fr] gap-6 ${
      align === "start" ? "items-start" : "items-center"
    }`}
  >
    <label htmlFor={htmlFor} className="font-medium text-gray-600">
      {label}
    </label>
    <div>{children}</div>
  </div>
);

export const FormBooking = ({
  cabins,
  guests,
  breakfastPrice,
  existingBookings,
  bookingId,
  onClose,
  onFormEvent,
  defaults,
}: FormBookingProps) => {
  const router = useRouter();
  const close = () => {
    onFormEvent?.();
    if (onClose) {
      onClose();
      router.refresh();
    } else {
      router.push("/bookings");
    }
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      cabinId: defaults?.cabinId ?? "",
      guestId: defaults?.guestId ?? "",
      startDate: defaults?.startDate ?? "",
      endDate: defaults?.endDate ?? "",
      numberOfGuests: defaults?.numberOfGuests ?? 1,
      status: defaults?.status ?? "unconfirmed",
      hasBreakfast: defaults?.hasBreakfast ?? false,
      hasPaid: defaults?.hasPaid ?? false,
      notes: defaults?.notes ?? "",
    },
  });

  const selectedCabinId = watch("cabinId");
  const startStr = watch("startDate");
  const endStr = watch("endDate");
  const guestIdStr = watch("guestId");

  // Local guest list so newly-created guests appear immediately.
  const [guestList, setGuestList] = useState<GuestOption[]>(guests);
  const selectedGuest = guestList.find((g) => String(g.id) === guestIdStr);

  const handleSelectGuest = (guest: GuestOption) => {
    setGuestList((prev) =>
      prev.some((g) => g.id === guest.id) ? prev : [...prev, guest]
    );
    setValue("guestId", String(guest.id), { shouldValidate: true });
  };

  const cabinBookings = existingBookings.filter(
    (b) => String(b.cabinId) === selectedCabinId
  );

  const range: DateRange | undefined = startStr
    ? { from: parseDateInput(startStr), to: endStr ? parseDateInput(endStr) : undefined }
    : undefined;

  const handleRange = (r?: DateRange) => {
    setValue("startDate", r?.from ? toDateInput(r.from) : "", {
      shouldValidate: true,
    });
    setValue("endDate", r?.to ? toDateInput(r.to) : "", {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: BookingFormInput) => {
    const cabin = cabins.find((c) => String(c.id) === data.cabinId);
    if (!cabin) {
      toast.error("Selected cabin not found");
      return;
    }

    const start = parseDateInput(data.startDate);
    const end = parseDateInput(data.endDate);
    const nights = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / 86_400_000)
    );

    const cabinPrice = (cabin.regularPrice - (cabin.discount || 0)) * nights;
    const extraPrice = data.hasBreakfast
      ? breakfastPrice * nights * data.numberOfGuests
      : 0;

    const payload: BookingsFormData = {
      id: bookingId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      numberOfNights: nights,
      numberOfGuests: data.numberOfGuests,
      cabinPrice,
      extraPrice,
      totalPrice: cabinPrice + extraPrice,
      status: data.status,
      hasBreakfast: data.hasBreakfast,
      hasPaid: data.hasPaid,
      notes: data.notes,
      cabinId: Number(data.cabinId),
      guestId: Number(data.guestId),
    };

    const res = bookingId
      ? await updateBookingAction(payload)
      : await createBookingAction(payload);
    if (res.success) {
      toast.success(bookingId ? "Booking updated" : "Booking created");
      close();
    } else {
      toast.error(
        `Unable to ${bookingId ? "update" : "create"} booking: ${
          res.appError?.message ?? ""
        }`
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="form-regular max-w-3xl flex flex-col gap-5"
    >
      <Row label="Cabin" htmlFor="cabinId">
        <select
          id="cabinId"
          className="w-full border border-gray-300 rounded px-3 py-2"
          {...register("cabinId")}
        >
          <option value="">Select a cabin…</option>
          {cabins.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.cabinId?.message} />
      </Row>

      <Row label="Guest">
        <div className="flex items-center gap-3 flex-wrap">
          <input type="hidden" {...register("guestId")} />
          <span className={selectedGuest ? "font-medium" : "text-gray-500"}>
            {selectedGuest
              ? `${selectedGuest.countryFlag} ${selectedGuest.fullName}`
              : "No guest selected"}
          </span>
          <Modal>
            <Modal.ButtonOpen
              className={buttonClasses(
                "secondary",
                "medium",
                "inline-flex items-center gap-2"
              )}
            >
              <MdImportContacts size={18} />
              <span>Choose</span>
            </Modal.ButtonOpen>
            <Modal.Window>
              <GuestPicker guests={guestList} onSelect={handleSelectGuest} />
            </Modal.Window>
          </Modal>
        </div>
        <FieldError message={errors.guestId?.message} />
      </Row>

      <Row label="Dates" align="start">
        {selectedCabinId ? (
          <div>
            <AvailabilityCalendar
              bookings={cabinBookings}
              selected={range}
              onSelect={handleRange}
            />
            <p className="text-[1.4rem] mt-2">
              {range?.from && range?.to
                ? `${formatDate(new Date(startStr))} → ${formatDate(
                    new Date(endStr)
                  )}`
                : "Select a check-in and check-out date."}
            </p>
            <FieldError message={errors.startDate?.message} />
            <FieldError message={errors.endDate?.message} />
          </div>
        ) : (
          <p className="text-gray-500">
            Select a cabin to choose available dates.
          </p>
        )}
      </Row>

      <Row label="Guests" htmlFor="numberOfGuests">
        <input
          id="numberOfGuests"
          type="number"
          min={1}
          className="w-28"
          {...register("numberOfGuests", { valueAsNumber: true })}
        />
        <FieldError message={errors.numberOfGuests?.message} />
      </Row>

      <Row label="Status" htmlFor="status">
        <select
          id="status"
          className="w-full border border-gray-300 rounded px-3 py-2"
          {...register("status")}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Row>

      <Row label="Breakfast" htmlFor="hasBreakfast">
        <input
          id="hasBreakfast"
          type="checkbox"
          className="w-5 h-5 p-0"
          {...register("hasBreakfast")}
        />
      </Row>

      <Row label="Paid" htmlFor="hasPaid">
        <input
          id="hasPaid"
          type="checkbox"
          className="w-5 h-5 p-0"
          {...register("hasPaid")}
        />
      </Row>

      <Row label="Notes" htmlFor="notes">
        <input id="notes" type="text" className="w-full" {...register("notes")} />
      </Row>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={() => close()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : bookingId
            ? "Update Booking"
            : "Create Booking"}
        </Button>
      </div>
    </form>
  );
};
