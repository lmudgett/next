"use server";
import { revalidatePath } from "next/cache";
import * as usersUC from "@/server/services/users";
import { signupSchema, SignupFormData, UserListItem } from "@/lib/validations/users";
import { AppPromise } from "@/types/app-promise";
import { convertToApplicationError } from "@/types/errors";

export const signupAction = async (
  data: SignupFormData
): Promise<AppPromise> => {
  try {
    signupSchema.parse(data);
    const res = await usersUC.createUser(data);
    if (res.success) {
      revalidatePath("/users");
      return { success: true };
    }
    throw res.appError;
  } catch (error) {
    return { success: false, appError: convertToApplicationError(error) };
  }
};

export const getAllUsersAction = async (): Promise<{
  success: boolean;
  users?: UserListItem[];
  message?: string;
}> => {
  try {
    const users = await usersUC.getAllUsers();
    return { success: true, users };
  } catch (error) {
    return { success: false, message: `Unable to get users ${error}` };
  }
};
