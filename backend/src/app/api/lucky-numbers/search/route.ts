import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { getLuckyNumbers } from "@/src/services/lucky-number/getLuckyNumbers";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { logger } from "@/src/utils/logger";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";
import z from "zod";

const searchSchema = z.object({ query: z.coerce.number() });

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const body = await searchSchema.parseAsync(await req.json());

    const activeDraw = await getActiveDraw();

    const [luckyNumbers] = await getLuckyNumbers({
      where: { number: body.query, drawId: activeDraw?.id },
    });

    logger.info(luckyNumbers);
    return SuccessResponse({
      data: luckyNumbers,
      status: 200,
      message: "Successfully fetched lucky numbers",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
