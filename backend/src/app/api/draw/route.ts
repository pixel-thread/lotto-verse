import { getAllDraw } from "@/src/services/draw/getAllDraw";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const draws = await getAllDraw({
      where: {
        isActive: true,
        winner: { isNot: null },
        createdAt: {
          lte: new Date(), // lte means less than or equal
        },
      },
    });

    return SuccessResponse({
      message: "Successfully fetched all draws",
      data: draws.slice(0, 20),
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
