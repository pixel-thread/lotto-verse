import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.DeviceWhereUniqueInput;
  data: Prisma.DeviceCreateInput;
};

export async function registerPushDevice({ where, data }: Props) {
  return await prisma.device.upsert({
    where: where,
    update: { userId: data.userId, platform: data.platform },
    create: { token: data.token, userId: data.userId, platform: data.platform },
  });
}
