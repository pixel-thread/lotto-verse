import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.NotificationWhereInput;
};

export async function getAllOrUserNotification({ where }: Props) {
  return await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}
