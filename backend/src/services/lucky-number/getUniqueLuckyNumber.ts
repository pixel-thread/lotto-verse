import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.LuckyNumberWhereUniqueInput;
};

export async function getUniqueLuckyNumber({ where }: Props) {
  return await prisma.luckyNumber.findUnique({
    where,
    include: { purchase: true },
  });
}
