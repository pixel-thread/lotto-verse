import { getPurchase } from "@/src/services/purchase/getPurchase";
import { getWinners } from "@/src/services/winner/getWinners";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userPurchases = await getPurchase({
      where: { userId: user.id, status: "SUCCESS" },
    });
    const userWinning = await getWinners({ where: { userId: user.id } });

    const totalDrawAmountSpend = userPurchases.reduce(
      (total, purchase) => total + purchase.amount,
      0, // initial value for total accumulator
    );
    const data = {
      totalDrawParticipate: userPurchases.length,
      totalWin: userWinning.length,
      totalDrawSpend: totalDrawAmountSpend,
      memberSince: user.createdAt,
      role: user.role,
    };
    return SuccessResponse({
      data: data,
      status: 200,
      message: "Successfully fetched User",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
