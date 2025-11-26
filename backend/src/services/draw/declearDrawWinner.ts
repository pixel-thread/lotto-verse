import { prisma } from "@/src/lib/db/prisma";
import { getUniquePurchase } from "../purchase/getUniquePurchase";

type DeclareRandomWinnerProps = {
  drawId: string;
};

export async function pickAndDeclareRandomWinner({
  drawId,
}: DeclareRandomWinnerProps) {
  // Find all purchases for the draw
  const purchases = await prisma.purchase.findMany({ where: { drawId } });

  if (purchases.length === 0) {
    throw new Error("No purchases found for this draw");
  }

  // Pick a random purchase
  const randomIndex = Math.floor(Math.random() * purchases.length);
  const winnerUser = purchases[randomIndex];
  const winnerUserId = purchases[randomIndex].userId;

  const isWinnerPurchaseExist = await getUniquePurchase({
    where: { razorpayId: winnerUser.razorpayId },
  });

  if (!isWinnerPurchaseExist) {
    throw new Error(
      "User Purchase not found && cannot be declared as winner, Please try again",
    );
  }

  // Use the previous declareWinner function or inline logic
  // Check if winner exists for draw
  const existingWinner = await prisma.winner.findUnique({ where: { drawId } });

  if (existingWinner) {
    // Update winner
    const updatedWinner = await prisma.winner.update({
      where: { id: existingWinner.id },
      data: { userId: winnerUserId, isPaid: false, paidAt: null },
    });

    await prisma.draw.update({
      where: { id: drawId },
      data: { winner: { connect: { id: updatedWinner.id } } },
    });
    return updatedWinner;
  } else {
    // Create winner
    return await prisma.$transaction(async (tx) => {
      const newWinner = await tx.winner.create({
        data: {
          drawId,
          userId: winnerUserId,
          isPaid: false,
          luckyNumberId: winnerUser.luckyNumberId,
        },
        include: { user: true },
      });

      await tx.luckyNumber.update({
        where: { id: winnerUser.luckyNumberId },
        data: { winnerId: newWinner.id },
      });

      await tx.draw.update({
        where: { id: drawId },
        data: {
          status: "ACTIVE",
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
