import { clerk } from "@/src/lib/clerk";
import { getWinners } from "@/src/services/winner/getWinners";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const winners = await getWinners();

    const data = await Promise.all(
      winners.map(async (winner) => {
        const id = winner.user.id;
        const clerkUser = await clerk.users.getUser(id);
        return {
          id: winner.id,
          name: clerkUser.username || clerkUser.firstName || clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          draw: winner.draw.month,
          luckyNumber: winner.luckyNumber,
          isPaid: winner.paidAt !== null,
          paidAt: winner.paidAt,
          prizeAmount: winner?.draw?.prize?.amount,
        };
      }),
    );

    return SuccessResponse({
      data: data,
      message: "Success fetching winners",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
