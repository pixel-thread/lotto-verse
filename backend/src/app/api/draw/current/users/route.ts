import { clerk } from "@/src/lib/clerk";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";
//TODO: PROPER FETCH USER ACCORDING TO DRAW PURCHASE
export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const usersList = await clerk.users.getUserList();

    logger.log({ users: usersList.data.length });

    const users = usersList.data.map((user, i) => ({
      id: i + 1,
      name: user.username || user.firstName,
      imageUrl: user.imageUrl,
      number: Math.floor(10000 + Math.random() * 90000),
      purchaseAt: new Date().toLocaleString(),
    }));

    return SuccessResponse({
      message: "Successfully fetched draw users",
      data: users,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
