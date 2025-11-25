import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  data: Prisma.AppUpdateCreateInput;
};

export async function createUpdate({ data }: Props) {
  return prisma.appUpdate.create({ data });
}
