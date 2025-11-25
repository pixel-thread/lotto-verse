import { getUpdate } from "@/src/services/update/getUpdate";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const update = await getUpdate();
    return SuccessResponse({
      data: update,
      message: "Success fetching update info",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
