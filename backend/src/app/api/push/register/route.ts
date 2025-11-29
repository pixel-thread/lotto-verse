import { registerPushDevice } from "@/src/services/push/registerDevice";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { registerPushSchema } from "@/src/utils/validation/push";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = registerPushSchema.parse(await req.json());
    const device = registerPushDevice({
      data: body,
      where: { token: body.token },
    });
    return SuccessResponse({
      data: device,
      message: "Successfully registered device",
    });
  } catch (err) {
    return handleApiErrors(err);
  }
}
