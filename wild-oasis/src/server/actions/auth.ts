"use server";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/server/data/users";
import { verifyPassword } from "@/lib/password";
import { createSessionCookie, destroySessionCookie } from "@/server/auth";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { AppPromise } from "@/types/app-promise";
import {
  ApplicationError,
  ErrorType,
  convertToApplicationError,
} from "@/types/errors";

export const loginAction = async (
  data: LoginFormData
): Promise<AppPromise> => {
  try {
    loginSchema.parse(data);
    const user = await getUserByEmail(data.email);
    if (!user || !verifyPassword(data.password, user.passwordHash)) {
      return {
        success: false,
        appError: new ApplicationError(
          "Invalid email or password",
          ErrorType.AUTHENTICATION
        ),
      };
    }
    await createSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    return { success: true };
  } catch (error) {
    return { success: false, appError: convertToApplicationError(error) };
  }
};

export const logoutAction = async () => {
  await destroySessionCookie();
  redirect("/login");
};
