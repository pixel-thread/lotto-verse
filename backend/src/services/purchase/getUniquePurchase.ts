import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.PurchaseWhereUniqueInput;
};

export async function getUniquePurchase({ where }: Props) {
  return prisma.purchase.findUnique({ where, include: { luckyNumber: true } });
}
