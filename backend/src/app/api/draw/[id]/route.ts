import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(req);
    const drawId = (await params).id;
    const draw = await getUniqueDraw({ where: { id: drawId } });
    return SuccessResponse({
      message: "Successfully fetched draw",
      data: draw,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
