import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  where: Prisma.PurchaseWhereUniqueInput;
  data: Prisma.PurchaseUpdateInput;
  paymentMethod?: "RAZORPAY" | "CASH";
};

export async function updatePurchase({
  where,
  data,
  paymentMethod = "RAZORPAY",
}: Props) {
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
          paymentMethod: paymentMethod,
          purchase: { connect: { id: purchase.id } },
        },
      });
      await tx.purchase.update({
        where: { id: purchase.id },
        data: { transactionId: transaction.id, status: "SUCCESS" },
      });
    }

    return purchase;
  });
}
