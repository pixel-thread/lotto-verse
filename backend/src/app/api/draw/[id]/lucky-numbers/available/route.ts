import { getLuckyNumbers } from "@/src/services/lucky-number/getLuckyNumbers";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    logger.log("GET /api/draw/current", req.url);
    const drawId = (await params).id;

    const numbers = await getLuckyNumbers({
      where: { drawId: drawId, isPurchased: false },
    });

    return SuccessResponse({
      message: "Successfully fetched lucky numbers",
      data: numbers,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
