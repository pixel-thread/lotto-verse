import { prisma } from "@/src/lib/db/prisma";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";

type Props = {
  data: {
    luckyNumberId: string;
    userId: string;
    drawId: string;
    razorpayId: string;
    amount: number;
  };
};

// export async function createPurchase({ data }: Props) {
//   return await prisma.purchase.create({ data });
// }

export async function createPurchaseAtomic({ data }: Props) {
  return await prisma.$transaction(async (tx) => {
    const luckyNumber = await tx.luckyNumber.findUnique({
      where: { id: data.luckyNumberId },
      select: { isPurchased: true },
    });

    if (!luckyNumber) {
      throw new Error("Lucky number not found");
    }

    const luckyPurchase = await tx.purchase.findFirst({
      where: { luckyNumberId: data.luckyNumberId, status: "SUCCESS" },
    });

    if (luckyPurchase) {
      throw new Error("Lucky number already purchased");
    }

    // Create purchase
    const purchase = await tx.purchase.create({
      data: {
        razorpayId: data.razorpayId,
        amount: data.amount,
        status: "PENDING", // or SUCCESS based on flow
        luckyNumberId: data.luckyNumberId,
        drawId: data.drawId,
        userId: data.userId,
      },
    });

    return purchase;
  });
}
