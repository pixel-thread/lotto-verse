import { getLatestUpdate } from "@/src/services/update/getLatestUpdate";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";

export async function GET() {
  try {
    const update = await getLatestUpdate();
    if (!update) {
      return ErrorResponse({
        message: "No updates found",
        status: 404,
      });
    }
    return SuccessResponse({
      message: "Latest update found",
      data: update,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
