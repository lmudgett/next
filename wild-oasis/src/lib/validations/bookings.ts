import { z } from "zod";

export const bookingsSchema = z.object({
  // Optional: absent when creating a booking, present once persisted.
  id: z.number().optional(),
  startDate: z.date(),
  endDate: z.date(),
  numberOfNights: z.number(),
  numberOfGuests: z.number(),
  cabinPrice: z.number(),
  extraPrice: z.number(),
  totalPrice: z.number(),
  status: z.string(),
  hasBreakfast: z.boolean(),
  hasPaid: z.boolean(),
  notes: z.string(),
  // Foreign keys to the cabin and guest a booking belongs to.
  cabinId: z.number(),
  guestId: z.number(),
  // Display-only, populated from the related records (not form inputs).
  cabinName: z.string().optional(),
  guestName: z.string().optional(),
  guestCountryFlag: z.string().optional(),
});

export type BookingsFormData = z.infer<typeof bookingsSchema>;

// User-entered fields for the "new booking" form. Derived values (nights,
// prices) are computed on submit; the FKs come from <select> values (strings).
export const bookingFormSchema = z
  .object({
    cabinId: z.string().min(1, "Please select a cabin"),
    guestId: z.string().min(1, "Please select a guest"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    numberOfGuests: z
      .number({ error: "Enter the number of guests" })
      .int()
      .min(1, "At least one guest"),
    status: z.string().min(1),
    hasBreakfast: z.boolean(),
    hasPaid: z.boolean(),
    notes: z.string(),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

export type BookingFormInput = z.infer<typeof bookingFormSchema>;
