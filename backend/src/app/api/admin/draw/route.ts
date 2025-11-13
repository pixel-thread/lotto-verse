import { createDraw } from "@/src/services/draw/createDraw";
import { getAllDraw } from "@/src/services/draw/getAllDraw";
import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { createDrawSchema } from "@/src/utils/validation/draw";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const draws = await getAllDraw();
    return SuccessResponse({
      message: "Successfully fetched draws",
      data: draws,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireSuperAdmin(req);
    const body = createDrawSchema.parse(await req.json());

    const now = new Date();
    const month = `${now.getFullYear()}-${now.getMonth()}`;
    const monthDraw = await getUniqueDraw({ where: { month } });

    if (monthDraw) {
      return ErrorResponse({
        status: 400,
        message: "Draw for this month already exists",
      });
    }

    const draw = await createDraw({
      data: {
        digitsCount: body.digitsCount,
        prize: {
          amount: body.prize.amount,
          description: body.prize.description,
        },
        startRange: body.startRange,
        endRange: body.endRange,
        createdBy: user.id,
      },
    });
    return SuccessResponse({
      message: "Successfully created draw",
      data: draw,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
