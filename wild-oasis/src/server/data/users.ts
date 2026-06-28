import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}
