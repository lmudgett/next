"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestSchema, GuestFormData } from "@/lib/validations/guests";
import type { GuestOption } from "@/server/services/guests";
import { createGuestAction } from "@/server/actions/guests";

type GuestPickerProps = {
  guests: GuestOption[];
  onSelect: (guest: GuestOption) => void;
  onClose?: () => void;
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-red-600 text-[1.3rem]">{message}</p> : null;

export const GuestPicker = ({ guests, onSelect, onClose }: GuestPickerProps) => {
  const [mode, setMode] = useState<"list" | "new">("list");
  const [query, setQuery] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormData>({ resolver: zodResolver(guestSchema) });

  const filtered = guests.filter((g) =>
    g.fullName.toLowerCase().includes(query.toLowerCase())
  );

  const choose = (g: GuestOption) => {
    onSelect(g);
    onClose?.();
  };

  const onSubmit = async (data: GuestFormData) => {
    const res = await createGuestAction(data);
    if (res.success && res.guest) {
      toast.success("Guest added");
      onSelect(res.guest);
      onClose?.();
    } else {
      toast.error(`Unable to add guest: ${res.appError?.message ?? ""}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 min-w-[34rem]">
      <h2 className="text-[2rem] font-semibold">Select a guest</h2>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("list")}
          className={`size-medium-button ${
            mode === "list" ? "button-type-primary" : "button-type-secondary"
          }`}
        >
          Existing
        </button>
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`size-medium-button ${
            mode === "new" ? "button-type-primary" : "button-type-secondary"
          }`}
        >
          Add new
        </button>
      </div>

      {mode === "list" ? (
        <div className="flex flex-col gap-2">
          <input
            placeholder="Search guests…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-200 rounded px-3 py-2"
          />
          <ul className="max-h-[22rem] overflow-auto divide-y divide-gray-100">
            {filtered.length === 0 && (
              <li className="text-gray-500 py-3">No guests found.</li>
            )}
            {filtered.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => choose(g)}
                  className="w-full text-left py-3 px-2 hover:bg-gray-50 flex items-center gap-3"
                >
                  <span>{g.countryFlag}</span>
                  <span>{g.fullName}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="form-row">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" type="text" {...register("fullName")} />
            <FieldError message={errors.fullName?.message} />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="form-row">
            <label htmlFor="nationality">Nationality</label>
            <input id="nationality" type="text" {...register("nationality")} />
            <FieldError message={errors.nationality?.message} />
          </div>
          <div className="form-row">
            <label htmlFor="nationalId">National ID</label>
            <input id="nationalId" type="text" {...register("nationalId")} />
            <FieldError message={errors.nationalId?.message} />
          </div>
          <div className="form-row">
            <label htmlFor="countryFlag">Country flag</label>
            <input
              id="countryFlag"
              type="text"
              placeholder="🏳️"
              {...register("countryFlag")}
            />
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
              {isSubmitting ? "Saving..." : "Add Guest"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
