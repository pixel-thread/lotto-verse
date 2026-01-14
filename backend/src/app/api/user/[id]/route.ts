import { getUniqueUser } from "@/src/services/user/getUserByClerkId";
import { updateUser } from "@/src/services/user/updateUser";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { userSchema } from "@/src/utils/validation/user";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body = userSchema.parse(await req.json());

    const isUserExists = await getUniqueUser({ where: { id: id } });

    if (!isUserExists) {
      return ErrorResponse({
        status: 404,
        message: "User not found",
      });
    }
    const updatedUser = await updateUser({
      where: { id: id },
      data: { phoneNumber: body.phoneNo },
    });

    return SuccessResponse({
      data: updatedUser,
      message: "Successfully updated user",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
