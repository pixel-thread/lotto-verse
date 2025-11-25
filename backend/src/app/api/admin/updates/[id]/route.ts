import { deleteUpdate } from "@/src/services/update/deleteUpdate";
import { getUniqueUpdate } from "@/src/services/update/getUniqueUpdate";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireSuperAdmin(req);

    const id = (await params).id;

    const isUpdateExist = await getUniqueUpdate({ where: { id } });

    if (!isUpdateExist) {
      return ErrorResponse({
        status: 404,
        message: "Update not found",
      });
    }

    const deletedUpdate = await deleteUpdate({ where: { id } });

    return SuccessResponse({
      data: deletedUpdate,
      message: "Update deleted successfully",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
