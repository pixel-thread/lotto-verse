import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.PurchaseWhereUniqueInput;
  data: Prisma.PurchaseUpdateInput;
};

export async function updatePurchase({ where, data }: Props) {
  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.update({ where, data });

    if (data.status === "SUCCESS") {
      await tx.luckyNumber.update({
        where: { id: purchase.luckyNumberId },
        data: { isPurchased: data.status === "SUCCESS" ? true : false },
      });
      const transaction = await tx.transaction.create({
        data: {
          user: { connect: { id: purchase.userId } },
          amount: purchase.amount,
          status: purchase.status,
          paymentMethod: "RAZORPAY",
          purchase: { connect: { id: purchase.id } },
        },
      });
      if (purchase.status !== "SUCCESS") {
        await tx.purchase.update({
          where: { id: purchase.id },
          data: { status: data.status, transactionId: transaction.id },
        });
      }
    }

    return purchase;
  });
}
