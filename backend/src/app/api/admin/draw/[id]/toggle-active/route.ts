import { getUniqueDraw } from "@/src/services/draw/getUniqueDraw";
import { toggleDrawActive } from "@/src/services/draw/toggleDrawActive";
import { getNotificationTokens } from "@/src/services/notification/getNotificationToken";
import { getUsers } from "@/src/services/user/getUsers";
import { AppPushNotificationT } from "@/src/types/notifications";
import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { requireSuperAdmin } from "@/src/utils/middleware/requireSuperAdmin";
import { ErrorResponse, SuccessResponse } from "@/src/utils/next-response";
import { sendPushNotifications } from "@/src/utils/notification/sendPushNotifications";
import { NextRequest } from "next/server";

export async function POST(
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

    if (drawExist.status === "DELETED") {
      return ErrorResponse({
        status: 400,
        message: "Draw is deleted",
      });
    }

    const draw = await toggleDrawActive({ id });

    if (draw.status === "ACTIVE") {
      const users = await getNotificationTokens();

      const tokens = users.map((u) => u.token);

      const payload: AppPushNotificationT = {
        title: "🔔 Lotto Verse Alert",
        subtitle: "New Draw is Active",
        body: `Ka Lucky Draw ${draw.month} Ka la sdang mynta. Good luck!`,
        image: "https://lotto-verse.vercel.app/assets/images/og.webp",
      };

      await sendPushNotifications({
        tokens: tokens,
        payload: payload,
      });
    }
    return SuccessResponse({
      message: "Successfully toggled draw active",
      data: draw,
      status: 200,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
