import { NextResponse } from "next/server";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { getUpdate } from "@/src/services/update/getUpdate";
import { ErrorResponse } from "@/src/utils/next-response";

export async function GET() {
  try {
    const release = await getUpdate();

    if (!release) {
      return ErrorResponse({
        status: 404,
        message: "No release found",
      });
    }

    if (!release.assetUrl) {
      return ErrorResponse({
        status: 404,
        message: "No release found",
      });
    }

    return NextResponse.redirect(release.assetUrl);
  } catch (error) {
    return handleApiErrors(error);
  }
}
