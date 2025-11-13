import { getActiveDraw } from "@/src/services/draw/getActiveDraw";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAuth } from "@/src/utils/middleware/requiredAuth";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

const winnerInfo = {
  name: "John Doe",
  number: 345,
  imageUrl:
    "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
  email: "john.doe@example.com",
  phone: "+1234567890",
};

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const draw = await getActiveDraw();
    if (!draw) {
      return ErrorResponse({
        status: 404,
        message: "No active draw found",
      });
    }
    return SuccessResponse({
      message: "Successfully fetched current draw",
      data: draw,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
