import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { getUserPurchase } from "@/src/services/user/getUserPurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const userId = user.id;

    if (!user) {
      return ErrorResponse({
        status: 400,
        message: "User not found",
      });
    }

    const purchase = await getUserPurchase({ where: { userId: userId } });

    return SuccessResponse({
      message: "Successfully fetched User Purchases",
      data: purchase,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
