import { z } from "zod";

// New hotel-staff login. Mirrors the credential auth model (User).
export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password needs a minimum of 8 characters"),
    passwordConfirm: z.string().min(1, "Please repeat the password"),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Passwords need to match",
    path: ["passwordConfirm"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// Safe user shape for listing — never carries the password hash.
export type UserListItem = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};
