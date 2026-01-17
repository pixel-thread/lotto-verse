import { upsertDevicePushToken } from "@/src/services/notification/upsertDevicePushToken";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { TokenSchema } from "@/src/utils/validation/notification/token";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = TokenSchema.parse(await req.json());
    const addedToken = await upsertDevicePushToken({
      where: { token: body.token },
      update: body,
      create: body,
    });

    return SuccessResponse({
      data: addedToken,
      message: "Success register for push tokens",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
