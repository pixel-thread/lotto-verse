import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where?: Prisma.AppUpdateWhereInput;
};

export async function getUpdates({ where }: Props = { where: undefined }) {
  return prisma.appUpdate.findMany({ where });
}
