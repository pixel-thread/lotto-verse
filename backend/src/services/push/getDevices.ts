import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where?: Prisma.DeviceWhereInput;
};
export async function getDevices({ where }: Props = { where: {} }) {
  return await prisma.device.findMany({ where });
}
