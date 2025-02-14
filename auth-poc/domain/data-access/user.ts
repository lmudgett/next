"use server";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}

export async function addUser(
  data: Omit<User, "id" | "updated" | "role">
): Promise<void> {
  await prisma.user.create({ data });
}

export async function updateUser(
  data: Omit<User, "id" | "updated" | "role">
): Promise<void> {
  await prisma.user.update({
    where: { email: data.email },
    data,
  });
}
