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
});

export type BookingsFormData = z.infer<typeof bookingsSchema>;
