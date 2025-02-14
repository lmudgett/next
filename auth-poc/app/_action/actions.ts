"use server";
import { z } from "zod";
import { UserFormData, userSchema } from "@/domain/lib/types";
import { addUser } from "@/domain/use-case/users";

export const addUserAction = async (
  formData: UserFormData
): Promise<{
  success: boolean;
  errors?: { general: string } | { [key: string]: string };
}> => {
  try {
    userSchema.parse(formData);
    const { fname, lname, password, email } = formData;
    await addUser(fname, lname, email, password);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error: adding user ", error.errors);
      return {
        success: false,
        errors: Object.fromEntries(
          error.errors.map((err) => [err.path[0] || "unknown", err.message])
        ),
      };
    } else {
      console.error("Unexpected Error: adding user ", error);
      return {
        success: false,
        errors: { general: "An unexpected error occurred adding user" },
      };
    }
  }
};
