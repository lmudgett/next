"use client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingFormSchema,
  BookingFormInput,
  BookingsFormData,
} from "@/lib/validations/bookings";
import { CabinFormData } from "@/lib/validations/cabins";
import type { GuestOption } from "@/server/services/guests";
import { createBookingAction } from "@/server/actions/bookings";

type FormBookingProps = {
  cabins: CabinFormData[];
  guests: GuestOption[];
  breakfastPrice: number;
  onClose?: () => void;
};

const STATUSES = ["unconfirmed", "confirmed", "checked-in", "checked-out"];

const Error = ({ message }: { message?: string }) =>
  message ? <p className="text-red-600 text-[1.3rem]">{message}</p> : null;

export const FormBooking = ({
  cabins,
  guests,
  breakfastPrice,
  onClose,
}: FormBookingProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      cabinId: "",
      guestId: "",
      startDate: "",
      endDate: "",
      numberOfGuests: 1,
      status: "unconfirmed",
      hasBreakfast: false,
      hasPaid: false,
      notes: "",
    },
  });

  const onSubmit = async (data: BookingFormInput) => {
    const cabin = cabins.find((c) => String(c.id) === data.cabinId);
    if (!cabin) {
      toast.error("Selected cabin not found");
      return;
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const nights = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / 86_400_000)
    );
    const cabinPrice = (cabin.regularPrice - (cabin.discount || 0)) * nights;
    const extraPrice = data.hasBreakfast
      ? breakfastPrice * nights * data.numberOfGuests
      : 0;

    const payload: BookingsFormData = {
      startDate: start,
      endDate: end,
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

    const res = await createBookingAction(payload);
    if (res.success) {
      toast.success("Booking created");
      reset();
      onClose?.();
    } else {
      toast.error(`Unable to create booking: ${res.appError?.message ?? ""}`);
    }
  };

  return (
    <form className="form-regular" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <label htmlFor="cabinId">Cabin</label>
        <select id="cabinId" {...register("cabinId")}>
          <option value="">Select a cabin…</option>
          {cabins.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <Error message={errors.cabinId?.message} />
      </div>

      <div className="form-row">
        <label htmlFor="guestId">Guest</label>
        <select id="guestId" {...register("guestId")}>
          <option value="">Select a guest…</option>
          {guests.map((g) => (
            <option key={g.id} value={String(g.id)}>
              {g.countryFlag} {g.fullName}
            </option>
          ))}
        </select>
        <Error message={errors.guestId?.message} />
      </div>

      <div className="form-row">
        <label htmlFor="startDate">Start date</label>
        <input id="startDate" type="date" {...register("startDate")} />
        <Error message={errors.startDate?.message} />
      </div>

      <div className="form-row">
        <label htmlFor="endDate">End date</label>
        <input id="endDate" type="date" {...register("endDate")} />
        <Error message={errors.endDate?.message} />
      </div>

      <div className="form-row">
        <label htmlFor="numberOfGuests">Number of guests</label>
        <input
          id="numberOfGuests"
          type="number"
          min={1}
          {...register("numberOfGuests", { valueAsNumber: true })}
        />
        <Error message={errors.numberOfGuests?.message} />
      </div>

      <div className="form-row">
        <label htmlFor="status">Status</label>
        <select id="status" {...register("status")}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="hasBreakfast">Includes breakfast</label>
        <input id="hasBreakfast" type="checkbox" {...register("hasBreakfast")} />
      </div>

      <div className="form-row">
        <label htmlFor="hasPaid">Paid</label>
        <input id="hasPaid" type="checkbox" {...register("hasPaid")} />
      </div>

      <div className="form-row">
        <label htmlFor="notes">Notes</label>
        <input id="notes" type="text" {...register("notes")} />
      </div>

      <div className="form-row">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="button-type-secondary size-medium-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="button-type-primary size-medium-button"
        >
          {isSubmitting ? "Saving..." : "Create Booking"}
        </button>
      </div>
    </form>
  );
};
