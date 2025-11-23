import { prisma } from "@/src/lib/db/prisma";

export async function getUsers() {
  return await prisma.user.findMany();
}
