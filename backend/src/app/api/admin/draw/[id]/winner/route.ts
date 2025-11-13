import { clerk } from "@/src/lib/clerk";
import { pickAndDeclareRandomWinner } from "@/src/services/draw/declearDrawWinner";
import { getDrawWinner } from "@/src/services/draw/getDrawWinner";
import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getDrawPurchase } from "@/src/services/purchase/getDrawPurchase";
import { getUniquePurchase } from "@/src/services/purchase/getUniquePurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";

export async function POST(
  req: Request,
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
    const userPurchase = await getUniquePurchase({
      where: { userId_drawId: { userId: winner.userId, drawId: drawId } },
    });

    if (!userPurchase) {
      return ErrorResponse({
        status: 400,
        message: "Error while getting user purchase, Please try again",
      });
    }

    const user = await clerk.users.getUser(winner.userId);

    const data = {
      clerkId: user.id,
      name: user.username,
      email: user.emailAddresses[0].emailAddress,
      purchase: userPurchase,
      luckyNumber: userPurchase?.luckyNumber.number,
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
