import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { MOCK_BILLING_DETAIL } from "@/src/utils/mocked";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(req);
    const drawId = (await params).id;
    return SuccessResponse({
      message: "Successfully fetched draw",
      data: MOCK_BILLING_DETAIL,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
