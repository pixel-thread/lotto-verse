import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.PurchaseWhereUniqueInput;
  data: Prisma.PurchaseUpdateInput;
};

export async function updatePurchase({ where, data }: Props) {
  return await prisma.purchase.update({ where, data });
}
