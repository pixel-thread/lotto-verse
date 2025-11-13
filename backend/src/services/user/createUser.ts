import { clerk } from "@/src/lib/clerk";
import { prisma } from "@/src/lib/db/prisma";

export async function createUser({ id }: { id: string }) {
  const clerkUser = await clerk.users.getUser(id);
  return await prisma.user.create({
    data: { clerkId: clerkUser.id },
  });
}
