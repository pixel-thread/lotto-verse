import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.PurchaseWhereInput;
};

export async function getPurchaseByLuckyNumber({ where }: Props) {
  return prisma.purchase.findMany({ where, include: { luckyNumber: true } });
}
