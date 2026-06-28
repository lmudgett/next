import { z } from "zod";

export const settingsSchema = z.object({
  id: z.number().readonly(),
  minBookingLength: z.preprocess(
    (val) => Number(val),
    z
      .number({
        error: "Min booking length must be a number",
      })
      .gt(0, "Min booking must be greater than zero")
  ),
  maxBookingLength: z.preprocess(
    (val) => Number(val),
    z
      .number({
        error: "Max booking length must be a number",
      })
      .gt(0, "Max booking must be greater than zero")
  ),
  maxGuestNumberPerBooking: z.preprocess(
    (val) => Number(val),
    z
      .number({
        error: "Max booking length must be a number",
      })
      .gt(0, "Max guests per booking must be greater than zero")
  ),
  breakfastPrice: z.preprocess(
    (val) => Number(val),
    z
      .number({
        error: "Breakfast Price must be a number",
      })
      .gt(0, "Breakfast price must be greater than zero")
  ),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
