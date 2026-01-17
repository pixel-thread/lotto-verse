import { addToken } from "@/src/services/notification/addToken";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { TokenSchema } from "@/src/utils/validation/notification/token";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = TokenSchema.parse(await req.json());
    const addedToken = await addToken({
      where: { token: body.token },
      update: body,
      create: body,
    });
    return SuccessResponse({
      data: addedToken,
      message: "Success",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
