import { deleteDrawById } from "@/src/services/draw/deleteDrawById";
import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin(req);
    const id = (await params).id;
    const draw = await getUniqueDraw({ where: { id } });
    return SuccessResponse({
      message: "Successfully fetched draw",
      data: draw,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin(req);

    const id = (await params).id;

    const drawExist = await getUniqueDraw({ where: { id } });

    if (!drawExist) {
      return ErrorResponse({
        status: 404,
        message: "Draw not found",
      });
    }

    const deletedDraw = await deleteDrawById({ id });

    return SuccessResponse({
      message: "Successfully deleted draw",
      status: 200,
      data: deletedDraw,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
