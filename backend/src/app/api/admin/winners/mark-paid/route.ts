import { updateWinner } from "@/src/services/winner/updateWinner";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireAdmin } from "@/src/utils/middleware/requireAdmin";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";
import z from "zod";

const WinnerSchema = z.object({
  winnerId: z.uuid(),
});

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = WinnerSchema.parse(await req.json());

    const updated = await updateWinner({
      where: { id: body.winnerId },
      data: { isPaid: true, paidAt: new Date() },
    });

    return SuccessResponse({ message: "Success", data: updated });
  } catch (error) {
    return handleApiErrors(error);
  }
}
