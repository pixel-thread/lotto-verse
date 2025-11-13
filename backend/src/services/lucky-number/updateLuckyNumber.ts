import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.LuckyNumberWhereUniqueInput;
  data: Prisma.LuckyNumberUpdateInput;
};

export async function updateLuckyNumber({ where, data }: Props) {
  return await prisma.luckyNumber.update({ where, data });
}
