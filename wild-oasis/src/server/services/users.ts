import * as usersDao from "@/server/data/users";
import { hashPassword } from "@/lib/password";
import { SignupFormData, UserListItem } from "@/lib/validations/users";
import { AppPromise } from "@/types/app-promise";
import {
  ApplicationError,
  ErrorType,
  convertToApplicationError,
} from "@/types/errors";

export async function createUser(data: SignupFormData): Promise<AppPromise> {
  try {
    const existing = await usersDao.getUserByEmail(data.email);
    if (existing) {
      return {
        success: false,
        appError: new ApplicationError(
          "A user with that email already exists",
          ErrorType.VALIDATION
        ),
      };
    }

    const res = await usersDao.createUser({
      name: data.name,
      email: data.email,
      passwordHash: hashPassword(data.password),
    });

    if (!res.success) throw res.appError;
    return { success: true };
  } catch (error) {
    return { success: false, appError: convertToApplicationError(error) };
  }
}

export async function getAllUsers(): Promise<UserListItem[]> {
  return usersDao.getAllUsers();
}
