import { z } from "zod";

export const bookingsSchema = z.object({
  id: z.number().readonly(),
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
