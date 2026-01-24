import { clerk } from "@/src/lib/clerk";
import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { getUniqueLuckyNumber } from "@/src/services/lucky-number/getUniqueLuckyNumber";
import { getDrawPurchase } from "@/src/services/purchase/getDrawPurchase";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    logger.log("GET /api/draw/current", req.url);

    const activeDraw = await getActiveDraw();

    if (!activeDraw) {
      return SuccessResponse({
        message: "No active draw",
        data: [],
      });
    }

    const drawPurchases = await getDrawPurchase({
      where: { drawId: activeDraw.id, status: "SUCCESS" },
    });

    if (drawPurchases.length === 0) {
      return SuccessResponse({
        message: "No active purchase",
        data: [],
      });
    }

    // Make sure clerkIds have same normalization as below
    const clerkIds = drawPurchases.map((purchase) => purchase.user.clerkId);
    // Create map with normalized keys
    const purchaseMap = new Map(
      drawPurchases.map((purchase) => [
        purchase.user.clerkId.toLowerCase().trim(),
        purchase,
      ]),
    );

    const users = await clerk.users.getUserList({ userId: clerkIds });

    const data = await Promise.all(
      users.data.map(async (user) => {
        const purchase = purchaseMap.get(user.id.toLowerCase().trim());
        return {
          id: user.id,
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.username || `${user.firstName} ${user.lastName}`,
          imageUrl: user.imageUrl,
          phone: user.primaryPhoneNumber?.phoneNumber,
          purchaseAt: purchase ? purchase.createdAt : "",
          number: "#",
        };
      }),
    );
    return SuccessResponse({
      message: "Successfully fetched draw users",
      data: data,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
