import { getDrawWinner } from "@/src/services/draw/getDrawWinner";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(req);
    const drawId = (await params).id;

    const drawWinner = await getDrawWinner({ id: drawId });

    if (!drawWinner) {
      return ErrorResponse({
        status: 400,
        message: "Winner is yet to be declear",
      });
    }

    return SuccessResponse({
      message: "Successfully fetched winner",
      data: drawWinner,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
