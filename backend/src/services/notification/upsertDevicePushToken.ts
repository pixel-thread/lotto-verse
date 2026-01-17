import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.NotificationTokenWhereUniqueInput;
  create: Prisma.NotificationTokenCreateInput;
  update: Prisma.NotificationTokenUpdateInput;
};

export async function upsertDevicePushToken({ where, create, update }: Props) {
  return await prisma.notificationToken.upsert({
    where,
    update,
    create,
  });
}
