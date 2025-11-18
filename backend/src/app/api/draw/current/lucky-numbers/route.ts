import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { getLuckyNumbers } from "@/src/services/lucky-number/getLuckyNumbers";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { NextRequest } from "next/server";
import { getMeta } from "@/src/utils/pagination/getMeta";
import { logger } from "@/src/utils/logger";
const addZeros = (num: number, endRange: number) => {
  const endRangLength = endRange.toString().length;
  const numLength = num.toString().length;
  if (numLength < endRangLength) {
    const zeros = endRangLength - numLength;
    for (let i = 0; i < zeros; i++) {
      num = parseInt("0" + num.toString());
    }
  }
  return num;
};
export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    let page = req.nextUrl.searchParams.get("page") || "1";
    const draw = await getActiveDraw();
    // check if page is a valid no else assign 1
    if (!Number.isInteger(parseInt(page))) {
      page = "1";
    }

    if (!draw) {
      return ErrorResponse({
        status: 404,
        message: "Draw does not exist",
      });
    }

    const drawExist = await getUniqueDraw({ where: { id: draw.id } });

    if (!drawExist) {
      return ErrorResponse({
        status: 404,
        message: "Draw does not exist",
      });
    }

    if (!drawExist.isActive) {
      return ErrorResponse({
        status: 400,
        message: "Draw is not active",
        data: null,
      });
    }

    const [numbers, total] = await getLuckyNumbers({
      where: { drawId: draw.id, isPurchased: false },
      page,
    });

    return SuccessResponse({
      message: "Successfully fetched lucky numbers",
      data: numbers.map((number) => {
        return {
          ...number,
          number: addZeros(number.number, draw.endRange),
        };
      }),
      status: 200,
      meta: getMeta({ total, currentPage: page }),
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
