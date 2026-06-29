import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UserListItem } from "@/lib/validations/users";
import {
  convertToApplicationError,
  ApplicationError,
  ErrorType,
} from "@/types/errors";

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

// Listing never selects passwordHash, so it can't leak to the client.
export async function getAllUsers(): Promise<UserListItem[]> {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<{ success: boolean; user?: User; appError?: ApplicationError }> {
  try {
    const user = await prisma.user.create({ data });
    return { success: true, user };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, appError: appErr };
  }
}
