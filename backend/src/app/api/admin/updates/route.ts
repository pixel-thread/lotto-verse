import { createUpdate } from "@/src/services/update/createUpdate";
import { getUpdates } from "@/src/services/update/getUpdates";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { SuccessResponse } from "@/src/utils/next-response";
import { updateSchema } from "@/src/utils/validation/updates";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const updates = await getUpdates();

    return SuccessResponse({
      data: updates,
      message: "Updates fetched successfully",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const body = updateSchema.parse(await req.json());

    const update = await createUpdate({ data: body });

    return SuccessResponse({
      data: update,
      message: "Update created successfully",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
