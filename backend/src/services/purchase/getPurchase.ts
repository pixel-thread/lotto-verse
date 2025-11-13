import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.PurchaseWhereInput;
};
export async function getPurchase({ where }: Props) {
  return await prisma.purchase.findMany({
    where,
    include: { luckyNumber: true },
  });
}
