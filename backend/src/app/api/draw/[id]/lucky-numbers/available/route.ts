import { getLuckyNumbers } from "@/src/services/lucky-number/getLuckyNumbers";
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
