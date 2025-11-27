import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getLuckyNumbers } from "@/src/services/lucky-number/getLuckyNumbers";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { NextRequest } from "next/server";
import { getMeta } from "@/src/utils/pagination/getMeta";
import { getCache } from "@/src/services/cache/getCache";
import { Prisma } from "@/src/lib/db/prisma/generated/prisma";
import { createCache } from "@/src/services/cache/createCache";
import { getTime } from "@/src/utils/helper/getTime";
import { logger } from "@/src/utils/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    let page = req.nextUrl.searchParams.get("page") || "1";
    let draw;

    const cachedDraw = await getCache<Prisma.DrawGetPayload<{}>>({
      key: "current-draw",
    });

    if (cachedDraw) {
      draw = cachedDraw;
    } else {
      draw = await getActiveDraw();
    }

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

    const numbersCache = await getCache<Prisma.LuckyNumberGetPayload<{}>[]>({
      key: `current-number-${draw.id}-${page}`,
    });

    if (numbersCache) {
      return SuccessResponse({
        message: "Successfully fetched lucky numbers",
        data: numbersCache,
        meta: getMeta({ total: numbersCache.length, currentPage: page }),
      });
    }

    const [numbers, total] = await getLuckyNumbers({
      where: { drawId: draw.id, isPurchased: false },
      page,
    });

    await createCache({
      key: "current-draw",
      data: draw,
      ttl: getTime(1, "h"),
    });

    await createCache({
      key: `current-luckyNumbers-${draw.id}-${page}`,
      data: numbers,
      ttl: getTime(1, "d"),
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
