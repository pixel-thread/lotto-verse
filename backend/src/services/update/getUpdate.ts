import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.AppUpdateWhereInput;
};

export async function getUpdate({ where }: Props = { where: {} }) {
  return prisma.appUpdate.findFirst({ where, orderBy: { createdAt: "desc" } });
}
