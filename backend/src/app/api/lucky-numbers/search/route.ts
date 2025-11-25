import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { getLuckyNumbers } from "@/src/services/lucky-number/getLuckyNumbers";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";
import z from "zod";

const searchSchema = z.object({ query: z.coerce.string() });

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const body = searchSchema.parse(await req.json());

    const activeDraw = await getActiveDraw();

    if (!activeDraw) {
      return ErrorResponse({
        status: 404,
        message: "No active draw found",
      });
    }
    const numberToSearch = parseInt(body.query);

    const paddLength = activeDraw.endRange.toString().length || 0;

    const paddedQuery = numberToSearch.toString().padStart(paddLength, "0");

    if (
      parseInt(body.query) === 0 ||
      numberToSearch < activeDraw?.startRange ||
      numberToSearch > activeDraw?.endRange
    ) {
      return ErrorResponse({
        status: 404,
        message: `Number should be between ${activeDraw?.startRange} and ${activeDraw?.endRange}`,
        data: null,
      });
    }

    const [luckyNumbers] = await getLuckyNumbers({
      where: {
        drawId: activeDraw?.id,
        number: {
          equals: paddedQuery,
        },
      },
    });

    return SuccessResponse({
      data: luckyNumbers,
      status: 200,
      message: "Successfully fetched lucky numbers",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
