import { prisma } from "@/src/lib/db/prisma";
import { getUniquePurchase } from "../purchase/getUniquePurchase";

type DeclareRandomWinnerProps = {
  drawId: string;
};

export async function pickAndDeclareRandomWinner({
  drawId,
}: DeclareRandomWinnerProps) {
  // Find all purchases for the draw
  const purchases = await prisma.purchase.findMany({
    where: { drawId, status: "SUCCESS" },
  });

  if (purchases.length === 0) {
    throw new Error("No purchases found for this draw");
  }

  // Get all previous winners' userIds for this draw to exclude them
  const previousWinners = await prisma.winner.findMany({
    where: { drawId },
    select: { userId: true },
  });
  const excludeUserIds = new Set(previousWinners.map((w) => w.userId));

  // Filter out previous winners and pick from eligible purchases
  const eligiblePurchases = purchases.filter(
    (purchase) => !excludeUserIds.has(purchase.userId),
  );

  if (eligiblePurchases.length === 0) {
    throw new Error("No eligible winners (all previous winners exhausted)");
  }

  // Pick completely random winner from eligible purchases
  const randomIndex = Math.floor(Math.random() * eligiblePurchases.length);
  const winnerPurchase = eligiblePurchases[randomIndex];
  const winnerUserId = winnerPurchase.userId;

  // Double-check purchase exists
  const isWinnerPurchaseExist = await getUniquePurchase({
    where: { razorpayId: winnerPurchase.razorpayId, status: "SUCCESS" },
  });

  if (!isWinnerPurchaseExist) {
    throw new Error("Winner purchase not found. Please try again.");
  }

  // Check if winner already exists for this draw
  const existingWinner = await prisma.winner.findUnique({
    where: { drawId },
  });

  if (existingWinner) {
    // Update existing winner
    const updatedWinner = await prisma.winner.update({
      where: { id: existingWinner.id },
      data: {
        userId: winnerUserId,
        isPaid: false,
        paidAt: null,
        luckyNumberId: winnerPurchase.luckyNumberId,
      },
    });

    await prisma.draw.update({
      where: { id: drawId },
      data: { winner: { connect: { id: updatedWinner.id } } },
    });
    return updatedWinner;
  } else {
    // Create new winner in transaction
    return await prisma.$transaction(async (tx) => {
      const newWinner = await tx.winner.create({
        data: {
          drawId,
          userId: winnerUserId,
          isPaid: false,
          luckyNumberId: winnerPurchase.luckyNumberId,
        },
        include: { user: true },
      });

      await tx.luckyNumber.update({
        where: { id: winnerPurchase.luckyNumberId },
        data: { winnerId: newWinner.id },
      });

      await tx.draw.update({
        where: { id: drawId },
        data: {
          isWinnerDecleared: true,
          winner: { connect: { id: newWinner.id } },
          declareAt: new Date(),
        },
        include: { luckyNumbers: true },
      });

      return newWinner;
    });
  }
}
