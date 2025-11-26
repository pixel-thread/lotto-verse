import { clerk } from "@/src/lib/clerk";
import { pickAndDeclareRandomWinner } from "@/src/services/draw/declearDrawWinner";
import { getDrawWinner } from "@/src/services/draw/getDrawWinner";
import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getDrawPurchase } from "@/src/services/purchase/getDrawPurchase";
import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin(req);

    const drawId = (await params).id;

    const isDrawExist = await getUniqueDraw({ where: { id: drawId } });

    if (!isDrawExist) {
      return ErrorResponse({
        status: 404,
        message: "Draw not found",
      });
    }

    const isSomePurchaseExist = await getDrawPurchase({ where: { drawId } });

    if (!isSomePurchaseExist) {
      return ErrorResponse({
        status: 400,
        message: "No purchases found for this draw",
      });
    }

    if (isDrawExist.status === "DELETED") {
      return ErrorResponse({
        status: 400,
        message: "Draw is deleted",
      });
    }

    if (isDrawExist.status === "INACTIVE") {
      return ErrorResponse({
        status: 400,
        message: "Draw is inactive",
      });
    }

    const isWinnerExist = await getDrawWinner({ id: drawId });

    if (isWinnerExist) {
      return ErrorResponse({
        status: 400,
        message: "Winner is already Declared",
      });
    }

    const winner = await pickAndDeclareRandomWinner({ drawId });

    if (!winner) {
      return ErrorResponse({
        status: 400,
        message: "No Winner is Declared",
      });
    }

    const user = await getUniqueUser({ where: { id: winner.userId } });

    if (!user) {
      return ErrorResponse({
        status: 400,
        message: "User not found",
      });
    }

    const clerkUser = await clerk.users.getUser(user?.clerkId);

    const data = {
      userId: user.id,
      name:
        clerkUser.username || clerkUser.firstName + " " + clerkUser.lastName,
      email: clerkUser.primaryEmailAddress?.emailAddress,
      phone: clerkUser.primaryPhoneNumber?.phoneNumber,
      imageUrl: clerkUser.imageUrl,
      winnerId: winner.id,
    };

    return SuccessResponse({
      message: "Successfully Decleared winner",
      data: data,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
