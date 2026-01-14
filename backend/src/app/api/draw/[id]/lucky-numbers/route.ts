import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getLuckyNumbers } from "@/src/services/lucky-number/getLuckyNumbers";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { getMeta } from "@/src/utils/pagination/getMeta";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    logger.log("GET /api/draw/current", req.url);
    const drawId = (await params).id;
    const drawExist = await getUniqueDraw({ where: { id: drawId } });
    const page = req.nextUrl.searchParams.get("page") || "1";
    if (!drawExist) {
      return ErrorResponse({
        status: 404,
        message: "Draw does not exist",
      });
    }
    if (drawExist.status === "INACTIVE") {
      return ErrorResponse({
        status: 400,
        message: "Draw is not active",
        data: null,
      });
    }

    const [numbers, total] = await getLuckyNumbers({
      where: { drawId: drawId },
    });

    return SuccessResponse({
      message: "Successfully fetched lucky numbers",
      data: numbers,
      status: 200,
      meta: getMeta({ total: total, currentPage: page }),
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
