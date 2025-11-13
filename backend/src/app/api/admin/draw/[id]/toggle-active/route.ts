import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { toggleDrawActive } from "@/src/services/draw/toggleDrawActive";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";

export async function POST(
  req: Request,
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
    const draw = await toggleDrawActive({ id });

    return SuccessResponse({
      message: "Successfully toggled draw active",
      data: draw,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
