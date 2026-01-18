import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where?: Prisma.NotificationTokenWhereUniqueInput;
};

export async function getNotificationTokens({ where }: Props = {}) {
  return await prisma.notificationToken.findMany({ where });
}
