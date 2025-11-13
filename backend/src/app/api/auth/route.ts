import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { SuccessResponse } from "@/src/utils/next-response";

export async function GET(req: Request) {
  try {
    const user = await requireAuth(req);
    return SuccessResponse({
      message: "Successfully fetched user",
      data: user,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
