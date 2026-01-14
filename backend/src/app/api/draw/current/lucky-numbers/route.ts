import { getLuckyNumbers } from "@/src/services/lucky-number/getLuckyNumbers";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { NextRequest } from "next/server";
import { getMeta } from "@/src/utils/pagination/getMeta";
import { createCache } from "@/src/services/cache/createCache";
import { getTime } from "@/src/utils/helper/getTime";
import { logger } from "@/src/utils/logger";

export async function GET(req: NextRequest) {
  try {
    logger.log("GET /api/draw/current", req.url);

    let page = req.nextUrl.searchParams.get("page") || "1";

    const draw = await getActiveDraw();

    if (!draw || draw.status === "INACTIVE") {
      return ErrorResponse({
        status: 404,
        message: "No active draw found",
      });
    }
    // check if page is a valid no else assign 1
    if (!Number.isInteger(parseInt(page))) {
      page = "1";
    }

    const [numbers, total] = await getLuckyNumbers({
      where: { drawId: draw.id, isPurchased: false },
      page,
    });

    createCache({
      key: "current-draw",
      data: draw,
      ttl: getTime(1, "h"),
    });

    createCache({
      key: `current-luckyNumbers-${draw.id}-${page}`,
      data: numbers,
      ttl: getTime(30, "m"),
    });

    return SuccessResponse({
      message: "Successfully fetched lucky numbers",
      data: numbers,
      status: 200,
      meta: getMeta({ total, currentPage: page }),
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
