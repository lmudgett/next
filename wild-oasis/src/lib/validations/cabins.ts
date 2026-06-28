import { z } from "zod";

export const cabinSchema = z
  .object({
    id: z.number().nullable().optional(),
    name: z
      .string()
      .min(3, { message: "Name is required with a lenght of 3 characters" }),
    maxCapacity: z
      .number({ error: "Max capacity must be a number" })
      .min(1, "Max capacity must be at least 1"),
    regularPrice: z
      .number({
        error: "Regular price must be a number",
      })
      .min(50, "Regular price must be at least 50"),
    discount: z
      .number({
        error: "Discount price must be a number",
      })
      .nullable()
      .optional(),
    description: z.string().nullable().optional(),
    image: z.any().optional(),
    imageBase64: z.string().optional(),
  })
  .refine((data) => !data.discount || data.discount < data.regularPrice, {
    message: "Discount price must be lower than regular price",
    path: ["discount"],
  });

export type CabinFormData = z.infer<typeof cabinSchema>;
