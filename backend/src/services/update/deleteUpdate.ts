import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.AppUpdateWhereUniqueInput;
};

export async function deleteUpdate({ where }: Props) {
  return prisma.appUpdate.delete({ where });
}
