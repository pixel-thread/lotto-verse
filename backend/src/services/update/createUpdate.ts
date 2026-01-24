import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  data: Prisma.AppVersionCreateInput;
};

export async function createUpdate({ data }: Props) {
  return prisma.appVersion.create({ data });
}
