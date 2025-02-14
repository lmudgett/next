import { z } from "zod";

export const userSchema = z
  .object({
    fname: z.string().min(2, {
      message: "First Name is required with a length of 2 characters",
    }),
    lname: z.string().min(2, {
      message: "Last Name is required with a length of 2 characters",
    }),
    email: z.string().min(2, {
      message: "Last Name is required with a length of 2 characters",
    }),
    password: z.string().min(10, {
      message: "Password has to be 10 characters long",
    }),
    confirmPassword: z.string().min(10, {
      message: "Password has to be 10 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userSchema>;

export const loginSchema = z.object({
  email: z.string().nonempty({ message: "Email is required" }),
  password: z.string().nonempty({ message: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
