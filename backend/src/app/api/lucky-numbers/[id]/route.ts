import { getUniqueLuckyNumber } from "@/src/services/lucky-number/getUniqueLuckyNumber";
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
    const id = (await params).id;
    const number = await getUniqueLuckyNumber({ where: { id } });
    return SuccessResponse({
      data: number,
      status: 200,
      message: "Successfully fetched lucky number",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
