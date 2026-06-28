import { z } from "zod";

export const guestSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email("A valid email is required"),
  nationality: z.string().min(1, "Nationality is required"),
  nationalId: z.string().min(1, "National ID is required"),
  // Emoji flag; optional in the form, defaulted when saved.
  countryFlag: z.string().optional(),
});

export type GuestFormData = z.infer<typeof guestSchema>;
