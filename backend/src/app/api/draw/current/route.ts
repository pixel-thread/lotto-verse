import { clerk } from "@/src/lib/clerk";
import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { getUniqueLuckyNumber } from "@/src/services/lucky-number/getUniqueLuckyNumber";
import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const draw = await getActiveDraw();
    if (!draw) {
      return ErrorResponse({
        status: 404,
        message: "No active draw found",
      });
    }
    const user = await getUniqueUser({ where: { id: draw.winner?.userId } });

    if (!user) {
      return ErrorResponse({
        status: 404,
        message: "User not found",
      });
    }
    const clerkUser = await clerk.users.getUser(user?.clerkId);
    if (!clerkUser) {
      return ErrorResponse({
        status: 404,
        message: "User not found",
      });
    }
    const number = await getUniqueLuckyNumber({
      where: { id: draw.winner?.luckyNumberId },
    });

    const drawWithWinner = {
      ...draw,
      winner: {
        ...draw.winner,
        name: clerkUser.fullName,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        imageUrl: clerkUser.imageUrl,
        number: number?.number,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber,
      },
    };

    return SuccessResponse({
      message: "Successfully fetched current draw",
      data: drawWithWinner,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
