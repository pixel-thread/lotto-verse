import { promoteToAppVersion } from "@/src/services/appVersion/promoteToAppVersion";
import { upsertEASBuild } from "@/src/services/easBuildWebhook/easBuildWebhook";
import { EasBuildPayload } from "@/src/types/eas/easBuild";
import { verifyExpoSignature } from "@/src/utils/eas/verifyExpoSignature";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("expo-signature");
    const body = await req.text();

    const valid = verifyExpoSignature(body, signature);
    if (!valid) {
      return ErrorResponse({
        error: "EAS signature error",
        status: 401,
        message: "Invalid signature",
      });
    }

    let payload: EasBuildPayload;

    try {
      payload = JSON.parse(body);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
      });
    }

    await upsertEASBuild(payload);

    await promoteToAppVersion(payload);

    return SuccessResponse({
      data: "Webhook received",
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
